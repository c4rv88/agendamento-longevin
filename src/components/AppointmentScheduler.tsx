
import React, { useState } from 'react';
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { AppointmentHeader } from '@/components/appointment/AppointmentHeader';
import { AppointmentStepContent } from '@/components/appointment/AppointmentStepContent';
import { AppointmentNavigation } from '@/components/appointment/AppointmentNavigation';

export const AppointmentScheduler: React.FC = () => {
  const { state, updateState, nextStep, prevStep, resetFlow } = useAppointmentFlow();
  const [logoUrl, setLogoUrl] = useState<string>('');

  const handleNext = () => {
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  const canProceed = () => {
    switch (state.currentStep) {
      case 1: return !!state.selectedUnity; // Unidade
      case 2: return !!state.selectedSpecialty; // Especialidade
      case 3: return !!state.selectedProfessional; // Profissional  
      case 4: return !!state.selectedInsurance; // Convênio
      case 5: return !!state.selectedDate && !!state.selectedTime; // Data/Hora
      case 6: return !!state.patient; // Paciente
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header com Logo */}
      <AppointmentHeader logoUrl={logoUrl} setLogoUrl={setLogoUrl} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressIndicator currentStep={state.currentStep} totalSteps={7} />
          
          <div className="mt-8">
            <AppointmentStepContent 
              currentStep={state.currentStep}
              state={state}
              updateState={updateState}
              resetFlow={resetFlow}
            />
          </div>

          {/* Navigation Buttons */}
          <AppointmentNavigation 
            currentStep={state.currentStep}
            canProceed={canProceed()}
            onNext={handleNext}
            onPrev={handlePrev}
            onReset={resetFlow}
          />

          {/* Campo para adicionar logo no mobile */}
          <div className="md:hidden mt-6">
            <input
              type="url"
              placeholder="URL do logotipo da clínica"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
