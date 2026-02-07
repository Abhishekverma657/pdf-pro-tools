import GenericOneClickTool from './GenericOneClickTool';
import { Table } from 'lucide-react';
import { excelToPdf } from '../../utils/pdfUtils';

export default function ExcelToPDF() {
    return (
        <GenericOneClickTool
            title="Excel to PDF"
            description="Convert Excel spreadsheets (.xlsx) to PDF format."
            icon={Table}
            color="from-green-600 to-emerald-700"
            accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }}
            processFunction={excelToPdf}
            outputFileName="converted_from_excel.pdf"
            inputLabel="Upload Excel File"
        />
    );
}
