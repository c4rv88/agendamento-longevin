
import React from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { PatientForm } from '@/components/PatientForm';

interface PatientStepProps {
  patient: AppointmentState['patient'];
  updateState: (updates: Partial<AppointmentState>) => void;
}

export const PatientStep: React.FC<PatientStepProps> = ({
  patient,
  updateState,
}) => {
  return (
    <PatientForm
      patient={patient}
      onPatientUpdate={(patient) => updateState({ patient })}
    />
  );
};
