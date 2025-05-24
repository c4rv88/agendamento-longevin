
import { AvailableSchedule } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const ScheduleService = {
  getAvailableSchedules: async (
    profissionalId: number, 
    unidadeId?: number, 
    especialidadeId?: number,
    convenioId?: number
  ): Promise<AvailableSchedule[]> => {
    try {
      console.log('Fetching available schedules with filters:', { profissionalId, unidadeId, especialidadeId, convenioId });
      
      // Format date as dd-mm-YYYY (dois dias após o dia atual)
      const today = new Date();
      today.setDate(today.getDate() + 2); // Add 2 days to current date
      const startDate = formatDate(today);
      
      // Format date as dd-mm-YYYY (30 days after start date)
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 30);
      const endDateStr = formatDate(endDate);
      
      // Build the URL with the required and optional parameters
      let url = `${API_BASE_URL}/api/appoints/available-schedule?profissional_id=${profissionalId}&tipo=p&procedimento_id=1&data_start=${startDate}&data_end=${endDateStr}`;
      
      if (unidadeId && unidadeId > 0) {
        url += `&unidade_id=${unidadeId}`;
      }
      
      if (especialidadeId && especialidadeId > 0) {
        url += `&especialidade_id=${especialidadeId}`;
      }
      
      if (convenioId && convenioId > 0) {
        url += `&convenio_id=${convenioId}`;
      }
      
      console.log('Schedule request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('API response for available schedules:', data);
      
      // Transform the API response structure to get the available dates and times
      const schedules: AvailableSchedule[] = [];
      
      // Check if data is an array with success property
      if (Array.isArray(data) && data[0]?.success) {
        const content = data[0].content;
        
        // Handle the nested structure with profissional_id
        if (content && content.profissional_id) {
          // Get the professional data using the professionalId as key or first available
          const professionalDataKey = Object.keys(content.profissional_id)[0];
          const professionalData = content.profissional_id[professionalDataKey];
          
          if (professionalData && professionalData.local_id) {
            // Get local_id data - either for specific unidadeId or first available
            const localDataKeys = Object.keys(professionalData.local_id);
            let localData = null;
            
            if (unidadeId && professionalData.local_id[unidadeId]) {
              localData = professionalData.local_id[unidadeId];
            } else if (localDataKeys.length > 0) {
              // Use the first available local_id if no specific unidadeId is requested
              localData = professionalData.local_id[localDataKeys[0]];
            }
            
            // Transform dates and times into our format
            if (localData) {
              Object.entries(localData).forEach(([date, times]) => {
                if (Array.isArray(times) && times.length > 0) {
                  schedules.push({
                    date: date,
                    times: times as string[],
                    professional_id: parseInt(professionalDataKey, 10)
                  });
                }
              });
            }
          }
        }
      } else if (!Array.isArray(data) && data.success && data.content) {
        // Handle the original JSON structure
        if (Array.isArray(data.content)) {
          data.content.forEach((dateItem: any) => {
            if (dateItem.date && dateItem.horarios && dateItem.horarios.length > 0) {
              schedules.push({
                date: dateItem.date,
                times: dateItem.horarios,
                professional_id: profissionalId
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
  
  getAvailableSchedule: async (profissionalId: number, date: string): Promise<AvailableSchedule | null> => {
    try {
      // Convert date to dd-mm-YYYY if needed
      const formattedDate = date.includes('-') && date.split('-').length === 3 ? 
        formatDateFromISO(date) : date;
      
      const url = `${API_BASE_URL}/api/appoints/available-schedule?profissional_id=${profissionalId}&date=${formattedDate}&tipo=p&procedimento_id=1`;
      console.log('Single day schedule request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('API response for single day schedule:', data);
      
      // Process the response similar to getAvailableSchedules
      let schedule: AvailableSchedule | null = null;
      
      if (Array.isArray(data) && data[0]?.success) {
        const content = data[0].content;
        if (content && content.profissional_id) {
          const professionalDataKey = Object.keys(content.profissional_id)[0];
          const professionalData = content.profissional_id[professionalDataKey];
          
          if (professionalData && professionalData.local_id) {
            const localDataKeys = Object.keys(professionalData.local_id);
            let times: string[] = [];
            
            if (localDataKeys.length > 0) {
              const localData = professionalData.local_id[localDataKeys[0]];
              if (localData && localData[formattedDate] && Array.isArray(localData[formattedDate])) {
                times = localData[formattedDate] as string[];
              }
            }
            
            if (times.length > 0) {
              schedule = {
                date: formattedDate,
                times: times,
                professional_id: parseInt(professionalDataKey, 10)
              };
            }
          }
        }
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
