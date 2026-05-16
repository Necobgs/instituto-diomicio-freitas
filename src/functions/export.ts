import * as XLSX from "xlsx";
import { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";

export const exportToPDF = (title: string, rows: (string | number)[][]) => {
    if (!rows || rows.length === 0) return;

    const headerRow = rows[0];
    const bodyRows = rows.slice(1);

    const tableRows = [
        `<tr>${headerRow.map((cell) => `<th style="border:1px solid #999;padding:8px;background:#f3f4f6;font-weight:700;text-align:left;">${String(cell).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</th>`).join("")}</tr>`,
        ...bodyRows.map((row) =>
            `<tr>${row.map((cell) => `<td style="border:1px solid #999;padding:8px;">${String(cell).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`).join("")}</tr>`
        ),
    ].join("");

    const printableHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:24px;}h1{margin-bottom:16px;}table{border-collapse:collapse;width:100%;font-size:12px;}td,th{vertical-align:top;}</style></head><body><h1>${title}</h1><table>${tableRows}</table></body></html>`;
    const newWindow = window.open("", "_blank");
    if (!newWindow) return;
    newWindow.document.write(printableHtml);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
};

export const exportToDocx = async (name: string, title: string, rows: (string | number)[][]) => {
    if (!rows || rows.length === 0) return;

    const headerRow = rows[0];
    const bodyRows = rows.slice(1);

    const tableRows = [
        new TableRow({
            children: headerRow.map((cell) =>
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ text: String(cell), bold: true }),
                            ],
                        }),
                    ],
                })
            ),
        }),
        ...bodyRows.map((row) =>
            new TableRow({
                children: row.map((cell) =>
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [new TextRun({ text: String(cell) })],
                            }),
                        ],
                    })
                ),
            })
        ),
    ];

    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        heading: HeadingLevel.HEADING_1,
                        children: [
                            new TextRun({
                                text: title,
                                bold: true,
                                color: "000000",
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Table({
                        rows: tableRows,
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                    }),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name ? `${name}.docx` : `ieedf_export.docx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};

export const exportToExcel = (name: string, rows: (string | number)[][]) => {
    if (!rows || rows.length === 0) return;

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name ? `${name}.xlsx` : `ieedf_export.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};

export const formatExportDate = (value?: string | Date | null | undefined) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("pt-BR");
};
