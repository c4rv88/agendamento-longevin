
import { AvailableSchedule } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const ScheduleService = {
  getAvailableSchedules: async (
    professionalId: number, 
    unityId?: number, 
    specialtyId?: number,
    insuranceId?: number
  ): Promise<AvailableSchedule[]> => {
    try {
      console.log('Fetching available schedules with filters:', { professionalId, unityId, specialtyId, insuranceId });
      
      // Format date as dd-mm-YYYY (dois dias após o dia atual)
      const today = new Date();
      today.setDate(today.getDate() + 2); // Add 2 days to current date
      const startDate = formatDate(today);
      
      // Format date as dd-mm-YYYY (30 days after start date)
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 30);
      const endDateStr = formatDate(endDate);
      
      // Build the URL with the required and optional parameters
      let url = `${API_BASE_URL}/api/appoints/available-schedule?professional_id=${professionalId}&tipo=p&procedimento_id=1&data_start=${startDate}&data_end=${endDateStr}`;
      
      if (unityId) {
        url += `&unidade_id=${unityId}`;
      }
      
      if (specialtyId) {
        url += `&especialidade_id=${specialtyId}`;
      }
      
      if (insuranceId) {
        url += `&convenio_id=${insuranceId}`;
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
      
      // Handle the new JSON structure
      if (Array.isArray(data) && data[0]?.success) {
        const content = data[0].content;
        const professionalData = content?.profissional_id?.[professionalId];
        
        if (professionalData) {
          const localData = professionalData.local_id || {};
          
          // Find the correct local_id data
          let datesAndTimes = {};
          if (unityId && localData[unityId]) {
            datesAndTimes = localData[unityId];
          } else {
            // If no specific unity is selected, use the first one
            const firstLocalId = Object.keys(localData)[0];
            if (firstLocalId) {
              datesAndTimes = localData[firstLocalId];
            }
          }
          
          // Transform dates and times into our format
          Object.entries(datesAndTimes).forEach(([date, times]) => {
            if (Array.isArray(times) && times.length > 0) {
              schedules.push({
                date: date,
                times: times as string[],
                professional_id: professionalId
              });
            }
          });
        }
      } else if (data.success && data.content) {
        // Handle the original JSON structure we were expecting before
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
      
      const url = `${API_BASE_URL}/api/appoints/available-schedule?professional_id=${professionalId}&date=${formattedDate}&tipo=p&procedimento_id=1`;
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
