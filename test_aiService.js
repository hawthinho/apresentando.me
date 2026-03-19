import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const envFile = fs.readFileSync('.env', 'utf-8');
const match = envFile.match(/VITE_GEMINI_API_KEY=(.+)/);
const API_KEY = match ? match[1].trim() : process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("No API_KEY found!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const optimizeResume = async (resumeText, jobDescription, aggressiveness) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3.1-flash-lite-preview",
            generationConfig: {
                temperature: 0.3, 
            }
        });

        const level = {
            name: "CONSERVADOR",
            focus: "Polimento e correções mínimas",
            actions: "- Corrigir erros"
        };

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
5. Se alguma seção não existir no original, OMITA ela deixando o array/string VAZIO (não invente conteúdo)
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
    }
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

        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Resposta da IA não contém JSON válido");
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Erro na otimização:", error);
        throw error;
    }
};

const sampleText = `
Flávio Silva
Desenvolvedor Full Stack
flavio@email.com | github.com/flaviodev | (11) 98888-7777

Experiência
Dev Front-end - Tech Corp (Jan/2021 - Atual)
Trabalhei com React e Vue. Fiz o app ficar 30% mais rápido.

Formação
Engenharia de Software - FIAP - 2020

Idiomas
Inglês Intermediário
`;

optimizeResume(sampleText, "Vaga para Dev React Pleno", "low")
    .then(res => {
        console.log(JSON.stringify(res, null, 2));
        fs.unlinkSync('./test_aiService.js');
    })
    .catch(err => {
        console.error(err);
        fs.unlinkSync('./test_aiService.js');
    });
