import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCoverLetterStyle } from "./coverLetterStyles";
import { buildKeywordTransferBrief, improveKeywordCoverage } from "./jobKeywordService";
import { getProvider } from "./providerConfig";
import { getApiKeyForSettings, getSelectedModelForSettings, getSettings } from "./settingsService";
import { sanitizeCoverLetterText, sanitizeGeneratedText } from "./textSanitizer.js";

const createMissingKeyError = (provider) => (
    `CHAVE DE API NÃO CONFIGURADA PARA ${provider.shortLabel.toUpperCase()}. Acesse as Configurações para inserir sua API Key.`
);

const extractJsonText = (text) => {
    const cleaned = String(text || '').replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        JSON.parse(cleaned);
        return cleaned;
    } catch {
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Resposta da IA não contém JSON válido.");
        }
        return jsonMatch[0];
    }
};

const parseJsonResponse = (text) => JSON.parse(extractJsonText(text));

const asText = (value, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    return String(value).trim();
};

const asScore = (value, fallback = 0) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.max(0, Math.min(100, Math.round(number)));
};

const asNullableScore = (value) => {
    if (value === null || value === undefined || value === '') return null;
    return asScore(value, 0);
};

const asStringArray = (value, limit = 10) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => asText(item)).filter(Boolean).slice(0, limit);
};

const normalizeStrengths = (value) => {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => ({
            title: asText(item?.title).slice(0, 80),
            description: asText(item?.description).slice(0, 180)
        }))
        .filter((item) => item.title || item.description)
        .slice(0, 3);
};

const normalizeAnalysis = (data, hasJobDescription) => ({
    atsScore: asScore(data?.atsScore),
    probability: ['Alta', 'Média', 'Baixa'].includes(data?.probability) ? data.probability : 'Média',
    screeningReason: asText(data?.screeningReason, 'Estrutura analisada com base no texto extraído do PDF.'),
    matchScore: hasJobDescription ? asNullableScore(data?.matchScore) : null,
    matchAnalysis: hasJobDescription ? asText(data?.matchAnalysis) || null : null,
    foundKeywords: hasJobDescription ? asStringArray(data?.foundKeywords, 10) : null,
    missingKeywords: hasJobDescription ? asStringArray(data?.missingKeywords, 10) : null,
    strengths: normalizeStrengths(data?.strengths),
    keywordOps: asStringArray(data?.keywordOps, 10),
    tips: asStringArray(data?.tips, 5)
});

const normalizeResumeData = (resumeData = {}) => ({
    contact: {
        name: asText(resumeData.contact?.name),
        email: asText(resumeData.contact?.email),
        phone: asText(resumeData.contact?.phone),
        linkedin: asText(resumeData.contact?.linkedin),
        portfolio: asText(resumeData.contact?.portfolio),
        location: asText(resumeData.contact?.location)
    },
    summary: asText(resumeData.summary),
    experiences: Array.isArray(resumeData.experiences) ? resumeData.experiences.map((exp) => ({
        role: asText(exp?.role),
        company: asText(exp?.company),
        startDate: asText(exp?.startDate),
        endDate: asText(exp?.endDate),
        bullets: asStringArray(exp?.bullets, 12)
    })).filter((exp) => exp.role || exp.company || exp.bullets.length) : [],
    skills: {
        hard: asStringArray(resumeData.skills?.hard, 40),
        soft: asStringArray(resumeData.skills?.soft, 20)
    },
    projects: Array.isArray(resumeData.projects) ? resumeData.projects.map((project) => ({
        name: asText(project?.name),
        url: asText(project?.url),
        description: asText(project?.description),
        bullets: asStringArray(project?.bullets, 8)
    })).filter((project) => project.name || project.url || project.description || project.bullets.length) : [],
    education: Array.isArray(resumeData.education) ? resumeData.education.map((edu) => ({
        degree: asText(edu?.degree),
        institution: asText(edu?.institution),
        year: asText(edu?.year)
    })).filter((edu) => edu.degree || edu.institution || edu.year) : [],
    certificates: Array.isArray(resumeData.certificates) ? resumeData.certificates.map((cert) => ({
        name: asText(cert?.name),
        institution: asText(cert?.institution),
        year: asText(cert?.year)
    })).filter((cert) => cert.name || cert.institution || cert.year) : [],
    languages: Array.isArray(resumeData.languages) ? resumeData.languages.map((lang) => ({
        language: asText(lang?.language),
        level: asText(lang?.level)
    })).filter((lang) => lang.language || lang.level) : []
});

const normalizeOptimization = (data) => ({
    resumeData: normalizeResumeData(data?.resumeData),
    improvements: asStringArray(data?.improvements, 8),
    impact: asText(data?.impact)
});

const getOpenAICompatibleEndpoint = (providerId) => {
    if (providerId === 'openrouter') return 'https://openrouter.ai/api/v1/chat/completions';
    if (providerId === 'deepseek') return 'https://api.deepseek.com/chat/completions';
    if (providerId === 'zai') return 'https://api.z.ai/api/paas/v4/chat/completions';
    throw new Error(`Provedor não suportado: ${providerId}`);
};

const buildOpenAICompatibleBody = ({ providerId, model, messages, temperature, expectJson }) => {
    const body = {
        model,
        messages,
        temperature,
        stream: false
    };

    if (expectJson) {
        body.response_format = { type: 'json_object' };
    }

    if (providerId === 'deepseek' || providerId === 'zai') {
        body.thinking = { type: expectJson ? 'disabled' : 'enabled' };
    }

    if (providerId === 'deepseek' && !expectJson) {
        body.reasoning_effort = 'high';
    }

    return body;
};

const fetchOpenAICompatible = async ({ provider, apiKey, model, systemPrompt, userPrompt, temperature, expectJson }) => {
    const endpoint = getOpenAICompatibleEndpoint(provider.id);
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
    };

    if (provider.id === 'openrouter') {
        headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location?.origin || 'https://apresentando.me' : 'https://apresentando.me';
        headers['X-OpenRouter-Title'] = 'APRESENTANDO.ME';
    }

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    const requestBody = buildOpenAICompatibleBody({
        providerId: provider.id,
        model,
        messages,
        temperature,
        expectJson
    });

    const sendRequest = async (body) => fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    });

    let response = await sendRequest(requestBody);
    if (!response.ok && requestBody.response_format) {
        const fallbackBody = { ...requestBody };
        delete fallbackBody.response_format;
        response = await sendRequest(fallbackBody);
    }

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`${provider.shortLabel} retornou HTTP ${response.status}. ${errorText.slice(0, 180)}`.trim());
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error(`${provider.shortLabel} não retornou conteúdo utilizável.`);
    }

    return content;
};

const fetchGemini = async ({ apiKey, model, systemPrompt, userPrompt, temperature, expectJson }) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({
        model,
        generationConfig: {
            temperature,
            ...(expectJson ? { responseMimeType: 'application/json' } : {})
        }
    });

    const result = await geminiModel.generateContent(`${systemPrompt}\n\n${userPrompt}`);
    const response = await result.response;
    return response.text();
};

const generateText = async ({ systemPrompt, userPrompt, temperature = 0.2, expectJson = false }) => {
    const settings = getSettings();
    const provider = getProvider(settings.provider);
    const apiKey = getApiKeyForSettings(settings);
    const model = getSelectedModelForSettings(settings);

    if (!apiKey) {
        throw new Error(createMissingKeyError(provider));
    }

    if (provider.id === 'google') {
        return fetchGemini({ apiKey, model, systemPrompt, userPrompt, temperature, expectJson });
    }

    return fetchOpenAICompatible({
        provider,
        apiKey,
        model,
        systemPrompt,
        userPrompt,
        temperature,
        expectJson
    });
};

const STYLE_GUARDRAILS = `
Regra de estilo obrigatória:
- Nunca use travessão ou meia-risca. Os caracteres proibidos são U+2014 e U+2013.
- Para pausas e explicações, use ponto, vírgula, dois-pontos ou parênteses.
- Não substitua travessão por hífen solto.
`;

const ANALYSIS_SYSTEM_PROMPT = `
Você é o motor de análise de currículos de uma plataforma de recrutamento.
Retorne sempre JSON válido, sem markdown, sem comentários e sem texto fora do objeto.
${STYLE_GUARDRAILS}

Execute DUAS análises separadas:

1. ATS SCORE: avalia a chance de parsing correto por sistemas ATS. Baseie-se no texto extraído e em qualquer pista estrutural disponível. Seja crítico quando houver sinais de layout fragmentado, falta de seções, texto embaralhado, ausência de contato, blocos longos ou baixa legibilidade.

2. MATCH SCORE: avalia compatibilidade com a vaga apenas quando uma descrição de vaga for fornecida. Se não houver vaga, use null em matchScore, matchAnalysis, foundKeywords e missingKeywords.

Escala:
- atsScore 85-100: formato limpo, seções claras, contato completo.
- atsScore 70-84: bom, com ajustes menores.
- atsScore 50-69: parsing possivelmente parcial.
- atsScore 0-49: alto risco de falha de leitura.

Limites:
- screeningReason: até 350 caracteres, sem falar da vaga.
- matchAnalysis: até 400 caracteres.
- foundKeywords/missingKeywords/keywordOps: até 10 itens.
- tips: até 5 itens.
- strengths: até 3 itens.

Formato obrigatório:
{
  "atsScore": 0,
  "probability": "Alta" | "Média" | "Baixa",
  "screeningReason": "",
  "matchScore": null,
  "matchAnalysis": null,
  "foundKeywords": null,
  "missingKeywords": null,
  "strengths": [{ "title": "", "description": "" }],
  "keywordOps": [],
  "tips": []
}
`;

export const analyzeResume = async (resumeText, jobDescription, pdfMetadata = null) => {
    try {
        const hasJobDescription = Boolean(jobDescription?.trim());
        const userPrompt = `
CURRÍCULO EXTRAÍDO:
${resumeText}

SINAIS TÉCNICOS DO PDF:
${pdfMetadata ? JSON.stringify(pdfMetadata, null, 2) : "Não disponíveis"}

DESCRIÇÃO DA VAGA:
${hasJobDescription ? jobDescription : "Não fornecida"}
`;

        const text = await generateText({
            systemPrompt: ANALYSIS_SYSTEM_PROMPT,
            userPrompt,
            temperature: 0,
            expectJson: true
        });

        return sanitizeGeneratedText(normalizeAnalysis(parseJsonResponse(text), hasJobDescription));
    } catch (error) {
        console.error("Erro na análise da IA:", error);
        throw new Error(error.message || "Falha ao analisar currículo pela IA.");
    }
};

const getOptimizationInstructions = (aggressiveness) => {
    const levels = {
        low: `
- Corrija gramática, ortografia e consistência.
- Padronize datas, títulos e bullets.
- Preserve voz, fatos, datas, empresas e links.
- Preserve projetos reais e seus links quando existirem.
- Insira palavras-chave apenas onde já existe contexto compatível.
- Não invente conquistas, senioridade, certificações ou ferramentas.
`,
        medium: `
- Faça tudo do modo conservador.
- Reescreva o resumo para destacar aderência real à vaga.
- Reformule bullets com verbos de ação e impacto concreto.
- Quantifique apenas quando houver número explícito ou inferência segura.
- Reordene habilidades conforme relevância para a vaga.
- Para perfis júnior, transição de carreira ou pouca experiência formal, valorize projetos reais como evidência técnica.
- Mantenha linguagem profissional, humana e verificável.
`,
        high: `
- Faça tudo do modo equilibrado.
- Reestruture a narrativa para maximizar clareza, aderência e impacto.
- Remova informação irrelevante para a vaga.
- Espelhe termos da vaga sem empilhar palavras-chave artificialmente.
- Reescreva todos os bullets fracos, mantendo fatos e limites do original.
`
    };

    return levels[aggressiveness] || levels.medium;
};

const OPTIMIZATION_SYSTEM_PROMPT = `
Você é um otimizador de currículos sênior.
Retorne apenas JSON válido, sem markdown e sem texto fora do objeto.
${STYLE_GUARDRAILS}

Regras:
- Nunca invente empresas, cargos, datas, certificações, tecnologias ou resultados.
- Preserve todos os links do currículo original.
- Preserve projetos existentes em uma seção própria. Se o currículo trouxer projetos pessoais, acadêmicos, portfólio ou GitHub, mova esses dados para o array projects.
- Use a descrição da vaga como fonte de vocabulário ATS, mas apenas quando houver evidência real no currículo original.
- Se houver brecha real no currículo, faça cerca de 80% das palavras-chave importantes e compatíveis da vaga aparecerem naturalmente no currículo otimizado.
- Não empilhe palavras-chave. Distribua termos em resumo, habilidades, projetos e bullets apenas quando fizer sentido.
- Se uma seção não existir, deixe o array vazio.
- Escreva em português do Brasil.
- Use linguagem natural, profissional e específica. Evite texto robótico, clichês e exageros.
- Cada bullet deve preferir verbo de ação + escopo + impacto.

Formato obrigatório:
{
  "resumeData": {
    "contact": { "name": "", "email": "", "phone": "", "linkedin": "", "portfolio": "", "location": "" },
    "summary": "",
    "experiences": [{ "role": "", "company": "", "startDate": "", "endDate": "", "bullets": [] }],
    "skills": { "hard": [], "soft": [] },
    "projects": [{ "name": "", "url": "", "description": "", "bullets": [] }],
    "education": [{ "degree": "", "institution": "", "year": "" }],
    "certificates": [{ "name": "", "institution": "", "year": "" }],
    "languages": [{ "language": "", "level": "" }]
  },
  "improvements": [],
  "impact": ""
}
`;

export const optimizeResume = async (resumeText, jobDescription, aggressiveness) => {
    try {
        const keywordTransferBrief = buildKeywordTransferBrief(jobDescription);
        const userPrompt = `
NÍVEL DE INTERVENÇÃO:
${getOptimizationInstructions(aggressiveness)}

CHECKLIST DE PALAVRAS-CHAVE DA VAGA:
${keywordTransferBrief}

REGRA DE TRANSFERÊNCIA DE PALAVRAS-CHAVE:
- Primeiro, compare o checklist com o currículo original.
- Marque internamente quais termos são comprovados ou compatíveis com experiências, projetos, habilidades, formação ou certificações do candidato.
- Quando o currículo permitir, inclua cerca de 80% desses termos compatíveis no JSON final.
- Use os termos exatos da vaga ao menos uma vez quando isso soar natural.
- Se o currículo não sustentar uma palavra-chave, não use essa palavra-chave.
- Se não for possível chegar perto de 80% sem inventar, priorize honestidade e naturalidade.

CURRÍCULO ORIGINAL:
${resumeText}

DESCRIÇÃO DA VAGA:
${jobDescription || "Não fornecida. Otimize para clareza, leitura ATS e competitividade geral."}
`;

        const text = await generateText({
            systemPrompt: OPTIMIZATION_SYSTEM_PROMPT,
            userPrompt,
            temperature: 0.25,
            expectJson: true
        });

        const normalized = normalizeOptimization(parseJsonResponse(text));
        return sanitizeGeneratedText({
            ...normalized,
            resumeData: improveKeywordCoverage(normalized.resumeData, resumeText, jobDescription)
        });
    } catch (error) {
        console.error("Erro na otimização:", error);
        throw new Error(error.message || "Falha ao otimizar currículo.");
    }
};

const COVER_LETTER_SYSTEM_PROMPT = `
Você é um redator de carreira sênior.
Escreva uma carta de apresentação em português do Brasil, humana e específica.
${STYLE_GUARDRAILS}

Direção de estilo:
- Evite tom robótico, genérico ou subserviente.
- Não use frases como "venho por meio desta", "fico à disposição", "fico no aguardo" ou "valor imediato".
- Não peça para agendar conversa, reunião ou chamada.
- Não mencione duração de conversa, como 15, 20 ou 30 minutos.
- Use ritmo natural, com frases de tamanhos variados.
- Conecte evidências do currículo ao problema da vaga.
- Se faltar vaga, escreva uma carta mais aberta, mas ainda concreta.
- Não invente experiências ou resultados.
- Entregue apenas o texto final em 4 a 6 parágrafos curtos.
- Separe os parágrafos com uma linha em branco.
- Termine com interesse em contribuir para o time ou seguir nas próximas etapas, sem pedir agenda.
`;

export const generateCoverLetter = async (resumeText, jobDescription, styleId = 'direta') => {
    try {
        const selectedStyle = getCoverLetterStyle(styleId);
        const userPrompt = `
ESTILO ESCOLHIDO:
${selectedStyle.label}

INSTRUÇÕES DO ESTILO:
${selectedStyle.prompt}

CURRÍCULO DO CANDIDATO:
${resumeText}

VAGA DE DESTINO:
${jobDescription || "Não especificada"}

Escreva uma carta que soe como uma pessoa competente falando com outra pessoa competente. Use detalhes reais do currículo, escolha 2 ou 3 evidências fortes, respeite o estilo escolhido e feche de forma confiante, sem tentar marcar conversa.
`;

        const text = await generateText({
            systemPrompt: COVER_LETTER_SYSTEM_PROMPT,
            userPrompt,
            temperature: 0.55,
            expectJson: false
        });

        return sanitizeCoverLetterText(text);
    } catch (error) {
        console.error("Erro na geração da carta de apresentação:", error);
        throw new Error(error.message || "Falha ao gerar a carta de apresentação.");
    }
};
