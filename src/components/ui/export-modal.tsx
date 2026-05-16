import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { exportToExcel, exportToPDF } from "@/functions/export";

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
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Exportar registro(s)</DialogTitle>
                    <DialogDescription>
                        Escolha o formato para exportar os dados desta registro(s).
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 pt-4">
                    <Button type="button" onClick={() => { exportToExcel(name, rows); onOpenChange(false); }}>
                        Exportar para Excel
                    </Button>
                    <Button type="button" onClick={() => { exportToPDF(title, rows); onOpenChange(false); }}>
                        Exportar para PDF
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}