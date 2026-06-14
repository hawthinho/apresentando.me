const STOPWORDS = new Set([
    'a', 'ao', 'aos', 'as', 'até', 'com', 'como', 'da', 'das', 'de', 'do', 'dos', 'e', 'em', 'entre',
    'essa', 'esse', 'esta', 'este', 'para', 'pela', 'pelo', 'por', 'que', 'se', 'sem', 'ser', 'sua',
    'suas', 'seu', 'seus', 'ter', 'uma', 'uns', 'nos', 'nas', 'no', 'na', 'o', 'os', 'ou', 'the',
    'and', 'or', 'to', 'of', 'in', 'for', 'with', 'on', 'at', 'by', 'from', 'you', 'your', 'our',
    'vaga', 'posição', 'posicao', 'profissional', 'pessoa', 'time', 'equipe', 'empresa', 'anos',
    'ano', 'meses', 'mínimo', 'minimo', 'desejável', 'desejavel', 'requisitos', 'requisito'
]);

const CANONICAL_KEYWORDS = [
    'UX/UI', 'UI/UX', 'UX', 'UI', 'Product Design', 'Product Designer', 'Product Manager',
    'Figma', 'FigJam', 'Miro', 'Jira', 'Confluence', 'Notion', 'Design System', 'Design Systems',
    'Pesquisa com usuários', 'Pesquisa qualitativa', 'Pesquisa quantitativa', 'Testes de usabilidade',
    'Entrevistas com usuários', 'Jornada do usuário', 'Mapas de jornada', 'Arquitetura de informação',
    'Wireframes', 'Prototipação', 'Protótipos de alta fidelidade', 'Discovery', 'Delivery',
    'Métricas de produto', 'Métricas de funil', 'Conversão', 'Backlog', 'Roadmap', 'OKR', 'KPI',
    'Squads ágeis', 'Scrum', 'Kanban', 'Agile', 'Lean', 'B2B', 'B2C', 'SaaS', 'CRM', 'SEO',
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular', 'Node.js',
    'NestJS', 'Express', 'Python', 'Java', 'C#', 'C++', '.NET', 'ASP.NET Core', 'PHP', 'Laravel',
    'APIs REST', 'API REST', 'REST', 'GraphQL', 'SQL', 'NoSQL', 'PostgreSQL', 'MySQL', 'SQL Server',
    'MongoDB', 'Redis', 'Entity Framework', 'Entity Framework Core', 'LINQ', 'JWT', 'Swagger',
    'OpenAPI', 'xUnit', 'Moq', 'Testes automatizados', 'Testes unitários', 'CI/CD', 'DevOps',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'GitHub', 'GitLab', 'Power BI',
    'Tableau', 'Excel', 'LGPD', 'Crédito', 'Prevenção à fraude', 'Fraude', 'Machine Learning',
    'Inteligência artificial', 'IA', 'Dados', 'Data Analytics'
];

const SOFT_KEYWORD_PATTERN = /(comunicação|comunicacao|liderança|lideranca|colaboração|colaboracao|stakeholders|facilitação|facilitacao|autonomia|organização|organizacao|priorização|priorizacao|negociação|negociacao)/i;

const normalizeSearchText = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9+#./]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeComparable = (value) => normalizeSearchText(value).replace(/[./]+/g, '');

const normalizeCommonVariants = (value) => normalizeSearchText(value)
    .replace(/\bapis\b/g, 'api')
    .replace(/\btestes\b/g, 'teste')
    .replace(/\busuarios\b/g, 'usuario')
    .replace(/\bmetricas\b/g, 'metrica')
    .replace(/\bsquads\b/g, 'squad')
    .replace(/[./]+/g, '');

const keywordMatches = (text, keyword) => {
    const normalizedText = normalizeSearchText(text);
    const normalizedKeyword = normalizeSearchText(keyword);
    if (!normalizedText || !normalizedKeyword) return false;
    if (normalizedText.includes(normalizedKeyword)) return true;

    return normalizeComparable(text).includes(normalizeComparable(keyword)) ||
        normalizeCommonVariants(text).includes(normalizeCommonVariants(keyword));
};

const getKeywordKey = (keyword) => normalizeComparable(keyword);

const CANONICAL_KEYWORD_KEYS = new Set(CANONICAL_KEYWORDS.map(getKeywordKey));
const HIGH_CONFIDENCE_KEYWORD_PATTERN = /([A-Z]{2,}|[+#.]|design|figma|scrum|kanban|agile|discovery|delivery|backlog|roadmap|pesquisa|usabilidade|prototip|jornada|métrica|metrica|conversão|conversao|dados|crédito|credito|fraude|testes?|api|sql|react|node|python|java|docker|aws|azure|git)/i;

const isHighConfidenceKeyword = (keyword) => (
    CANONICAL_KEYWORD_KEYS.has(getKeywordKey(keyword)) || HIGH_CONFIDENCE_KEYWORD_PATTERN.test(keyword)
);

const addCandidate = (candidates, keyword, score, order) => {
    const cleaned = String(keyword || '').replace(/\s+/g, ' ').trim();
    if (!cleaned || cleaned.length < 2) return order;

    const key = getKeywordKey(cleaned);
    if (!key || STOPWORDS.has(key)) return order;

    const previous = candidates.get(key);
    if (previous) {
        previous.score += score;
        return order;
    }

    candidates.set(key, { keyword: cleaned, score, order });
    return order + 1;
};

const tokenizeWords = (text) => String(text || '')
    .split(/[^A-Za-zÀ-ÿ0-9+#.]+/)
    .map((word) => word.trim())
    .filter(Boolean);

const getMeaningfulTokens = (text) => tokenizeWords(text)
    .filter((word) => {
        const normalized = normalizeComparable(word);
        return normalized.length > 2 && !STOPWORDS.has(normalized) && !/^\d+$/.test(normalized);
    });

export const extractImportantJobKeywords = (jobDescription = '', limit = 35) => {
    const text = String(jobDescription || '').trim();
    if (!text) return [];

    const candidates = new Map();
    let order = 0;

    CANONICAL_KEYWORDS.forEach((keyword) => {
        if (keywordMatches(text, keyword)) {
            order = addCandidate(candidates, keyword, 8, order);
        }
    });

    const sentences = text.split(/[\n.;:]+/).map((sentence) => sentence.trim()).filter(Boolean);
    sentences.forEach((sentence) => {
        const tokens = getMeaningfulTokens(sentence);
        for (const size of [3, 2]) {
            for (let index = 0; index <= tokens.length - size; index += 1) {
                const phrase = tokens.slice(index, index + size).join(' ');
                const normalizedPhrase = normalizeComparable(phrase);
                if (normalizedPhrase.length < 8) continue;
                if ([...candidates.keys()].some((key) => key.includes(normalizedPhrase) || normalizedPhrase.includes(key))) continue;
                order = addCandidate(candidates, phrase, size, order);
            }
        }
    });

    return [...candidates.values()]
        .sort((a, b) => b.score - a.score || a.order - b.order)
        .slice(0, limit)
        .map((candidate) => candidate.keyword);
};

export const buildKeywordTransferBrief = (jobDescription = '') => {
    const keywords = extractImportantJobKeywords(jobDescription);
    if (!keywords.length) return 'Nenhuma palavra-chave estruturada foi extraída porque a vaga não foi fornecida.';

    return keywords.map((keyword, index) => `${index + 1}. ${keyword}`).join('\n');
};

const resumeDataToSearchText = (resumeData = {}) => [
    resumeData.summary,
    ...(Array.isArray(resumeData.experiences) ? resumeData.experiences.flatMap((experience) => [
        experience.role,
        experience.company,
        ...(Array.isArray(experience.bullets) ? experience.bullets : [])
    ]) : []),
    ...(Array.isArray(resumeData.projects) ? resumeData.projects.flatMap((project) => [
        project.name,
        project.description,
        ...(Array.isArray(project.bullets) ? project.bullets : [])
    ]) : []),
    ...(Array.isArray(resumeData.skills?.hard) ? resumeData.skills.hard : []),
    ...(Array.isArray(resumeData.skills?.soft) ? resumeData.skills.soft : []),
    ...(Array.isArray(resumeData.education) ? resumeData.education.flatMap((education) => [
        education.degree,
        education.institution
    ]) : []),
    ...(Array.isArray(resumeData.certificates) ? resumeData.certificates.flatMap((certificate) => [
        certificate.name,
        certificate.institution
    ]) : [])
].filter(Boolean).join('\n');

const addKeywordToSkills = (resumeData, keyword) => {
    const target = SOFT_KEYWORD_PATTERN.test(keyword) ? 'soft' : 'hard';
    const skills = {
        hard: Array.isArray(resumeData.skills?.hard) ? [...resumeData.skills.hard] : [],
        soft: Array.isArray(resumeData.skills?.soft) ? [...resumeData.skills.soft] : []
    };

    const alreadyListed = [...skills.hard, ...skills.soft].some((skill) => keywordMatches(skill, keyword));
    if (!alreadyListed) skills[target].push(keyword);

    return { ...resumeData, skills };
};

export const improveKeywordCoverage = (resumeData, originalResumeText = '', jobDescription = '', targetRatio = 0.8) => {
    const jobKeywords = extractImportantJobKeywords(jobDescription);
    if (!jobKeywords.length) return resumeData;

    const supportedKeywords = jobKeywords
        .filter((keyword) => isHighConfidenceKeyword(keyword))
        .filter((keyword) => keywordMatches(originalResumeText, keyword));
    if (!supportedKeywords.length) return resumeData;

    let enhancedResume = {
        ...resumeData,
        skills: {
            hard: Array.isArray(resumeData?.skills?.hard) ? [...resumeData.skills.hard] : [],
            soft: Array.isArray(resumeData?.skills?.soft) ? [...resumeData.skills.soft] : []
        }
    };

    const targetCount = Math.ceil(supportedKeywords.length * targetRatio);
    const getCoveredCount = () => {
        const optimizedText = resumeDataToSearchText(enhancedResume);
        return supportedKeywords.filter((keyword) => keywordMatches(optimizedText, keyword)).length;
    };

    for (const keyword of supportedKeywords) {
        if (getCoveredCount() >= targetCount) break;
        if (!keywordMatches(resumeDataToSearchText(enhancedResume), keyword)) {
            enhancedResume = addKeywordToSkills(enhancedResume, keyword);
        }
    }

    return enhancedResume;
};
