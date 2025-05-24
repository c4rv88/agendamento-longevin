
import React from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { AppointmentSummary } from '@/components/AppointmentSummary';
import { useAppointmentConfirmation } from '@/hooks/useAppointmentConfirmation';

interface SummaryStepProps {
  appointmentData: AppointmentState;
  resetFlow: () => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  appointmentData,
  resetFlow,
}) => {
  const { 
    confirming, 
    confirmed, 
    handleConfirmAppointment 
  } = useAppointmentConfirmation();

  return (
    <AppointmentSummary 
      appointmentData={appointmentData} 
      onConfirm={() => handleConfirmAppointment(appointmentData)}
      loading={confirming}
      success={confirmed}
      onReset={resetFlow}
    />
  );
};
