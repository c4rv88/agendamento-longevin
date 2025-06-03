
import { WhatsAppPayload, WhatsAppNotificationData } from './types/whatsappTypes';
import { sendWhatsAppMessage, testWhatsAppConnection } from './api/whatsappApi';
import { createAppointmentPayload } from './utils/whatsappUtils';

export const WhatsAppService = {
  /**
   * Send appointment notification via WhatsApp
   */
  sendAppointmentNotification: async (data: WhatsAppNotificationData): Promise<boolean> => {
    try {
      console.log('=== WHATSAPP SERVICE - INICIO ===');
      console.log('Dados recebidos:', JSON.stringify(data, null, 2));
      
      if (!data.telefone || data.telefone.trim() === '') {
        console.error('❌ TELEFONE VAZIO - CANCELANDO ENVIO');
        return false;
      }

      // Garantir que o telefone comece com +55
      let phoneNumber = data.telefone.replace(/\D/g, '');
      if (!phoneNumber.startsWith('55')) {
        phoneNumber = '55' + phoneNumber;
      }
      phoneNumber = '+' + phoneNumber;
      
      console.log('Telefone formatado:', phoneNumber);

      // Criar payload com template "lagendamento"
      const payload = createAppointmentPayload(phoneNumber, data, 'lagendamento');
      
      console.log('=== PAYLOAD CRIADO ===');
      console.log(JSON.stringify(payload, null, 2));

      // Enviar mensagem
      const result = await sendWhatsAppMessage(payload);
      
      console.log('=== RESULTADO DO ENVIO ===');
      console.log('Sucesso:', result);
      
      return result;
    } catch (error) {
      console.error('=== ERRO NO WHATSAPP SERVICE ===');
      console.error('Error sending WhatsApp notification:', error);
      return false;
    }
  },

  /**
   * Test WhatsApp connection
   */
  testConnection: async (phoneNumber: string): Promise<boolean> => {
    try {
      return await testWhatsAppConnection(phoneNumber);
    } catch (error) {
      console.error('Error testing WhatsApp connection:', error);
      return false;
    }
  }
};
