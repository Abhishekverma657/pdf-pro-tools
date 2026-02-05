import { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import { ArrowLeft, Lock, Download, FileText, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { protectPdf } from '../../utils/pdfUtils';
import { saveAs } from 'file-saver';

export default function ProtectPDF() {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile);
    };

    const handleProtect = async () => {
        if (!password) return alert('Please enter a password');
        setIsProcessing(true);
        try {
            const pdfBlob = await protectPdf(file, password);
            saveAs(pdfBlob, 'protected_document.pdf');
        } catch (error) {
            console.error(error);
            alert('Error protecting PDF');
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
                        <span className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg"><Lock size={24} /></span>
                        Protect PDF
                    </h1>
                    <p className="text-text-secondary mt-1">Encrypt your PDF with a password</p>
                </div>
            </div>

            <div className="card min-h-[400px]">
                {!file ? (
                    <div className="py-12">
                        <FileUploader onFileSelect={handleFileSelect} label="Upload PDF to Protect" />
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
                            <button onClick={() => setFile(null)} className="text-sm text-red-500 hover:underline">Remove</button>
                        </div>

                        <div className="max-w-md mx-auto space-y-4">
                            <label className="block font-medium">Set Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter strong password"
                                className="input-field"
                            />
                            <p className="text-xs text-text-secondary">Make sure to remember this password. It cannot be recovered.</p>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleProtect}
                                className="btn-primary"
                                disabled={isProcessing || !password}
                            >
                                {isProcessing ? 'Encrypting...' : 'Protect PDF'}
                                <Lock size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
