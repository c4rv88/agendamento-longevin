

import { useState } from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { FeegowApiService } from '@/services/api';
import { WhatsAppService } from '@/services/whatsapp/whatsappService';
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
      
      // Se o paciente não tem ID, criar primeiro
      let patientData = appointmentData.patient;
      if (!patientData?.patient_id) {
        console.log('Creating new patient...');
        console.log('Patient data before creation:', patientData);
        patientData = await FeegowApiService.createPatient(appointmentData.patient!);
        console.log('Patient data after creation:', patientData);
        if (!patientData) {
          throw new Error('Erro ao criar paciente');
        }
        console.log('Patient created with ID:', patientData.patient_id);
      }

      // Garantir que temos um patient_id válido
      const patientId = patientData.patient_id;
      console.log('Final patient ID to use:', patientId);
      console.log('Patient ID type:', typeof patientId);
      console.log('Patient ID value:', patientId);
      
      if (!patientId) {
        console.error('Patient data after creation/retrieval:', patientData);
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
        patient_id: patientId,
        patient_phone: patientData.patient_phone,
      };

      console.log('Appointment payload with patient ID:', appointmentPayload);

      const success = await FeegowApiService.createAppointment(appointmentPayload);
      
      if (success) {
        console.log('=== AGENDAMENTO CRIADO, ENVIANDO WHATSAPP ===');
        
        // Enviar notificação via WhatsApp
        try {
          // Formatar data para exibição (DD/MM/YYYY)
          const formattedDate = appointmentData.selectedDate.split('-').reverse().join('/');
          
          const whatsappData = {
            nome: patientData.patient_name,
            especialidade: appointmentData.selectedSpecialty?.specialty_name || '',
            data: formattedDate,
            horario: appointmentData.selectedTime,
            local: appointmentData.selectedUnity?.unity_name || '',
            profissional: appointmentData.selectedProfessional?.professional_name || '',
            telefone: patientData.patient_phone
          };

          console.log('=== DADOS PARA WHATSAPP ===');
          console.log('WhatsApp data being sent:', whatsappData);
          
          // Validar se todos os campos obrigatórios estão preenchidos
          const missingFields = [];
          if (!whatsappData.nome) missingFields.push('nome');
          if (!whatsappData.especialidade) missingFields.push('especialidade');
          if (!whatsappData.data) missingFields.push('data');
          if (!whatsappData.horario) missingFields.push('horario');
          if (!whatsappData.local) missingFields.push('local');
          if (!whatsappData.profissional) missingFields.push('profissional');
          if (!whatsappData.telefone) missingFields.push('telefone');
          
          if (missingFields.length > 0) {
            console.error('Campos obrigatórios faltando:', missingFields);
            console.warn('Enviando WhatsApp mesmo com campos faltando...');
          }

          const whatsappSent = await WhatsAppService.sendAppointmentNotification(whatsappData);
          
          if (whatsappSent) {
            console.log('=== WHATSAPP ENVIADO COM SUCESSO ===');
          } else {
            console.warn('=== FALHA AO ENVIAR WHATSAPP ===');
            console.warn('Agendamento foi criado, mas WhatsApp falhou');
          }
        } catch (whatsappError) {
          console.error('=== ERRO NO WHATSAPP ===');
          console.error('Error sending WhatsApp notification:', whatsappError);
          // Não falhar o agendamento se o WhatsApp falhar
        }

        setConfirmed(true);
        toast({
          title: "Agendamento confirmado!",
          description: "Seu agendamento foi realizado com sucesso.",
        });
      } else {
        throw new Error('Erro ao criar agendamento');
      }
    } catch (error) {
      console.error('=== ERRO GERAL NA CONFIRMAÇÃO ===');
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

