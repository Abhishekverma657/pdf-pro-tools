import { useState, useRef } from 'react';
import FileUploader from '../../components/FileUploader';
import {
    ArrowLeft, Type, Download, Trash2, Check, Move,
    PenTool, Image as ImageIcon, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { pdfToImages } from '../../utils/pdfUtils';
import SignaturePad from '../../components/SignaturePad';
import DraggableSignature from '../../components/DraggableSignature';

const FONTS = [
    { name: 'Great Vibes', family: "'Great Vibes', cursive" },
    { name: 'Sacramento', family: "'Sacramento', cursive" },
    { name: 'Dancing Script', family: "'Dancing Script', cursive" },
    { name: 'Satisfy', family: "'Satisfy', cursive" },
    { name: 'Homemade Apple', family: "'Homemade Apple', cursive" },
];

export default function SignPDF() {
    const [file, setFile] = useState(null);
    const [pages, setPages] = useState([]);
    const [currPageIndex, setCurrPageIndex] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    // Signature State
    const [activeTab, setActiveTab] = useState('draw'); // draw, type, upload
    const [typedText, setTypedText] = useState('');
    const [selectedFont, setSelectedFont] = useState(FONTS[0]);

    // Placement State
    const [placedSignatures, setPlacedSignatures] = useState([]); // { id, x, y, pageIndex, image }

    const sigPadRef = useRef(null);
    const pdfContainerRef = useRef(null);

    const handleFileSelect = async (selectedFile) => {
        setFile(selectedFile);
        setIsProcessing(true);
        try {
            const imgs = await pdfToImages(selectedFile);
            setPages(imgs);
            setPlacedSignatures([]);
        } catch (e) {
            console.error(e);
            alert('Error extracting pages. Please try a different PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDrawSave = () => {
        if (sigPadRef.current?.isEmpty()) return;
        const dataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
        addSignatureToPage(dataUrl);
        sigPadRef.current.clear();
    };

    const handleTypeSave = () => {
        if (!typedText) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 150;

        // Transparent bg
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = `80px ${selectedFont.family}`;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedText, canvas.width / 2, canvas.height / 2);

        addSignatureToPage(canvas.toDataURL('image/png'));
        setTypedText('');
    };

    const handleUploadSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                // Create an image object to load the file
                const img = new Image();
                img.onload = () => {
                    // Create a canvas to convert the image to PNG
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    // Convert to consistent PNG format
                    const pngDataUrl = canvas.toDataURL('image/png');
                    addSignatureToPage(pngDataUrl);
                };
                // Handle image load errors
                img.onerror = () => {
                    alert('Could not load image. Please try a different file.');
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const addSignatureToPage = (imgUrl) => {
        setPlacedSignatures([
            ...placedSignatures,
            {
                id: Date.now(),
                x: 50,
                y: 50,
                pageIndex: currPageIndex,
                image: imgUrl
            }
        ]);
    };

    const updateSignaturePosition = (id, data) => {
        setPlacedSignatures(prev => prev.map(sig =>
            sig.id === id ? { ...sig, x: data.x, y: data.y } : sig
        ));
    };

    const removeSignature = (id) => {
        setPlacedSignatures(prev => prev.filter(s => s.id !== id));
    };

    const handleSavePDF = async () => {
        if (placedSignatures.length === 0) {
            alert("Please place at least one signature.");
            return;
        }

        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pdfPages = pdfDoc.getPages();

            const containerWidth = pdfContainerRef.current ? pdfContainerRef.current.offsetWidth : 1;

            for (const sig of placedSignatures) {
                const page = pdfPages[sig.pageIndex];
                const { width: pageWidth, height: pageHeight } = page.getSize();

                // Scale calculation
                // 200px is the visual width of the signature in the DOM
                const pdfSigWidth = (200 / containerWidth) * pageWidth;

                // Handle both PNG and JPG embedding
                // Default to PNG, but if it's explicitly a JPG data URL or fails, try JPG.
                let pdfImage;
                try {
                    // Check standard data URL header
                    if (sig.image.startsWith('data:image/jpeg') || sig.image.startsWith('data:image/jpg')) {
                        pdfImage = await pdfDoc.embedJpg(sig.image);
                    } else if (sig.image.startsWith('data:image/png')) {
                        pdfImage = await pdfDoc.embedPng(sig.image);
                    } else {
                        // Fallback logic
                        try {
                            pdfImage = await pdfDoc.embedPng(sig.image);
                        } catch (pngError) {
                            pdfImage = await pdfDoc.embedJpg(sig.image);
                        }
                    }
                } catch (e) {
                    console.error("Image embedding failed, trying fallback:", e);
                    // Last ditch effort
                    try {
                        pdfImage = await pdfDoc.embedJpg(sig.image);
                    } catch (e2) {
                        console.error("Last ditch failed:", e2);
                        continue; // Skip this signature if we can't embed it
                    }
                }

                if (!pdfImage) continue;

                const pdfSigHeight = pdfImage.height * (pdfSigWidth / pdfImage.width);

                // Coordinate mapping
                // PDF coordinates start from Bottom-Left. DOM starts from Top-Left.
                // We get x, y from Draggable (Top-Left relative to container)

                const displayedImage = document.getElementById(`page-preview-${sig.pageIndex}`);
                const containerHeight = displayedImage ? displayedImage.offsetHeight : 1;

                const pdfX = (sig.x / containerWidth) * pageWidth;
                const pdfY = pageHeight - ((sig.y / containerHeight) * pageHeight) - pdfSigHeight;

                page.drawImage(pdfImage, {
                    x: pdfX,
                    y: pdfY,
                    width: pdfSigWidth,
                    height: pdfSigHeight,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, 'signed_document.pdf');

        } catch (e) {
            console.error(e);
            alert('Error saving PDF: ' + e.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/tools" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <span className="p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-lg"><Type size={24} /></span>
                        Sign PDF
                    </h1>
                    <p className="text-text-secondary mt-1">Place your signature anywhere on the document</p>
                </div>
            </div>

            {!file ? (
                <div className="card py-20">
                    <FileUploader onFileSelect={handleFileSelect} label="Upload PDF to Sign" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card">
                            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
                                {['draw', 'type', 'upload'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-text-secondary hover:text-text-light'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Drawing Tab */}
                            {activeTab === 'draw' && (
                                <div className="space-y-4">
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-white/5 overflow-hidden">
                                        <SignaturePad
                                            ref={sigPadRef}
                                            className="w-full h-40 cursor-crosshair touch-none"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => sigPadRef.current.clear()} className="flex-1 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">Clear</button>
                                        <button onClick={handleDrawSave} className="flex-1 btn-primary py-2 text-sm">Add Signature</button>
                                    </div>
                                </div>
                            )}

                            {/* Typing Tab */}
                            {activeTab === 'type' && (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={typedText}
                                        onChange={(e) => setTypedText(e.target.value)}
                                        placeholder="Type your name"
                                        className="input-field"
                                    />
                                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                        {FONTS.map(font => (
                                            <button
                                                key={font.name}
                                                onClick={() => setSelectedFont(font)}
                                                className={`p-2 border rounded-lg text-lg truncate ${selectedFont.name === font.name ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 dark:border-gray-700'
                                                    }`}
                                                style={{ fontFamily: font.family }}
                                            >
                                                {font.name}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={handleTypeSave} className="w-full btn-primary py-2 text-sm">Add Signature</button>
                                </div>
                            )}

                            {/* Upload Tab */}
                            {activeTab === 'upload' && (
                                <div className="space-y-4">
                                    <label className="block w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                        <input type="file" accept="image/*" className="hidden" onChange={handleUploadSelect} />
                                        <ImageIcon className="mx-auto mb-2 text-gray-400" />
                                        <span className="text-sm text-text-secondary">Click to upload image</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="card bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
                            <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2">Instructions</h3>
                            <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1 list-disc list-inside">
                                <li>Create your signature above.</li>
                                <li>It will appear on the document page.</li>
                                <li><strong>Drag</strong> the signature to position it.</li>
                                <li>Click <strong>Download Signed PDF</strong> when done.</li>
                            </ul>
                        </div>

                        <button
                            onClick={handleSavePDF}
                            disabled={isProcessing}
                            className="w-full btn-primary"
                        >
                            {isProcessing ? 'Processing' : 'Download Signed PDF'}
                            <Download size={20} />
                        </button>
                    </div>

                    {/* Right: PDF Preview & Playground */}
                    <div className="lg:col-span-2">
                        <div className="card min-h-[600px] flex flex-col items-center bg-gray-100 dark:bg-black/20 p-8 relative overflow-hidden">
                            {isProcessing && pages.length === 0 ? (
                                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full font-bold m-auto" />
                            ) : (
                                <>
                                    {/* Pagination Controls */}
                                    {pages.length > 1 && (
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center gap-4 px-4 py-2 z-20">
                                            <button
                                                onClick={() => setCurrPageIndex(p => Math.max(0, p - 1))}
                                                disabled={currPageIndex === 0}
                                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-30"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <span className="text-xs font-bold text-nowrap">
                                                Page {currPageIndex + 1} of {pages.length}
                                            </span>
                                            <button
                                                onClick={() => setCurrPageIndex(p => Math.min(pages.length - 1, p + 1))}
                                                disabled={currPageIndex === pages.length - 1}
                                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-30"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    )}

                                    {/* PDF Page Container */}
                                    <div
                                        ref={pdfContainerRef}
                                        className="relative shadow-2xl mt-8 bg-white max-w-full"
                                    >
                                        {/* The Page Image */}
                                        {pages[currPageIndex] && (
                                            <img
                                                id={`page-preview-${currPageIndex}`}
                                                src={pages[currPageIndex]}
                                                alt={`Page ${currPageIndex + 1}`}
                                                className="block max-w-full h-auto select-none pointer-events-none"
                                            />
                                        )}

                                        {/* Signatures Layer */}
                                        <div className="absolute inset-0 z-10 overflow-hidden">
                                            {placedSignatures.filter(s => s.pageIndex === currPageIndex).map((sig) => (
                                                <DraggableSignature
                                                    key={sig.id}
                                                    sig={sig}
                                                    updatePosition={updateSignaturePosition}
                                                    removeSignature={removeSignature}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
