
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
      
      if (!patientId) {
        console.error('Patient data after creation/retrieval:', patientData);
        throw new Error('ID do paciente não encontrado');
      }

      // Criar agendamento com local_id fixo = 13
      const appointmentPayload = {
        unity_id: 0, // Manter para compatibilidade
        unity_name: 'Longevin',
        local_id: 13, // local_id fixo sempre 13
        specialty_id: appointmentData.selectedSpecialty?.specialty_id,
        professional_id: appointmentData.selectedProfessional?.professional_id,
        insurance_id: appointmentData.selectedInsurance?.insurance_id,
        date: appointmentData.selectedDate,
        time: appointmentData.selectedTime,
        patient_id: patientId,
        patient_phone: patientData.patient_phone,
      };

      console.log('Appointment payload with fixed local_id=13:', appointmentPayload);

      const success = await FeegowApiService.createAppointment(appointmentPayload);
      
      if (success) {
        console.log('=== AGENDAMENTO CRIADO, PREPARANDO DADOS PARA WHATSAPP ===');
        
        // Formatar data no formato DD-MM-AAAA
        let formattedDate = '';
        if (appointmentData.selectedDate) {
          const dateParts = appointmentData.selectedDate.split('-');
          if (dateParts.length === 3) {
            // De YYYY-MM-DD para DD-MM-YYYY
            formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          }
        }
        
        // Formatar horário no formato HH:MM
        let formattedTime = appointmentData.selectedTime || '';
        if (formattedTime && formattedTime.includes(':')) {
          const timeParts = formattedTime.split(':');
          formattedTime = `${timeParts[0]}:${timeParts[1]}`;
        }
        
        // Usar local Longevin
        const formattedLocation = 'Longevin';
        
        console.log('=== DADOS FORMATADOS ===');
        console.log('Data formatada:', formattedDate);
        console.log('Horário formatado:', formattedTime);
        console.log('Local formatado:', formattedLocation);
        
        // Preparar dados do WhatsApp com validação MUITO detalhada
        const whatsappData = {
          nome: String(patientData.patient_name || 'Paciente').trim(),
          especialidade: String(appointmentData.selectedSpecialty?.specialty_name || 'Consulta').trim(),
          data: formattedDate || 'Data não informada',
          horario: formattedTime || '00:00',
          local: formattedLocation,
          profissional: String(appointmentData.selectedProfessional?.professional_name || 'Profissional').trim(),
          convenio: String(appointmentData.selectedInsurance?.insurance_name || 'Particular').trim(),
          telefone: String(patientData.patient_phone || '').replace(/\D/g, '')
        };

        console.log('=== DADOS FINAIS PARA WHATSAPP ===');
        Object.entries(whatsappData).forEach(([key, value]) => {
          console.log(`${key}:`, typeof value, `"${value}"`, value.length, 'chars');
          if (key !== 'telefone' && (!value || value.trim() === '')) {
            console.error(`🚨 CAMPO CRÍTICO VAZIO: ${key}`);
          }
        });

        if (!whatsappData.telefone) {
          console.error('⚠️ TELEFONE VAZIO - WHATSAPP NÃO PODE SER ENVIADO');
        }

        console.log('=== INICIANDO ENVIO WHATSAPP ===');
        try {
          const whatsappSent = await WhatsAppService.sendAppointmentNotification(whatsappData);
          
          if (whatsappSent) {
            console.log('✅ WHATSAPP ENVIADO COM SUCESSO');
          } else {
            console.warn('❌ FALHA AO ENVIAR WHATSAPP');
          }
        } catch (whatsappError) {
          console.error('=== ERRO NO WHATSAPP ===');
          console.error('Error sending WhatsApp notification:', whatsappError);
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
      
      // Verificar se é o erro específico de agendamento duplicado
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
