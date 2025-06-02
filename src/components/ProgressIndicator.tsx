
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  const steps = [
    'Especialidade', 
    'Profissional',
    'Convênio',
    'Data/Hora',
    'Paciente',
    'Confirmação'
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[#7B8466]">
          Etapa {currentStep} de {totalSteps}
        </span>
        <span className="text-sm text-[#7B8466]/70">
          {Math.round((currentStep / totalSteps) * 100)}% concluído
        </span>
      </div>
      
      <div className="w-full bg-[#E6DCCD]/50 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-[#7B8466] to-[#A6AD97] h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      <div className="hidden md:flex justify-between text-xs text-[#7B8466]/70">
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              "flex flex-col items-center",
              index + 1 === currentStep && "text-[#7B8466] font-semibold",
              index + 1 < currentStep && "text-[#A6AD97]"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center mb-1",
                index + 1 === currentStep && "border-[#7B8466] bg-[#E6DCCD]/30",
                index + 1 < currentStep && "border-[#A6AD97] bg-[#A6AD97]/20",
                index + 1 > currentStep && "border-[#7B8466]/30"
              )}
            >
              {index + 1 < currentStep ? (
                <span className="text-[#A6AD97]">✓</span>
              ) : (
                <span className={cn(
                  index + 1 === currentStep ? "text-[#7B8466]" : "text-[#7B8466]/50"
                )}>
                  {index + 1}
                </span>
              )}
            </div>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
