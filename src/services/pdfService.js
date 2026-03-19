import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Configurar o worker do PDF.js (usando o loader do Vite para garantir que o worker seja servido corretamente)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractTextFromPdf = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            fullText += pageText + "\n";
        }

        return fullText;
    } catch (error) {
        console.error("Erro ao extrair texto do PDF:", error);
        throw new Error("Não foi possível ler o conteúdo do arquivo PDF.");
    }
};
