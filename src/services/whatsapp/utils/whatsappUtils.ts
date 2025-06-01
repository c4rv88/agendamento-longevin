
import { WhatsAppTemplateData, WhatsAppParameter } from '../types/whatsappTypes';

/**
 * Convert date to Brazilian format DD-MM-YYYY
 */
export const formatDateToBrazilian = (dateString: string): string => {
  if (!dateString) return '01-01-2024';
  
  // If already in DD-MM-YYYY format, return as is
  if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
    console.log('Data já no formato correto DD-MM-YYYY:', dateString);
    return dateString;
  }
  
  // If in YYYY-MM-DD format, convert to DD-MM-YYYY
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split('-');
    const brazilianDate = `${day}-${month}-${year}`;
    console.log(`Convertendo data de ${dateString} para ${brazilianDate}`);
    return brazilianDate;
  }
  
  // If in DD/MM/YYYY format, convert to DD-MM-YYYY
  if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const converted = dateString.replace(/\//g, '-');
    console.log(`Convertendo data de ${dateString} para ${converted}`);
    return converted;
  }
  
  console.error('Formato de data não reconhecido:', dateString);
  return '01-01-2024'; // Fallback
};

/**
 * Format phone number for WhatsApp API
 */
export const formatPhoneNumber = (phone: string): string => {
  console.log('Telefone original:', phone);
  
  let formattedPhone = phone.replace(/\D/g, '');
  console.log('Telefone após limpar:', formattedPhone);
  
  if (formattedPhone.startsWith('55')) {
    formattedPhone = formattedPhone.substring(2);
  }
  
  const finalPhone = `55${formattedPhone}`;
  console.log('Telefone final formatado:', finalPhone);
  
  return finalPhone;
};

/**
 * Validate and clean template data
 */
export const validateAndCleanTemplateData = (templateData: WhatsAppTemplateData) => {
  console.log('=== DADOS ORIGINAIS RECEBIDOS ===');
  console.log('Nome original:', JSON.stringify(templateData.nome));
  console.log('Especialidade original:', JSON.stringify(templateData.especialidade));
  console.log('Data original:', JSON.stringify(templateData.data));
  console.log('Horário original:', JSON.stringify(templateData.horario));
  console.log('Local original:', JSON.stringify(templateData.local));
  console.log('Profissional original:', JSON.stringify(templateData.profissional));
  console.log('Telefone original:', JSON.stringify(templateData.telefone));

  const cleanData = {
    nome: String(templateData.nome || 'Paciente').trim() || 'Paciente',
    especialidade: String(templateData.especialidade || 'Consulta').trim() || 'Consulta',
    data: formatDateToBrazilian(String(templateData.data || '01-01-2024').trim()),
    horario: String(templateData.horario || '09:00').trim() || '09:00',
    local: String(templateData.local || 'Clinica').trim() || 'Clinica',
    profissional: String(templateData.profissional || 'Medico').trim() || 'Medico',
    telefone: String(templateData.telefone || '').replace(/\D/g, '')
  };

  console.log('=== DADOS LIMPOS E VALIDADOS ===');
  Object.entries(cleanData).forEach(([key, value]) => {
    console.log(`${key}:`, typeof value, `"${value}"`, `length: ${value.length}`);
    if (key !== 'telefone' && (!value || value.trim() === '' || value.length === 0)) {
      console.error(`🚨 CAMPO VAZIO DETECTADO: ${key} = "${value}"`);
    }
  });

  // Validate phone
  if (!cleanData.telefone || cleanData.telefone.length < 10) {
    console.error('🚨 TELEFONE INVÁLIDO:', cleanData.telefone);
    throw new Error('Telefone inválido');
  }

  return cleanData;
};

/**
 * Create WhatsApp parameters from clean data with correct structure for Facebook API
 */
export const createWhatsAppParameters = (cleanData: ReturnType<typeof validateAndCleanTemplateData>): WhatsAppParameter[] => {
  const parameters: WhatsAppParameter[] = [
    { type: "text", text: cleanData.nome },
    { type: "text", text: cleanData.especialidade },
    { type: "text", text: cleanData.data },
    { type: "text", text: cleanData.horario },
    { type: "text", text: cleanData.local },
    { type: "text", text: cleanData.profissional }
  ];

  console.log('=== PARÂMETROS CRIADOS PARA API ===');
  parameters.forEach((param, index) => {
    console.log(`Parâmetro ${index + 1}:`, JSON.stringify(param));
    console.log(`  - Tipo: ${param.type}`);
    console.log(`  - Texto: "${param.text}"`);
    console.log(`  - Comprimento: ${param.text.length}`);
    console.log(`  - É string válida: ${typeof param.text === 'string' && param.text.length > 0}`);
    
    if (!param.text || param.text.trim() === '') {
      console.error(`🚨 PARÂMETRO VAZIO DETECTADO NO ÍNDICE ${index}:`, param);
    }
  });

  return parameters;
};
