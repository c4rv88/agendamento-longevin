
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchAvailableSchedules = async () => {
      if (!professionalId) {
        console.log('Nenhum profissional selecionado, não buscando horários');
        setLoading(false);
        setError('Por favor, selecione um profissional primeiro.');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching schedules with params:', { 
          profissional_id: professionalId, 
          unidade_id: unityId || 0,
          especialidade_id: specialtyId || 0,
          convenio_id: insuranceId || 0
        });
        
        const schedules = await FeegowApiService.getAvailableSchedules(
          professionalId,
          unityId || 0,
          specialtyId || 0,
          insuranceId || 0
        );
        
        console.log(`Fetched ${schedules.length} available schedules for professional #${professionalId}`);
        setAvailableSchedules(schedules);
        
        if (schedules.length === 0) {
          toast.warning('Não foram encontrados horários disponíveis para este profissional');
          setError('Nenhum horário disponível para este profissional.');
          return;
        }
        
        // Automatically select the first available date if there is one
        if (schedules.length > 0 && onSelectDate) {
          console.log('Auto-selecting first date:', schedules[0].date);
          onSelectDate(schedules[0].date);
          
          // And automatically select the first available time if there is one
          if (schedules[0].times.length > 0 && onSelectTime) {
            console.log('Auto-selecting first time:', schedules[0].times[0]);
            onSelectTime(schedules[0].times[0]);
          }
        } else {
          console.log('No schedules available to auto-select.');
        }
      } catch (error) {
        console.error('Erro ao carregar horários:', error);
        setError('Falha ao carregar horários disponíveis. Por favor, tente novamente.');
        toast.error('Falha ao carregar horários disponíveis');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSchedules();
  }, [professionalId, unityId, specialtyId, insuranceId, onSelectDate, onSelectTime]);

  const getAvailableTimesForDate = (date: string): string[] => {
    const schedule = availableSchedules.find(s => s.date === date);
    if (schedule) {
      console.log(`Found ${schedule.times.length} times for date ${date}`);
    } else {
      console.log(`No times found for date ${date}`);
    }
    return schedule ? schedule.times : [];
  };

  return {
    availableSchedules,
    loading,
    error,
    getAvailableTimesForDate
  };
};
