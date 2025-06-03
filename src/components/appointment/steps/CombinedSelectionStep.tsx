
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
  // Auto-scroll to next section when all selections are complete
  React.useEffect(() => {
    if (state.selectedSpecialty && state.selectedProfessional && state.selectedInsurance) {
      const timer = setTimeout(() => {
        onSelectionComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.selectedSpecialty, state.selectedProfessional, state.selectedInsurance, onSelectionComplete]);

  return (
    <div className="space-y-8">
      {/* Especialidade */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-[#A6AD97]/20 shadow-sm">
        <h3 className="text-lg font-semibold text-[#7B8466] mb-4">1. Escolha a Especialidade</h3>
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
          <h3 className="text-lg font-semibold text-[#7B8466] mb-4">2. Escolha o Profissional</h3>
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
          <h3 className="text-lg font-semibold text-[#7B8466] mb-4">3. Escolha o Convênio</h3>
          <InsuranceSelector
            selectedInsurance={state.selectedInsurance}
            professionalId={state.selectedProfessional?.professional_id}
            onSelect={(insurance) => updateState({ selectedInsurance: insurance })}
          />
        </div>
      )}

      {/* Indicador de conclusão */}
      {state.selectedSpecialty && state.selectedProfessional && state.selectedInsurance && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-700 font-medium">
            ✓ Seleções concluídas! Rolando para a próxima etapa...
          </p>
        </div>
      )}
    </div>
  );
};
