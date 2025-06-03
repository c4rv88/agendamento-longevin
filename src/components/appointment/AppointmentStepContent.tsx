
import React from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import {
  DateTimeStep,
  PatientStep,
  SummaryStep
} from './steps';
import { CombinedSelectionStep } from './steps/CombinedSelectionStep';

interface AppointmentStepContentProps {
  currentStep: number;
  state: AppointmentState;
  updateState: (updates: Partial<AppointmentState>) => void;
  resetFlow: () => void;
  onStepComplete: () => void;
}

export const AppointmentStepContent: React.FC<AppointmentStepContentProps> = ({
  currentStep,
  state,
  updateState,
  resetFlow,
  onStepComplete
}) => {
  switch (currentStep) {
    case 1: // Especialidade, Profissional e Convênio
      return (
        <div id="step-1">
          <CombinedSelectionStep
            state={state}
            updateState={updateState}
            onSelectionComplete={onStepComplete}
          />
        </div>
      );
    case 2: // Data/Hora
      return (
        <div id="step-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-[#A6AD97]/20 shadow-sm">
            <h3 className="text-lg font-semibold text-[#7B8466] mb-4">Escolha Data e Horário</h3>
            <DateTimeStep
              selectedDate={state.selectedDate}
              selectedTime={state.selectedTime}
              professionalId={state.selectedProfessional?.professional_id!}
              unityId={0}
              specialtyId={state.selectedSpecialty?.specialty_id}
              insuranceId={state.selectedInsurance?.insurance_id}
              updateState={updateState}
            />
          </div>
        </div>
      );
    case 3: // Paciente
      return (
        <div id="step-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-[#A6AD97]/20 shadow-sm">
            <h3 className="text-lg font-semibold text-[#7B8466] mb-4">Dados do Paciente</h3>
            <PatientStep
              patient={state.patient}
              updateState={updateState}
            />
          </div>
        </div>
      );
    case 4: // Confirmação
      return (
        <div id="step-4">
          <SummaryStep
            appointmentData={state}
            resetFlow={resetFlow}
          />
        </div>
      );
    default:
      return null;
  }
};
