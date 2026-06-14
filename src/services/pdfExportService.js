import { jsPDF } from 'jspdf';
import { getContactItemLink, splitContactItems } from './contactLinkService.js';

/**
 * Professional Resume PDF Export Service
 * Creates beautifully formatted PDF resumes with proper typography and structure
 */

// ATS classic palette: keep the exported resume plain, high-contrast and parser-friendly.
const colors = {
    textPrimary: '#111111',
    textSecondary: '#333333',
    border: '#555555'
};

// Resume section patterns to detect
const sectionPatterns = [
    { regex: /^(resumo|resumo profissional|sobre mim|objetivo|perfil|summary|profile|about)/i, type: 'summary' },
    { regex: /^(experiência|experiência profissional|experiências|experience|work experience|employment)/i, type: 'experience' },
    { regex: /^(formação|formação acadêmica|educação|education|academic)/i, type: 'education' },
    { regex: /^(habilidades|competências|skills|competencies|technical skills)/i, type: 'skills' },
    { regex: /^(certificações|certificados|certifications|licenses)/i, type: 'certifications' },
    { regex: /^(projetos|projects|portfolio)/i, type: 'projects' },
    { regex: /^(idiomas|languages)/i, type: 'languages' },
    { regex: /^(contato|contact|informações de contato)/i, type: 'contact' },
];

/**
 * Parse resume content into structured sections
 */
const parseResumeContent = (content) => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const sections = [];
    let currentSection = { type: 'header', title: '', items: [] };
    let candidateName = '';
    let contactInfo = [];

    // First pass: identify candidate name (usually first non-empty line)
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !sectionPatterns.some(p => p.regex.test(trimmed))) {
            // Check if it looks like a name (no special chars, not too long)
            if (trimmed.length < 50 && !trimmed.includes(':') && !trimmed.startsWith('-') && !trimmed.startsWith('•')) {
                candidateName = trimmed;
                break;
            }
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip empty lines
        if (!trimmed) continue;

        // Check if this is a section header
        const sectionMatch = sectionPatterns.find(p => p.regex.test(trimmed));

        if (sectionMatch) {
            // Save previous section if it has content
            if (currentSection.items.length > 0 || currentSection.title) {
                sections.push(currentSection);
            }
            currentSection = {
                type: sectionMatch.type,
                title: trimmed.replace(/[:：]/g, '').trim(),
                items: []
            };
        } else if (trimmed === candidateName && sections.length === 0) {
            // This is the name, skip it for now (we'll handle it separately)
            continue;
        } else if (sections.length === 0 && currentSection.type === 'header') {
            // This is contact/header info (before first section)
            if (trimmed.includes('@') || trimmed.includes('linkedin') ||
                trimmed.includes('github') || trimmed.match(/[\d\-+()]{8,}/)) {
                contactInfo.push(trimmed);
            } else if (trimmed !== candidateName) {
                contactInfo.push(trimmed);
            }
        } else {
            // Regular content line
            currentSection.items.push(trimmed);
        }
    }

    // Don't forget the last section
    if (currentSection.items.length > 0 || currentSection.title) {
        sections.push(currentSection);
    }

    return { candidateName, contactInfo, sections };
};

/**
 * Check if line is a bullet point
 */
const isBulletPoint = (text) => {
    return text.startsWith('-') || text.startsWith('•') || text.startsWith('*') ||
        text.match(/^\d+[.)]\s/) || text.startsWith('→') || text.startsWith('▪');
};

/**
 * Remove markdown formatting (bold markers) from text
 */
const cleanMarkdown = (text) => {
    return text.replace(/\*\*/g, ''); // Remove ** markers for bold
};

/**
 * Clean bullet point text
 */
const cleanBulletText = (text) => {
    return cleanMarkdown(text.replace(/^[-•*→▪]\s*/, '').replace(/^\d+[.)]\s*/, '').trim());
};

/**
 * Check if line looks like a job/education title (company, date, etc.)
 */
const isSubheading = (text) => {
    // Contains date patterns or | separator
    return text.includes('|') ||
        text.match(/\d{4}/) ||
        text.match(/\d{2}\/\d{4}/) ||
        text.includes(' - ') && text.match(/\d{2,4}/);
};

const drawLinkedText = (doc, text, x, y, link = '') => {
    doc.text(text, x, y);
    if (!link) return;

    const width = doc.getTextWidth(text);
    doc.link(x, y - 3, width, 4, { url: link });
};

const drawContactInfo = (doc, contactInfo, contactOptions, marginLeft, contentWidth, yPosition) => {
    const items = splitContactItems(contactInfo);
    const separator = ' | ';
    const lineHeight = 4;
    const maxX = marginLeft + contentWidth;
    let currentX = marginLeft;
    let currentY = yPosition;

    items.forEach((item, index) => {
        const link = getContactItemLink(item, contactOptions);
        const separatorWidth = currentX === marginLeft ? 0 : doc.getTextWidth(separator);
        const itemWidth = doc.getTextWidth(item);

        if (currentX !== marginLeft && currentX + separatorWidth + itemWidth > maxX) {
            currentX = marginLeft;
            currentY += lineHeight;
        }

        if (currentX !== marginLeft) {
            doc.text(separator, currentX, currentY);
            currentX += separatorWidth;
        }

        drawLinkedText(doc, item, currentX, currentY, link);
        currentX += itemWidth;

        if (index === items.length - 1) {
            currentY += lineHeight;
        }
    });

    return currentY;
};

/**
 * Generate professional PDF from resume content
 */
export const generateResumePDF = (content, filename = 'curriculo_otimizado.pdf', coverLetterContent = null, options = {}) => {
    const parsed = parseResumeContent(content);
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const marginLeft = 14;
    const marginRight = 14;
    const marginTop = 14;
    const marginBottom = 14;
    const contentWidth = pageWidth - marginLeft - marginRight;

    let yPosition = marginTop;

    /**
     * Check and add new page if needed
     */
    const checkPageBreak = (neededSpace = 15) => {
        if (yPosition + neededSpace > pageHeight - marginBottom) {
            doc.addPage();
            yPosition = marginTop;
            return true;
        }
        return false;
    };

    // ========== COVER LETTER ==========
    if (coverLetterContent) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.textPrimary);
        
        const paragraphs = coverLetterContent.split('\n\n').map(p => p.trim()).filter(Boolean);
        for (const p of paragraphs) {
            const textLines = doc.splitTextToSize(cleanMarkdown(p), contentWidth);
            const lineHeight = 6;
            for (const line of textLines) {
                checkPageBreak(lineHeight + 2);
                doc.text(line, marginLeft, yPosition);
                yPosition += lineHeight;
            }
            yPosition += 6;
        }
        
        doc.addPage();
        yPosition = marginTop;
    }

    // ========== HEADER: Name ==========
    if (parsed.candidateName) {
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.textPrimary);
        doc.text(parsed.candidateName, marginLeft, yPosition);
        yPosition += 6;
    }

    // ========== HEADER: Contact Info ==========
    if (parsed.contactInfo.length > 0) {
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.textPrimary);

        yPosition = drawContactInfo(doc, parsed.contactInfo, options.contact || {}, marginLeft, contentWidth, yPosition);
        yPosition += 2;
    }

    // ========== SECTIONS ==========
    for (const section of parsed.sections) {
        if (section.type === 'header') continue;

        checkPageBreak(16);

        // Section Title
        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.textPrimary);
        doc.text(section.title.toUpperCase(), marginLeft, yPosition);
        yPosition += 2.5;

        doc.setDrawColor(colors.border);
        doc.setLineWidth(0.2);
        doc.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
        yPosition += 5;

        // Section Content
        let previousWasSubheading = false;

        for (let i = 0; i < section.items.length; i++) {
            const item = section.items[i];

            checkPageBreak(12);

            // Special handling for skills/competencies section
            if (section.type === 'skills') {
                // Check if line starts with skill category label (Hard Skills, Soft Skills, etc.)
                // Matches patterns like: "Hard Skills:", "[Hard Skills]:", "HARD SKILLS Figma...", "Hard Skills Figma..."
                const skillLabelMatch = item.match(/^\[?(hard skills|soft skills|technical skills|ferramentas|tecnologias|idiomas)\]?[:\s]*/i);

                if (skillLabelMatch) {
                    // Extract label and skills list
                    const rawLabel = skillLabelMatch[1]; // Get the captured group (the label text)
                    const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1).toLowerCase(); // Normalize to "Hard Skills"
                    const skillsList = item.substring(skillLabelMatch[0].length).trim();

                    checkPageBreak(8);

                    // Draw label in bold
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(colors.textPrimary);
                    const labelWidth = doc.getTextWidth(label + ': ');
                    doc.text(label + ':', marginLeft, yPosition);

                    // Draw skills list in normal weight
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(colors.textPrimary);

                    const skillsLines = doc.splitTextToSize(cleanMarkdown(skillsList), contentWidth - labelWidth);
                    if (skillsLines.length > 0 && skillsLines[0]) {
                        doc.text(skillsLines[0], marginLeft + labelWidth, yPosition);
                    }
                    yPosition += 5;

                    // Handle wrapped lines
                    for (let j = 1; j < skillsLines.length; j++) {
                        checkPageBreak(5);
                        doc.text(skillsLines[j], marginLeft, yPosition);
                        yPosition += 5;
                    }
                    yPosition += 2;
                } else {
                    // Regular skill item (comma-separated list without label)
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(colors.textPrimary);

                    const textLines = doc.splitTextToSize(cleanMarkdown(item), contentWidth);
                    for (const line of textLines) {
                        checkPageBreak(5);
                        doc.text(line, marginLeft, yPosition);
                        yPosition += 5;
                    }
                    yPosition += 2;
                }
                previousWasSubheading = false;
                continue;
            }

            if (isBulletPoint(item)) {
                // Bullet point item
                const bulletText = cleanBulletText(item);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(colors.textPrimary);

                // Draw bullet
                doc.setFillColor(colors.textPrimary);
                doc.circle(marginLeft + 2, yPosition - 1.5, 0.8, 'F');

                // Draw text with wrap
                const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 10);
                const lineHeight = 4.5;

                for (let j = 0; j < bulletLines.length; j++) {
                    checkPageBreak(lineHeight);
                    doc.text(bulletLines[j], marginLeft + 6, yPosition);
                    yPosition += lineHeight;
                }
                yPosition += 1;
                previousWasSubheading = false;

            } else if (isSubheading(item) || (section.type === 'experience' && !previousWasSubheading && i > 0)) {
                // Job title / Company / Date line
                yPosition += 2;
                checkPageBreak(10);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(colors.textPrimary);

                const subLines = doc.splitTextToSize(cleanMarkdown(item), contentWidth);
                for (const line of subLines) {
                    doc.text(line, marginLeft, yPosition);
                    yPosition += 4.5;
                }
                yPosition += 1;
                previousWasSubheading = true;

            } else {
                // Regular paragraph text
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(colors.textPrimary);

                const textLines = doc.splitTextToSize(cleanMarkdown(item), contentWidth);
                const lineHeight = 4.5;

                for (const line of textLines) {
                    checkPageBreak(lineHeight);
                    doc.text(line, marginLeft, yPosition);
                    yPosition += lineHeight;
                }
                yPosition += 2;
                previousWasSubheading = false;
            }
        }

        // Space after section
        yPosition += 4;
    }

    // Save the PDF
    doc.save(filename);

    return doc;
};

/**
 * Generate PDF for Cover Letter
 */
export const generateCoverLetterPDF = (content, filename = 'carta_de_apresentacao.pdf') => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const marginLeft = 25;
    const marginRight = 25;
    const marginTop = 30;
    const contentWidth = pageWidth - marginLeft - marginRight;

    let yPosition = marginTop;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.textPrimary);

    // Split content into paragraphs
    const paragraphs = content.split('\\n\\n').map(p => p.trim()).filter(Boolean);

    for (const p of paragraphs) {
        const textLines = doc.splitTextToSize(cleanMarkdown(p), contentWidth);
        const lineHeight = 6;

        for (const line of textLines) {
            if (yPosition + lineHeight > pageHeight - 20) {
                doc.addPage();
                yPosition = marginTop;
            }
            doc.text(line, marginLeft, yPosition);
            yPosition += lineHeight;
        }
        yPosition += 6; // Spacing between paragraphs
    }

    doc.save(filename);
    return doc;
};

export default { generateResumePDF, generateCoverLetterPDF };
