import { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import { ArrowLeft, Download, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';

export default function GenericOneClickTool({
    title,
    description,
    icon: Icon,
    color,
    accept,
    processFunction,
    outputFileName,
    inputLabel = "Upload File"
}) {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile);
        setIsDone(false);
    };

    const handleProcess = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const resultBlob = await processFunction(file);
            saveAs(resultBlob, outputFileName || `processed_${file.name}`);
            setIsDone(true);
        } catch (error) {
            console.error(error);
            alert('An error occurred while processing the file.');
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
                        <span className={`p-2 bg-gradient-to-br ${color} text-white rounded-lg bg-opacity-80`}>
                            <Icon size={24} />
                        </span>
                        {title}
                    </h1>
                    <p className="text-text-secondary mt-1">{description}</p>
                </div>
            </div>

            <div className="card min-h-[400px] flex flex-col items-center justify-center py-12">
                {!file ? (
                    <FileUploader
                        onFileSelect={handleFileSelect}
                        label={inputLabel}
                        accept={accept}
                    />
                ) : (
                    <div className="text-center space-y-6 max-w-md w-full">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon size={40} />
                        </div>

                        <h3 className="text-xl font-bold truncate px-4">{file.name}</h3>

                        {!isDone ? (
                            <button
                                onClick={handleProcess}
                                disabled={isProcessing}
                                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        Start Conversion
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center justify-center gap-2">
                                    <CheckCircle size={20} />
                                    Success! Your file has been downloaded.
                                </div>
                                <button
                                    onClick={() => { setFile(null); setIsDone(false); }}
                                    className="text-primary hover:underline"
                                >
                                    Convert another file
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
