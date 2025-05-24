
import React from 'react';
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
  console.log('DateTimeStep rendering with props:', {
    professionalId,
    unityId,
    specialtyId,
    insuranceId,
    selectedDate,
    selectedTime
  });

  return (
    <DateTimeSelector
      selectedDate={selectedDate}
      selectedTime={selectedTime}
      professionalId={professionalId}
      unityId={unityId}
      specialtyId={specialtyId}
      insuranceId={insuranceId}
      onSelectDate={(date) => updateState({ selectedDate: date })}
      onSelectTime={(time) => updateState({ selectedTime: time })}
    />
  );
};
