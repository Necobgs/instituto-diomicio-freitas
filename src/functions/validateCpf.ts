export function validateCPF(cpf: string): boolean {
  // Remove tudo que não for número
  cpf = cpf.replace(/\D/g, "");

  // Verifica tamanho
  if (cpf.length !== 11) return false;

  // Elimina CPFs inválidos conhecidos
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Validação do primeiro dígito
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += Number(cpf[i]) * (10 - i);
  }

  let firstDigit = (sum * 10) % 11;

  if (firstDigit === 10) firstDigit = 0;

  if (firstDigit !== Number(cpf[9])) return false;

  // Validação do segundo dígito
  sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += Number(cpf[i]) * (11 - i);
  }

  let secondDigit = (sum * 10) % 11;

  if (secondDigit === 10) secondDigit = 0;

  if (secondDigit !== Number(cpf[10])) return false;

  return true;
}