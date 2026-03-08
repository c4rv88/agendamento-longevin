import { useState } from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { FeegowApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useAppointmentConfirmation = () => {
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { toast } = useToast();

  const handleConfirmAppointment = async (appointmentData: AppointmentState) => {
    setConfirming(true);
    try {
      console.log('=== INICIANDO CONFIRMAÇÃO DE AGENDAMENTO ===');
      console.log('Dados do agendamento:', appointmentData);
      
      let patientData = appointmentData.patient;
      if (!patientData?.patient_id) {
        console.log('Creating new patient...');
        patientData = await FeegowApiService.createPatient(appointmentData.patient!);
        if (!patientData) {
          throw new Error('Erro ao criar paciente');
        }
        console.log('Patient created with ID:', patientData.patient_id);
      }

      const patientId = patientData.patient_id;
      if (!patientId) {
        throw new Error('ID do paciente não encontrado');
      }

      const appointmentPayload = {
        unity_id: 0,
        unity_name: 'Longevin',
        local_id: 13,
        specialty_id: appointmentData.selectedSpecialty?.specialty_id,
        professional_id: appointmentData.selectedProfessional?.professional_id,
        insurance_id: appointmentData.selectedInsurance?.insurance_id,
        date: appointmentData.selectedDate,
        time: appointmentData.selectedTime,
        patient_id: patientId,
        patient_phone: patientData.patient_phone,
      };

      console.log('Appointment payload:', appointmentPayload);

      const success = await FeegowApiService.createAppointment(appointmentPayload);
      
      if (success) {
        setConfirmed(true);
        toast({
          title: "Agendamento confirmado!",
          description: "Seu agendamento foi realizado com sucesso.",
        });
      } else {
        throw new Error('Erro ao criar agendamento');
      }
    } catch (error) {
      console.error('Error in appointment confirmation:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('já possui um agendamento nessa agenda') || 
          errorMessage.includes('Esse paciente já possui um agendamento')) {
        toast({
          title: "Agendamento já existe",
          description: "Este paciente já possui um agendamento para este profissional nesta data e horário. Escolha outro horário ou data.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro no agendamento",
          description: "Ocorreu um erro ao confirmar o agendamento. Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setConfirming(false);
    }
  };

  return {
    confirming,
    confirmed,
    handleConfirmAppointment,
    setConfirmed,
  };
};
