
import React from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { ProfessionalSelector } from '@/components/ProfessionalSelector';

interface ProfessionalStepProps {
  selectedProfessional: AppointmentState['selectedProfessional'];
  specialtyId?: number;
  unityId?: number;
  updateState: (updates: Partial<AppointmentState>) => void;
}

export const ProfessionalStep: React.FC<ProfessionalStepProps> = ({
  selectedProfessional,
  specialtyId,
  unityId,
  updateState,
}) => {
  return (
    <ProfessionalSelector
      selectedProfessional={selectedProfessional}
      specialtyId={specialtyId}
      unityId={unityId}
      onSelect={(professional) => {
        // Clear insurance when selecting a new professional
        updateState({ 
          selectedProfessional: professional,
          selectedInsurance: null
        });
      }}
    />
  );
};
