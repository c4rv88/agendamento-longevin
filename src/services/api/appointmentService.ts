
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const AppointmentService = {
  createAppointment: async (appointmentData: any): Promise<boolean> => {
    try {
      // Format the date from YYYY-MM-DD to DD-MM-YYYY if needed
      let formattedData = { ...appointmentData };
      
      if (appointmentData.date && appointmentData.date.includes('-') && appointmentData.date.split('-')[0].length === 4) {
        const [year, month, day] = appointmentData.date.split('-');
        formattedData.date = `${day}-${month}-${year}`;
      }
      
      console.log('Creating appointment with data:', formattedData);
      
      const response = await fetch(`${API_BASE_URL}/api/appoints/new-appoint`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify({
          local_id: formattedData.unity_id,
          paciente_id: formattedData.patient.patient_id,
          profissional_id: formattedData.professional_id,
          especialidade_id: formattedData.specialty_id,
          procedimento_id: 2, // ID for consultation
          data: formattedData.date,
          hora: formattedData.time,
          convenio_id: formattedData.insurance_id || null,
          celular: formattedData.patient.patient_phone?.replace(/\D/g, '')
        }),
      });
      
      const data = await response.json();
      console.log('Appointment creation response:', data);
      return data.success;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return false;
    }
  }
};
