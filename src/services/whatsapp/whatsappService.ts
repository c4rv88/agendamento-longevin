
interface WhatsAppTemplateData {
  nome: string;
  especialidade: string;
  data: string;
  horario: string;
  local: string;
  profissional: string;
  telefone: string;
}

export const WhatsAppService = {
  sendAppointmentNotification: async (templateData: WhatsAppTemplateData): Promise<boolean> => {
    try {
      // WhatsApp Cloud API credentials (securely stored)
      const token = 'EAAVlloPc6eABO4tOWmbgl16kuG500Msz3fZAC46SK8TZBOAF8pQXwUC5Yjs5qrkQZCchzs6OQRoRcHSr7idDx99USb1jHA0Onv1PZAlpFlPbqlW8DdndZBJtR5fhMUj28GWrlTDQhgZCV3C9s6bPosVm0BByHAZBJHYNEi4MupOyyBdlNhKf4HjyWpjnluS3p5NAgZDZD';
      const phoneNumberId = '401831683009192';
      
      // Format phone number for WhatsApp (remove country code if present)
      let formattedPhone = templateData.telefone.replace(/\D/g, '');
      if (formattedPhone.startsWith('55')) {
        formattedPhone = formattedPhone.substring(2);
      }
      
      const payload = {
        messaging_product: "whatsapp",
        to: `55${formattedPhone}`,
        type: "template",
        template: {
          name: "notifica_agendamento",
          language: {
            code: "pt_BR"
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: templateData.nome
                },
                {
                  type: "text",
                  text: templateData.especialidade
                },
                {
                  type: "text",
                  text: templateData.data
                },
                {
                  type: "text",
                  text: templateData.horario
                },
                {
                  type: "text",
                  text: templateData.local
                },
                {
                  type: "text",
                  text: templateData.profissional
                }
              ]
            },
            {
              type: "button",
              sub_type: "quick_reply",
              index: 0,
              parameters: [
                {
                  type: "payload",
                  payload: "Finalizar Atendimento"
                }
              ]
            }
          ]
        }
      };

      console.log('Sending WhatsApp notification with payload:', payload);

      const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('WhatsApp API response:', data);

      if (!response.ok) {
        console.error('WhatsApp API Error:', data);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      return false;
    }
  }
};
