import GenericOneClickTool from './GenericOneClickTool';
import { FileText } from 'lucide-react';
import { wordToPdf } from '../../utils/pdfUtils';

export default function WordToPDF() {
    return (
        <GenericOneClickTool
            title="Word to PDF"
            description="Convert Word documents (.docx) to PDF format."
            icon={FileText}
            color="from-blue-500 to-indigo-500"
            accept={{ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }}
            processFunction={wordToPdf}
            outputFileName="converted_from_word.pdf"
            inputLabel="Upload Word Doc"
        />
    );
}
