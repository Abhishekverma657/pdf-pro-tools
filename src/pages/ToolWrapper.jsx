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
import SEO from '../components/SEO';
import ToolSEOContent from '../components/ToolSEOContent';
import { TOOLS } from '../data/tools';

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

    // Find tool info for SEO
    const toolInfo = TOOLS.find(t => t.path === `/tools/${toolId}`);

    if (Component) {
        return (
            <>
                {toolInfo && (
                    <SEO
                        title={toolInfo.content?.title || toolInfo.name}
                        description={toolInfo.description}
                        url={`https://pdf-pro-tools.vercel.app/tools/${toolId}`}
                    />
                )}
                <div className="pb-12">
                    <Component />
                    {toolInfo && toolInfo.content && (
                        <ToolSEOContent content={toolInfo.content} />
                    )}
                </div>
            </>
        );
    }

    return <ToolPlaceholder toolId={toolId} />;
}
