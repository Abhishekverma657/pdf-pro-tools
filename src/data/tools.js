import {
    FileText, Scissors, Combine, Image,
    ScanLine, Lock, Eye, Type, RotateCw
} from 'lucide-react';

export const TOOLS = [
    { id: 'extract-text', name: 'Extract Text', icon: FileText, description: 'Extract ALL text content from your PDF files instantly.', path: '/tools/extract-text', color: 'from-orange-500 to-red-500', iconColor: 'text-orange-500' },
    { id: 'split-pdf', name: 'Split PDF', icon: Scissors, description: 'Split one PDF into multiple files by page ranges.', path: '/tools/split-pdf', color: 'from-purple-500 to-indigo-500', iconColor: 'text-purple-500' },
    { id: 'merge-pdf', name: 'Merge PDF', icon: Combine, description: 'Combine multiple PDF documents into a single file.', path: '/tools/merge-pdf', color: 'from-blue-500 to-cyan-500', iconColor: 'text-blue-500' },
    { id: 'image-to-pdf', name: 'Image to PDF', icon: Image, description: 'Convert PNG, JPG, and other images to PDF format.', path: '/tools/image-to-pdf', color: 'from-green-500 to-emerald-500', iconColor: 'text-green-500' },
    { id: 'scan-invoice', name: 'Invoice Scanner', icon: ScanLine, description: 'Scan invoices and extract key data automatically.', path: '/tools/scan-invoice', color: 'from-pink-500 to-rose-500', iconColor: 'text-pink-500' },
    { id: 'protect-pdf', name: 'Protect PDF', icon: Lock, description: 'Encrypt your PDF with a secure password.', path: '/tools/protect-pdf', color: 'from-red-500 to-orange-500', iconColor: 'text-red-500' },
    { id: 'ocr', name: 'OCR PDF', icon: Eye, description: 'Make scanned PDFs searchable and editable using OCR.', path: '/tools/ocr', color: 'from-indigo-500 to-purple-500', iconColor: 'text-indigo-500' },
    { id: 'sign-pdf', name: 'Sign PDF', icon: Type, description: 'Add your digital signature to documents securely.', path: '/tools/sign-pdf', color: 'from-teal-500 to-green-500', iconColor: 'text-teal-500' },
    { id: 'rotate-pdf', name: 'Rotate PDF', icon: RotateCw, description: 'Rotate PDF pages left or right permanently.', path: '/tools/rotate-pdf', color: 'from-yellow-500 to-orange-500', iconColor: 'text-yellow-500' },
];
