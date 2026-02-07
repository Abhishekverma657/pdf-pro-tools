import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

        const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
        const isJpg = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');

        if (isJpg) {
            image = await pdfDoc.embedJpg(buffer);
        } else if (isPng) {
            image = await pdfDoc.embedPng(buffer);
        } else {
            try {
                image = await pdfDoc.embedPng(buffer);
            } catch (e) {
                try {
                    image = await pdfDoc.embedJpg(buffer);
                } catch (e2) {
                    continue;
                }
            }
        }

        const page = pdfDoc.addPage();
        const { width, height } = image.scale(1);

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
        const viewport = page.getViewport({ scale: 2.0 });
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
        ownerPassword: password,
    });
    return new Blob([savedPdf], { type: 'application/pdf' });
};

// --- New Advanced Tools ---

export const pdfToWord = async (file) => {
    const buffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(buffer);
    const pdf = await loadingTask.promise;

    const children = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');

        children.push(
            new Paragraph({
                children: [new TextRun(pageText)],
            })
        );
        children.push(new Paragraph("")); // Empty line between pages
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: children,
        }],
    });

    const blob = await Packer.toBlob(doc);
    return blob;
};

export const wordToPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value;

    const doc = new jsPDF();
    // Simple HTML to PDF
    // Note: For complex docs this is basic. Client-side limitation.
    // We create a temporary element to render HTML for jsPDF
    const element = document.createElement('div');
    element.innerHTML = html;
    element.style.width = '190mm'; // A4 width approx
    document.body.appendChild(element);

    await doc.html(element, {
        callback: function (doc) {
            document.body.removeChild(element);
        },
        x: 10,
        y: 10,
        width: 190,
        windowWidth: 800
    });

    return doc.output('blob');
};

export const excelToPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const doc = new jsPDF();

    // jspdf-autotable should be available via the side-effect import at the top
    // Access it through the jsPDF instance
    if (typeof doc.autoTable === 'function') {
        doc.autoTable({
            head: [jsonData[0]],
            body: jsonData.slice(1),
        });
    } else {
        // Fallback: manually draw table if autoTable not available
        let y = 10;
        jsonData.forEach((row, i) => {
            const text = row.join(' | ');
            doc.text(text, 10, y);
            y += 10;
        });
    }

    return doc.output('blob');
};

export const addWatermark = async (file, text) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const pages = pdf.getPages();
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);

    pages.forEach(page => {
        const { width, height } = page.getSize();
        const fontSize = 50;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        page.drawText(text, {
            x: width / 2 - textWidth / 2,
            y: height / 2 - textHeight / 2,
            size: fontSize,
            font: font,
            color: rgb(0.75, 0.75, 0.75),
            rotate: degrees(45),
            opacity: 0.5,
        });
    });

    const savedPdf = await pdf.save();
    return new Blob([savedPdf], { type: 'application/pdf' });
};

export const addPageNumbers = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const pages = pdf.getPages();
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    const totalPages = pages.length;

    pages.forEach((page, index) => {
        const { width } = page.getSize();
        const text = `Page ${index + 1} of ${totalPages}`;
        const fontSize = 12;
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        page.drawText(text, {
            x: width - textWidth - 20,
            y: 20,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
        });
    });

    const savedPdf = await pdf.save();
    return new Blob([savedPdf], { type: 'application/pdf' });
};
