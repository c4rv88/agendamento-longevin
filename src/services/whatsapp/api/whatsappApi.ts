import { WhatsAppPayload, WhatsAppApiError } from '../types/whatsappTypes';

// WhatsApp API configuration from environment variables
const WHATSAPP_CONFIG = {
  token: import.meta.env.VITE_WHATSAPP_TOKEN,
  phoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID,
  apiVersion: import.meta.env.VITE_WHATSAPP_API_VERSION || 'v22.0'
};

/**
 * Send WhatsApp message via Facebook Graph API
 */
export const sendWhatsAppMessage = async (payload: WhatsAppPayload): Promise<boolean> => {
  const url = `${WHATSAPP_CONFIG.baseUrl}/${WHATSAPP_CONFIG.apiVersion}/${WHATSAPP_CONFIG.phoneNumberId}/messages`;
  
  const headers = {
    'Authorization': `Bearer ${WHATSAPP_CONFIG.token}`,
    'Content-Type': 'application/json',
  };

  console.log('=== PAYLOAD FINAL PARA ENVIO ===');
  console.log('JSON completo do payload:');
  console.log(JSON.stringify(payload, null, 2));
  
  console.log('=== VALIDAÇÃO DE ESTRUTURA ===');
  console.log('Nome do template:', payload.template.name);
  console.log('Código do idioma:', payload.template.language.code);
  console.log('Número de componentes:', payload.template.components?.length || 0);
  
  if (payload.template.components && payload.template.components.length > 0) {
    payload.template.components.forEach((component, index) => {
      console.log(`Componente ${index}:`, component.type);
      if (component.parameters) {
        console.log(`  - Parâmetros (${component.parameters.length}):`, component.parameters);
        component.parameters.forEach((param, paramIndex) => {
          console.log(`    Param ${paramIndex}: ${param.type} = "${param.text}"`);
          if (!param.text || param.text.trim() === '') {
            console.error(`🚨 PARÂMETRO VAZIO NO COMPONENTE ${index}, PARAM ${paramIndex}`);
          }
        });
      }
    });
  }
  
  console.log('URL da API:', url);
  console.log('=== ENVIANDO REQUISIÇÃO ===');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    console.log('Status da resposta:', response.status);
    console.log('Status text:', response.statusText);
    
    const data = await response.json();
    console.log('=== RESPOSTA DA API ===');
    console.log(JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('=== ERRO NA API WHATSAPP ===');
      console.error('Status:', response.status);
      console.error('Data completa:', JSON.stringify(data, null, 2));
      
      const errorData = data as WhatsAppApiError;
      if (errorData.error) {
        console.error('Tipo do erro:', errorData.error.type);
        console.error('Código do erro:', errorData.error.code);
        console.error('Mensagem do erro:', errorData.error.message);
        console.error('Detalhes do erro:', JSON.stringify(errorData.error.error_data || {}, null, 2));
        console.error('Trace ID:', errorData.error.fbtrace_id);
      }
      
      return false;
    }

    console.log('=== MENSAGEM ENVIADA COM SUCESSO ===');
    return true;
  } catch (error) {
    console.error('=== ERRO GERAL NO ENVIO ===');
    console.error('Tipo do erro:', typeof error);
    console.error('Erro completo:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Erro de rede: Verifique a conexão com a internet');
    }
    
    throw error;
  }
};

/**
 * Test WhatsApp API connection with hello_world template
 */
export const testWhatsAppConnection = async (phoneNumber: string): Promise<boolean> => {
  const testPayload: WhatsAppPayload = {
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "template",
    template: {
      name: "hello_world",
      language: {
        code: "en_US"
      },
      components: []
    }
  };

  console.log('=== TESTANDO CONEXÃO COM HELLO_WORLD ===');
  return await sendWhatsAppMessage(testPayload);
};
