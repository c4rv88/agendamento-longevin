
import React from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { AppointmentSummary } from '@/components/AppointmentSummary';

interface SummaryStepProps {
  appointmentData: AppointmentState;
  resetFlow: () => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  appointmentData,
  resetFlow,
}) => {
  return (
    <AppointmentSummary appointmentData={appointmentData} onConfirm={resetFlow} />
  );
};
