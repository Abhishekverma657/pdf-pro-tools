import { PDFDocument, degrees, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const getPdfPageCount = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    return pdf.getPageCount();
};

export const mergePdfs = async (files) => {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
        const buffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const savedPdf = await mergedPdf.save();
    return new Blob([savedPdf], { type: 'application/pdf' });
};

export const splitPdf = async (file, pageRanges) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const zip = new JSZip();

    // pageRanges is array of arrays/numbers e.g. [[1,2], 3, [4,5]]
    // For simplicity, we'll assume we split EVERY page if no range provided, 
    // or handle range logic. Here let's implement split all pages for now or range.

    // We'll implement a simple "split by pages" where we create a new PDF for each defined range
    // Range format: { start: 1, end: 2 } (1-based)

    for (let i = 0; i < pageRanges.length; i++) {
        const range = pageRanges[i];
        const newPdf = await PDFDocument.create();

        const start = range.start - 1; // 0-based
        const end = range.end - 1; // 0-based

        const indices = [];
        for (let j = start; j <= end; j++) {
            indices.push(j);
        }

        const copiedPages = await newPdf.copyPages(pdf, indices);
        copiedPages.forEach((page) => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        zip.file(`split_part_${i + 1}.pdf`, pdfBytes);
    }

    return await zip.generateAsync({ type: 'blob' });
};

export const rotatePdf = async (file, rotation) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const pages = pdf.getPages();

    pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
    });

    const savedPdf = await pdf.save();
    return new Blob([savedPdf], { type: 'application/pdf' });
};

export const imagesToPdf = async (files) => {
    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
        const buffer = await file.arrayBuffer();
        let image;

        // Check helper to determine image type
        const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
        const isJpg = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');

        if (isJpg) {
            image = await pdfDoc.embedJpg(buffer);
        } else if (isPng) {
            image = await pdfDoc.embedPng(buffer);
        } else {
            // Fallback: try embedding as PNG if type is messy, or skip
            try {
                image = await pdfDoc.embedPng(buffer);
            } catch (e) {
                try {
                    image = await pdfDoc.embedJpg(buffer);
                } catch (e2) {
                    console.warn(`Could not embed image: ${file.name}`, e2);
                    continue;
                }
            }
        }

        const page = pdfDoc.addPage();
        const { width, height } = image.scale(1);

        // Scale image to fit page while maintaining aspect ratio
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        const scale = Math.min(
            (pageWidth - 40) / width,
            (pageHeight - 40) / height
        );

        const dims = image.scale(scale);

        page.drawImage(image, {
            x: (pageWidth / 2) - (dims.width / 2),
            y: (pageHeight / 2) - (dims.height / 2),
            width: dims.width,
            height: dims.height,
        });
    }

    const savedPdf = await pdfDoc.save();
    return new Blob([savedPdf], { type: 'application/pdf' });
};

export const pdfToImages = async (file) => {
    const buffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(buffer);
    const pdf = await loadingTask.promise;
    const images = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High quality scale
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        const dataUrl = canvas.toDataURL('image/png');
        images.push(dataUrl);
    }

    return images;
};

export const extractTextFromPdf = async (file) => {
    const buffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(buffer);
    const pdf = await loadingTask.promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
    }

    return fullText;
};

export const protectPdf = async (file, password) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const savedPdf = await pdf.save({
        userPassword: password,
        ownerPassword: password, // usually same for simple protection
    });
    return new Blob([savedPdf], { type: 'application/pdf' });
};
