
import { WhatsAppTemplateData, WhatsAppParameter, WhatsAppPayload } from '../types/whatsappTypes';

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
  console.log('Convênio original:', JSON.stringify(templateData.convenio));

  const cleanData = {
    nome: String(templateData.nome || 'Paciente').trim() || 'Paciente',
    especialidade: String(templateData.especialidade || 'Consulta').trim() || 'Consulta',
    data: formatDateToBrazilian(String(templateData.data || '01-01-2024').trim()),
    horario: String(templateData.horario || '09:00').trim() || '09:00',
    local: String(templateData.local || 'Clinica').trim() || 'Clinica',
    profissional: String(templateData.profissional || 'Medico').trim() || 'Medico',
    convenio: String(templateData.convenio || 'Particular').trim() || 'Particular',
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
 * Create WhatsApp parameters with correct structure for the template "lagendamento"
 */
export const createWhatsAppParameters = (cleanData: ReturnType<typeof validateAndCleanTemplateData>): WhatsAppParameter[] => {
  // Based on your template "lagendamento", the parameters order is:
  // {{1}} - Nome, {{2}} - Especialidade, {{3}} - Data, {{4}} - Horário, {{5}} - Local, {{6}} - Profissional, {{7}} - Convênio
  const parameters: WhatsAppParameter[] = [
    { type: "text", text: cleanData.nome },           // {{1}}
    { type: "text", text: cleanData.especialidade },  // {{2}}
    { type: "text", text: cleanData.data },           // {{3}}
    { type: "text", text: cleanData.horario },        // {{4}}
    { type: "text", text: cleanData.local },          // {{5}}
    { type: "text", text: cleanData.profissional },   // {{6}}
    { type: "text", text: cleanData.convenio }        // {{7}}
  ];

  console.log('=== PARÂMETROS CRIADOS PARA TEMPLATE "lagendamento" ===');
  console.log('Ordem dos parâmetros baseada no template:');
  console.log('1. {{1}} - Nome do paciente');
  console.log('2. {{2}} - Especialidade');
  console.log('3. {{3}} - Data');
  console.log('4. {{4}} - Horário');
  console.log('5. {{5}} - Local');
  console.log('6. {{6}} - Profissional');
  console.log('7. {{7}} - Convênio');
  
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

/**
 * Create appointment payload for WhatsApp
 */
export const createAppointmentPayload = (phoneNumber: string, data: any, templateName: string): WhatsAppPayload => {
  const cleanData = validateAndCleanTemplateData(data);
  const parameters = createWhatsAppParameters(cleanData);

  return {
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: "pt_BR"
      },
      components: [
        {
          type: "body",
          parameters: parameters
        }
      ]
    }
  };
};
