
import { WhatsAppTemplateData } from './types/whatsappTypes';
import { validateAndCleanTemplateData, createWhatsAppParameters, formatPhoneNumber } from './utils/whatsappUtils';
import { sendWhatsAppMessage } from './api/whatsappApi';
import { WhatsAppPayload } from './types/whatsappTypes';

export class WhatsAppService {
  /**
   * Send appointment notification via WhatsApp
   */
  static async sendAppointmentNotification(templateData: WhatsAppTemplateData): Promise<boolean> {
    try {
      console.log('=== INICIANDO ENVIO WHATSAPP ===');
      console.log('Template data recebido:', templateData);

      // Validate and clean data
      const cleanData = validateAndCleanTemplateData(templateData);
      
      // Format phone number
      const formattedPhone = formatPhoneNumber(cleanData.telefone);
      
      // Create parameters
      const parameters = createWhatsAppParameters(cleanData);

      // Create payload
      const payload: WhatsAppPayload = {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "template",
        template: {
          name: "notifica_agendamento",
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

      return await sendWhatsAppMessage(payload);
    } catch (error) {
      console.error('Error in WhatsAppService:', error);
      return false;
    }
  }
}
