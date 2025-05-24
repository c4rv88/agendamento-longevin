
import React, { useState } from 'react';
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow';
import { UnitySelector } from './UnitySelector';
import { SpecialtySelector } from './SpecialtySelector';
import { ProfessionalSelector } from './ProfessionalSelector';
import { InsuranceSelector } from './InsuranceSelector';
import { DateTimeSelector } from './DateTimeSelector';
import { PatientForm } from './PatientForm';
import { AppointmentSummary } from './AppointmentSummary';
import { ProgressIndicator } from './ProgressIndicator';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';

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
      case 1: return !!state.selectedSpecialty;
      case 2: return !!state.selectedProfessional;
      case 3: return !!state.selectedUnity;
      case 4: return !!state.selectedInsurance;
      case 5: return !!state.selectedDate && !!state.selectedTime;
      case 6: return !!state.patient;
      default: return false;
    }
  };

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <SpecialtySelector
            selectedSpecialty={state.selectedSpecialty}
            onSelect={(specialty) => {
              // Clear professionals when selecting a new specialty
              updateState({ 
                selectedSpecialty: specialty,
                selectedProfessional: null,
                selectedUnity: null 
              });
            }}
          />
        );
      case 2:
        return (
          <ProfessionalSelector
            selectedProfessional={state.selectedProfessional}
            specialtyId={state.selectedSpecialty?.specialty_id}
            onSelect={(professional) => {
              // Clear unity when selecting a new professional
              updateState({ 
                selectedProfessional: professional,
                selectedUnity: null 
              });
            }}
          />
        );
      case 3:
        return (
          <UnitySelector
            selectedUnity={state.selectedUnity}
            professionalId={state.selectedProfessional?.professional_id}
            specialtyId={state.selectedSpecialty?.specialty_id}
            onSelect={(unity) => updateState({ selectedUnity: unity })}
          />
        );
      case 4:
        return (
          <InsuranceSelector
            selectedInsurance={state.selectedInsurance}
            professionalId={state.selectedProfessional?.professional_id}
            onSelect={(insurance) => updateState({ selectedInsurance: insurance })}
          />
        );
      case 5:
        return (
          <DateTimeSelector
            selectedDate={state.selectedDate}
            selectedTime={state.selectedTime}
            professionalId={state.selectedProfessional?.professional_id!}
            unityId={state.selectedUnity?.unity_id}
            specialtyId={state.selectedSpecialty?.specialty_id}
            onSelectDate={(date) => updateState({ selectedDate: date })}
            onSelectTime={(time) => updateState({ selectedTime: time })}
          />
        );
      case 6:
        return (
          <PatientForm
            patient={state.patient}
            onPatientUpdate={(patient) => updateState({ patient })}
          />
        );
      case 7:
        return <AppointmentSummary appointmentData={state} onConfirm={resetFlow} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header com Logo */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {logoUrl && (
                <img src={logoUrl} alt="Logo da Clínica" className="h-12 w-auto object-contain" />
              )}
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Agendamento Online
                </h1>
                <p className="text-sm text-gray-600">Sistema Feegow</p>
              </div>
            </div>
            <div className="hidden md:block">
              <input
                type="url"
                placeholder="URL do logotipo da clínica"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressIndicator currentStep={state.currentStep} totalSteps={7} />
          
          <div className="mt-8">
            {renderCurrentStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={state.currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowUp className="w-4 h-4" />
              Voltar
            </Button>
            
            {state.currentStep < 7 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Próximo
                <ArrowDown className="w-4 h-4" />
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
