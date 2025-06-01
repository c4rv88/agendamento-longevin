
import { API_BASE_URL, apiHeaders, getUnitIdByName } from './apiConfig';

export const AppointmentService = {
  createAppointment: async (appointmentData: any): Promise<boolean> => {
    try {
      // Format the date from YYYY-MM-DD to DD-MM-YYYY if needed
      let formattedData = { ...appointmentData };
      
      if (appointmentData.date) {
        // Verificar se a data está no formato YYYY-MM-DD
        if (appointmentData.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Converter de YYYY-MM-DD para DD-MM-YYYY
          const [year, month, day] = appointmentData.date.split('-');
          formattedData.date = `${day}-${month}-${year}`;
        }
        // Se já está em DD-MM-YYYY, manter como está
      }

      // Format time to H:i:s format (add seconds if missing)
      let formattedTime = appointmentData.time;
      if (formattedTime && !formattedTime.includes(':00', formattedTime.lastIndexOf(':'))) {
        // If time is in H:i format, add seconds
        formattedTime = formattedTime + ':00';
      }

      // Get the correct local_id based on unity name
      const localId = appointmentData.unity_name 
        ? getUnitIdByName(appointmentData.unity_name)
        : appointmentData.unity_id || 0;
      
      console.log('Creating appointment with data:', formattedData);
      console.log('Formatted time:', formattedTime);
      
      const requestBody = {
        local_id: localId,
        paciente_id: formattedData.patient_id,
        profissional_id: formattedData.professional_id,
        especialidade_id: formattedData.specialty_id,
        procedimento_id: 1, // Always 1 as specified
        data: formattedData.date,
        horario: formattedTime, // Now properly formatted with seconds
        valor: '0.00', // Always 0.00 as specified
        plano: 1, // Always 1 as specified
        convenio_id: formattedData.insurance_id || 0,
        notas: 'agende-isv', // As specified
        celular: formattedData.patient_phone?.replace(/\D/g, '') || ''
      };

      console.log('Sending appointment request with body:', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/api/appoints/new-appoint`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      console.log('Appointment creation response:', data);
      
      if (!response.ok) {
        console.error('API Error Response:', data);
        // Extrair a mensagem específica da API se disponível
        const errorMessage = data.content || data.message || `HTTP ${response.status}`;
        throw new Error(`API Error: ${JSON.stringify(data)}`);
      }
      
      // Verificar se a resposta indica sucesso, mesmo com status 200
      if (data.success === false) {
        console.error('API returned success:false:', data);
        // Lançar erro com a mensagem específica da API
        const errorMessage = data.content || data.message || 'Erro desconhecido da API';
        throw new Error(errorMessage);
      }
      
      return data.success;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      // Re-lançar o erro para que seja tratado corretamente no hook
      throw error;
    }
  }
};
