
import React, { useEffect } from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { DateTimeSelector } from '@/components/DateTimeSelector';
import { toast } from 'sonner';

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
  // Log API related errors for debugging
  useEffect(() => {
    console.log('DateTimeStep rendering with params:', {
      professionalId,
      unityId,
      specialtyId,
      insuranceId,
      selectedDate,
      selectedTime
    });

    // Display toast for API errors only in development
    if (process.env.NODE_ENV === 'development') {
      if (professionalId && unityId === 0 && specialtyId && insuranceId) {
        toast.info('Consultando disponibilidade do médico', {
          description: `Prof #${professionalId}, Esp #${specialtyId}, Conv #${insuranceId}`,
          duration: 3000,
        });
      }
    }
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
