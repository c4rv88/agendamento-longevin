
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
          
          {/* Centered Navigation Buttons - Only show on steps 1-6 */}
          {state.currentStep < 7 && (
            <div className="flex justify-center items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={state.currentStep === 1}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-[#004264] hover:bg-blue-50 text-[#004264] px-3 py-1.5"
                style={{ borderColor: '#004264', color: '#004264' }}
                size="sm"
              >
                <ChevronUp className="w-3 h-3" />
                Voltar
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-3 py-1.5"
                style={{ backgroundColor: '#004264' }}
                size="sm"
              >
                Próximo
                <ChevronDown className="w-3 h-3" />
              </Button>
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

          {/* Bottom Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={state.currentStep === 1}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-[#004264] hover:bg-blue-50 text-[#004264]"
              style={{ borderColor: '#004264', color: '#004264' }}
            >
              <ChevronUp className="w-4 h-4" />
              Voltar
            </Button>
            
            {state.currentStep < 7 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2"
                style={{ backgroundColor: '#004264' }}
              >
                Próximo
                <ChevronDown className="w-4 h-4" />
              </Button>
            ) : (
              <div></div> // Empty div to maintain flex layout
            )}
          </div>

          {/* Credits with Sauv logo - Below bottom navigation */}
          <div className="flex justify-center mt-6 mb-4">
            <div className="flex items-center gap-2 text-xs text-blue-800/70 font-medium">
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
