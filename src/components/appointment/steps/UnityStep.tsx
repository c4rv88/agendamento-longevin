
import React from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { UnitySelector } from '@/components/UnitySelector';

interface UnityStepProps {
  selectedUnity: AppointmentState['selectedUnity'];
  updateState: (updates: Partial<AppointmentState>) => void;
}

export const UnityStep: React.FC<UnityStepProps> = ({
  selectedUnity,
  updateState,
}) => {
  return (
    <UnitySelector
      selectedUnity={selectedUnity}
      onSelect={(unity) => {
        // Clear related selections when changing unity
        updateState({ 
          selectedUnity: unity,
          selectedSpecialty: null,
          selectedProfessional: null,
          selectedInsurance: null
        });
      }}
    />
  );
};
