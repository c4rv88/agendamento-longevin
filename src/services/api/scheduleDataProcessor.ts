
import { AvailableSchedule } from '@/types/feegow';

/**
 * Process the schedule data from API response
 */
export const processScheduleData = (
  data: any, 
  professionalId: number, 
  unityId?: number
): AvailableSchedule[] => {
  const schedules: AvailableSchedule[] = [];
  
  if (!data.success) {
    return schedules;
  }
  
  if (data.content && Array.isArray(data.content)) {
    // Handle the simple array format
    data.content.forEach((dateItem: any) => {
      if (dateItem.date && dateItem.horarios && dateItem.horarios.length > 0) {
        schedules.push({
          date: dateItem.date,
          times: dateItem.horarios,
          professional_id: professionalId
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
          const localId = unityId && profData.local_id[unityId] 
            ? unityId 
            : localKeys[0];
          const localData = profData.local_id[localId];
          
          // Get dates and times from localData
          for (const [date, times] of Object.entries(localData)) {
            if (Array.isArray(times) && times.length > 0) {
              schedules.push({
                date,
                times: times as string[],
                professional_id: professionalId
              });
            }
          }
        }
      }
    }
  }
  
  return schedules;
};

/**
 * Generate mock schedule data for testing
 */
export const generateMockScheduleData = (professionalId: number, startDate: Date): AvailableSchedule[] => {
  const mockData: AvailableSchedule[] = [];
  const currentDate = new Date(startDate);
  
  // Mock data for 3 days
  for (let i = 0; i < 3; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const dateStr = `${day}-${month}-${year}`;
    
    // Create different times for each day
    let times;
    if (i === 0) {
      times = ['08:00', '09:00', '10:00', '14:00', '15:00'];
    } else if (i === 1) {
      times = ['08:30', '09:30', '14:30', '15:30'];
    } else {
      times = ['10:00', '11:00', '13:00', '16:00'];
    }
    
    mockData.push({
      date: dateStr,
      times,
      professional_id: professionalId
    });
  }
  
  return mockData;
};
