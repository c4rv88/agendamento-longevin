
import React from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import {
  UnityStep,
  SpecialtyStep,
  ProfessionalStep,
  InsuranceStep,
  DateTimeStep,
  PatientStep,
  SummaryStep
} from './steps';

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
    case 1: // Especialidade
      return (
        <SpecialtyStep
          selectedSpecialty={state.selectedSpecialty}
          updateState={updateState}
        />
      );
    case 2: // Unidade
      return (
        <UnityStep
          selectedUnity={state.selectedUnity}
          updateState={updateState}
        />
      );
    case 3: // Profissional
      return (
        <ProfessionalStep
          selectedProfessional={state.selectedProfessional}
          specialtyId={state.selectedSpecialty?.specialty_id}
          unityId={state.selectedUnity?.unity_id}
          updateState={updateState}
        />
      );
    case 4: // Convênio
      return (
        <InsuranceStep
          selectedInsurance={state.selectedInsurance}
          professionalId={state.selectedProfessional?.professional_id}
          updateState={updateState}
        />
      );
    case 5: // Data/Hora
      return (
        <DateTimeStep
          selectedDate={state.selectedDate}
          selectedTime={state.selectedTime}
          professionalId={state.selectedProfessional?.professional_id!}
          unityId={state.selectedUnity?.unity_id}
          specialtyId={state.selectedSpecialty?.specialty_id}
          insuranceId={state.selectedInsurance?.insurance_id}
          updateState={updateState}
        />
      );
    case 6: // Paciente
      return (
        <PatientStep
          patient={state.patient}
          updateState={updateState}
        />
      );
    case 7: // Confirmação
      return (
        <SummaryStep
          appointmentData={state}
          resetFlow={resetFlow}
        />
      );
    default:
      return null;
  }
};
