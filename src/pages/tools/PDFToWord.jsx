import GenericOneClickTool from './GenericOneClickTool';
import { FileType } from 'lucide-react';
import { pdfToWord } from '../../utils/pdfUtils';

export default function PDFToWord() {
    return (
        <GenericOneClickTool
            title="PDF to Word"
            description="Convert PDF documents to editable Word (.docx) files."
            icon={FileType}
            color="from-blue-600 to-blue-800"
            accept={{ 'application/pdf': ['.pdf'] }}
            processFunction={pdfToWord}
            outputFileName="converted_document.docx"
            inputLabel="Upload PDF"
        />
    );
}
