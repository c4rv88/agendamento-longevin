
import { useEffect, useState } from 'react';
import { AvailableSchedule } from '@/types/feegow';
import { FeegowApiService } from '@/services/api';

export const useDateTimeSelection = (
  professionalId: number,
  unityId?: number,
  specialtyId?: number,
  onSelectDate?: (date: string) => void,
  onSelectTime?: (time: string) => void
) => {
  const [availableSchedules, setAvailableSchedules] = useState<AvailableSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableSchedules = async () => {
      if (!professionalId) {
        setLoading(false);
        setError('Por favor, selecione um profissional primeiro.');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const schedules = await FeegowApiService.getAvailableSchedules(
          professionalId,
          unityId,
          specialtyId
        );
        
        setAvailableSchedules(schedules);
        
        // Automatically select the first available date if there is one
        if (schedules.length > 0 && onSelectDate) {
          onSelectDate(schedules[0].date);
          
          // And automatically select the first available time if there is one
          if (schedules[0].times.length > 0 && onSelectTime) {
            onSelectTime(schedules[0].times[0]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar horários:', error);
        setError('Falha ao carregar horários disponíveis. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSchedules();
  }, [professionalId, unityId, specialtyId, onSelectDate, onSelectTime]);

  const getAvailableTimesForDate = (date: string): string[] => {
    const schedule = availableSchedules.find(s => s.date === date);
    return schedule ? schedule.times : [];
  };

  return {
    availableSchedules,
    loading,
    error,
    getAvailableTimesForDate
  };
};
