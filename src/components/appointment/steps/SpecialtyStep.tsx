
import React from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { SpecialtySelector } from '@/components/SpecialtySelector';

interface SpecialtyStepProps {
  selectedSpecialty: AppointmentState['selectedSpecialty'];
  updateState: (updates: Partial<AppointmentState>) => void;
}

export const SpecialtyStep: React.FC<SpecialtyStepProps> = ({
  selectedSpecialty,
  updateState,
}) => {
  return (
    <SpecialtySelector
      selectedSpecialty={selectedSpecialty}
      onSelect={(specialty) => {
        // Clear professionals and unity when selecting a new specialty
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
