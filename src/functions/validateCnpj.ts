export function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, "");

  // Verifica tamanho
  if (cnpj.length !== 14) return false;

  // Elimina sequências inválidas
  if (/^(\d)\1+$/.test(cnpj)) return false;

  const calcDigit = (base: string, weights: number[]) => {
    const sum = base
      .split("")
      .reduce((acc, num, index) => {
        return acc + Number(num) * weights[index];
      }, 0);

    const remainder = sum % 11;

    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Primeiro dígito
  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const firstDigit = calcDigit(cnpj.slice(0, 12), firstWeights);

  // Segundo dígito
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondDigit = calcDigit(
    cnpj.slice(0, 12) + firstDigit,
    secondWeights
  );

  return (
    firstDigit === Number(cnpj[12]) &&
    secondDigit === Number(cnpj[13])
  );
}