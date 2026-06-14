const SECTION_HEADER_PATTERN = /^(resumo|resumo profissional|objetivo|experiência|experiencia|experiência profissional|experiencia profissional|projetos|projects|formação|formacao|formação acadêmica|formacao academica|competências|competencias|habilidades|certificados|certificações|certificacoes|cursos|idiomas|línguas|linguas)\b/i;
const CONTACT_HINT_PATTERN = /(@|linkedin\.com|github\.com|gitlab\.com|behance|dribbble|portfolio|portfólio|https?:\/\/|www\.|\+\d|\(?\d{2}\)?\s*\d{4,5}[-\s]?\d{4})/i;
const ROLE_HINT_PATTERN = /(desenvolvedor|developer|designer|analista|engenheiro|arquiteto|gerente|coordenador|especialista|consultor|estagiário|estagiario|assistente|diretor|product|produto|ux|ui|fullstack|front-end|backend|back-end|dados|data|devops|qa|marketing|conteúdo|conteudo|redator|copywriter|social media|financeiro|administrativo)/i;

const asCleanLine = (value) => String(value || '').replace(/\*\*/g, '').trim();

const removeControlChars = (value) => Array.from(value)
    .filter((character) => {
        const code = character.charCodeAt(0);
        return code >= 32 && code !== 127;
    })
    .join('');

export const sanitizeFilenamePart = (value, maxLength = 80) => {
    const cleaned = removeControlChars(asCleanLine(value))
        .replace(/[<>:"/\\|?*]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/[. ]+$/g, '');

    return cleaned.slice(0, maxLength).trim().replace(/[. ]+$/g, '');
};

const isSectionHeader = (line) => SECTION_HEADER_PATTERN.test(asCleanLine(line));

const looksLikeContact = (line) => CONTACT_HINT_PATTERN.test(asCleanLine(line));

const normalizeRole = (value) => {
    const line = asCleanLine(value).replace(/^[-•*]\s*/, '');
    const firstPart = line.split('|').map((part) => part.trim()).filter(Boolean)[0] || line;

    return firstPart
        .replace(/\s+(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)[a-zç]*\.?\/?\s*\d{4}.*$/i, '')
        .replace(/\s+\d{2}\/\d{4}.*$/i, '')
        .replace(/\s+(19|20)\d{2}.*$/i, '')
        .trim();
};

const getRoleFromSummary = (value) => {
    const summary = asCleanLine(value);
    if (!ROLE_HINT_PATTERN.test(summary)) return '';

    return summary
        .split(/[.;]/)[0]
        .replace(/\s+com\s+foco\b.*$/i, '')
        .replace(/\s+especializad[oa]\b.*$/i, '')
        .trim();
};

const getFirstRoleFromData = (resumeData) => {
    const experiences = Array.isArray(resumeData?.experiences) ? resumeData.experiences : [];
    const firstExperience = experiences.find((experience) => asCleanLine(experience?.role));
    if (firstExperience) return firstExperience.role;

    return getRoleFromSummary(resumeData?.summary);
};

const extractIdentityFromData = (resumeData) => ({
    name: resumeData?.contact?.name || '',
    role: getFirstRoleFromData(resumeData)
});

const getHeaderRoleCandidate = (lines) => {
    const headerCandidates = [];

    for (const line of lines.slice(1)) {
        if (isSectionHeader(line)) break;
        if (!looksLikeContact(line)) headerCandidates.push(line);
    }

    return headerCandidates.find((line) => ROLE_HINT_PATTERN.test(line)) || headerCandidates[0] || '';
};

const getExperienceRoleCandidate = (lines) => {
    const experienceIndex = lines.findIndex((line) => /^(experiência|experiencia|experiência profissional|experiencia profissional|experience|work experience)\b/i.test(line));
    if (experienceIndex < 0) return '';

    for (const line of lines.slice(experienceIndex + 1)) {
        if (isSectionHeader(line)) break;
        if (!line || line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) continue;
        return line;
    }

    return '';
};

const getSummaryRoleCandidate = (lines) => {
    const summaryIndex = lines.findIndex((line) => /^(resumo|resumo profissional|objetivo|summary|profile)\b/i.test(line));
    if (summaryIndex < 0) return '';

    for (const line of lines.slice(summaryIndex + 1)) {
        if (isSectionHeader(line)) break;
        const role = getRoleFromSummary(line);
        if (role) return role;
    }

    return '';
};

const extractIdentityFromText = (content) => {
    const lines = String(content || '').split('\n').map(asCleanLine).filter(Boolean);
    const name = lines.find((line) => !isSectionHeader(line) && !looksLikeContact(line) && !line.startsWith('-') && !line.startsWith('•')) || '';
    const role = getHeaderRoleCandidate(lines) || getExperienceRoleCandidate(lines) || getSummaryRoleCandidate(lines);

    return { name, role: normalizeRole(role) };
};

export const buildResumePdfFilename = (resumeSource, prefix = 'Currículo') => {
    const identity = typeof resumeSource === 'string'
        ? extractIdentityFromText(resumeSource)
        : extractIdentityFromData(resumeSource);

    const parts = [
        sanitizeFilenamePart(prefix, 40),
        sanitizeFilenamePart(identity.name, 80),
        sanitizeFilenamePart(normalizeRole(identity.role), 80)
    ].filter(Boolean);

    const baseName = sanitizeFilenamePart(parts.join(' - '), 180) || 'Currículo';
    return `${baseName}.pdf`;
};
