import { feegowFetch } from './apiConfig';
import { ProcedureService } from './procedureService';

export const AppointmentService = {
  createAppointment: async (appointmentData: any): Promise<boolean> => {
    try {
      let formattedData = { ...appointmentData };
      
      if (appointmentData.date) {
        if (appointmentData.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month, day] = appointmentData.date.split('-');
          formattedData.date = `${day}-${month}-${year}`;
        }
      }

      let formattedTime = appointmentData.time;
      if (formattedTime && !formattedTime.includes(':00', formattedTime.lastIndexOf(':'))) {
        formattedTime = formattedTime + ':00';
      }

      // Dynamically resolve procedimento_id based on specialty
      const specialtyId = formattedData.specialty_id;
      let procedimentoId = await ProcedureService.getProcedureIdForSpecialty(specialtyId);
      
      if (!procedimentoId) {
        console.warn('Could not resolve procedimento_id, falling back to 8');
        procedimentoId = 8;
      }

      console.log('Creating appointment with data:', formattedData);
      console.log('Resolved procedimento_id:', procedimentoId);
      
      const requestBody = {
        local_id: 13,
        paciente_id: formattedData.patient_id,
        profissional_id: formattedData.professional_id,
        especialidade_id: formattedData.specialty_id,
        procedimento_id: procedimentoId,
        data: formattedData.date,
        horario: formattedTime,
        valor: '0.00',
        plano: 1,
        convenio_id: formattedData.insurance_id || 0,
        notas: 'agende-Longevin',
        canal_id: 1,
        celular: formattedData.patient_phone?.replace(/\D/g, '') || ''
      };

      console.log('Sending appointment request with body:', requestBody);
      
      const data = await feegowFetch('/api/appoints/new-appoint', 'POST', requestBody);
      console.log('Appointment creation response:', data);
      
      if (data.success === false) {
        console.error('API returned success:false:', data);
        const errorMessage = data.content || data.message || 'Erro desconhecido da API';
        throw new Error(errorMessage);
      }
      
      return data.success;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  }
};
