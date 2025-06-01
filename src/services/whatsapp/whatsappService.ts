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
      
      // Validar e garantir que TODOS os campos tenham valores não vazios
      const cleanData = {
        nome: (templateData.nome || 'Paciente').trim() || 'Paciente',
        especialidade: (templateData.especialidade || 'Consulta').trim() || 'Consulta',
        data: (templateData.data || '01-01-2024').trim() || '01-01-2024',
        horario: (templateData.horario || '09:00').trim() || '09:00',
        local: (templateData.local || 'Clínica').trim() || 'Clínica',
        profissional: (templateData.profissional || 'Médico').trim() || 'Médico',
        telefone: String(templateData.telefone || '').replace(/\D/g, '')
      };

      console.log('=== DADOS LIMPOS E VALIDADOS ===');
      Object.entries(cleanData).forEach(([key, value]) => {
        console.log(`${key}:`, typeof value, `"${value}"`, value.length, 'chars');
      });

      // Verificar telefone
      if (!cleanData.telefone || cleanData.telefone.length < 10) {
        console.error('🚨 TELEFONE INVÁLIDO:', cleanData.telefone);
        return false;
      }

      // WhatsApp Cloud API credentials
      const token = 'EAAVlloPc6eABO4tOWmbgl16kuG500Msz3fZAC46SK8TZBOAF8pQXwUC5Yjs5qrkQZCchzs6OQRoRcHSr7idDx99USb1jHA0Onv1PZAlpFlPbqlW8DdndZBJtR5fhMUj28GWrlTDQhgZCV3C9s6bPosVm0BByHAZBJHYNEi4MupOyyBdlNhKf4HjyWpjnluS3p5NAgZDZD';
      const phoneNumberId = '401831683009192';
      
      // Format phone number for WhatsApp
      let formattedPhone = cleanData.telefone;
      console.log('Telefone original:', templateData.telefone);
      console.log('Telefone após limpar:', formattedPhone);
      
      if (formattedPhone.startsWith('55')) {
        formattedPhone = formattedPhone.substring(2);
      }
      
      const finalPhone = `55${formattedPhone}`;
      console.log('Telefone final formatado:', finalPhone);
      
      // Criar parâmetros do template com validação EXTRA
      const templateParameters = [
        { type: "text", text: cleanData.nome },
        { type: "text", text: cleanData.especialidade },
        { type: "text", text: cleanData.data },
        { type: "text", text: cleanData.horario },
        { type: "text", text: cleanData.local },
        { type: "text", text: cleanData.profissional }
      ];

      console.log('=== PARÂMETROS FINAIS DO TEMPLATE ===');
      templateParameters.forEach((param, index) => {
        console.log(`Parâmetro ${index + 1}:`, JSON.stringify(param));
        if (!param.text || param.text.length === 0) {
          console.error(`🚨 ERRO CRÍTICO: Parâmetro ${index + 1} está vazio!`);
          throw new Error(`Parâmetro ${index + 1} não pode estar vazio`);
        }
      });

      // Payload simplificado - REMOVENDO o botão que pode estar causando o erro
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

      console.log('=== PAYLOAD SIMPLIFICADO (SEM BOTÃO) ===');
      console.log(JSON.stringify(payload, null, 2));

      // URL atualizada para v22.0
      const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
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
