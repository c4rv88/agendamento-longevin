
/**
 * Formats a string as a CPF (Brazilian ID)
 * @param value String to format
 * @returns Formatted CPF string (e.g. 123.456.789-00)
 */
export const formatCpf = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

/**
 * Formats a string as a Brazilian phone number
 * @param value String to format
 * @returns Formatted phone string (e.g. (11) 98765-4321)
 */
export const formatPhone = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})/, '$1-$2');
};

/**
 * Masks an email for privacy protection
 * @param email Email to mask
 * @returns Masked email (e.g. jo***@example.com)
 */
export const maskEmail = (email: string): string => {
  if (!email || email.length === 0) return '';
  const [username, domain] = email.split('@');
  if (!domain) return email;
  const maskedUsername = username.slice(0, 2) + '*'.repeat(username.length > 3 ? username.length - 3 : 1) + (username.length > 2 ? username.slice(-1) : '');
  return `${maskedUsername}@${domain}`;
};

/**
 * Masks a phone number for privacy protection
 * @param phone Phone number to mask
 * @returns Masked phone number (e.g. (11) 9****-4321)
 */
export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 8) return phone;
  return phone.slice(0, 4) + '*'.repeat(phone.length - 7) + phone.slice(-3);
};
