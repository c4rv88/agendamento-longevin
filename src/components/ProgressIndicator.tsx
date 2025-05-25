
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
    'Unidade',
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
        <span className="text-sm font-medium text-blue-700">
          Etapa {currentStep} de {totalSteps}
        </span>
        <span className="text-sm text-blue-600/70">
          {Math.round((currentStep / totalSteps) * 100)}% concluído
        </span>
      </div>
      
      <div className="w-full bg-blue-100 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      <div className="hidden md:flex justify-between text-xs text-blue-600/70">
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              "flex flex-col items-center",
              index + 1 === currentStep && "text-blue-600 font-semibold",
              index + 1 < currentStep && "text-green-600"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center mb-1",
                index + 1 === currentStep && "border-blue-600 bg-blue-50",
                index + 1 < currentStep && "border-green-600 bg-green-50",
                index + 1 > currentStep && "border-blue-300"
              )}
            >
              {index + 1 < currentStep ? (
                <span className="text-green-600">✓</span>
              ) : (
                <span className={cn(
                  index + 1 === currentStep ? "text-blue-600" : "text-blue-400"
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
