import { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import { ArrowLeft, Eye, Download, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pdfToImages } from '../../utils/pdfUtils';
import Tesseract from 'tesseract.js';

export default function OCR() {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [extractedText, setExtractedText] = useState('');

    const handleFileSelect = async (selectedFile) => {
        setFile(selectedFile);
        setIsProcessing(true);
        setExtractedText('');
        setProgress(0);

        try {
            // 1. Convert PDF to Images
            const images = await pdfToImages(selectedFile);

            // 2. Run OCR on each image
            let fullText = '';
            for (let i = 0; i < images.length; i++) {
                setProgress(Math.round(((i / images.length) * 100)));
                const { data: { text } } = await Tesseract.recognize(images[i], 'eng');
                fullText += `--- Page ${i + 1} ---\n${text}\n\n`;
            }

            setExtractedText(fullText);
            setProgress(100);
        } catch (error) {
            console.error(error);
            alert('Error performing OCR. Ensure you have a valid PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const blob = new Blob([extractedText], { type: 'text/plain' });
        element.href = URL.createObjectURL(blob);
        element.download = "ocr_result.txt";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="flex items-center gap-4">
                <Link to="/tools" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <span className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg"><Eye size={24} /></span>
                        OCR PDF
                    </h1>
                    <p className="text-text-secondary mt-1">Extract text from scanned documents and images</p>
                </div>
            </div>

            <div className="card min-h-[400px]">
                {!file ? (
                    <div className="py-12">
                        <FileUploader onFileSelect={handleFileSelect} label="Upload Scanned PDF" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="font-medium">{file.name}</div>
                            <button onClick={() => setFile(null)} className="text-red-500 text-sm hover:underline">Remove</button>
                        </div>

                        {isProcessing ? (
                            <div className="py-12 space-y-6 text-center">
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <div>
                                    <h3 className="text-xl font-bold">Analysing Document...</h3>
                                    <p className="text-text-secondary mt-2">This may take a few moments. Processing page...</p>
                                </div>
                                {progress > 0 && (
                                    <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg">Recognized Text</h3>
                                    <button onClick={handleDownload} className="btn-primary py-2 px-4 text-sm h-10">
                                        <Download size={16} /> Save Text
                                    </button>
                                </div>
                                <textarea
                                    value={extractedText}
                                    readOnly
                                    className="w-full h-96 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-mono text-sm resize-none focus:outline-none"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
