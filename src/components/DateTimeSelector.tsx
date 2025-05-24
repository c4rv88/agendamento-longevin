
import React from 'react';
import { useDateTimeSelection } from '@/hooks/useDateTimeSelection';
import { DateTimeStatus } from '@/components/datetime/DateTimeStatus';
import { AvailableDates } from '@/components/datetime/AvailableDates';
import { AvailableTimes } from '@/components/datetime/AvailableTimes';

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
      <DateTimeStatus 
        showNoData 
        noDataMessage="Nenhuma data disponível para este profissional." 
      />
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
