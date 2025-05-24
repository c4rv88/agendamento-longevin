
import React, { useState, useEffect } from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { PatientForm } from '@/components/PatientForm';
import { useToast } from '@/hooks/use-toast';

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
