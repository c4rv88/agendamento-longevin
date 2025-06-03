
import React, { useRef } from 'react';
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { AppointmentHeader } from '@/components/appointment/AppointmentHeader';
import { AppointmentStepContent } from '@/components/appointment/AppointmentStepContent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const AppointmentScheduler: React.FC = () => {
  const { state, updateState, nextStep, prevStep, resetFlow, scrollToNextSection } = useAppointmentFlow();
  const topRef = useRef<HTMLDivElement>(null);

  const handleStepComplete = () => {
    nextStep();
    scrollToNextSection();
  };

  const handlePrevStep = () => {
    prevStep();
    setTimeout(() => {
      const currentStepElement = document.getElementById(`step-${state.currentStep - 1}`);
      if (currentStepElement) {
        currentStepElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  const canProceedToNextStep = () => {
    switch (state.currentStep) {
      case 1:
        return state.selectedSpecialty && state.selectedProfessional && state.selectedInsurance;
      case 2:
        return state.selectedDate && state.selectedTime;
      case 3:
        return state.patient;
      default:
        return false;
    }
  };

  const showNextButton = () => {
    return state.currentStep <= 3 && canProceedToNextStep();
  };

  const showPrevButton = () => {
    return state.currentStep > 1 && state.currentStep <= 4;
  };

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

          {/* Botões de Navegação */}
          {(showNextButton() || showPrevButton()) && (
            <div className="flex justify-between items-center mt-8">
              {/* Botão Voltar */}
              {showPrevButton() ? (
                <Button 
                  onClick={handlePrevStep}
                  variant="outline"
                  className="bg-white/80 border-[#7B8466] text-[#7B8466] hover:bg-[#7B8466] hover:text-white px-6 py-3 text-lg"
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar
                </Button>
              ) : (
                <div></div>
              )}

              {/* Botão Próximo */}
              {showNextButton() && (
                <Button 
                  onClick={handleStepComplete}
                  className="bg-[#7B8466] hover:bg-[#6B7456] text-white px-6 py-3 text-lg"
                  size="lg"
                >
                  Próximo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          )}

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
