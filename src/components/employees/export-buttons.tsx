
import { useState } from "react";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Employee } from "@/pages/Employees";

interface ExportButtonsProps {
  employees: Employee[];
}

export function ExportButtons({ employees }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = (type: string) => {
    setIsExporting(type);
    
    // Simulate export processing
    setTimeout(() => {
      setIsExporting(null);
      toast.success(`${type} export complete!`);
    }, 1500);
  };

  const exportToExcel = () => {
    if (employees.length === 0) {
      toast.error("No data to export");
      return;
    }
    handleExport("Excel");
    
    // In a real implementation, we would generate and download an Excel file
    console.log("Exporting to Excel:", employees);
  };

  const exportToPDF = () => {
    if (employees.length === 0) {
      toast.error("No data to export");
      return;
    }
    handleExport("PDF");
    
    // In a real implementation, we would generate and download a PDF file
    console.log("Exporting to PDF:", employees);
  };

  const printTable = () => {
    if (employees.length === 0) {
      toast.error("No data to print");
      return;
    }
    handleExport("Print");
    
    // In a real implementation, we would open the print dialog
    window.print();
  };

  return (
    <div className="flex justify-end gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={exportToExcel}
        disabled={isExporting !== null}
        className="flex items-center gap-1"
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span className="hidden sm:inline">Export Excel</span>
        <span className="sm:hidden">Excel</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToPDF}
        disabled={isExporting !== null}
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Export PDF</span>
        <span className="sm:hidden">PDF</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={printTable}
        disabled={isExporting !== null}
        className="flex items-center gap-1"
      >
        <Printer className="h-4 w-4" />
        <span className="hidden sm:inline">Print</span>
      </Button>
    </div>
  );
}
