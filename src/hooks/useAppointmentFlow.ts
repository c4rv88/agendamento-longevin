
import { useState, useCallback } from 'react';
import { Unity, Specialty, Professional, Insurance, Patient } from '@/types/feegow';

export interface AppointmentState {
  selectedSpecialty: Specialty | null;
  selectedProfessional: Professional | null;
  selectedUnity: Unity | null;
  selectedInsurance: Insurance | null;
  selectedDate: string;
  selectedTime: string;
  patient: Patient | null;
  currentStep: number;
}

export const useAppointmentFlow = () => {
  const [state, setState] = useState<AppointmentState>({
    selectedSpecialty: null,
    selectedProfessional: null,
    selectedUnity: { unity_id: 0, unity_name: 'Longevin', unity_address: '', unity_phone: '' },
    selectedInsurance: null,
    selectedDate: '',
    selectedTime: '',
    patient: null,
    currentStep: 1,
  });

  const updateState = useCallback((updates: Partial<AppointmentState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }));
  }, []);

  const resetFlow = useCallback(() => {
    setState({
      selectedSpecialty: null,
      selectedProfessional: null,
      selectedUnity: { unity_id: 0, unity_name: 'Longevin', unity_address: '', unity_phone: '' },
      selectedInsurance: null,
      selectedDate: '',
      selectedTime: '',
      patient: null,
      currentStep: 1,
    });
  }, []);

  const scrollToNextSection = useCallback(() => {
    setTimeout(() => {
      const nextStepElement = document.getElementById(`step-${state.currentStep + 1}`);
      if (nextStepElement) {
        nextStepElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  }, [state.currentStep]);

  return {
    state,
    updateState,
    nextStep,
    prevStep,
    resetFlow,
    scrollToNextSection,
  };
};
