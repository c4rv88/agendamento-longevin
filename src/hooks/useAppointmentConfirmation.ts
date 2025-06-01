

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
        console.log('=== AGENDAMENTO CRIADO, PREPARANDO DADOS PARA WHATSAPP ===');
        
        // Formatar data para exibição (DD/MM/YYYY)
        const formattedDate = appointmentData.selectedDate?.split('-').reverse().join('/') || '';
        
        // Preparar dados do WhatsApp com validação MUITO detalhada
        console.log('=== DADOS BRUTOS ANTES DA PREPARAÇÃO ===');
        console.log('patientData.patient_name:', typeof patientData.patient_name, JSON.stringify(patientData.patient_name));
        console.log('appointmentData.selectedSpecialty?.specialty_name:', typeof appointmentData.selectedSpecialty?.specialty_name, JSON.stringify(appointmentData.selectedSpecialty?.specialty_name));
        console.log('formattedDate:', typeof formattedDate, JSON.stringify(formattedDate));
        console.log('appointmentData.selectedTime:', typeof appointmentData.selectedTime, JSON.stringify(appointmentData.selectedTime));
        console.log('appointmentData.selectedUnity?.unity_name:', typeof appointmentData.selectedUnity?.unity_name, JSON.stringify(appointmentData.selectedUnity?.unity_name));
        console.log('appointmentData.selectedProfessional?.professional_name:', typeof appointmentData.selectedProfessional?.professional_name, JSON.stringify(appointmentData.selectedProfessional?.professional_name));
        console.log('patientData.patient_phone:', typeof patientData.patient_phone, JSON.stringify(patientData.patient_phone));
        
        const whatsappData = {
          nome: String(patientData.patient_name || '').trim() || 'Nome não informado',
          especialidade: String(appointmentData.selectedSpecialty?.specialty_name || '').trim() || 'Especialidade não informada',
          data: String(formattedDate || '').trim() || 'Data não informada',
          horario: String(appointmentData.selectedTime || '').trim() || 'Horário não informado',
          local: String(appointmentData.selectedUnity?.unity_name || '').trim() || 'Local não informado',
          profissional: String(appointmentData.selectedProfessional?.professional_name || '').trim() || 'Profissional não informado',
          telefone: String(patientData.patient_phone || '').replace(/\D/g, '') || ''
        };

        console.log('=== DADOS PARA WHATSAPP (APÓS PROCESSAMENTO) ===');
        Object.entries(whatsappData).forEach(([key, value]) => {
          console.log(`${key}:`, typeof value, `"${value}"`, value.length, 'chars');
        });
        
        // Verificar se algum campo crítico está vazio
        const criticalFields = ['nome', 'especialidade', 'data', 'horario', 'local', 'profissional'];
        const emptyFields = criticalFields.filter(field => !whatsappData[field as keyof typeof whatsappData] || whatsappData[field as keyof typeof whatsappData].trim() === '');
        
        if (emptyFields.length > 0) {
          console.error('⚠️ CAMPOS CRÍTICOS VAZIOS:', emptyFields);
          console.error('⚠️ DADOS COMPLETOS:', whatsappData);
        }

        if (!whatsappData.telefone) {
          console.error('⚠️ TELEFONE VAZIO - WHATSAPP NÃO PODE SER ENVIADO');
          // Ainda assim, continuar com o processo já que o agendamento foi criado
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
