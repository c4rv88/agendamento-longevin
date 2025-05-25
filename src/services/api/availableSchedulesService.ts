
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
   * Tries progressively: 30 days, then 60 days, then 90 days if no schedules found
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
      
      // Ensure all parameters are numbers and sanitize
      const sanitizedProfessionalId = Number(profissional_id);
      const sanitizedUnityId = Number(unidade_id || 0);
      const sanitizedSpecialtyId = Number(especialidade_id || 0);
      const sanitizedInsuranceId = Number(convenio_id || 0);
      
      // Try different date ranges progressively
      const dateRanges = [30, 60, 90];
      
      for (const days of dateRanges) {
        console.log(`Trying to fetch schedules for ${days} days...`);
        
        // Get date range (starting 2 days from today, ending X days later)
        const { startDate, endDateStr } = getDateRange(2, days);
        
        console.log(`Date range for ${days} days:`, { startDate, endDateStr });
        
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
        
        // Add specialty parameter
        if (sanitizedSpecialtyId > 0) {
          url += `&especialidade_id=${sanitizedSpecialtyId}`;
        }
        
        console.log(`Schedule API request URL for ${days} days:`, url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: apiHeaders,
        });
        
        const data = await response.json();
        console.log(`API response for ${days} days:`, data);
        
        // If API returns success and has schedules, process them
        if (data.success) {
          const schedules = processScheduleData(data, sanitizedProfessionalId, sanitizedUnityId);
          
          if (schedules.length > 0) {
            console.log(`Found ${schedules.length} schedules with ${days} days range`);
            return schedules;
          }
        }
        
        console.log(`No schedules found for ${days} days, trying next range...`);
      }
      
      // If no schedules found in any range, use mock data for testing
      console.log('No schedules found in any date range, using mock data');
      const today = new Date();
      today.setDate(today.getDate() + 2); // Add 2 days to current date
      return generateMockScheduleData(sanitizedProfessionalId, today);
      
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      return [];
    }
  }
};
