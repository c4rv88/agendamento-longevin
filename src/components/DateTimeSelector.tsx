
import React, { useEffect } from 'react';
import { useDateTimeSelection } from '@/hooks/useDateTimeSelection';
import { useAutoScroll } from '@/hooks/useAutoScroll';
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
  const { scrollToElement } = useAutoScroll();
  
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
    (date: string) => {
      onSelectDate(date);
      // Scroll gradativo: primeiro para as datas, depois para os horários
      setTimeout(() => {
        scrollToElement('available-times', 100);
      }, 500);
    },
    onSelectTime
  );

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
      <Card className="w-full bg-white/80 backdrop-blur-sm border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <CalendarCheck className="w-5 h-5" />
            Próximas Datas Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-amber-600">
              Não foram encontrados horários disponíveis para este profissional.
              Tente selecionar outro convênio ou profissional.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <AvailableDates 
        availableSchedules={availableSchedules}
        selectedDate={selectedDate}
        onSelectDate={(date: string) => {
          onSelectDate(date);
          // Scroll gradativo para os horários após selecionar data
          setTimeout(() => {
            scrollToElement('available-times', 100);
          }, 300);
        }}
      />

      {selectedDate && (
        <div id="available-times">
          <AvailableTimes
            times={availableTimes}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            onSelectTime={onSelectTime}
          />
        </div>
      )}
    </div>
  );
};
