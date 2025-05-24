
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
      console.log('Fetching available schedules with filters:', { 
        profissional_id, 
        unidade_id, 
        especialidade_id, 
        convenio_id 
      });
      
      if (!profissional_id) {
        console.error('Error: missing professional ID');
        return [];
      }
      
      // Get date range (starting 2 days from today, ending 30 days later)
      const { startDate, endDateStr } = getDateRange(2, 30);
      
      console.log('Date range for schedule search:', { startDate, endDateStr });
      
      // Ensure all parameters are numbers and sanitize
      const sanitizedProfessionalId = Number(profissional_id);
      const sanitizedUnityId = Number(unidade_id || 0);
      const sanitizedSpecialtyId = Number(especialidade_id || 0);
      const sanitizedInsuranceId = Number(convenio_id || 0);
      
      // Build the URL with the required parameters in the specified order
      let url = `${API_BASE_URL}/api/appoints/available-schedule?`;
      
      // Params in the requested order
      url += `tipo=P`;  // Uppercase P as requested
      url += `&procedimento_id=1`;
      url += `&data_start=${startDate}`;
      url += `&data_end=${endDateStr}`;
      url += `&unidade_id=${sanitizedUnityId}`;
      url += `&profissional_id=${sanitizedProfessionalId}`;
      url += `&convenio_id=${sanitizedInsuranceId}`;
      
      // Add specialty parameter (wasn't in the specified order but still needed)
      if (sanitizedSpecialtyId > 0) {
        url += `&especialidade_id=${sanitizedSpecialtyId}`;
      }
      
      console.log('Schedule API request URL:', url);
      
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
        return generateMockScheduleData(sanitizedProfessionalId, today);
      }
      
      // Process the API response
      const schedules = processScheduleData(data, sanitizedProfessionalId, sanitizedUnityId);
      
      console.log('Available schedules processed:', schedules);
      return schedules;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      return [];
    }
  }
};
