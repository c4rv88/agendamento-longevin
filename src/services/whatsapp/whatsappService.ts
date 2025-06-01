
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
      
      // Log dos dados originais ANTES de qualquer processamento
      console.log('=== DADOS ORIGINAIS RECEBIDOS ===');
      console.log('Nome original:', JSON.stringify(templateData.nome));
      console.log('Especialidade original:', JSON.stringify(templateData.especialidade));
      console.log('Data original:', JSON.stringify(templateData.data));
      console.log('Horário original:', JSON.stringify(templateData.horario));
      console.log('Local original:', JSON.stringify(templateData.local));
      console.log('Profissional original:', JSON.stringify(templateData.profissional));
      console.log('Telefone original:', JSON.stringify(templateData.telefone));
      
      // Função para converter data para formato DD-MM-YYYY
      const formatDateToBrazilian = (dateString: string): string => {
        if (!dateString) return '01-01-2024';
        
        // Se já está no formato DD-MM-YYYY, retornar como está
        if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
          console.log('Data já no formato correto DD-MM-YYYY:', dateString);
          return dateString;
        }
        
        // Se está no formato YYYY-MM-DD, converter para DD-MM-YYYY
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month, day] = dateString.split('-');
          const brazilianDate = `${day}-${month}-${year}`;
          console.log(`Convertendo data de ${dateString} para ${brazilianDate}`);
          return brazilianDate;
        }
        
        // Se está no formato DD/MM/YYYY, converter para DD-MM-YYYY
        if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          const converted = dateString.replace(/\//g, '-');
          console.log(`Convertendo data de ${dateString} para ${converted}`);
          return converted;
        }
        
        console.error('Formato de data não reconhecido:', dateString);
        return '01-01-2024'; // Fallback
      };
      
      // Validar e garantir que TODOS os campos tenham valores não vazios e válidos
      const cleanData = {
        nome: String(templateData.nome || 'Paciente').trim() || 'Paciente',
        especialidade: String(templateData.especialidade || 'Consulta').trim() || 'Consulta',
        data: formatDateToBrazilian(String(templateData.data || '01-01-2024').trim()),
        horario: String(templateData.horario || '09:00').trim() || '09:00',
        local: String(templateData.local || 'Clinica').trim() || 'Clinica',
        profissional: String(templateData.profissional || 'Medico').trim() || 'Medico',
        telefone: String(templateData.telefone || '').replace(/\D/g, '')
      };

      console.log('=== DADOS LIMPOS E VALIDADOS ===');
      Object.entries(cleanData).forEach(([key, value]) => {
        console.log(`${key}:`, typeof value, `"${value}"`, `length: ${value.length}`);
        if (key !== 'telefone' && (!value || value.trim() === '' || value.length === 0)) {
          console.error(`🚨 CAMPO VAZIO DETECTADO: ${key} = "${value}"`);
        }
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
      
      // Criar parâmetros do template - AGORA COM DATA NO FORMATO CORRETO
      const bodyParameters = [
        { type: "text", text: cleanData.nome },
        { type: "text", text: cleanData.especialidade },
        { type: "text", text: cleanData.data }, // AGORA GARANTIDAMENTE DD-MM-YYYY
        { type: "text", text: cleanData.horario },
        { type: "text", text: cleanData.local },
        { type: "text", text: cleanData.profissional }
      ];

      console.log('=== VALIDAÇÃO FINAL DOS PARÂMETROS ===');
      let hasEmptyParameter = false;
      bodyParameters.forEach((param, index) => {
        console.log(`Parâmetro ${index + 1}:`, JSON.stringify(param));
        console.log(`  - Tipo: ${param.type}`);
        console.log(`  - Texto: "${param.text}"`);
        console.log(`  - Comprimento: ${param.text.length}`);
        console.log(`  - É string: ${typeof param.text === 'string'}`);
        console.log(`  - Está vazio: ${!param.text || param.text.trim() === ''}`);
        
        if (!param.text || typeof param.text !== 'string' || param.text.trim() === '' || param.text.length === 0) {
          console.error(`🚨 ERRO CRÍTICO: Parâmetro ${index + 1} está vazio ou inválido!`, param);
          hasEmptyParameter = true;
        }
      });

      if (hasEmptyParameter) {
        console.error('🚨 ABORTANDO ENVIO - PARÂMETROS VAZIOS DETECTADOS');
        return false;
      }

      // Payload com estrutura mínima - TESTE COM TEMPLATE NAME EXATO
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
              parameters: bodyParameters
            }
          ]
        }
      };

      console.log('=== PAYLOAD FINAL PARA ENVIO ===');
      console.log('JSON completo do payload:');
      console.log(JSON.stringify(payload, null, 2));
      
      // Log específico do template
      console.log('=== DETALHES DO TEMPLATE ===');
      console.log('Nome do template:', payload.template.name);
      console.log('Código do idioma:', payload.template.language.code);
      console.log('Número de componentes:', payload.template.components.length);
      console.log('Tipo do primeiro componente:', payload.template.components[0].type);
      console.log('Número de parâmetros no body:', payload.template.components[0].parameters.length);

      // URL da API do Facebook
      const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
      console.log('URL da API:', url);
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      console.log('=== ENVIANDO REQUISIÇÃO ===');
      console.log('Headers:', headers);
      
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
