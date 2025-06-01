
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
      console.log('=== INICIANDO ENVIO WHATSAPP ===');
      console.log('Template data recebido:', templateData);
      
      // Validar e garantir que todos os campos estão preenchidos
      const validatedData = {
        nome: templateData.nome?.trim() || 'Nome não informado',
        especialidade: templateData.especialidade?.trim() || 'Especialidade não informada',
        data: templateData.data?.trim() || 'Data não informada',
        horario: templateData.horario?.trim() || 'Horário não informado',
        local: templateData.local?.trim() || 'Local não informado',
        profissional: templateData.profissional?.trim() || 'Profissional não informado'
      };

      console.log('=== DADOS VALIDADOS ===');
      console.log('Nome:', `"${validatedData.nome}"`);
      console.log('Especialidade:', `"${validatedData.especialidade}"`);
      console.log('Data:', `"${validatedData.data}"`);
      console.log('Horário:', `"${validatedData.horario}"`);
      console.log('Local:', `"${validatedData.local}"`);
      console.log('Profissional:', `"${validatedData.profissional}"`);
      
      // WhatsApp Cloud API credentials
      const token = 'EAAVlloPc6eABO4tOWmbgl16kuG500Msz3fZAC46SK8TZBOAF8pQXwUC5Yjs5qrkQZCchzs6OQRoRcHSr7idDx99USb1jHA0Onv1PZAlpFlPbqlW8DdndZBJtR5fhMUj28GWrlTDQhgZCV3C9s6bPosVm0BByHAZBJHYNEi4MupOyyBdlNhKf4HjyWpjnluS3p5NAgZDZD';
      const phoneNumberId = '401831683009192';
      
      // Format phone number for WhatsApp
      let formattedPhone = templateData.telefone.replace(/\D/g, '');
      console.log('Telefone original:', templateData.telefone);
      console.log('Telefone após limpar:', formattedPhone);
      
      if (formattedPhone.startsWith('55')) {
        formattedPhone = formattedPhone.substring(2);
      }
      
      const finalPhone = `55${formattedPhone}`;
      console.log('Telefone final formatado:', finalPhone);
      
      // Criar parâmetros do template com validação individual
      const templateParameters = [
        { type: "text", text: validatedData.nome },
        { type: "text", text: validatedData.especialidade },
        { type: "text", text: validatedData.data },
        { type: "text", text: validatedData.horario },
        { type: "text", text: validatedData.local },
        { type: "text", text: validatedData.profissional }
      ];

      console.log('=== PARÂMETROS DO TEMPLATE ===');
      templateParameters.forEach((param, index) => {
        console.log(`Parâmetro ${index + 1}:`, JSON.stringify(param));
        if (!param.text || param.text.trim() === '') {
          console.warn(`⚠️ ALERTA: Parâmetro ${index + 1} está vazio!`);
        }
      });

      const payload = {
        messaging_product: "whatsapp",
        to: finalPhone,
        type: "template",
        template: {
          name: "notifica_agendamento",
          language: {
            code: "pt_BR"
          },
          components: [
            {
              type: "body",
              parameters: templateParameters
            }
          ]
        }
      };

      console.log('=== PAYLOAD COMPLETO ===');
      console.log(JSON.stringify(payload, null, 2));

      const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
      console.log('URL da API:', url);
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      console.log('=== ENVIANDO REQUISIÇÃO ===');
      
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
        
        // Log detalhado do erro
        if (data.error) {
          console.error('Tipo do erro:', data.error.type);
          console.error('Código do erro:', data.error.code);
          console.error('Mensagem do erro:', data.error.message);
          console.error('Detalhes do erro:', JSON.stringify(data.error.error_data || {}, null, 2));
          console.error('Trace ID:', data.error.fbtrace_id);
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
      
      return false;
    }
  }
};
