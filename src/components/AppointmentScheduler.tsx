
import React, { useRef, useEffect } from 'react';
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { AppointmentHeader } from '@/components/appointment/AppointmentHeader';
import { AppointmentStepContent } from '@/components/appointment/AppointmentStepContent';

export const AppointmentScheduler: React.FC = () => {
  const { state, updateState, nextStep, prevStep, resetFlow, scrollToNextSection } = useAppointmentFlow();
  const topRef = useRef<HTMLDivElement>(null);

  const handleStepComplete = () => {
    nextStep();
    scrollToNextSection();
  };

  // Auto-scroll para próxima etapa quando data/hora são selecionados
  useEffect(() => {
    if (state.currentStep === 2 && state.selectedDate && state.selectedTime) {
      const timer = setTimeout(() => {
        handleStepComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.selectedDate, state.selectedTime, state.currentStep]);

  // Auto-scroll para próxima etapa quando paciente é preenchido
  useEffect(() => {
    if (state.currentStep === 3 && state.patient) {
      const timer = setTimeout(() => {
        handleStepComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.patient, state.currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6DCCD] via-[#A6AD97] to-[#7B8466]">
      {/* Header */}
      <AppointmentHeader />

      <div className="container mx-auto px-4 py-8" ref={topRef}>
        <div className="max-w-4xl mx-auto">
          <ProgressIndicator currentStep={state.currentStep} totalSteps={4} />
          
          <div className="mt-8">
            <AppointmentStepContent 
              currentStep={state.currentStep}
              state={state}
              updateState={updateState}
              resetFlow={resetFlow}
              onStepComplete={handleStepComplete}
            />
          </div>

          {/* Credits with Sauv logo */}
          <div className="flex justify-center mt-12 mb-4">
            <div className="flex items-center gap-2 text-xs text-[#616160]/70 font-medium">
              <span>Desenvolvido por</span>
              <a 
                href="https://sauv.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center opacity-70 hover:opacity-100 transition-opacity"
              >
                <img 
                  src="https://isv.med.br/wp-content/uploads/2025/05/sauv-preto2-e1748220200282.png" 
                  alt="Sauv" 
                  className="h-5 w-auto"
                  style={{ display: 'block' }}
                  onError={(e) => {
                    console.error('Erro ao carregar logo da Sauv:', e);
                    console.log('URL da imagem:', e.currentTarget.src);
                  }}
                  onLoad={(e) => {
                    console.log('Logo da Sauv carregada com sucesso');
                    console.log('Dimensões da imagem:', {
                      width: (e.target as HTMLImageElement).naturalWidth,
                      height: (e.target as HTMLImageElement).naturalHeight
                    });
                  }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
