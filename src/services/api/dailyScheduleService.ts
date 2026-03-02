import { AvailableSchedule } from '@/types/feegow';
import { feegowFetch } from './apiConfig';
import { formatDateFromISO } from '@/utils/dateUtils';
import { processScheduleData } from './scheduleDataProcessor';

export const DailyScheduleService = {
  getAvailableSchedule: async (
    profissional_id: number, 
    date: string,
    unidade_id?: number
  ): Promise<AvailableSchedule | null> => {
    try {
      const formattedDate = date.includes('-') && date.split('-').length === 3 ? 
        formatDateFromISO(date) : date;
      
      let endpoint = `/api/appoints/available-schedule?`;
      endpoint += `tipo=P`;
      endpoint += `&procedimento_id=77`;
      endpoint += `&date=${formattedDate}`;
      
      if (unidade_id) {
        endpoint += `&unidade_id=${unidade_id}`;
      }
      
      endpoint += `&profissional_id=${profissional_id}`;
      
      console.log('Single day schedule request endpoint:', endpoint);
      
      const data = await feegowFetch(endpoint);
      console.log('API response for single day schedule:', data);
      
      const schedules = processScheduleData(data, profissional_id, unidade_id);
      let schedule = schedules.length > 0 ? schedules[0] : null;
      
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
