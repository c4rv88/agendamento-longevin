
import React from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { SpecialtySelector } from '@/components/SpecialtySelector';
import { ProfessionalSelector } from '@/components/ProfessionalSelector';
import { InsuranceSelector } from '@/components/InsuranceSelector';

interface CombinedSelectionStepProps {
  state: AppointmentState;
  updateState: (updates: Partial<AppointmentState>) => void;
  onSelectionComplete: () => void;
}

export const CombinedSelectionStep: React.FC<CombinedSelectionStepProps> = ({
  state,
  updateState,
  onSelectionComplete,
}) => {
  return (
    <div className="space-y-8">
      {/* Especialidade */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-[#A6AD97]/20 shadow-sm">
        <h3 className="text-lg font-semibold text-[#7B8466] mb-4">1. Especialidade</h3>
        <SpecialtySelector
          selectedSpecialty={state.selectedSpecialty}
          onSelect={(specialty) => {
            updateState({ 
              selectedSpecialty: specialty,
              selectedProfessional: null,
              selectedInsurance: null
            });
          }}
        />
      </div>

      {/* Profissional */}
      {state.selectedSpecialty && (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-[#A6AD97]/20 shadow-sm">
          <h3 className="text-lg font-semibold text-[#7B8466] mb-4">2. Profissional</h3>
          <ProfessionalSelector
            selectedProfessional={state.selectedProfessional}
            specialtyId={state.selectedSpecialty?.specialty_id}
            unityId={0}
            onSelect={(professional) => {
              updateState({ 
                selectedProfessional: professional,
                selectedInsurance: null
              });
            }}
          />
        </div>
      )}

      {/* Convênio */}
      {state.selectedProfessional && (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-[#A6AD97]/20 shadow-sm">
          <h3 className="text-lg font-semibold text-[#7B8466] mb-4">3. Convênio</h3>
          <InsuranceSelector
            selectedInsurance={state.selectedInsurance}
            professionalId={state.selectedProfessional?.professional_id}
            onSelect={(insurance) => updateState({ selectedInsurance: insurance })}
          />
        </div>
      )}
    </div>
  );
};
