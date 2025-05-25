
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
      // Se o paciente não tem ID, criar primeiro
      let patientData = appointmentData.patient;
      if (!patientData?.patient_id) {
        console.log('Creating new patient...');
        patientData = await FeegowApiService.createPatient(appointmentData.patient!);
        if (!patientData) {
          throw new Error('Erro ao criar paciente');
        }
        console.log('Patient created with ID:', patientData.patient_id);
      }

      // Garantir que temos um patient_id válido
      const patientId = patientData.patient_id;
      if (!patientId) {
        throw new Error('ID do paciente não encontrado');
      }

      // Criar agendamento com o ID do paciente correto
      const appointmentPayload = {
        unity_id: appointmentData.selectedUnity?.unity_id,
        unity_name: appointmentData.selectedUnity?.unity_name,
        specialty_id: appointmentData.selectedSpecialty?.specialty_id,
        professional_id: appointmentData.selectedProfessional?.professional_id,
        insurance_id: appointmentData.selectedInsurance?.insurance_id,
        date: appointmentData.selectedDate,
        time: appointmentData.selectedTime,
        patient_id: patientId, // Usar o ID do paciente criado/existente
        patient_phone: patientData.patient_phone,
      };

      console.log('Appointment payload with patient ID:', appointmentPayload);

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
      toast({
        title: "Erro no agendamento",
        description: "Ocorreu um erro ao confirmar o agendamento. Tente novamente.",
        variant: "destructive",
      });
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
