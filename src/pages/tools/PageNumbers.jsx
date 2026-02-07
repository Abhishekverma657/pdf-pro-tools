import GenericOneClickTool from './GenericOneClickTool';
import { Hash } from 'lucide-react';
import { addPageNumbers } from '../../utils/pdfUtils';

export default function PageNumbers() {
    return (
        <GenericOneClickTool
            title="Add Page Numbers"
            description="Add page numbers to your PDF document automatically."
            icon={Hash}
            color="from-gray-600 to-gray-800"
            accept={{ 'application/pdf': ['.pdf'] }}
            processFunction={addPageNumbers}
            outputFileName="numbered_document.pdf"
            inputLabel="Upload PDF"
        />
    );
}
