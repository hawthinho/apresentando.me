import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const round = (value) => Math.round(value * 100) / 100;

const groupTextItemsIntoLines = (items) => {
    const lines = new Map();

    items.forEach((item) => {
        const y = Math.round(item.y / 4) * 4;
        if (!lines.has(y)) lines.set(y, []);
        lines.get(y).push(item);
    });

    return [...lines.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([, lineItems]) => lineItems
            .sort((a, b) => a.x - b.x)
            .map((item) => item.str)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim())
        .filter(Boolean);
};

const countImages = async (page) => {
    try {
        const operatorList = await page.getOperatorList();
        const imageOps = new Set([
            pdfjsLib.OPS.paintImageXObject,
            pdfjsLib.OPS.paintJpegXObject,
            pdfjsLib.OPS.paintInlineImageXObject,
            pdfjsLib.OPS.paintImageMaskXObject
        ].filter(Boolean));

        return operatorList.fnArray.filter((fn) => imageOps.has(fn)).length;
    } catch {
        return 0;
    }
};

const analyzePageLayout = async (page, pageIndex) => {
    const viewport = page.getViewport({ scale: 1 });
    const textContent = await page.getTextContent();
    const items = textContent.items
        .map((item) => ({
            str: item.str || '',
            x: item.transform?.[4] || 0,
            y: item.transform?.[5] || 0,
            width: item.width || 0,
            height: item.height || 0
        }))
        .filter((item) => item.str.trim());

    const lines = groupTextItemsIntoLines(items);
    const pageWidth = viewport.width || 1;
    const leftItems = items.filter((item) => item.x < pageWidth * 0.42);
    const middleItems = items.filter((item) => item.x >= pageWidth * 0.42 && item.x <= pageWidth * 0.58);
    const rightItems = items.filter((item) => item.x > pageWidth * 0.58);

    const yBuckets = new Map();
    items.forEach((item) => {
        const bucket = Math.round(item.y / 16) * 16;
        const current = yBuckets.get(bucket) || { left: 0, right: 0 };
        if (item.x < pageWidth * 0.45) current.left += 1;
        if (item.x > pageWidth * 0.55) current.right += 1;
        yBuckets.set(bucket, current);
    });

    const overlappingColumnRows = [...yBuckets.values()].filter((bucket) => bucket.left > 0 && bucket.right > 0).length;
    const twoColumnCandidate = overlappingColumnRows >= 6 && leftItems.length > 8 && rightItems.length > 8;
    const possibleSidebar = leftItems.length > rightItems.length * 0.35 && middleItems.length < items.length * 0.25 && rightItems.length > 20;
    const imageCount = await countImages(page);
    const averageLineLength = lines.length
        ? lines.reduce((sum, line) => sum + line.length, 0) / lines.length
        : 0;

    return {
        page: pageIndex,
        width: round(viewport.width),
        height: round(viewport.height),
        textItems: items.length,
        lines: lines.length,
        imageCount,
        twoColumnCandidate,
        possibleSidebar,
        overlappingColumnRows,
        averageLineLength: round(averageLineLength),
        text: lines.join('\n')
    };
};

const detectSections = (text) => {
    const lower = text.toLowerCase();
    return {
        contact: /[\w.+-]+@[\w.-]+\.\w+/.test(text) || /(\+?\d[\d\s().-]{7,})/.test(text),
        summary: /(resumo|objetivo|perfil profissional|summary|profile)/i.test(text),
        experience: /(experiência|experiencia|experience|histórico profissional|historico profissional)/i.test(text),
        education: /(formação|formacao|educação|educacao|education|graduação|graduacao)/i.test(text),
        skills: /(habilidades|competências|competencias|skills|ferramentas|tecnologias)/i.test(text),
        projects: /(projetos|projects|portfólio|portfolio|github\.com|gitlab\.com)/i.test(text),
        bullets: /(^|\n)\s*[-•*]/.test(text) || lower.includes(' implement') || lower.includes(' lider')
    };
};

const summarizeLayout = (pages, text) => {
    const sections = detectSections(text);
    const imageCount = pages.reduce((sum, page) => sum + page.imageCount, 0);
    const likelyTwoColumns = pages.some((page) => page.twoColumnCandidate);
    const possibleSidebar = pages.some((page) => page.possibleSidebar);
    const warnings = [];

    if (likelyTwoColumns) warnings.push('Possível layout em duas colunas detectado pela distribuição horizontal do texto.');
    if (possibleSidebar) warnings.push('Possível sidebar detectada em uma ou mais páginas.');
    if (imageCount > 0) warnings.push(`${imageCount} imagem(ns) detectada(s) no PDF.`);
    if (!sections.contact) warnings.push('Contato não identificado no texto extraído.');
    if (!sections.experience) warnings.push('Seção de experiência não identificada.');
    if (!sections.skills) warnings.push('Seção de habilidades/competências não identificada.');

    return {
        pageCount: pages.length,
        imageCount,
        likelyTwoColumns,
        possibleSidebar,
        sections,
        warnings,
        pages: pages.map((page) => {
            const pageSummary = { ...page };
            delete pageSummary.text;
            return pageSummary;
        })
    };
};

export const extractResumeFromPdf = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const pages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            pages.push(await analyzePageLayout(page, i));
        }

        const text = pages.map((page) => page.text).join('\n\n').trim();
        return {
            text,
            metadata: summarizeLayout(pages, text)
        };
    } catch (error) {
        console.error("Erro ao extrair texto do PDF:", error);
        throw new Error("Não foi possível ler o conteúdo do arquivo PDF.");
    }
};

export const extractTextFromPdf = async (file) => {
    const result = await extractResumeFromPdf(file);
    return result.text;
};
