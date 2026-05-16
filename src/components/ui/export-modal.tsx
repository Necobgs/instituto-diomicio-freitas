import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Printer } from "lucide-react";
import { exportToExcel, exportToPDF, exportToDocx } from "@/functions/export";

interface ExportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    name: string;
    title: string;
    rows: (string | number)[][];
}

export const ExportModal = ({
    open,
    onOpenChange,
    name,
    title,
    rows
}: ExportModalProps) => {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-md max-w-[95%]">
                <DialogHeader>
                    <DialogTitle className="text-left">Exportar registro(s)</DialogTitle>
                    <DialogDescription className="text-left">
                        Escolha o formato para exportar os dados deste(s) registro(s).
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 pt-4">
                    <Button className="flex align-center justify-center gap-2 bg-green-800 hover:bg-green-700" type="button" onClick={() => { exportToExcel(name, rows); onOpenChange(false); }}>
                        <FileSpreadsheet size={18}/>
                        Exportar para Excel
                    </Button>
                    <Button className="flex align-center justify-center gap-2  bg-blue-900 hover:bg-blue-800" type="button" onClick={() => { exportToDocx(name, title, rows); onOpenChange(false); }}>
                        <FileText size={18}/>
                        Exportar para Word
                    </Button>
                    <Button className="flex align-center justify-center gap-2 bg-red-700 hover:bg-red-600" type="button" onClick={() => { exportToPDF(title, rows); onOpenChange(false); }}>
                        <Printer size={18}/>
                        Exportar para PDF
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}