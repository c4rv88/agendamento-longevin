
import React, { useEffect } from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { DateTimeSelector } from '@/components/DateTimeSelector';

interface DateTimeStepProps {
  selectedDate: string;
  selectedTime: string;
  professionalId: number;
  unityId?: number;
  specialtyId?: number;
  insuranceId?: number;
  updateState: (updates: Partial<AppointmentState>) => void;
}

export const DateTimeStep: React.FC<DateTimeStepProps> = ({
  selectedDate,
  selectedTime,
  professionalId,
  unityId,
  specialtyId,
  insuranceId,
  updateState,
}) => {
  // Add additional logging to track the exact data being passed
  useEffect(() => {
    console.log('DateTimeStep rendering with params:', {
      professionalId,
      unityId,
      specialtyId,
      insuranceId,
      selectedDate,
      selectedTime
    });
  }, [professionalId, unityId, specialtyId, insuranceId, selectedDate, selectedTime]);

  return (
    <DateTimeSelector
      selectedDate={selectedDate}
      selectedTime={selectedTime}
      professionalId={professionalId}
      unityId={unityId || 0}
      specialtyId={specialtyId || 0}
      insuranceId={insuranceId || 0}
      onSelectDate={(date) => updateState({ selectedDate: date })}
      onSelectTime={(time) => updateState({ selectedTime: time })}
    />
  );
};
