
import React from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { SpecialtySelector } from '@/components/SpecialtySelector';

interface SpecialtyStepProps {
  selectedSpecialty: AppointmentState['selectedSpecialty'];
  unityId?: number | null;
  updateState: (updates: Partial<AppointmentState>) => void;
}

export const SpecialtyStep: React.FC<SpecialtyStepProps> = ({
  selectedSpecialty,
  unityId,
  updateState,
}) => {
  return (
    <SpecialtySelector
      selectedSpecialty={selectedSpecialty}
      unityId={unityId}
      onSelect={(specialty) => {
        updateState({ 
          selectedSpecialty: specialty,
          selectedProfessional: null,
          selectedUnity: null,
          selectedInsurance: null
        });
      }}
    />
  );
};
