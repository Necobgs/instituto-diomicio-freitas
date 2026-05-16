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

export const exportToExcel = (name: string, rows: (string | number)[][]) => {
    const tableHtml = rows.map((row) =>
        `<tr>${row.map((cell) => `<td>${String(cell).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`).join("")}</tr>`
    ).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><table>${tableHtml}</table></body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name ? `${name}.xls` : `ieedf_export.xls`;
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
