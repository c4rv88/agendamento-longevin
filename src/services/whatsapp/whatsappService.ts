
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
      
      // Validar rigorosamente cada campo
      const cleanData = {
        nome: String(templateData.nome || '').trim(),
        especialidade: String(templateData.especialidade || '').trim(),
        data: String(templateData.data || '').trim(),
        horario: String(templateData.horario || '').trim(),
        local: String(templateData.local || '').trim(),
        profissional: String(templateData.profissional || '').trim(),
        telefone: String(templateData.telefone || '').replace(/\D/g, '')
      };

      console.log('=== DADOS LIMPOS ===');
      Object.entries(cleanData).forEach(([key, value]) => {
        console.log(`${key}:`, typeof value, `"${value}"`, value.length, 'chars');
        if (key !== 'telefone' && (!value || value.length === 0)) {
          console.error(`🚨 CAMPO VAZIO DETECTADO: ${key}`);
        }
      });

      // Se qualquer campo obrigatório estiver vazio, usar valores padrão
      const safeData = {
        nome: cleanData.nome || 'Paciente',
        especialidade: cleanData.especialidade || 'Consulta',
        data: cleanData.data || new Date().toLocaleDateString('pt-BR'),
        horario: cleanData.horario || '00:00',
        local: cleanData.local || 'Clínica',
        profissional: cleanData.profissional || 'Médico'
      };

      console.log('=== DADOS SEGUROS PARA ENVIO ===');
      Object.entries(safeData).forEach(([key, value]) => {
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
      
      // Criar parâmetros do template garantindo que NUNCA estejam vazios
      const templateParameters = [
        { type: "text", text: safeData.nome },
        { type: "text", text: safeData.especialidade },
        { type: "text", text: safeData.data },
        { type: "text", text: safeData.horario },
        { type: "text", text: safeData.local },
        { type: "text", text: safeData.profissional }
      ];

      console.log('=== PARÂMETROS FINAIS DO TEMPLATE ===');
      templateParameters.forEach((param, index) => {
        console.log(`Parâmetro ${index + 1}:`, JSON.stringify(param));
        if (!param.text || param.text.trim() === '') {
          console.error(`🚨 ERRO: Parâmetro ${index + 1} ainda está vazio após processamento!`);
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
