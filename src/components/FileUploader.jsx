import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useCallback } from 'react';

export default function FileUploader({ onFileSelect, accept = { 'application/pdf': ['.pdf'] }, label = "Drop PDF file here" }) {
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple: false
    });

    return (
        <div
            {...getRootProps()}
            className={`
        relative overflow-hidden group
        border-3 border-dashed rounded-[32px] p-12 text-center cursor-pointer transition-all duration-300
        ${isDragActive
                    ? 'border-primary bg-primary/5 scale-[0.99]'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
                }
      `}
        >
            <input {...getInputProps()} />
            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className={`
          w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl
          ${isDragActive ? 'bg-primary text-white rotate-12' : 'bg-white dark:bg-surface-dark text-primary group-hover:scale-110'}
        `}>
                    <Upload size={32} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{isDragActive ? 'Drop it!' : label}</h3>
                    <p className="text-text-secondary">or click to browse files</p>
                </div>
            </div>

            {/* Decorative background blobs */}
            <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}
