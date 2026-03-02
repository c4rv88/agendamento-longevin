import { AvailableSchedule } from '@/types/feegow';
import { feegowFetch } from './apiConfig';
import { getDateRange } from '@/utils/dateUtils';
import { processScheduleData } from './scheduleDataProcessor';

export const AvailableSchedulesService = {
  getAvailableSchedules: async (
    profissional_id: number, 
    unidade_id: number = 0, 
    especialidade_id: number = 0,
    convenio_id: number = 0
  ): Promise<AvailableSchedule[]> => {
    try {
      console.log('Fetching available schedules with filters:', { 
        profissional_id, unidade_id, especialidade_id, convenio_id 
      });
      
      if (!profissional_id) {
        console.error('Error: missing professional ID');
        return [];
      }
      
      const sanitizedProfessionalId = Number(profissional_id);
      const sanitizedUnityId = Number(unidade_id || 0);
      const sanitizedSpecialtyId = Number(especialidade_id || 0);
      const sanitizedInsuranceId = Number(convenio_id || 0);
      
      const dateRanges = [30, 60, 90];
      
      for (const days of dateRanges) {
        console.log(`Trying to fetch schedules for ${days} days...`);
        
        const { startDate, endDateStr } = getDateRange(2, days);
        console.log(`Date range for ${days} days:`, { startDate, endDateStr });
        
        let endpoint = `/api/appoints/available-schedule?`;
        endpoint += `tipo=P`;
        endpoint += `&procedimento_id=77`;
        endpoint += `&data_start=${startDate}`;
        endpoint += `&data_end=${endDateStr}`;
        endpoint += `&unidade_id=${sanitizedUnityId}`;
        endpoint += `&profissional_id=${sanitizedProfessionalId}`;
        endpoint += `&convenio_id=${sanitizedInsuranceId}`;
        
        if (sanitizedSpecialtyId > 0) {
          endpoint += `&especialidade_id=${sanitizedSpecialtyId}`;
        }
        
        console.log(`Schedule API endpoint for ${days} days:`, endpoint);
        
        const data = await feegowFetch(endpoint);
        console.log(`API response for ${days} days:`, data);
        
        if (data.success) {
          const schedules = processScheduleData(data, sanitizedProfessionalId, sanitizedUnityId);
          
          if (schedules.length > 0) {
            console.log(`Found ${schedules.length} schedules with ${days} days range`);
            return schedules;
          }
        }
        
        console.log(`No schedules found for ${days} days, trying next range...`);
      }
      
      console.log('No schedules found in any date range');
      return [];
      
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      return [];
    }
  }
};
