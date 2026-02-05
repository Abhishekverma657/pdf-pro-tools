import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Image as ImageIcon, Download, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { imagesToPdf } from '../../utils/pdfUtils';
import { saveAs } from 'file-saver';

export default function ImageToPDF() {
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Clean up object URLs to avoid memory leaks
    useEffect(() => {
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, []); // Run on unmount only actually isn't enough if files change, but good hygiene

    const onDrop = (acceptedFiles) => {
        const newFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setFiles(prev => [...prev, ...newFiles]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png']
        }
    });

    const handleConvert = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        try {
            const pdfBlob = await imagesToPdf(files);
            saveAs(pdfBlob, 'converted_images.pdf');
        } catch (error) {
            console.error(error);
            alert('Error converting images to PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    const removeFile = (index) => {
        URL.revokeObjectURL(files[index].preview);
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="flex items-center gap-4">
                <Link to="/tools" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <span className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg"><ImageIcon size={24} /></span>
                        Image to PDF
                    </h1>
                    <p className="text-text-secondary mt-1">Convert PNG and JPG images to PDF</p>
                </div>
            </div>

            <div className="card min-h-[400px]">
                {files.length === 0 ? (
                    <div className="py-12">
                        <div
                            {...getRootProps()}
                            className="border-3 border-dashed border-gray-200 dark:border-gray-700 rounded-[32px] p-12 text-center cursor-pointer transition-all hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                                    <ImageIcon size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">Drop images here</h3>
                                    <p className="text-text-secondary">or click to browse PNG/JPG</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {files.map((file, index) => (
                                <div key={file.name + index} className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm">
                                    <img
                                        src={file.preview}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                        onLoad={() => {
                                            // Optional: trigger a re-render or status update if helpful
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-110 transition-all"
                                        >
                                            <span className="sr-only">Delete</span>
                                            &times;
                                        </button>
                                        <span className="absolute bottom-2 left-2 text-white text-xs px-2 py-1 bg-black/60 rounded backdrop-blur-sm">
                                            Page {index + 1}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <div {...getRootProps()} className="aspect-[3/4] border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group">
                                <input {...getInputProps()} />
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Plus size={24} className="text-gray-400 group-hover:text-primary" />
                                </div>
                                <span className="text-sm font-medium text-text-secondary group-hover:text-primary">Add More</span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t dark:border-gray-800">
                            <button
                                onClick={handleConvert}
                                disabled={isProcessing}
                                className="btn-primary"
                            >
                                {isProcessing ? 'Converting...' : `Convert ${files.length} Images to PDF`}
                                {!isProcessing && <Download size={20} />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
