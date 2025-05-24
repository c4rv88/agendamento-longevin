
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
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
  const [retryCount, setRetryCount] = useState(0);
  
  // Use refs to track if we've already auto-selected date/time and for stable dependencies
  const hasAutoSelectedRef = useRef(false);
  const professionalIdRef = useRef(professionalId);
  const unityIdRef = useRef(unityId || 0);
  const specialtyIdRef = useRef(specialtyId || 0);
  const insuranceIdRef = useRef(insuranceId || 0);
  
  // Update refs when props change
  useEffect(() => {
    professionalIdRef.current = professionalId;
    unityIdRef.current = unityId || 0;
    specialtyIdRef.current = specialtyId || 0;
    insuranceIdRef.current = insuranceId || 0;
  }, [professionalId, unityId, specialtyId, insuranceId]);

  const fetchAvailableSchedules = useCallback(async () => {
    const currentProfessionalId = professionalIdRef.current;
    
    if (!currentProfessionalId) {
      console.log('Nenhum profissional selecionado, não buscando horários');
      setLoading(false);
      setError('Por favor, selecione um profissional primeiro.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const schedules = await FeegowApiService.getAvailableSchedules(
        currentProfessionalId,
        unityIdRef.current,
        specialtyIdRef.current,
        insuranceIdRef.current
      );
      
      setAvailableSchedules(schedules);
      
      if (schedules.length === 0) {
        toast.warning('Não foram encontrados horários disponíveis para este profissional');
        setError('Nenhum horário disponível para este profissional.');
        return;
      }
      
      // Only auto-select if we have schedules, and we haven't auto-selected yet
      if (schedules.length > 0 && onSelectDate && !hasAutoSelectedRef.current) {
        hasAutoSelectedRef.current = true;
        onSelectDate(schedules[0].date);
        
        // And automatically select the first available time if there is one
        if (schedules[0].times.length > 0 && onSelectTime) {
          onSelectTime(schedules[0].times[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      setError('Falha ao carregar horários disponíveis. Por favor, tente novamente.');
      toast.error('Falha ao carregar horários disponíveis');
    } finally {
      setLoading(false);
    }
  }, [onSelectDate, onSelectTime]);

  // Retry function for UI
  const retry = useCallback(() => {
    hasAutoSelectedRef.current = false; // Reset auto-selection on retry
    setRetryCount(prev => prev + 1);
  }, []);

  // Effect for fetching data - dependencies are minimized to prevent unnecessary calls
  useEffect(() => {
    hasAutoSelectedRef.current = false;
    fetchAvailableSchedules();
  }, [fetchAvailableSchedules, retryCount, professionalId, unityId, specialtyId, insuranceId]);

  // Memoize this function to prevent unnecessary recreations
  const getAvailableTimesForDate = useCallback((date: string): string[] => {
    if (!availableSchedules || !date) return [];
    const schedule = availableSchedules.find(s => s.date === date);
    return schedule ? schedule.times : [];
  }, [availableSchedules]);

  // Memoize the entire return value to prevent unnecessary recreations
  return useMemo(() => ({
    availableSchedules,
    loading,
    error,
    getAvailableTimesForDate,
    retry
  }), [availableSchedules, loading, error, getAvailableTimesForDate, retry]);
};
