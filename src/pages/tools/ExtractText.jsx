import { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import { ArrowLeft, FileText, Download, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { extractTextFromPdf } from '../../utils/pdfUtils';

export default function ExtractText() {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelect = async (selectedFile) => {
        setFile(selectedFile);
        setIsProcessing(true);
        setError('');

        try {
            const text = await extractTextFromPdf(selectedFile);
            setExtractedText(text);
        } catch (err) {
            console.error(err);
            setError('Failed to extract text. The PDF might be password protected or checked.');
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(extractedText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([extractedText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "extracted_text.txt";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/tools" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <span className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg"><FileText size={24} /></span>
                        Extract Text
                    </h1>
                    <p className="text-text-secondary mt-1">Convert PDF content to editable text</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="card min-h-[400px]">
                {!file ? (
                    <div className="py-12">
                        <FileUploader onFileSelect={handleFileSelect} label="Upload PDF to Extract Text" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* File Info Bar */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-xs text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setFile(null); setExtractedText(''); }}
                                className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline"
                            >
                                Remove
                            </button>
                        </div>

                        {isProcessing ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="font-medium text-lg">Extracting text...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12 text-red-500">
                                <p>{error}</p>
                                <button onClick={() => setFile(null)} className="mt-4 btn-primary bg-red-500 hover:bg-red-600">Try Another File</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg">Extracted Content</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={copyToClipboard}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {copySuccess ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            {copySuccess ? 'Copied' : 'Copy'}
                                        </button>
                                        <button
                                            onClick={handleDownload}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                        >
                                            <Download size={16} />
                                            Save as .txt
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 min-h-[300px] whitespace-pre-wrap font-mono text-sm leading-relaxed overflow-y-auto max-h-[600px]">
                                    {extractedText}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
