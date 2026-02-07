import {
    FileText, Scissors, Combine, Image,
    ScanLine, Lock, Eye, Type, RotateCw,
    FileType, Table, Hash, Stamp
} from 'lucide-react';

export const TOOLS = [
    {
        id: 'extract-text',
        name: 'Extract Text',
        icon: FileText,
        description: 'Extract ALL text content from your PDF files instantly.',
        path: '/tools/extract-text',
        color: 'from-orange-500 to-red-500',
        iconColor: 'text-orange-500',
        content: {
            title: "Extract Text from PDF Online Free",
            features: [
                "Extract text from any PDF document instantly",
                "Copy text to clipboard with one click",
                "Download extracted text as .txt file",
                "100% Client-side processing (Secure)"
            ],
            steps: [
                "Upload your PDF file.",
                "Wait a second for the text to be extracted.",
                "Review the text in the preview box.",
                "Click 'Download Text' to save it."
            ],
            faq: [
                { q: "Is it free?", a: "Yes, this tool is completely free to use." },
                { q: "Is my data safe?", a: "Absolutely. All processing happens in your browser." }
            ]
        }
    },
    {
        id: 'pdf-to-word',
        name: 'PDF to Word',
        icon: FileType,
        description: 'Convert PDF files to editable Word documents (.docx).',
        path: '/tools/pdf-to-word',
        color: 'from-blue-600 to-blue-800',
        iconColor: 'text-blue-700',
        content: {
            title: "PDF to Word Converter",
            features: [
                "Convert PDF to DOCX instantly",
                "Editable text output",
                "No software installation needed",
                "Secure client-side conversion"
            ],
            steps: [
                "Upload your PDF file.",
                "Click 'Start Conversion'.",
                "Download your editable Word document."
            ]
        }
    },
    {
        id: 'word-to-pdf',
        name: 'Word to PDF',
        icon: FileText,
        description: 'Convert Word documents to professional PDF format.',
        path: '/tools/word-to-pdf',
        color: 'from-blue-500 to-indigo-500',
        iconColor: 'text-indigo-600',
        content: {
            title: "Word to PDF Converter",
            features: [
                "Convert DOCX to PDF",
                "Preserves basic formatting",
                "Fast processing",
                "Secure privacy"
            ],
            steps: [
                "Upload your Word (.docx) file.",
                "Click 'Start Conversion'.",
                "Download your new PDF file."
            ]
        }
    },
    {
        id: 'excel-to-pdf',
        name: 'Excel to PDF',
        icon: Table,
        description: 'Turn Excel spreadsheets into easy-to-read PDFs.',
        path: '/tools/excel-to-pdf',
        color: 'from-green-600 to-emerald-700',
        iconColor: 'text-green-600',
        content: {
            title: "Excel to PDF Converter",
            features: [
                "Convert XLSX to PDF tables",
                "Auto-formats data",
                "Clean output",
                "Fast and free"
            ],
            steps: [
                "Upload your Excel (.xlsx) file.",
                "The tool processes your spreadsheet.",
                "Download the PDF with your data tables."
            ]
        }
    },
    {
        id: 'pdf-to-jpg',
        name: 'PDF to JPG',
        icon: Image,
        description: 'Convert PDF pages into high-quality images.',
        path: '/tools/pdf-to-jpg',
        color: 'from-yellow-500 to-orange-500',
        iconColor: 'text-yellow-600',
        content: {
            title: "PDF to Image Converter",
            features: [
                "Convert pages to PNG images",
                "Download as ZIP archive",
                "High resolution output",
                "Batch processing"
            ],
            steps: [
                "Upload your PDF.",
                "Click 'Start Conversion'.",
                "Download a ZIP file containing all pages as images."
            ]
        }
    },
    {
        id: 'watermark-pdf',
        name: 'Watermark PDF',
        icon: Stamp,
        description: 'Stamp text watermarks on your PDF pages.',
        path: '/tools/watermark-pdf',
        color: 'from-pink-500 to-rose-500',
        iconColor: 'text-pink-500',
        content: {
            title: "Add Watermark to PDF",
            features: [
                "Custom text watermarks",
                "Diagonal placement",
                "Apply to all pages",
                "Protect your documents"
            ],
            steps: [
                "Upload your PDF.",
                "Type your watermark text.",
                "Click 'Apply & Download'.",
                "Get your stamped PDF instantly."
            ]
        }
    },
    {
        id: 'page-numbers',
        name: 'Page Numbers',
        icon: Hash,
        description: 'Add page numbers to your PDF document.',
        path: '/tools/page-numbers',
        color: 'from-gray-600 to-gray-800',
        iconColor: 'text-gray-700',
        content: {
            title: "Add Page Numbers to PDF",
            features: [
                "Auto-number all pages",
                "Clean positioning",
                "Professional look",
                "Instant processing"
            ],
            steps: [
                "Upload your PDF.",
                "Click 'Start Conversion'.",
                "Download the numbered PDF."
            ]
        }
    },
    {
        id: 'split-pdf',
        name: 'Split PDF',
        icon: Scissors,
        description: 'Split one PDF into multiple files by page ranges.',
        path: '/tools/split-pdf',
        color: 'from-purple-500 to-indigo-500',
        iconColor: 'text-purple-500',
        content: {
            title: "Free PDF Splitter Online",
            features: [
                "Split PDF into individual pages",
                "Extract specific page ranges",
                "Download result as a ZIP file",
                "Preserve original quality"
            ],
            steps: [
                "Select the PDF you want to split.",
                "Choose to extract 'All Pages' or a 'Custom Range'.",
                "Click 'Split PDF'.",
                "Download your separated PDF files."
            ]
        }
    },
    {
        id: 'merge-pdf',
        name: 'Merge PDF',
        icon: Combine,
        description: 'Combine multiple PDF documents into a single file.',
        path: '/tools/merge-pdf',
        color: 'from-blue-500 to-cyan-500',
        iconColor: 'text-blue-500',
        content: {
            title: "Merge PDF Files Online",
            features: [
                "Combine unlimited PDF files",
                "Drag and drop to reorder files",
                "Fast merging process",
                "Secure & Private"
            ],
            steps: [
                "Upload multiple PDF files.",
                "Reorder them by dragging if needed.",
                "Click 'Merge PDF'.",
                "Download your single combined document."
            ]
        }
    },
    {
        id: 'image-to-pdf',
        name: 'Image to PDF',
        icon: Image,
        description: 'Convert PNG, JPG, and other images to PDF format.',
        path: '/tools/image-to-pdf',
        color: 'from-green-500 to-emerald-500',
        iconColor: 'text-green-500',
        content: {
            title: "Convert Images to PDF",
            features: [
                "Supports PNG, JPG, JPEG, WebP",
                "Maintains image quality",
                "Combine multiple images into one PDF",
                "Auto-scaling to fit pages"
            ],
            steps: [
                "Upload your images (PNG/JPG).",
                "They will automatically appear in the grid.",
                "Click 'Convert to PDF'.",
                "Your images are now a single PDF document."
            ]
        }
    },
    {
        id: 'scan-invoice',
        name: 'Invoice Scanner',
        icon: ScanLine,
        description: 'Scan invoices and extract key data automatically.',
        path: '/tools/scan-invoice',
        color: 'from-pink-500 to-rose-500',
        iconColor: 'text-pink-500',
        content: {
            title: "AI Invoice Scanner & Data Extractor",
            features: [
                "Detects Total Amount, Date, and Invoice Number",
                "Uses OCR technology",
                "Works with scanned PDF invoices",
                "Export data easily"
            ],
            steps: [
                "Upload an invoice PDF.",
                "The tool scans the text using OCR.",
                "It identifies key fields automatically.",
                "Copy the extracted data."
            ]
        }
    },
    {
        id: 'protect-pdf',
        name: 'Protect PDF',
        icon: Lock,
        description: 'Encrypt your PDF with a secure password.',
        path: '/tools/protect-pdf',
        color: 'from-red-500 to-orange-500',
        iconColor: 'text-red-500',
        content: {
            title: "Encrypt & Password Protect PDF",
            features: [
                "Add strong AES encryption",
                "Prevent unauthorized access",
                "Instant processing",
                "Client-side security"
            ],
            steps: [
                "Upload your sensitive PDF.",
                "Enter a strong password.",
                "Click 'Protect PDF'.",
                "Download the locked file."
            ]
        }
    },
    {
        id: 'ocr',
        name: 'OCR PDF',
        icon: Eye,
        description: 'Make scanned PDFs searchable and editable using OCR.',
        path: '/tools/ocr',
        color: 'from-indigo-500 to-purple-500',
        iconColor: 'text-indigo-500',
        content: {
            title: "Free Online OCR PDF Converter",
            features: [
                "Convert scanned images to text",
                "Supports English language",
                "Powered by Tesseract.js",
                "No upload limits"
            ],
            steps: [
                "Upload a scanned PDF.",
                "The tool processes each page to recognize text.",
                "Copy the text or download it.",
                "Searchable text is ready."
            ]
        }
    },
    {
        id: 'sign-pdf',
        name: 'Sign PDF',
        icon: Type,
        description: 'Add your digital signature to documents securely.',
        path: '/tools/sign-pdf',
        color: 'from-teal-500 to-green-500',
        iconColor: 'text-teal-500',
        content: {
            title: "Sign PDF Documents Online",
            features: [
                "Draw your signature",
                "Type your name with cursive fonts",
                "Upload signature image",
                "Place signature anywhere on any page"
            ],
            steps: [
                "Upload the PDF you need to sign.",
                "Choose 'Draw', 'Type', or 'Upload' tab.",
                "Create your signature.",
                "Drag it to the correct position on the document.",
                "Click 'Download Signed PDF'."
            ]
        }
    },
    {
        id: 'rotate-pdf',
        name: 'Rotate PDF',
        icon: RotateCw,
        description: 'Rotate PDF pages left or right permanently.',
        path: '/tools/rotate-pdf',
        color: 'from-yellow-500 to-orange-500',
        iconColor: 'text-yellow-500',
        content: {
            title: "Rotate PDF Pages Permanently",
            features: [
                "Rotate 90, 180, or 270 degrees",
                "Visual preview of rotation",
                "Fix upside-down scans",
                "Save permanently"
            ],
            steps: [
                "Upload the PDF.",
                "Use the Left/Right buttons to rotate.",
                "See the preview update instantly.",
                "Click 'Apply Rotation' to save."
            ]
        }
    },
];
