
/**
 * Validates Brazilian CPF (Cadastro de Pessoas Físicas)
 * @param cpf CPF string (with or without formatting)
 * @returns boolean indicating if CPF is valid
 */
export const validateCpf = (cpf: string): boolean => {
  // Remove all non-numeric characters
  const cleanCpf = cpf.replace(/\D/g, '');
  
  // Check if CPF has 11 digits
  if (cleanCpf.length !== 11) {
    return false;
  }
  
  // Check if all digits are the same (invalid CPFs like 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cleanCpf)) {
    return false;
  }
  
  // Validate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  
  let remainder = sum % 11;
  let firstDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cleanCpf.charAt(9)) !== firstDigit) {
    return false;
  }
  
  // Validate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  
  remainder = sum % 11;
  let secondDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cleanCpf.charAt(10)) !== secondDigit) {
    return false;
  }
  
  return true;
};

/**
 * Gets CPF validation error message
 * @param cpf CPF string
 * @returns error message or null if valid
 */
export const getCpfValidationError = (cpf: string): string | null => {
  const cleanCpf = cpf.replace(/\D/g, '');
  
  if (!cleanCpf) {
    return 'CPF é obrigatório';
  }
  
  if (cleanCpf.length !== 11) {
    return 'CPF deve ter 11 dígitos';
  }
  
  if (!validateCpf(cpf)) {
    return 'CPF inválido';
  }
  
  return null;
};
