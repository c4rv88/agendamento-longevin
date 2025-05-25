
import React, { useRef } from 'react';
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { AppointmentHeader } from '@/components/appointment/AppointmentHeader';
import { AppointmentStepContent } from '@/components/appointment/AppointmentStepContent';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      {/* Header */}
      <AppointmentHeader />

      <div className="container mx-auto px-4 py-8" ref={topRef}>
        <div className="max-w-4xl mx-auto">
          <ProgressIndicator currentStep={state.currentStep} totalSteps={7} />
          
          {/* Centered Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 my-6">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={state.currentStep === 1}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50 text-blue-700 px-4 py-2"
              size="sm"
            >
              <ChevronUp className="w-4 h-4" />
              Voltar
            </Button>
            
            {state.currentStep < 7 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-2"
                size="sm"
              >
                Próximo
                <ChevronDown className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={resetFlow}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-4 py-2"
                size="sm"
              >
                Novo Agendamento
              </Button>
            )}
          </div>
          
          <div className="mt-8">
            <AppointmentStepContent 
              currentStep={state.currentStep}
              state={state}
              updateState={updateState}
              resetFlow={resetFlow}
            />
          </div>

          {/* Bottom Navigation and Credits */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={state.currentStep === 1}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50 text-blue-700"
            >
              <ChevronUp className="w-4 h-4" />
              Voltar
            </Button>
            
            {/* Credits centered */}
            <div className="text-xs text-blue-600/70 font-medium">
              Desenvolvido por Sauv®
            </div>
            
            {state.currentStep < 7 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Próximo
                <ChevronDown className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={resetFlow}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Novo Agendamento
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
