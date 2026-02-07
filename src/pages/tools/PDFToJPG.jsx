import GenericOneClickTool from './GenericOneClickTool';
import { Image } from 'lucide-react';
import { pdfToImages } from '../../utils/pdfUtils';
import JSZip from 'jszip';

const processPdfToJpg = async (file) => {
    const images = await pdfToImages(file);
    const zip = new JSZip();

    images.forEach((imgDataUrl, index) => {
        // Remove data:image/png;base64,
        const data = imgDataUrl.split(',')[1];
        zip.file(`page_${index + 1}.png`, data, { base64: true });
    });

    return await zip.generateAsync({ type: 'blob' });
};

export default function PDFToJPG() {
    return (
        <GenericOneClickTool
            title="PDF to JPG"
            description="Convert PDF pages into high-quality images."
            icon={Image}
            color="from-yellow-500 to-orange-500"
            accept={{ 'application/pdf': ['.pdf'] }}
            processFunction={processPdfToJpg}
            outputFileName="pdf_images.zip"
            inputLabel="Upload PDF"
        />
    );
}
