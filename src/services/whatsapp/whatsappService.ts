

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
      
      // TESTE: Vamos tentar com o template "hello_world" primeiro para verificar se o problema é o template
      console.log('=== TESTANDO COM TEMPLATE HELLO_WORLD ===');
      
      // Payload mais simples possível
      const payload = {
        messaging_product: "whatsapp",
        to: finalPhone,
        type: "template",
        template: {
          name: "hello_world",
          language: {
            code: "en_US"
          }
        }
      };

      console.log('=== PAYLOAD DE TESTE (HELLO_WORLD) ===');
      console.log('JSON completo do payload:');
      console.log(JSON.stringify(payload, null, 2));

      // URL da API do Facebook
      const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
      console.log('URL da API:', url);
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      console.log('=== ENVIANDO REQUISIÇÃO DE TESTE ===');
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

      console.log('=== TESTE HELLO_WORLD ENVIADO COM SUCESSO ===');
      console.log('Se o hello_world funcionou, o problema está no template customizado');
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

