import { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import { ArrowLeft, Scissors, Download, FileText, Check, Layout, Grid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { splitPdf, getPdfPageCount } from '../../utils/pdfUtils';
import { saveAs } from 'file-saver';

export default function SplitPDF() {
    const [file, setFile] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [splitMode, setSplitMode] = useState('all'); // 'all' or 'range'
    const [rangeStart, setRangeStart] = useState(1);
    const [rangeEnd, setRangeEnd] = useState(1);

    const handleFileSelect = async (selectedFile) => {
        setFile(selectedFile);
        try {
            const count = await getPdfPageCount(selectedFile);
            setPageCount(count);
            setRangeEnd(count);
        } catch (e) {
            console.error(e);
            alert('Could not read PDF page count');
        }
    };

    const handleSplit = async () => {
        setIsProcessing(true);
        try {
            const ranges = [];
            if (splitMode === 'all') {
                // Create range for each page
                for (let i = 1; i <= pageCount; i++) {
                    ranges.push({ start: i, end: i });
                }
            } else {
                ranges.push({ start: rangeStart, end: rangeEnd });
            }

            const zipBlob = await splitPdf(file, ranges);
            saveAs(zipBlob, `split_files_${Date.now()}.zip`);
        } catch (error) {
            console.error(error);
            alert('Error splitting PDF');
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
                        <span className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg"><Scissors size={24} /></span>
                        Split PDF
                    </h1>
                    <p className="text-text-secondary mt-1">Separate PDF pages into individual files</p>
                </div>
            </div>

            <div className="card min-h-[400px]">
                {!file ? (
                    <div className="py-12">
                        <FileUploader onFileSelect={handleFileSelect} label="Upload PDF to Split" />
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
                                    <p className="text-xs text-text-secondary">{pageCount} Pages • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline"
                            >
                                Remove
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setSplitMode('all')}
                                className={`p-6 rounded-xl border-2 text-left transition-all ${splitMode === 'all'
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                    }`}
                            >
                                <div className="mb-4 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <Grid size={20} />
                                </div>
                                <h3 className="font-bold mb-1">Extract All Pages</h3>
                                <p className="text-sm text-text-secondary">Save every page as a separate PDF file</p>
                            </button>

                            <button
                                onClick={() => setSplitMode('range')}
                                className={`p-6 rounded-xl border-2 text-left transition-all ${splitMode === 'range'
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                    }`}
                            >
                                <div className="mb-4 w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <Layout size={20} />
                                </div>
                                <h3 className="font-bold mb-1">Select Range</h3>
                                <p className="text-sm text-text-secondary">Extract specific range of pages</p>
                            </button>
                        </div>

                        {splitMode === 'range' && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl animate-fade-in">
                                <h4 className="font-medium mb-4">Page Range</h4>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-text-secondary mb-1">From</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={pageCount}
                                            value={rangeStart}
                                            onChange={(e) => setRangeStart(parseInt(e.target.value))}
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-text-secondary mb-1">To</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={pageCount}
                                            value={rangeEnd}
                                            onChange={(e) => setRangeEnd(parseInt(e.target.value))}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleSplit}
                                disabled={isProcessing}
                                className="btn-primary"
                            >
                                {isProcessing ? 'Processing...' : splitMode === 'all' ? 'Split All Pages' : 'Split Range'}
                                {!isProcessing && <Scissors size={20} />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
