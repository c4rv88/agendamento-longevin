
import React, { useMemo, useCallback } from 'react';
import { useDateTimeSelection } from '@/hooks/useDateTimeSelection';
import { DateTimeStatus } from '@/components/datetime/DateTimeStatus';
import { AvailableDates } from '@/components/datetime/AvailableDates';
import { AvailableTimes } from '@/components/datetime/AvailableTimes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarCheck } from 'lucide-react';

interface DateTimeSelectorProps {
  selectedDate: string;
  selectedTime: string;
  professionalId: number;
  unityId?: number;
  specialtyId?: number;
  insuranceId?: number;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  professionalId,
  unityId = 0,
  specialtyId = 0,
  insuranceId = 0,
  onSelectDate,
  onSelectTime,
}) => {
  const { 
    availableSchedules, 
    loading, 
    error, 
    getAvailableTimesForDate,
    retry
  } = useDateTimeSelection(
    professionalId,
    unityId,
    specialtyId,
    insuranceId,
    onSelectDate,
    onSelectTime
  );

  // Use useCallback for handlers to prevent unnecessary recreation
  const handleSelectDate = useCallback((date: string) => {
    onSelectDate(date);
  }, [onSelectDate]);

  const handleSelectTime = useCallback((time: string) => {
    onSelectTime(time);
  }, [onSelectTime]);

  // Use useMemo to prevent unnecessary calculations of available times
  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    return getAvailableTimesForDate(selectedDate);
  }, [selectedDate, getAvailableTimesForDate]);

  if (loading) {
    return <DateTimeStatus loading />;
  }

  if (error) {
    return (
      <DateTimeStatus 
        error={error} 
        onRetry={retry}
      />
    );
  }

  if (!availableSchedules || availableSchedules.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" />
            Próximas Datas Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-amber-500">
              Não foram encontrados horários disponíveis para este profissional.
              Tente selecionar outro convênio ou profissional.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Parâmetros de busca: Profissional #{professionalId}, Unidade #{unityId}, 
              Especialidade #{specialtyId}, Convênio #{insuranceId}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <AvailableDates 
        availableSchedules={availableSchedules}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      {selectedDate && (
        <AvailableTimes
          times={availableTimes}
          selectedTime={selectedTime}
          selectedDate={selectedDate}
          onSelectTime={handleSelectTime}
        />
      )}
    </div>
  );
};
