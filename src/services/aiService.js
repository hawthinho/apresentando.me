import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSettings } from "./settingsService";

export const getGenAIInstance = () => {
    const settings = getSettings();
    if (!settings.apiKey) {
        throw new Error("CHAVE DE API NÃO CONFIGURADA. Acesse as Configurações para inserir sua API Key.");
    }
    return new GoogleGenerativeAI(settings.apiKey);
};

const SYSTEM_PROMPT = `
Você é o motor de análise de currículos de uma plataforma de recrutamento de nível enterprise.
Sua função é executar DUAS análises SEPARADAS e INDEPENDENTES:

## ANÁLISE 1: ATS SCORE (Compatibilidade Técnica com Sistemas ATS)
Esta análise avalia se o currículo será PARSEADO CORRETAMENTE por sistemas ATS.
IMPORTANTE: Sistemas ATS reais NÃO conseguem ler layouts complexos, duas colunas, fotos ou sidebars.

### PONTUAÇÃO BASE: Comece com 100 pontos e SUBTRAIA conforme problemas encontrados:

**PENALIZAÇÕES CRÍTICAS (layout que QUEBRA parsing do ATS):**
- Layout em DUAS COLUNAS ou mais: **-30 pontos** (ATS lê linha por linha, colunas misturam texto)
- Possui FOTO/IMAGEM do candidato: **-15 pontos** (ocupa espaço e pode confundir OCR)
- SIDEBAR com informações: **-20 pontos** (ATS não sabe ler barras laterais)
- Tabelas ou caixas de texto: **-15 pontos** (estrutura não-linear)
- Ícones ou elementos gráficos decorativos: **-10 pontos** (não são texto)
- Headers/footers complexos: **-5 pontos**

**PENALIZAÇÕES MODERADAS (conteúdo subótimo):**
- Falta seção de Resumo/Objetivo: **-8 pontos**
- Falta seção de Experiência clara: **-10 pontos**
- Falta seção de Formação: **-6 pontos**
- Falta seção de Habilidades: **-6 pontos**
- Falta informações de contato (email/telefone): **-8 pontos**
- Não usa bullet points nas experiências: **-5 pontos**
- Parágrafos muito longos (blocos de texto): **-5 pontos**
- Não usa verbos de ação: **-5 pontos**
- Não quantifica resultados: **-5 pontos**

### INTERPRETAÇÃO DO SCORE:
- **85-100**: Formato ideal para ATS. Coluna única, estrutura limpa.
- **70-84**: Bom formato com pequenos ajustes recomendados.
- **50-69**: Formato problemático. Pode ter parsing parcial.
- **0-49**: Formato RUIM. Alto risco de rejeição automática por falha de parsing.

### PROBABILIDADE DE LEITURA ATS:
- **Alta (≥75)**: Estrutura em coluna única, sem elementos visuais, seções claras.
- **Média (50-74)**: Alguns elementos problemáticos, parsing parcial provável.
- **Baixa (<50)**: Layout complexo (duas colunas, sidebar, foto) que ATS não consegue ler.

**REGRA DE OURO**: Se o currículo tem LAYOUT EM DUAS COLUNAS ou SIDEBAR, o score NUNCA pode ser acima de 55.

---

## ANÁLISE 2: MATCH SCORE (Compatibilidade com a Vaga)
Esta análise avalia APENAS se o candidato atende aos requisitos da vaga (SE fornecida).
Se não houver vaga, retorne matchScore, matchAnalysis, foundKeywords e missingKeywords como NULL.

Critérios (quando há vaga):
- Requisitos obrigatórios atendidos
- Requisitos desejáveis atendidos
- Keywords encontradas vs faltantes
- Alinhamento de senioridade

---

## LIMITES DE CARACTERES (RESPEITE RIGOROSAMENTE):
- screeningReason: máximo 350 caracteres (fale APENAS sobre formato/estrutura, NÃO sobre vaga)
- matchAnalysis: máximo 400 caracteres
- foundKeywords: máximo 10 itens
- missingKeywords: máximo 10 itens
- keywordOps: máximo 10 itens
- tips: máximo 5 itens, cada um com máximo 120 caracteres
- strengths: máximo 3 itens

## OUTPUT JSON (estrutura obrigatória):
{
  "atsScore": (0-100, baseado APENAS na qualidade de formato do currículo),
  "probability": "Alta" | "Média" | "Baixa" (probabilidade de LEITURA correta pelo ATS, não de aprovação na vaga),
  "screeningReason": "(máx 350 chars) Explique a qualidade do FORMATO: seções presentes/ausentes, estrutura, legibilidade. NÃO mencione a vaga aqui.",
  "matchScore": (0-100, compatibilidade com a vaga - NULL se não houver vaga),
  "matchAnalysis": "(máx 400 chars) Análise de compatibilidade com a VAGA. Requisitos atendidos vs gaps. NULL se não houver vaga.",
  "foundKeywords": ["Keywords da VAGA encontradas no currículo - NULL se não houver vaga"],
  "missingKeywords": ["Keywords da VAGA não encontradas - NULL se não houver vaga"],
  "strengths": [
    { "title": "(máx 50 chars)", "description": "(máx 100 chars)" }
  ],
  "keywordOps": ["Termos que o candidato deveria adicionar para melhorar"],
  "tips": ["Ações práticas para melhorar o currículo"]
}

## REGRAS CRÍTICAS:
- atsScore = qualidade de FORMATO. matchScore = compatibilidade com VAGA.
- Se não houver vaga, matchScore/matchAnalysis/foundKeywords/missingKeywords = null.
- Seja CRÍTICO e REALISTA. Não infle scores.
- Use Português do Brasil.
`;



export const analyzeResume = async (resumeText, jobDescription) => {
    try {
        const genAI = getGenAIInstance();
        const settings = getSettings();
        const model = genAI.getGenerativeModel({
            model: settings.model || "gemini-3-flash-preview",
            generationConfig: {
                temperature: 0, // Temperatura 0 para resultados determinísticos e consistentes
            }
        });

        const prompt = `
      ${SYSTEM_PROMPT}
      
      CURRÍCULO:
      ${resumeText}
      
      DESCRIÇÃO DA VAGA:
      ${jobDescription || "Não fornecida"}
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean JSON response (sometimes Gemini wraps it in code blocks)
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Erro na análise da IA:", error);
        throw new Error("Falha ao analisar currículo pela IA. Verifique sua conexão ou tente novamente.");
    }
};

export const optimizeResume = async (resumeText, jobDescription, aggressiveness) => {
    try {
        const genAI = getGenAIInstance();
        const settings = getSettings();
        const model = genAI.getGenerativeModel({
            model: settings.model || "gemini-3-flash-preview",
            generationConfig: {
                temperature: 0.3, // Temperatura baixa para consistência, mas com alguma criatividade na reescrita
            }
        });

        const levelInstructions = {
            low: {
                name: "CONSERVADOR",
                focus: "Polimento e correções mínimas",
                actions: `
                    - Corrigir erros gramaticais e ortográficos
                    - Padronizar formatação (datas, títulos, bullet points)
                    - Melhorar clareza sem alterar significado
                    - Adicionar keywords da vaga APENAS onde já existe contexto compatível
                    - NÃO inventar experiências ou habilidades
                    - NÃO reescrever bullet points significativamente
                    - Manter tom e voz originais do candidato
                `
            },
            medium: {
                name: "EQUILIBRADO",
                focus: "Reescrita estratégica com alinhamento à vaga",
                actions: `
                    - TUDO do nível conservador, MAIS:
                    - Reescrever o resumo profissional para destacar fit com a vaga
                    - Reformular bullet points de experiência com verbos de ação fortes (liderou, implementou, otimizou, reduziu, aumentou)
                    - Quantificar resultados onde possível (%, números, impacto)
                    - Inserir keywords da vaga naturalmente nas descrições de experiência
                    - Reordenar habilidades priorizando as mais relevantes para a vaga
                    - Ajustar títulos de cargo para melhor match (se razoável)
                    - Manter veracidade: não inventar, apenas reformular
                `
            },
            high: {
                name: "AGRESSIVO",
                focus: "Transformação completa orientada a conversão",
                actions: `
                    - TUDO dos níveis anteriores, MAIS:
                    - Reescrever TODO o currículo com tom altamente persuasivo
                    - Criar resumo profissional de alto impacto vendendo o candidato como a escolha ideal
                    - Maximizar inserção de keywords da vaga em TODAS as seções
                    - Reformular TODOS os bullet points para mostrar impacto e resultados
                    - Reestruturar ordem das seções se beneficiar o match
                    - Expandir descrições curtas para mostrar mais valor
                    - Remover informações irrelevantes para a vaga
                    - Usar linguagem que espelha a descrição da vaga
                    - Objetivo: maximizar ATS score e impressionar recrutador
                `
            }
        };

        const level = levelInstructions[aggressiveness] || levelInstructions.medium;

        const prompt = `
Você é um otimizador de currículos de nível enterprise, especializado em maximizar aprovação em sistemas de recrutamento automatizado.

## SUA MISSÃO
Otimizar o currículo para MAXIMIZAR a chance de passar no filtro ATS e impressionar o recrutador.
Nível de intervenção: **${level.name}** - ${level.focus}

## ETAPA 1: ANÁLISE DA VAGA (execute mentalmente)
Antes de otimizar, identifique na descrição da vaga:
- Requisitos OBRIGATÓRIOS vs DESEJÁVEIS
- Hard skills específicas (tecnologias, ferramentas, certificações)
- Soft skills mencionadas
- Nível de senioridade esperado
- Palavras-chave que o ATS vai procurar

## ETAPA 2: OTIMIZAÇÃO (nível ${level.name})
${level.actions}

## CURRÍCULO ORIGINAL:
${resumeText}

## DESCRIÇÃO DA VAGA:
${jobDescription || "Não fornecida - otimize para qualidade geral de mercado tech"}

## REGRAS DE OURO:
1. NUNCA invente experiências, empresas ou certificações que não existem no original
2. Mantenha datas e empresas exatamente como estão
3. Keywords devem ser inseridas de forma NATURAL, não forçada
4. Resultados quantificados são mais impactantes (use quando possível inferir do contexto)
5. Se alguma seção não existir no original, OMITA ela (não invente conteúdo)
6. PRESERVE todos os links do currículo original (portfolio, github, behance, dribbble, etc) - NÃO os remova

## FORMATAÇÃO DO OUTPUT JSON:
Retorne ESTRITAMENTE o formato JSON abaixo, preenchendo as seções com o conteúdo otimizado. 
A estrutura do objeto "resumeData" é mandatória para integração com nossa API.

{
    "resumeData": {
        "contact": { "name": "Nome Completo", "email": "E-mail", "phone": "Telefone", "linkedin": "URL", "portfolio": "URL", "location": "Localização" },
        "summary": "Resumo completo otimizado em 2-4 linhas descrevendo perfil, competências e objetivo.",
        "experiences": [ 
            { "role": "Cargo", "company": "Empresa", "startDate": "Mês/Ano", "endDate": "Mês/Ano ou Presente", "bullets": ["Ação 1 com verbo forte e resultado quantificado", "Ação 2 detalhada"] } 
        ],
        "skills": { "hard": ["Skill Técnica 1", "Skill Técnica 2"], "soft": ["Skill Comportamental 1", "Skill Comportamental 2"] },
        "education": [ { "degree": "Grau - Curso", "institution": "Instituição", "year": "Ano de Conclusão" } ],
        "certificates": [ { "name": "Nome do Certificado/Curso", "institution": "Instituição", "year": "Ano" } ],
        "languages": [ { "language": "Idioma", "level": "Nível (Básico/Intermediário/Avançado/Fluente/Nativo)" } ]
    },
    "improvements": ["Melhoria específica 1 que você fez", "Melhoria específica 2 que você fez", "Melhoria específica 3 que você fez"],
    "impact": "Explicação em um parágrafo de como essas mudanças específicas aumentam a chance do candidato conseguir o emprego, baseado na percepção dos recrutadores e ATS."
}

NOTAS:
- Se alguma seção não existir no original (ex: idiomas ou certificados), deixe o array respectivo VAZIO (ex: "languages": []).
- NÃO crie chaves fora do padrão acima.
- Cada bullet point de experiência ('bullets') em 'experiences' deve preferencialmente começar com verbo de ação (Liderou, Desenvolveu, Implementou, Otimizou).
- Remova hobbies e seções irrelevantes.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Remove markdown code blocks
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Extract JSON object from the response (in case AI adds extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Resposta da IA não contém JSON válido");
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Erro na otimização:", error);
        throw new Error("Falha ao otimizar currículo.");
    }
};

export const generateCoverLetter = async (resumeText, jobDescription) => {
    try {
        const genAI = getGenAIInstance();
        const settings = getSettings();
        const model = genAI.getGenerativeModel({
            model: settings.model || "gemini-3-flash-preview",
            generationConfig: {
                temperature: 0.5,
            }
        });

        const prompt = `
Você é um redator de nível premium auxiliando um profissional a conquistar um emprego estratégico.

## DADOS DO CANDIDATO
${resumeText}

## VAGA DE DESTINO
${jobDescription || "Não especificada - foque no valor geral e histórico de sucesso"}

## SUA MISSÃO
Escreva uma Carta de Apresentação (Cover Letter) persuasiva focada no "fit" de valor, destacando o impacto do candidato.

## REGRAS DE REDAÇÃO
1. Tamanho: Máximo de 3 a 5 parágrafos curtos, diretos.
2. Tom: Confiante, profissional, indo direto ao ponto, com estilo "Editorial Brutalism". Evite linguagem subserviente ou clichê.
3. Estrutura:
   - Gancho inicial focando no problema da vaga/empresa e sua solução.
   - 1 a 2 parágrafos provindo evidências das suas experiências passadas sem citar o currículo desnecessariamente.
   - Conclusão com call-to-action forte.
4. Idioma: Português do Brasil.
5. Retorne APENAS o texto formatado final.

Importante: Retorne o texto puro em parágrafos, sem metadados, títulos internos, ou markdown extras.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Erro na geração da carta de apresentação:", error);
        throw new Error("Falha ao gerar a carta de apresentação.");
    }
};
