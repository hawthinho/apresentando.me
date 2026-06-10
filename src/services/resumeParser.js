/**
 * Resume Parser Utility
 * Parses AI-generated resume text into structured editable format
 */

/**
 * Parse the optimized resume text into a structured object
 * @param {string} content - The AI-generated resume text
 * @returns {object} Structured resume data
 */
export const parseResumeText = (content) => {
    const lines = content.split('\n').map(line => line.trim()).filter(Boolean);

    const result = {
        contact: {
            name: '',
            email: '',
            phone: '',
            linkedin: '',
            portfolio: '',
            location: ''
        },
        summary: '',
        experiences: [],
        skills: {
            hard: [],
            soft: []
        },
        education: [],
        certificates: [],
        languages: []
    };

    let currentSection = 'header';
    let currentExperience = null;
    let currentEducation = null;
    let lineIndex = 0;

    // Parse header (first two lines: name and contact info)
    if (lines.length > 0) {
        result.contact.name = lines[0];
        lineIndex = 1;
    }

    if (lines.length > 1 && !isSectionHeader(lines[1])) {
        const contactLine = lines[1];
        parseContactLine(contactLine, result.contact);
        lineIndex = 2;
    }

    // Parse sections
    for (let i = lineIndex; i < lines.length; i++) {
        const line = lines[i];
        const sectionType = getSectionType(line);

        if (sectionType) {
            // Save current experience/education if any
            if (currentExperience) {
                result.experiences.push(currentExperience);
                currentExperience = null;
            }
            if (currentEducation) {
                result.education.push(currentEducation);
                currentEducation = null;
            }
            currentSection = sectionType;
            continue;
        }

        switch (currentSection) {
            case 'summary':
                if (result.summary) {
                    result.summary += '\n' + line;
                } else {
                    result.summary = line;
                }
                break;

            case 'experience':
                if (line.startsWith('-') || line.startsWith('•')) {
                    // It's a bullet point
                    if (currentExperience) {
                        currentExperience.bullets.push(line.replace(/^[-•]\s*/, ''));
                    }
                } else if (line.includes('|')) {
                    // New experience entry with | separator
                    if (currentExperience) {
                        result.experiences.push(currentExperience);
                    }
                    currentExperience = parseExperienceLine(line);
                } else if (line.match(/\d{4}/) && !line.startsWith('-') && !line.startsWith('•')) {
                    // Line contains a year - likely a new experience header without | separator
                    // Example: "UI Designer Jr. Blue Saúde Fev 2024 - Presente"
                    if (currentExperience) {
                        result.experiences.push(currentExperience);
                    }
                    currentExperience = {
                        role: line,
                        company: '',
                        startDate: '',
                        endDate: '',
                        bullets: []
                    };
                    // Try to extract date from the line
                    const dateMatch = line.match(/(\w+\/?\s*\d{4})\s*[-\u2013]\s*(\w+\/?\s*\d{4}|Presente|Atual|até o momento)/i);
                    if (dateMatch) {
                        currentExperience.startDate = dateMatch[1];
                        currentExperience.endDate = dateMatch[2];
                        currentExperience.role = line.replace(dateMatch[0], '').trim();
                    }
                }
                break;

            case 'skills':
                parseSkillsLine(line, result.skills);
                break;

            case 'education':
                if (line.includes('|')) {
                    if (currentEducation) {
                        result.education.push(currentEducation);
                    }
                    currentEducation = parseEducationLine(line);
                } else if (currentEducation && line.startsWith('-')) {
                    // Additional info for education
                    if (!currentEducation.details) currentEducation.details = [];
                    currentEducation.details.push(line.replace(/^[-•]\s*/, ''));
                }
                break;

            case 'certificates':
                if (line.startsWith('-') || line.startsWith('•')) {
                    const cert = parseCertificateLine(line.replace(/^[-•]\s*/, ''));
                    if (cert) result.certificates.push(cert);
                } else if (line.includes('|')) {
                    const cert = parseCertificateLine(line);
                    if (cert) result.certificates.push(cert);
                }
                break;

            case 'languages':
                if (line.startsWith('-') || line.startsWith('•')) {
                    const lang = parseLanguageLine(line.replace(/^[-•]\s*/, ''));
                    if (lang) result.languages.push(lang);
                } else if (line.includes(':')) {
                    const lang = parseLanguageLine(line);
                    if (lang) result.languages.push(lang);
                }
                break;
        }
    }

    // Push any remaining experience/education
    if (currentExperience) {
        result.experiences.push(currentExperience);
    }
    if (currentEducation) {
        result.education.push(currentEducation);
    }

    return result;
};

/**
 * Format structured resume data back to text
 * @param {object} data - Structured resume data
 * @returns {string} Formatted resume text
 */
export const formatResumeToText = (data) => {
    const lines = [];

    // Header
    lines.push(data.contact.name);
    const contactParts = [];
    if (data.contact.email) contactParts.push(data.contact.email);
    if (data.contact.phone) contactParts.push(data.contact.phone);
    if (data.contact.linkedin) contactParts.push(data.contact.linkedin);
    if (data.contact.portfolio) contactParts.push(data.contact.portfolio);
    if (data.contact.location) contactParts.push(data.contact.location);
    if (contactParts.length > 0) {
        lines.push(contactParts.join(' | '));
    }
    lines.push('');

    // Summary
    if (data.summary) {
        lines.push('RESUMO PROFISSIONAL');
        lines.push(data.summary);
        lines.push('');
    }

    // Experience
    if (data.experiences.length > 0) {
        lines.push('EXPERIÊNCIA PROFISSIONAL');
        data.experiences.forEach(exp => {
            const expParts = [exp.role, exp.company];
            if (exp.startDate || exp.endDate) {
                expParts.push(`${exp.startDate || ''} - ${exp.endDate || ''}`);
            }
            lines.push(expParts.filter(Boolean).join(' | '));
            exp.bullets.forEach(bullet => {
                lines.push(`- ${bullet}`);
            });
            lines.push('');
        });
    }

    // Skills
    if (data.skills.hard.length > 0 || data.skills.soft.length > 0) {
        lines.push('COMPETÊNCIAS');
        if (data.skills.hard.length > 0) {
            lines.push(`[Hard Skills]: ${data.skills.hard.join(', ')}`);
        }
        if (data.skills.soft.length > 0) {
            lines.push(`[Soft Skills]: ${data.skills.soft.join(', ')}`);
        }
        lines.push('');
    }

    // Education
    if (data.education.length > 0) {
        lines.push('FORMAÇÃO ACADÊMICA');
        data.education.forEach(edu => {
            const eduParts = [edu.degree, edu.institution, edu.year].filter(Boolean);
            lines.push(eduParts.join(' | '));
        });
        lines.push('');
    }

    // Certificates
    if (data.certificates.length > 0) {
        lines.push('CERTIFICADOS E CURSOS');
        data.certificates.forEach(cert => {
            const certParts = [cert.name, cert.institution, cert.year].filter(Boolean);
            lines.push(`- ${certParts.join(' | ')}`);
        });
        lines.push('');
    }

    // Languages
    if (data.languages.length > 0) {
        lines.push('IDIOMAS');
        data.languages.forEach(lang => {
            lines.push(`- ${lang.language}: ${lang.level}`);
        });
    }

    return lines.join('\n');
};

// Helper functions
function isSectionHeader(line) {
    return getSectionType(line) !== null;
}

function getSectionType(line) {
    const upper = line.toUpperCase().trim();
    // A section header should generally be short and not start with bullets or brackets
    if (upper.length > 50 || upper.startsWith('-') || upper.startsWith('•') || upper.startsWith('[')) {
        return null;
    }

    if (upper === 'RESUMO PROFISSIONAL' || upper === 'RESUMO' || upper === 'OBJETIVO') return 'summary';
    if (upper === 'EXPERIÊNCIA PROFISSIONAL' || upper === 'EXPERIÊNCIA' || upper === 'EXPERIENCIAS') return 'experience';
    if (upper === 'COMPETÊNCIAS' || upper === 'HABILIDADES' || upper === 'SKILLS') return 'skills';
    if (upper === 'FORMAÇÃO ACADÊMICA' || upper === 'FORMAÇÃO' || upper === 'EDUCAÇÃO') return 'education';
    if (upper === 'CERTIFICADOS E CURSOS' || upper === 'CERTIFICADOS' || upper === 'CURSOS' || upper === 'CERTIFICAÇÕES') return 'certificates';
    if (upper === 'IDIOMAS' || upper === 'LÍNGUAS') return 'languages';

    // Looser checks for lines that are exactly only containing these words
    if (upper.includes('RESUMO') || upper.includes('OBJETIVO')) return 'summary';
    if (upper.includes('EXPERIÊNCIA') || upper.includes('EXPERIENCIAS')) return 'experience';
    if (upper.includes('COMPETÊNCIAS') || upper.includes('HABILIDADES') || upper === 'SKILLS') return 'skills';
    if (upper.includes('FORMAÇÃO') || upper.includes('EDUCAÇÃO')) return 'education';
    if (upper.includes('CERTIFICAD') || upper.includes('CURSOS')) return 'certificates';
    if (upper.includes('IDIOMAS') || upper.includes('LÍNGUAS')) return 'languages';

    return null;
}

function parseContactLine(line, contact) {
    const parts = line.split('|').map(p => p.trim());
    parts.forEach(part => {
        if (part.includes('@')) {
            contact.email = part;
        } else if (part.match(/linkedin/i) || part.includes('linkedin.com')) {
            contact.linkedin = part;
        } else if (part.match(/behance|dribbble|github|gitlab|portfolio|figma\.com/i)) {
            contact.portfolio = part;
        } else if (part.match(/[\d\s+()-]{8,}/)) {
            contact.phone = part;
        } else if (part.length > 0 && !contact.location) {
            contact.location = part;
        }
    });
}

function parseExperienceLine(line) {
    const parts = line.split('|').map(p => p.trim());
    const exp = {
        role: parts[0] || '',
        company: parts[1] || '',
        startDate: '',
        endDate: '',
        bullets: []
    };

    if (parts[2]) {
        const periodMatch = parts[2].match(/(.+?)\s*[-\u2013]\s*(.+)/);
        if (periodMatch) {
            exp.startDate = periodMatch[1].trim();
            exp.endDate = periodMatch[2].trim();
        } else {
            exp.startDate = parts[2];
        }
    }

    return exp;
}

function parseSkillsLine(line, skills) {
    const lowerLine = line.toLowerCase();

    // Check if both hard and soft skills are on the same line
    // Format: "Hard Skills: skill1, skill2  Soft Skills: skill3, skill4"
    // or "[Hard Skills]: skill1, skill2  [Soft Skills]: skill3, skill4"
    if (lowerLine.includes('hard skill') && lowerLine.includes('soft skill')) {
        // Find the split point between hard and soft skills
        const softIndex = lowerLine.indexOf('soft skill');
        const hardPart = line.substring(0, softIndex);
        const softPart = line.substring(softIndex);

        // Parse hard skills from the first part
        const hardMatch = hardPart.match(/hard\s*skills?\]?:?\s*(.+)/i);
        if (hardMatch && hardMatch[1]) {
            skills.hard = hardMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        }

        // Parse soft skills from the second part
        const softMatch = softPart.match(/soft\s*skills?\]?:?\s*(.+)/i);
        if (softMatch && softMatch[1]) {
            skills.soft = softMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        }
        return;
    }

    // Check for Hard Skills only on this line
    if (lowerLine.includes('hard skill')) {
        const patterns = [
            /\[hard\s*skills?\]:\s*(.+)/i,  // [Hard Skills]: list
            /hard\s*skills?:\s*(.+)/i,       // Hard Skills: list
        ];
        for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match && match[1]) {
                skills.hard = match[1].split(',').map(s => s.trim()).filter(Boolean);
                return;
            }
        }
    }

    // Check for Soft Skills only on this line
    if (lowerLine.includes('soft skill')) {
        const patterns = [
            /\[soft\s*skills?\]:\s*(.+)/i,  // [Soft Skills]: list
            /soft\s*skills?:\s*(.+)/i,       // Soft Skills: list
        ];
        for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match && match[1]) {
                skills.soft = match[1].split(',').map(s => s.trim()).filter(Boolean);
                return;
            }
        }
    }

    // Generic skills line - assume hard skills if nothing parsed yet
    if (!skills.hard.length && !skills.soft.length) {
        const skillsList = line.split(',').map(s => s.trim()).filter(Boolean);
        if (skillsList.length > 0) {
            skills.hard = skillsList;
        }
    }
}

function parseEducationLine(line) {
    const parts = line.split('|').map(p => p.trim());
    return {
        degree: parts[0] || '',
        institution: parts[1] || '',
        year: parts[2] || ''
    };
}

function parseCertificateLine(line) {
    if (!line.trim()) return null;
    const parts = line.split('|').map(p => p.trim());
    return {
        name: parts[0] || line,
        institution: parts[1] || '',
        year: parts[2] || ''
    };
}

function parseLanguageLine(line) {
    if (!line.trim()) return null;

    // Format: "Idioma: Nível" or "Idioma - Nível"
    const colonMatch = line.match(/(.+?):\s*(.+)/);
    if (colonMatch) {
        return {
            language: colonMatch[1].trim(),
            level: colonMatch[2].trim()
        };
    }

    const dashMatch = line.match(/(.+?)\s*[-\u2013]\s*(.+)/);
    if (dashMatch) {
        return {
            language: dashMatch[1].trim(),
            level: dashMatch[2].trim()
        };
    }

    return {
        language: line,
        level: ''
    };
}

/**
 * Format structured resume data to LaTeX code
 * @param {object} data - Structured resume data
 * @returns {string} LaTeX code
 */
export const formatResumeToLatex = (data) => {
    const escapeLatex = (str) => {
        if (!str) return '';
        return str
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/([&%$#_{}])/g, '\\$1')
            .replace(/~/g, '\\textasciitilde{}')
            .replace(/\^/g, '\\textasciicircum{}');
    };

    let latex = `\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[brazil]{babel}
\\usepackage[left=2cm,right=2cm,top=2cm,bottom=2cm]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}

% Colors
\\definecolor{primary}{RGB}{15, 118, 110} % Teal

% Formatting
\\titleformat{\\section}{\\Large\\bfseries\\color{primary}}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{12pt}{8pt}

\\newcommand{\\resumetitle}[1]{{\\fontsize{24}{28}\\selectfont\\textbf{\\color{primary}#1}}\\\\[6pt]}
\\newcommand{\\resumeheader}[1]{{\\small #1}\\\\[12pt]}

\\begin{document}
\\pagestyle{empty}

% Header
\\begin{center}
    \\resumetitle{${escapeLatex(data.contact.name)}}
    \\resumeheader{
        ${[
            data.contact.email,
            data.contact.phone,
            data.contact.linkedin,
            data.contact.portfolio,
            data.contact.location
        ].filter(Boolean).map(escapeLatex).join(' $\\cdot$ ')}
    }
\\end{center}

`;

    // Summary
    if (data.summary) {
        latex += `\\section*{Resumo Profissional}
${escapeLatex(data.summary)}

`;
    }

    // Experience
    if (data.experiences && data.experiences.length > 0) {
        latex += `\\section*{Experiência Profissional}
\\begin{itemize}[leftmargin=*,label={}]
`;
        data.experiences.forEach(exp => {
            latex += `    \\item \\textbf{${escapeLatex(exp.role)}} $|$ ${escapeLatex(exp.company)} \\hfill {\\small ${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)}}
    \\begin{itemize}[leftmargin=1.5em,label=\\textbullet]
`;
            exp.bullets.forEach(bullet => {
                latex += `        \\item ${escapeLatex(bullet)}
`;
            });
            latex += `    \\end{itemize}
    \\vspace{4pt}
`;
        });
        latex += `\\end{itemize}

`;
    }

    // Skills
    if ((data.skills.hard && data.skills.hard.length) || (data.skills.soft && data.skills.soft.length)) {
        latex += `\\section*{Competências}
`;
        if (data.skills.hard && data.skills.hard.length) {
            latex += `\\textbf{Hard Skills:} ${data.skills.hard.map(escapeLatex).join(', ')}\\\\[4pt]
`;
        }
        if (data.skills.soft && data.skills.soft.length) {
            latex += `\\textbf{Soft Skills:} ${data.skills.soft.map(escapeLatex).join(', ')}

`;
        }
    }

    // Education
    if (data.education && data.education.length > 0) {
        latex += `\\section*{Formação Acadêmica}
\\begin{itemize}[leftmargin=*,label={}]
`;
        data.education.forEach(edu => {
            latex += `    \\item \\textbf{${escapeLatex(edu.degree)}} $|$ ${escapeLatex(edu.institution)} \\hfill {\\small ${escapeLatex(edu.year)}}
`;
            if (edu.details && edu.details.length) {
                latex += `    \\begin{itemize}[leftmargin=1.5em,label=\\textbullet]
`;
                edu.details.forEach(detail => {
                    latex += `        \\item ${escapeLatex(detail)}
`;
                });
                latex += `    \\end{itemize}
`;
            }
        });
        latex += `\\end{itemize}

`;
    }

    // Certificates
    if (data.certificates && data.certificates.length > 0) {
        latex += `\\section*{Certificados e Cursos}
\\begin{itemize}[leftmargin=*,label={}]
`;
        data.certificates.forEach(cert => {
            latex += `    \\item \\textbf{${escapeLatex(cert.name)}} $|$ ${escapeLatex(cert.institution)} \\hfill {\\small ${escapeLatex(cert.year)}}
`;
        });
        latex += `\\end{itemize}

`;
    }

    // Languages
    if (data.languages && data.languages.length > 0) {
        latex += `\\section*{Idiomas}
`;
        data.languages.forEach((lang, index) => {
            const isLast = index === data.languages.length - 1;
            latex += `\\textbf{${escapeLatex(lang.language)}}: ${escapeLatex(lang.level)}${isLast ? '' : '\\\\[2pt]'}
`;
        });
        latex += `
`;
    }

    latex += `\\end{document}`;
    return latex;
};

/**
 * Format Cover Letter to LaTeX code
 * @param {string} content - Cover Letter content
 * @returns {string} LaTeX code
 */
export const formatCoverLetterToLatex = (content) => {
    const escapeLatex = (str) => {
        if (!str) return '';
        return str
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/([&%$#_{}])/g, '\\$1')
            .replace(/~/g, '\\textasciitilde{}')
            .replace(/\^/g, '\\textasciicircum{}');
    };

    const paragraphs = content.split('\\n\\n').map(p => p.trim()).filter(Boolean);
    let latex = `\\documentclass[a4paper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[brazil]{babel}
\\usepackage[left=2.5cm,right=2.5cm,top=3cm,bottom=3cm]{geometry}
\\usepackage{mathptmx} % Serif font for letter
\\usepackage{setspace}
\\onehalfspacing

\\begin{document}
\\pagestyle{empty}
\\begin{flushright}
  \\today
\\end{flushright}
\\vspace{1cm}

`;

    for (const p of paragraphs) {
        latex += `${escapeLatex(p)}\n\n`;
    }

    latex += `\\end{document}`;
    return latex;
};

/**
 * Format combined Resume and Cover Letter to LaTeX code
 * @param {string} resumeLatex - Pre-formatted Resume LaTeX string
 * @param {string} coverLetter - Cover Letter content
 * @returns {string} LaTeX code
 */
export const formatCombinedToLatex = (resumeLatex, coverLetter) => {
    
    const escapeLatex = (str) => {
        if (!str) return '';
        return str
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/([&%$#_{}])/g, '\\$1')
            .replace(/~/g, '\\textasciitilde{}')
            .replace(/\\^/g, '\\textasciicircum{}');
    };

    const paragraphs = coverLetter.split('\\n\\n').map(p => p.trim()).filter(Boolean);
    let coverLetterBlock = `\\begin{flushright}\n  \\today\n\\end{flushright}\n\\vspace{1cm}\n\n`;
    for (const p of paragraphs) {
        coverLetterBlock += `${escapeLatex(p)}\n\n`;
    }
    coverLetterBlock += `\\newpage\n`;

    return resumeLatex.replace('\\begin{document}\n\\pagestyle{empty}\n', `\\begin{document}\n\\pagestyle{empty}\n\n${coverLetterBlock}`);
};
