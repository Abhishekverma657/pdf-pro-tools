import { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import { ArrowLeft, ScanLine, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pdfToImages } from '../../utils/pdfUtils';
import Tesseract from 'tesseract.js';

export default function InvoiceScanner() {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);

    const handleFileSelect = async (selectedFile) => {
        setFile(selectedFile);
        setIsProcessing(true);
        setInvoiceData(null);

        try {
            // 1. Convert PDF to Images
            const images = await pdfToImages(selectedFile);

            // 2. Run OCR on first page only (usually invoice info is on page 1)
            const { data: { text } } = await Tesseract.recognize(images[0], 'eng');

            // 3. Simple Regex Parsing (Demo)
            // Attempt to find dates, amounts, and common invoice patterns
            const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/);
            const amountMatch = text.match(/[$€£₹]\s?(\d+([.,]\d{2})?)/) || text.match(/Total:?\s?(\d+([.,]\d{2})?)/i);
            const invoiceNumMatch = text.match(/Invoice\s*(No|#)?[:.]?\s*([A-Za-z0-9-]+)/i);

            setInvoiceData({
                rawText: text,
                date: dateMatch ? dateMatch[0] : 'Not found',
                total: amountMatch ? amountMatch[0] : 'Not found',
                invoiceNumber: invoiceNumMatch ? invoiceNumMatch[2] : 'Not found'
            });
        } catch (error) {
            console.error(error);
            alert('Error extracted invoice data. Ensure it is a clear PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="flex items-center gap-4">
                <Link to="/tools" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <span className="p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 rounded-lg"><ScanLine size={24} /></span>
                        Invoice Scanner
                    </h1>
                    <p className="text-text-secondary mt-1">Smartly extract data from invoices</p>
                </div>
            </div>

            <div className="card min-h-[400px]">
                {!file ? (
                    <div className="py-12">
                        <FileUploader onFileSelect={handleFileSelect} label="Upload Invoice PDF" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="font-medium">{file.name}</div>
                            <button onClick={() => setFile(null)} className="text-red-500 text-sm hover:underline">Remove</button>
                        </div>

                        {isProcessing ? (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-lg font-medium">Scanning Invoice...</p>
                            </div>
                        ) : invoiceData && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="font-bold text-xl">Extracted Data</h3>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider">Total Amount</label>
                                            <div className="text-2xl font-bold text-green-600 mt-1">{invoiceData.total}</div>
                                        </div>

                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider">Invoice Date</label>
                                            <div className="text-lg font-medium mt-1">{invoiceData.date}</div>
                                        </div>

                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <label className="text-xs text-text-secondary uppercase font-bold tracking-wider">Invoice Number</label>
                                            <div className="text-lg font-medium mt-1">{invoiceData.invoiceNumber}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-xl mb-4">Raw Text</h3>
                                    <div className="h-64 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900 rounded-xl text-xs font-mono leading-relaxed whitespace-pre-wrap">
                                        {invoiceData.rawText}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
