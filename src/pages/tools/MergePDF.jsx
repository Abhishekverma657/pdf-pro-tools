import { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import { ArrowLeft, Combine, Download, FileText, Check, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mergePdfs } from '../../utils/pdfUtils';
import { saveAs } from 'file-saver';
import { useDropzone } from 'react-dropzone';

export default function MergePDF() {
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const onDrop = (acceptedFiles) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
        setIsSuccess(false); // Reset success on new file add
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] }
    });

    const handleMerge = async () => {
        if (files.length < 2) return;
        setIsProcessing(true);
        try {
            const mergedBlob = await mergePdfs(files);
            saveAs(mergedBlob, 'merged_document.pdf');
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            alert('Error merging PDFs');
        } finally {
            setIsProcessing(false);
        }
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
        setIsSuccess(false);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="flex items-center gap-4">
                <Link to="/tools" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg"><Combine size={24} /></span>
                        Merge PDF
                    </h1>
                    <p className="text-text-secondary mt-1">Combine multiple PDF documents into one</p>
                </div>
            </div>

            <div className="card min-h-[400px] flex flex-col">
                {files.length === 0 ? (
                    <div className="py-12">
                        <FileUploader onFileSelect={(f) => setFiles([f])} label="Drop first PDF here" />
                    </div>
                ) : (
                    <div className="space-y-6 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3 truncate">
                                        <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                            <span className="font-bold text-xs">{index + 1}</span>
                                        </span>
                                        <span className="truncate font-medium text-sm">{file.name}</span>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="ml-2 text-text-secondary hover:text-red-500"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}

                            <div {...getRootProps()} className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                                <input {...getInputProps()} />
                                <div className="flex items-center gap-2 text-primary font-medium">
                                    <Plus size={20} />
                                    <span>Add another PDF</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end pt-6 border-t dark:border-gray-800">
                            {isProcessing ? (
                                <button disabled className="btn-primary opacity-70 cursor-wait">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    Merging...
                                </button>
                            ) : (
                                <button
                                    onClick={handleMerge}
                                    disabled={files.length < 2}
                                    className={`btn-primary ${files.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Combine size={20} />
                                    Merge {files.length} Files
                                </button>
                            )}
                        </div>

                        {isSuccess && (
                            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl flex items-center gap-2 animate-fade-in">
                                <Check size={20} />
                                <span>PDFs merged successfully! Download started.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
