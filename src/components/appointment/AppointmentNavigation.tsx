
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface AppointmentNavigationProps {
  currentStep: number;
  canProceed: boolean;
  onNext: () => void;
  onPrev: () => void;
  onReset?: () => void;
}

export const AppointmentNavigation: React.FC<AppointmentNavigationProps> = ({
  currentStep,
  canProceed,
  onNext,
  onPrev,
  onReset
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentStep === 1}
        className="flex items-center gap-2"
      >
        <ChevronUp className="w-4 h-4" />
        Voltar
      </Button>
      
      {currentStep < 7 ? (
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Próximo
          <ChevronDown className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          onClick={onReset}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          Novo Agendamento
        </Button>
      )}
    </div>
  );
};
