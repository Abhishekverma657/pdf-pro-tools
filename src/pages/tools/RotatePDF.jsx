import { useState, useEffect } from 'react';
import FileUploader from '../../components/FileUploader';
import { ArrowLeft, RotateCw, Download, FileText, Check, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { rotatePdf, pdfToImages } from '../../utils/pdfUtils';
import { saveAs } from 'file-saver';

export default function RotatePDF() {
    const [file, setFile] = useState(null);
    const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const handleFileSelect = async (selectedFile) => {
        setFile(selectedFile);
        setRotation(0);
        setIsProcessing(true);
        try {
            // Get preview of first page
            const images = await pdfToImages(selectedFile);
            if (images && images.length > 0) {
                setPreviewImage(images[0]);
            }
        } catch (e) {
            console.error("Preview error", e);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRotate = async () => {
        setIsProcessing(true);
        try {
            const pdfBlob = await rotatePdf(file, rotation);
            saveAs(pdfBlob, 'rotated_document.pdf');
        } catch (error) {
            console.error(error);
            alert('Error rotating PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    const rotateLeft = () => setRotation((prev) => (prev - 90));
    const rotateRight = () => setRotation((prev) => (prev + 90));

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="flex items-center gap-4">
                <Link to="/tools" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <span className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-lg"><RotateCw size={24} /></span>
                        Rotate PDF
                    </h1>
                    <p className="text-text-secondary mt-1">Rotate PDF pages permanently</p>
                </div>
            </div>

            <div className="card min-h-[400px]">
                {!file ? (
                    <div className="py-12">
                        <FileUploader onFileSelect={handleFileSelect} label="Upload PDF to Rotate" />
                    </div>
                ) : (
                    <div className="space-y-8">
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
                            <button onClick={() => { setFile(null); setPreviewImage(null); }} className="text-sm text-red-500 hover:underline">Remove</button>
                        </div>

                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="relative shadow-2xl transition-transform duration-500 ease-in-out">
                                {isProcessing && !previewImage ? (
                                    <div className="w-48 h-64 bg-gray-100 flex items-center justify-center">
                                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
                                    </div>
                                ) : (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="max-w-[300px] h-auto rounded border border-gray-200"
                                        style={{ transform: `rotate(${rotation}deg)` }}
                                    />
                                )}
                            </div>

                            <div className="flex gap-4 mt-12">
                                <button onClick={rotateLeft} className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm" title="Rotate Left">
                                    <RotateCcw size={24} />
                                </button>
                                <button onClick={rotateRight} className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm" title="Rotate Right">
                                    <RotateCw size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleRotate}
                                className="btn-primary"
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Apply Rotation'}
                                <Download size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
