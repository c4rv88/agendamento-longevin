
import { useEffect, useState, useCallback, useRef } from 'react';
import { AvailableSchedule } from '@/types/feegow';
import { FeegowApiService } from '@/services/api';
import { toast } from 'sonner';

export const useDateTimeSelection = (
  professionalId: number,
  unityId?: number,
  specialtyId?: number,
  insuranceId?: number,
  onSelectDate?: (date: string) => void,
  onSelectTime?: (time: string) => void
) => {
  const [availableSchedules, setAvailableSchedules] = useState<AvailableSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to prevent infinite loops
  const lastFetchParams = useRef<string>('');
  const hasAutoSelected = useRef(false);

  const fetchAvailableSchedules = useCallback(async () => {
    if (!professionalId) {
      setLoading(false);
      setError('Por favor, selecione um profissional primeiro.');
      return;
    }
    
    const currentParams = `${professionalId}-${unityId || 0}-${specialtyId || 0}-${insuranceId || 0}`;
    
    // Prevent duplicate API calls
    if (lastFetchParams.current === currentParams) {
      return;
    }
    
    lastFetchParams.current = currentParams;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching schedules with params:', {
        professionalId,
        unityId,
        specialtyId,
        insuranceId
      });
      
      const schedules = await FeegowApiService.getAvailableSchedules(
        professionalId,
        unityId || 0,
        specialtyId || 0,
        insuranceId || 0
      );
      
      console.log('Received schedules:', schedules);
      setAvailableSchedules(schedules);
      
      if (schedules.length === 0) {
        setError('Nenhum horário disponível encontrado para este profissional com os filtros selecionados.');
        return;
      }
      
      // Auto-select only once per parameter change
      if (schedules.length > 0 && onSelectDate && !hasAutoSelected.current) {
        hasAutoSelected.current = true;
        onSelectDate(schedules[0].date);
        
        if (schedules[0].times.length > 0 && onSelectTime) {
          onSelectTime(schedules[0].times[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      setError('Falha ao carregar horários disponíveis. Por favor, tente novamente.');
      setAvailableSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [professionalId, unityId, specialtyId, insuranceId, onSelectDate, onSelectTime]);

  const retry = useCallback(() => {
    hasAutoSelected.current = false;
    lastFetchParams.current = '';
    fetchAvailableSchedules();
  }, [fetchAvailableSchedules]);

  const getAvailableTimesForDate = useCallback((date: string): string[] => {
    const schedule = availableSchedules.find(s => s.date === date);
    return schedule ? schedule.times : [];
  }, [availableSchedules]);

  // Reset auto-selection when params change
  useEffect(() => {
    hasAutoSelected.current = false;
    lastFetchParams.current = '';
  }, [professionalId, unityId, specialtyId, insuranceId]);

  useEffect(() => {
    fetchAvailableSchedules();
  }, [fetchAvailableSchedules]);

  return {
    availableSchedules,
    loading,
    error,
    getAvailableTimesForDate,
    retry
  };
};
