
import { AvailableSchedule } from '@/types/feegow';

/**
 * Normalize date format to dd-mm-yyyy
 */
const normalizeDateFormat = (dateString: string): string => {
  try {
    if (!dateString) return '';
    
    // If already in dd-mm-yyyy format
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return dateString;
    }
    
    // If in yyyy-mm-dd format, convert to dd-mm-yyyy
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    }
    
    // If in dd/mm/yyyy format, convert to dd-mm-yyyy
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return dateString.replace(/\//g, '-');
    }
    
    // Return as is if format is unrecognized
    console.warn('Unrecognized date format:', dateString);
    return dateString;
  } catch (error) {
    console.error('Error normalizing date format:', error, dateString);
    return dateString;
  }
};

/**
 * Process the schedule data from API response
 */
export const processScheduleData = (
  data: any, 
  professionalId: number, 
  unityId?: number
): AvailableSchedule[] => {
  const schedules: AvailableSchedule[] = [];
  
  console.log('Processing schedule data:', data);
  
  if (!data.success) {
    console.log('API response indicates failure');
    return schedules;
  }
  
  try {
    if (data.content && Array.isArray(data.content)) {
      // Handle the simple array format
      console.log('Processing simple array format');
      data.content.forEach((dateItem: any) => {
        if (dateItem.date && dateItem.horarios && Array.isArray(dateItem.horarios) && dateItem.horarios.length > 0) {
          const normalizedDate = normalizeDateFormat(dateItem.date);
          schedules.push({
            date: normalizedDate,
            times: dateItem.horarios.filter((time: string) => time && time.trim()),
            professional_id: professionalId
          });
        }
      });
    } else if (data.content && data.content.profissional_id) {
      // Handle the nested format with profissional_id
      console.log('Processing nested format with profissional_id');
      const profKeys = Object.keys(data.content.profissional_id);
      if (profKeys.length > 0) {
        const profData = data.content.profissional_id[profKeys[0]];
        if (profData && profData.local_id) {
          const localKeys = Object.keys(profData.local_id);
          if (localKeys.length > 0) {
            const localId = (unityId !== undefined && unityId !== null && profData.local_id[unityId]) 
              ? unityId 
              : localKeys[0];
            const localData = profData.local_id[localId];
            
            // Get dates and times from localData
            for (const [date, times] of Object.entries(localData)) {
              if (Array.isArray(times) && times.length > 0) {
                const validTimes = times.filter((time: string) => time && time.trim());
                if (validTimes.length > 0) {
                  const normalizedDate = normalizeDateFormat(date);
                  schedules.push({
                    date: normalizedDate,
                    times: validTimes,
                    professional_id: professionalId
                  });
                }
              }
            }
          }
        }
      }
    } else if (data.content && typeof data.content === 'object') {
      // Handle direct object format where dates are keys
      console.log('Processing direct object format');
      for (const [date, times] of Object.entries(data.content)) {
        if (Array.isArray(times) && times.length > 0) {
          const validTimes = times.filter((time: string) => time && time.trim());
          if (validTimes.length > 0) {
            const normalizedDate = normalizeDateFormat(date);
            schedules.push({
              date: normalizedDate,
              times: validTimes,
              professional_id: professionalId
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing schedule data:', error);
  }
  
  console.log('Processed schedules:', schedules);
  return schedules;
};

/**
 * Generate mock schedule data for testing - REMOVED to show real "no dates available"
 */
export const generateMockScheduleData = (professionalId: number, startDate: Date): AvailableSchedule[] => {
  // Return empty array instead of mock data
  return [];
};
