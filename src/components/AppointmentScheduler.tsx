
import React, { useRef } from 'react';
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { AppointmentHeader } from '@/components/appointment/AppointmentHeader';
import { AppointmentStepContent } from '@/components/appointment/AppointmentStepContent';
import { AppointmentNavigation } from '@/components/appointment/AppointmentNavigation';

export const AppointmentScheduler: React.FC = () => {
  const { state, updateState, nextStep, prevStep, resetFlow } = useAppointmentFlow();
  const topRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    nextStep();
    // Scroll to top of next step
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handlePrev = () => {
    prevStep();
    // Scroll to top of previous step
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
      {/* Header */}
      <AppointmentHeader />

      <div className="container mx-auto px-4 py-8" ref={topRef}>
        <div className="max-w-4xl mx-auto">
          <ProgressIndicator currentStep={state.currentStep} totalSteps={7} />
          
          {/* Next button at top for better UX */}
          {state.currentStep < 7 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Próximo
              </button>
            </div>
          )}
          
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
        </div>
      </div>
    </div>
  );
};
