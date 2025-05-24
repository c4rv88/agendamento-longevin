
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const AppointmentService = {
  createAppointment: async (appointmentData: any): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appoints/new-appoint`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(appointmentData),
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return false;
    }
  }
};
