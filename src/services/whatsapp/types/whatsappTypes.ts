
export interface WhatsAppTemplateData {
  nome: string;
  especialidade: string;
  data: string;
  horario: string;
  local: string;
  profissional: string;
  convenio: string;  // Adicionado o campo convênio
  telefone: string;
}

export interface WhatsAppParameter {
  type: "text";
  text: string;
}

export interface WhatsAppTemplate {
  name: string;
  language: {
    code: string;
  };
  components: Array<{
    type: "body";
    parameters: WhatsAppParameter[];
  }>;
}

export interface WhatsAppPayload {
  messaging_product: "whatsapp";
  to: string;
  type: "template";
  template: WhatsAppTemplate;
}

export interface WhatsAppApiError {
  error: {
    message: string;
    type: string;
    code: number;
    error_data?: {
      messaging_product: string;
      details: string;
    };
    fbtrace_id?: string;
  };
}
