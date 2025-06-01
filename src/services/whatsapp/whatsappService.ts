
import { WhatsAppTemplateData } from './types/whatsappTypes';
import { validateAndCleanTemplateData, createWhatsAppParameters, formatPhoneNumber } from './utils/whatsappUtils';
import { sendWhatsAppMessage } from './api/whatsappApi';
import { WhatsAppPayload } from './types/whatsappTypes';

export class WhatsAppService {
  /**
   * Send appointment notification via WhatsApp using template "agendamento"
   */
  static async sendAppointmentNotification(templateData: WhatsAppTemplateData): Promise<boolean> {
    try {
      console.log('=== INICIANDO ENVIO WHATSAPP ===');
      console.log('Template data recebido:', templateData);

      // Validate and clean data
      const cleanData = validateAndCleanTemplateData(templateData);
      
      // Format phone number
      const formattedPhone = formatPhoneNumber(cleanData.telefone);
      
      // Create parameters for the new template with 7 variables
      const parameters = createWhatsAppParameters(cleanData);

      // Validate parameters before creating payload
      console.log('=== VALIDAÇÃO FINAL ANTES DO PAYLOAD ===');
      const invalidParams = parameters.filter(param => !param.text || param.text.trim() === '');
      if (invalidParams.length > 0) {
        console.error('🚨 PARÂMETROS INVÁLIDOS ENCONTRADOS:', invalidParams);
        throw new Error('Parâmetros inválidos detectados');
      }

      // Create payload with correct structure for template "agendamento"
      const payload: WhatsAppPayload = {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "template",
        template: {
          name: "agendamento",  // Nome do novo template
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

      console.log('=== PAYLOAD CRIADO PARA TEMPLATE "agendamento" ===');
      console.log('Estrutura do template:', {
        name: payload.template.name,
        language: payload.template.language.code,
        componentsCount: payload.template.components.length,
        parametersCount: payload.template.components[0].parameters.length
      });

      return await sendWhatsAppMessage(payload);
    } catch (error) {
      console.error('Error in WhatsAppService:', error);
      return false;
    }
  }
}
