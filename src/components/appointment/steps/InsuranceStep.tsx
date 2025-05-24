
import React from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { InsuranceSelector } from '@/components/InsuranceSelector';

interface InsuranceStepProps {
  selectedInsurance: AppointmentState['selectedInsurance'];
  professionalId?: number;
  updateState: (updates: Partial<AppointmentState>) => void;
}

export const InsuranceStep: React.FC<InsuranceStepProps> = ({
  selectedInsurance,
  professionalId,
  updateState,
}) => {
  return (
    <InsuranceSelector
      selectedInsurance={selectedInsurance}
      professionalId={professionalId}
      onSelect={(insurance) => updateState({ selectedInsurance: insurance })}
    />
  );
};
