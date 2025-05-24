
import { AvailableSchedule } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const ScheduleService = {
  getAvailableSchedules: async (professionalId: number): Promise<AvailableSchedule[]> => {
    try {
      console.log('Fetching available schedules for professional ID:', professionalId);
      
      // Get current date in YYYY-MM-DD format
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      
      const url = `${API_BASE_URL}/api/appoints/available-schedule?professional_id=${professionalId}&date=${formattedDate}`;
      
      console.log('Request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('API response for available schedules:', data);
      
      if (!data.success) {
        console.error('API returned error:', data);
        return [];
      }
      
      // Transform the API response structure to get the next available dates and times
      const schedules: AvailableSchedule[] = [];
      
      if (data.content && Array.isArray(data.content)) {
        data.content.forEach((dateItem: any) => {
          if (dateItem.date && dateItem.horarios && dateItem.horarios.length > 0) {
            schedules.push({
              date: dateItem.date,
              times: dateItem.horarios,
              professional_id: professionalId
            });
          }
        });
      }
      
      console.log('Available schedules:', schedules);
      return schedules;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      return [];
    }
  },
  
  getAvailableSchedule: async (professionalId: number, date: string): Promise<AvailableSchedule | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appoints/available-schedule?professional_id=${professionalId}&date=${date}`, {
        method: 'GET',
        headers: apiHeaders,
      });
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      return null;
    }
  }
};
