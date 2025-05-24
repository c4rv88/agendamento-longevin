
import { AvailableSchedule } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const ScheduleService = {
  getAvailableSchedules: async (professionalId: number): Promise<AvailableSchedule[]> => {
    try {
      console.log('Fetching available schedules for professional ID:', professionalId);
      
      // Get date 2 days from now in YYYY-MM-DD format
      const today = new Date();
      today.setDate(today.getDate() + 2);
      const startDate = today.toISOString().split('T')[0];
      
      // Get date 30 days from the start date
      const endDate = new Date();
      endDate.setDate(today.getDate() + 30);
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const url = `${API_BASE_URL}/api/appoints/available-schedule?professional_id=${professionalId}&tipo=A&data_start=${startDate}&data_end=${endDateStr}`;
      
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
      const response = await fetch(`${API_BASE_URL}/api/appoints/available-schedule?professional_id=${professionalId}&date=${date}&tipo=A`, {
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
