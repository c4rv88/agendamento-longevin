
import React from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { UnitySelector } from '@/components/UnitySelector';
import { SpecialtySelector } from '@/components/SpecialtySelector';
import { ProfessionalSelector } from '@/components/ProfessionalSelector';
import { InsuranceSelector } from '@/components/InsuranceSelector';
import { DateTimeSelector } from '@/components/DateTimeSelector';
import { PatientForm } from '@/components/PatientForm';
import { AppointmentSummary } from '@/components/AppointmentSummary';

interface AppointmentStepContentProps {
  currentStep: number;
  state: AppointmentState;
  updateState: (updates: Partial<AppointmentState>) => void;
  resetFlow: () => void;
}

export const AppointmentStepContent: React.FC<AppointmentStepContentProps> = ({
  currentStep,
  state,
  updateState,
  resetFlow
}) => {
  switch (currentStep) {
    case 1: // Unidade
      return (
        <UnitySelector
          selectedUnity={state.selectedUnity}
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
    case 2: // Especialidade
      return (
        <SpecialtySelector
          selectedSpecialty={state.selectedSpecialty}
          unityId={state.selectedUnity?.unity_id}
          onSelect={(specialty) => {
            // Clear professionals when selecting a new specialty
            updateState({ 
              selectedSpecialty: specialty,
              selectedProfessional: null,
              selectedInsurance: null
            });
          }}
        />
      );
    case 3: // Profissional
      return (
        <ProfessionalSelector
          selectedProfessional={state.selectedProfessional}
          specialtyId={state.selectedSpecialty?.specialty_id}
          unityId={state.selectedUnity?.unity_id}
          onSelect={(professional) => {
            // Clear insurance when selecting a new professional
            updateState({ 
              selectedProfessional: professional,
              selectedInsurance: null
            });
          }}
        />
      );
    case 4: // Convênio
      return (
        <InsuranceSelector
          selectedInsurance={state.selectedInsurance}
          professionalId={state.selectedProfessional?.professional_id}
          onSelect={(insurance) => updateState({ selectedInsurance: insurance })}
        />
      );
    case 5: // Data/Hora
      return (
        <DateTimeSelector
          selectedDate={state.selectedDate}
          selectedTime={state.selectedTime}
          professionalId={state.selectedProfessional?.professional_id!}
          unityId={state.selectedUnity?.unity_id}
          specialtyId={state.selectedSpecialty?.specialty_id}
          onSelectDate={(date) => updateState({ selectedDate: date })}
          onSelectTime={(time) => updateState({ selectedTime: time })}
        />
      );
    case 6: // Paciente
      return (
        <PatientForm
          patient={state.patient}
          onPatientUpdate={(patient) => updateState({ patient })}
        />
      );
    case 7: // Confirmação
      return <AppointmentSummary appointmentData={state} onConfirm={resetFlow} />;
    default:
      return null;
  }
};
