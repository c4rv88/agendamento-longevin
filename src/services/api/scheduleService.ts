
import { AvailableSchedule } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const ScheduleService = {
  getAvailableSchedules: async (
    professionalId: number, 
    unityId?: number, 
    specialtyId?: number
  ): Promise<AvailableSchedule[]> => {
    try {
      console.log('Fetching available schedules with filters:', { professionalId, unityId, specialtyId });
      
      // Format date as dd-mm-YYYY (today)
      const today = new Date();
      const startDate = formatDate(today);
      
      // Format date as dd-mm-YYYY (3 months from now)
      const endDate = new Date();
      endDate.setMonth(today.getMonth() + 3);
      const endDateStr = formatDate(endDate);
      
      // Build the URL with the required and optional parameters
      let url = `${API_BASE_URL}/api/appoints/available-schedule?professional_id=${professionalId}&tipo=A&data_start=${startDate}&data_end=${endDateStr}`;
      
      if (unityId) {
        url += `&unity_id=${unityId}`;
      }
      
      if (specialtyId) {
        url += `&specialty_id=${specialtyId}`;
      }
      
      console.log('Schedule request URL:', url);
      
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
      
      // Transform the API response structure to get the available dates and times
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
      
      console.log('Available schedules processed:', schedules);
      return schedules;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      return [];
    }
  },
  
  getAvailableSchedule: async (professionalId: number, date: string): Promise<AvailableSchedule | null> => {
    try {
      // Convert date to dd-mm-YYYY if needed
      const formattedDate = date.includes('-') && date.split('-').length === 3 ? 
        formatDateFromISO(date) : date;
      
      const url = `${API_BASE_URL}/api/appoints/available-schedule?professional_id=${professionalId}&date=${formattedDate}&tipo=A`;
      console.log('Single day schedule request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('API response for single day schedule:', data);
      
      return data.success && data.data ? data.data : null;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis para o dia:', error);
      return null;
    }
  }
};

// Helper function to format date as dd-mm-YYYY
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper function to convert from ISO format (YYYY-MM-DD) to dd-mm-YYYY
const formatDateFromISO = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`;
};
