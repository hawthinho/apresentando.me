export const stripAiDashMarks = (value) => {
    if (typeof value !== 'string') return value;

    return value
        .replace(/(\d)\s*[\u2014\u2013]\s*(\d)/g, '$1 a $2')
        .replace(/\s*[\u2014\u2013]\s*/g, ', ')
        .replace(/\s+([,.!?;:])/g, '$1')
        .replace(/\s{2,}/g, ' ')
        .trim();
};

export const sanitizeGeneratedText = (value) => {
    if (typeof value === 'string') return stripAiDashMarks(value);
    if (Array.isArray(value)) return value.map(sanitizeGeneratedText);
    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, sanitizeGeneratedText(item)])
        );
    }
    return value;
};

const splitIntoSentences = (text) => (
    text
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean)
);

const groupSentences = (sentences, targetParagraphs = 4) => {
    if (sentences.length <= targetParagraphs) return sentences;

    const groups = [];
    let index = 0;
    while (index < sentences.length) {
        const remainingSentences = sentences.length - index;
        const remainingGroups = Math.max(1, targetParagraphs - groups.length);
        const take = Math.ceil(remainingSentences / remainingGroups);
        groups.push(sentences.slice(index, index + take).join(' '));
        index += take;
    }
    return groups;
};

export const sanitizeCoverLetterText = (value) => {
    const withoutDashMarks = stripAiDashMarks(value);
    if (!withoutDashMarks) return '';

    const withoutPushyClose = withoutDashMarks
        .replace(/\b(?:Gostaria|Quero|Posso|Podemos)\s+(?:de\s+)?(?:agendar|marcar)\s+[^.!?]*(?:conversa|reuni[aã]o)[^.!?]*(?:[.!?]|$)/gi, '')
        .replace(/\b(?:conversa|reuni[aã]o)\s+de\s+\d+\s+minutos[^.!?]*(?:[.!?]|$)/gi, '')
        .replace(/\b(?:Agrade[cç]o\s+a\s+aten[cç][aã]o\s+e\s+)?fico\s+no\s+aguardo[^.!?]*(?:[.!?]|$)/gi, '')
        .replace(/\bvalor imediato\b/gi, 'valor concreto')
        .replace(/\s{2,}/g, ' ')
        .trim();

    const withGreetingBreak = withoutPushyClose
        .replace(/^Prezado\s+time\s+de\s+([^,.]+),\s*/i, 'Olá, time de $1.\n\n')
        .replace(/^Prezados?,\s*/i, 'Olá.\n\n');

    const paragraphs = withGreetingBreak
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
        .filter(Boolean);

    if (paragraphs.length > 1) {
        return paragraphs.join('\n\n');
    }

    return groupSentences(splitIntoSentences(withGreetingBreak), 4).join('\n\n');
};
