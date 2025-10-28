export const formatCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export const formatCnpj = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

export const formatPhone = (phone: string) => {
    return phone.length === 10 
    ? phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
    : phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
}