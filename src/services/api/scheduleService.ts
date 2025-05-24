
import { AvailableSchedule } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const ScheduleService = {
  getAvailableSchedules: async (
    profissional_id: number, 
    unidade_id?: number, 
    especialidade_id?: number,
    convenio_id?: number
  ): Promise<AvailableSchedule[]> => {
    try {
      console.log('Fetching available schedules with filters:', { profissional_id, unidade_id, especialidade_id, convenio_id });
      
      // Format date as dd-mm-YYYY (dois dias após o dia atual)
      const today = new Date();
      today.setDate(today.getDate() + 2); // Add 2 days to current date
      const startDate = formatDate(today);
      
      // Format date as dd-mm-YYYY (30 days after start date)
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 30);
      const endDateStr = formatDate(endDate);
      
      // Build the URL with the required and optional parameters
      let url = `${API_BASE_URL}/api/appoints/available-schedule?profissional_id=${profissional_id}&tipo=p&procedimento_id=1&data_start=${startDate}&data_end=${endDateStr}`;
      
      // Only add unidade_id if it's provided and greater than 0
      if (unidade_id && unidade_id > 0) {
        url += `&unidade_id=${unidade_id}`;
      }
      
      // Only add especialidade_id if it's provided and greater than 0
      if (especialidade_id && especialidade_id > 0) {
        url += `&especialidade_id=${especialidade_id}`;
      }
      
      // Only add convenio_id if it's provided and greater than 0
      if (convenio_id && convenio_id > 0) {
        url += `&convenio_id=${convenio_id}`;
      }
      
      console.log('Schedule request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('API response for available schedules:', data);
      
      // Mock data for testing when API returns error
      if (!data.success && process.env.NODE_ENV !== 'production') {
        console.log('Using mock data because API returned error');
        return [
          {
            date: formatDate(new Date(today)),
            times: ['08:00', '09:00', '10:00', '14:00', '15:00'],
            professional_id: profissional_id
          },
          {
            date: formatDate(new Date(today.setDate(today.getDate() + 1))),
            times: ['08:30', '09:30', '14:30', '15:30'],
            professional_id: profissional_id
          },
          {
            date: formatDate(new Date(today.setDate(today.getDate() + 1))),
            times: ['10:00', '11:00', '13:00', '16:00'],
            professional_id: profissional_id
          }
        ];
      }
      
      // Transform the API response structure to get the available dates and times
      const schedules: AvailableSchedule[] = [];
      
      if (data.success) {
        if (data.content && Array.isArray(data.content)) {
          // Handle the simple array format
          data.content.forEach((dateItem: any) => {
            if (dateItem.date && dateItem.horarios && dateItem.horarios.length > 0) {
              schedules.push({
                date: dateItem.date,
                times: dateItem.horarios,
                professional_id: profissional_id
              });
            }
          });
        } else if (data.content && data.content.profissional_id) {
          // Handle the nested format with profissional_id
          const profKeys = Object.keys(data.content.profissional_id);
          if (profKeys.length > 0) {
            const profData = data.content.profissional_id[profKeys[0]];
            if (profData && profData.local_id) {
              const localKeys = Object.keys(profData.local_id);
              if (localKeys.length > 0) {
                const localId = unidade_id && profData.local_id[unidade_id] 
                  ? unidade_id 
                  : localKeys[0];
                const localData = profData.local_id[localId];
                
                // Get dates and times from localData
                for (const [date, times] of Object.entries(localData)) {
                  if (Array.isArray(times) && times.length > 0) {
                    schedules.push({
                      date,
                      times: times as string[],
                      professional_id: profissional_id
                    });
                  }
                }
              }
            }
          }
        }
      }
      
      console.log('Available schedules processed:', schedules);
      return schedules;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      return [];
    }
  },
  
  getAvailableSchedule: async (
    profissional_id: number, 
    date: string,
    unidade_id?: number // Add unidade_id parameter
  ): Promise<AvailableSchedule | null> => {
    try {
      // Convert date to dd-mm-YYYY if needed
      const formattedDate = date.includes('-') && date.split('-').length === 3 ? 
        formatDateFromISO(date) : date;
      
      const url = `${API_BASE_URL}/api/appoints/available-schedule?profissional_id=${profissional_id}&date=${formattedDate}&tipo=p&procedimento_id=1`;
      console.log('Single day schedule request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('API response for single day schedule:', data);
      
      // Process the response similar to getAvailableSchedules
      let schedule: AvailableSchedule | null = null;
      
      if (data.success) {
        // Process based on same logic as getAvailableSchedules
        if (data.content && Array.isArray(data.content)) {
          data.content.forEach((dateItem: any) => {
            if (dateItem.date && dateItem.horarios && dateItem.horarios.length > 0) {
              schedule = {
                date: dateItem.date,
                times: dateItem.horarios,
                professional_id: profissional_id
              };
            }
          });
        } else if (data.content && data.content.profissional_id) {
          const profKeys = Object.keys(data.content.profissional_id);
          if (profKeys.length > 0) {
            const profData = data.content.profissional_id[profKeys[0]];
            if (profData && profData.local_id) {
              const localKeys = Object.keys(profData.local_id);
              if (localKeys.length > 0) {
                // Use the provided unidade_id or default to the first available local
                const localId = unidade_id && profData.local_id[unidade_id] 
                  ? unidade_id 
                  : localKeys[0];
                const localData = profData.local_id[localId];
                
                // Get dates and times from localData
                for (const [date, times] of Object.entries(localData)) {
                  if (Array.isArray(times) && times.length > 0) {
                    schedule = {
                      date,
                      times: times as string[],
                      professional_id: profissional_id
                    };
                  }
                }
              }
            }
          }
        }
      } else {
        // Mock data for testing when API returns error
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
