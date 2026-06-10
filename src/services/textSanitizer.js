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
