
import { AvailableSchedule } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';
import { formatDateFromISO } from '@/utils/dateUtils';
import { processScheduleData } from './scheduleDataProcessor';

/**
 * Service for fetching daily schedule
 */
export const DailyScheduleService = {
  /**
   * Get available schedule for a specific date
   */
  getAvailableSchedule: async (
    profissional_id: number, 
    date: string,
    unidade_id?: number
  ): Promise<AvailableSchedule | null> => {
    try {
      // Convert date to dd-mm-YYYY if needed
      const formattedDate = date.includes('-') && date.split('-').length === 3 ? 
        formatDateFromISO(date) : date;
      
      // Build URL with parameters in the requested order
      let url = `${API_BASE_URL}/api/appoints/available-schedule?`;
      url += `tipo=P`;  // Uppercase P as requested
      url += `&procedimento_id=1`;
      
      // For daily schedule, use the date parameter instead of date_start/date_end
      url += `&date=${formattedDate}`;
      
      // Add unit ID if provided
      if (unidade_id) {
        url += `&unidade_id=${unidade_id}`;
      }
      
      // Add professional ID
      url += `&profissional_id=${profissional_id}`;
      
      console.log('Single day schedule request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('API response for single day schedule:', data);
      
      // Process the response
      const schedules = processScheduleData(data, profissional_id, unidade_id);
      let schedule = schedules.length > 0 ? schedules[0] : null;
      
      // Mock data for testing when API returns error
      if (!data.success && process.env.NODE_ENV !== 'production') {
        console.log('Using mock data for single day schedule because API returned error');
        return {
          date: formattedDate,
          times: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
          professional_id: profissional_id
        };
      }
      
      return schedule;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis para o dia:', error);
      return null;
    }
  }
};
