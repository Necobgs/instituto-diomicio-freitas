export const formatCpf = (cpf: string) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export const formatCnpj = (cnpj: string) => {
    if (!cnpj) return '';
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

export const formatPhone = (phone: string) => {
    if (!phone) return '';
    return phone.length === 10
    ? phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
    : phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
}

export const formatDate = (date: Date | string | null) => {
    if (!date) return "";

    console.log('formatDate received:', date);

    let dateStr: string;
    if (date instanceof Date) {
        dateStr = date.toISOString().split('T')[0];
    } else if (typeof date === 'string') {
        dateStr = date.split('T')[0];
    } else {
        return "";
    }

    const [year, month, day] = dateStr.split('-').map(Number);
    const formatted = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

    console.log('Formatted date:', formatted);
    return formatted;
};