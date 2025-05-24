
import { AvailableSchedule } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';
import { getDateRange, formatDateFromISO } from '@/utils/dateUtils';
import { processScheduleData, generateMockScheduleData } from './scheduleDataProcessor';

/**
 * Service for fetching available schedules
 */
export const AvailableSchedulesService = {
  /**
   * Get available schedules for a professional with optional filters
   */
  getAvailableSchedules: async (
    profissional_id: number, 
    unidade_id: number = 0, 
    especialidade_id: number = 0,
    convenio_id: number = 0
  ): Promise<AvailableSchedule[]> => {
    try {
      console.log('Fetching available schedules with filters:', { profissional_id, unidade_id, especialidade_id, convenio_id });
      
      // Get date range (starting 2 days from today, ending 60 days later)
      const { startDate, endDateStr } = getDateRange(2, 60);
      
      console.log('Date range:', { startDate, endDateStr });
      
      // Build the URL with the required and optional parameters
      let url = `${API_BASE_URL}/api/appoints/available-schedule?profissional_id=${profissional_id}&tipo=p&procedimento_id=1&data_start=${startDate}&data_end=${endDateStr}`;
      
      // Adicionando os parâmetros mesmo quando são zero para manter consistência
      url += `&unidade_id=${unidade_id}`;
      url += `&especialidade_id=${especialidade_id}`;
      url += `&convenio_id=${convenio_id}`;
      
      console.log('Schedule request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('API response for available schedules:', data);
      
      // Mock data for testing when API returns error
      if (!data.success) {
        console.log('Using mock data because API returned error');
        const today = new Date();
        today.setDate(today.getDate() + 2); // Add 2 days to current date
        return generateMockScheduleData(profissional_id, today);
      }
      
      // Process the API response
      const schedules = processScheduleData(data, profissional_id, unidade_id);
      
      console.log('Available schedules processed:', schedules);
      return schedules;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      return [];
    }
  }
};
