import { useParams } from 'react-router-dom';
import ExtractText from './tools/ExtractText';
import SplitPDF from './tools/SplitPDF';
import MergePDF from './tools/MergePDF';
import ImageToPDF from './tools/ImageToPDF';
import RotatePDF from './tools/RotatePDF';
import ProtectPDF from './tools/ProtectPDF';
import SignPDF from './tools/SignPDF';
import OCR from './tools/OCR';
import InvoiceScanner from './tools/InvoiceScanner';
import ToolPlaceholder from './ToolPlaceholder';

const TOOL_COMPONENTS = {
    'extract-text': ExtractText,
    'split-pdf': SplitPDF,
    'merge-pdf': MergePDF,
    'image-to-pdf': ImageToPDF,
    'rotate-pdf': RotatePDF,
    'protect-pdf': ProtectPDF,
    'sign-pdf': SignPDF,
    'ocr': OCR,
    'scan-invoice': InvoiceScanner,
};

export default function ToolWrapper() {
    const { toolId } = useParams();
    const Component = TOOL_COMPONENTS[toolId];

    if (Component) {
        return <Component />;
    }

    return <ToolPlaceholder toolId={toolId} />;
}
