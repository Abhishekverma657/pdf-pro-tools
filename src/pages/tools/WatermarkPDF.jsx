import { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import { ArrowLeft, Stamp, Download, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { addWatermark } from '../../utils/pdfUtils';
import { saveAs } from 'file-saver';

export default function WatermarkPDF() {
    const [file, setFile] = useState(null);
    const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleProcess = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const resultBlob = await addWatermark(file, watermarkText);
            saveAs(resultBlob, `watermarked_${file.name}`);
        } catch (error) {
            console.error(error);
            alert('Error applying watermark');
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
                        <span className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                            <Stamp size={24} />
                        </span>
                        Watermark PDF
                    </h1>
                    <p className="text-text-secondary mt-1">Stamp text over your PDF pages</p>
                </div>
            </div>

            <div className="card min-h-[400px] flex flex-col items-center justify-center py-12">
                {!file ? (
                    <FileUploader
                        onFileSelect={setFile}
                        label="Upload PDF to Watermark"
                        accept={{ 'application/pdf': ['.pdf'] }}
                    />
                ) : (
                    <div className="text-center space-y-6 max-w-md w-full">
                        <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Stamp size={40} />
                        </div>

                        <h3 className="text-xl font-bold truncate px-4">{file.name}</h3>

                        <div className="text-left space-y-2">
                            <label className="text-sm font-medium">Watermark Text</label>
                            <input
                                type="text"
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                className="input-field"
                                placeholder="Enter watermark text"
                            />
                        </div>

                        <button
                            onClick={handleProcess}
                            disabled={isProcessing}
                            className="btn-primary w-full py-3"
                        >
                            {isProcessing ? 'Processing...' : 'Apply & Download'}
                        </button>

                        <button
                            onClick={() => setFile(null)}
                            className="text-text-secondary hover:text-primary text-sm"
                        >
                            Change File
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
