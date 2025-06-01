
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
      
      // VERIFICAÇÃO CRÍTICA: Vamos testar com valores fixos e simples primeiro
      console.log('=== TESTE COM VALORES SIMPLES ===');
      
      const simpleParameters = [
        { type: "text", text: "João Silva" },
        { type: "text", text: "Cardiologia" },
        { type: "text", text: "15-06-2025" },
        { type: "text", text: "14:30" },
        { type: "text", text: "Clinica Central" },
        { type: "text", text: "Dr. Pedro Santos" }
      ];

      console.log('=== VALIDAÇÃO DOS PARÂMETROS SIMPLES ===');
      simpleParameters.forEach((param, index) => {
        console.log(`Parâmetro simples ${index + 1}:`, JSON.stringify(param));
        console.log(`  - Validação texto: "${param.text}"`);
        console.log(`  - Tem acentos: ${/[àáâãäéêëíîïóôõöúûüç]/i.test(param.text)}`);
        console.log(`  - Tem caracteres especiais: ${/[^\w\s\-.:]/i.test(param.text)}`);
        console.log(`  - Encoding UTF-8 válido: ${encodeURIComponent(param.text) === param.text ? 'não precisa' : 'precisa encoding'}`);
      });

      // Payload com template notifica_agendamento usando parâmetros simples
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
              parameters: simpleParameters
            }
          ]
        }
      };

      console.log('=== PAYLOAD COM PARÂMETROS SIMPLES ===');
      console.log('JSON completo do payload:');
      console.log(JSON.stringify(payload, null, 2));
      
      // Log estrutural detalhado
      console.log('=== ANÁLISE ESTRUTURAL DO PAYLOAD ===');
      console.log('messaging_product:', payload.messaging_product);
      console.log('to:', payload.to);
      console.log('type:', payload.type);
      console.log('template exists:', !!payload.template);
      console.log('template.name:', payload.template.name);
      console.log('template.language exists:', !!payload.template.language);
      console.log('template.language.code:', payload.template.language.code);
      console.log('template.components exists:', !!payload.template.components);
      console.log('template.components.length:', payload.template.components.length);
      console.log('first component type:', payload.template.components[0].type);
      console.log('first component parameters exists:', !!payload.template.components[0].parameters);
      console.log('parameters count:', payload.template.components[0].parameters.length);

      // URL da API do Facebook
      const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
      console.log('URL da API:', url);
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      console.log('=== ENVIANDO REQUISIÇÃO COM VALORES SIMPLES ===');
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
          
          // Se ainda der erro, vamos tentar sem acentos
          if (data.error.details && data.error.details.includes('Parameter name is missing or empty')) {
            console.log('=== TENTANDO SEM ACENTOS E CARACTERES ESPECIAIS ===');
            
            const cleanParameters = simpleParameters.map(param => ({
              type: "text",
              text: param.text
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove acentos
                .replace(/[^\w\s\-.:]/g, '') // Remove caracteres especiais
                .trim()
            }));
            
            console.log('Parâmetros sem acentos:', cleanParameters);
            
            const cleanPayload = {
              ...payload,
              template: {
                ...payload.template,
                components: [
                  {
                    type: "body",
                    parameters: cleanParameters
                  }
                ]
              }
            };
            
            console.log('=== TENTATIVA 2: PAYLOAD LIMPO ===');
            console.log(JSON.stringify(cleanPayload, null, 2));
            
            const response2 = await fetch(url, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(cleanPayload),
            });
            
            const data2 = await response2.json();
            console.log('=== RESPOSTA DA TENTATIVA 2 ===');
            console.log(JSON.stringify(data2, null, 2));
            
            if (response2.ok) {
              console.log('✅ SUCESSO COM PARÂMETROS LIMPOS!');
              return true;
            }
          }
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
