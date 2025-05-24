
import React, { useEffect } from 'react';
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
  unityId,
  specialtyId,
  insuranceId,
  onSelectDate,
  onSelectTime,
}) => {
  const { 
    availableSchedules, 
    loading, 
    error, 
    getAvailableTimesForDate 
  } = useDateTimeSelection(
    professionalId,
    unityId,
    specialtyId,
    insuranceId,
    onSelectDate,
    onSelectTime
  );

  useEffect(() => {
    console.log('DateTimeSelector rendered with:', {
      availableSchedules,
      loading,
      error,
      selectedDate,
      selectedTime
    });
  }, [availableSchedules, loading, error, selectedDate, selectedTime]);

  if (loading) {
    return <DateTimeStatus loading />;
  }

  if (error) {
    return (
      <DateTimeStatus 
        error={error} 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  if (availableSchedules.length === 0) {
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
        onSelectDate={onSelectDate}
      />

      {selectedDate && (
        <AvailableTimes
          times={getAvailableTimesForDate(selectedDate)}
          selectedTime={selectedTime}
          selectedDate={selectedDate}
          onSelectTime={onSelectTime}
        />
      )}
    </div>
  );
};
