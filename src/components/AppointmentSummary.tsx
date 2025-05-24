
import React, { useState } from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { FeegowApiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, MapPin, User, CreditCard, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentSummaryProps {
  appointmentData: AppointmentState;
  onConfirm: () => void;
}

export const AppointmentSummary: React.FC<AppointmentSummaryProps> = ({ 
  appointmentData, 
  onConfirm 
}) => {
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      // Se o paciente não tem ID, criar primeiro
      let patientData = appointmentData.patient;
      if (!patientData?.patient_id) {
        patientData = await FeegowApiService.createPatient(appointmentData.patient!);
        if (!patientData) {
          throw new Error('Erro ao criar paciente');
        }
      }

      // Criar agendamento
      const appointmentPayload = {
        unity_id: appointmentData.selectedUnity?.unity_id,
        specialty_id: appointmentData.selectedSpecialty?.specialty_id,
        professional_id: appointmentData.selectedProfessional?.professional_id,
        insurance_id: appointmentData.selectedInsurance?.insurance_id,
        date: appointmentData.selectedDate,
        time: appointmentData.selectedTime,
        patient_id: patientData.patient_id,
        notes: 'Agendamento via sistema online',
      };

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
      toast({
        title: "Erro no agendamento",
        description: "Ocorreu um erro ao confirmar o agendamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setConfirming(false);
    }
  };

  if (confirmed) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Agendamento Confirmado!
          </h2>
          <p className="text-gray-600 mb-6">
            Seu agendamento foi realizado com sucesso. Você receberá uma confirmação em breve.
          </p>
          <Button onClick={onConfirm} className="bg-gradient-to-r from-green-600 to-blue-600">
            Fazer Novo Agendamento
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Resumo do Agendamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-semibold">Unidade</div>
                <div className="text-sm text-gray-600">
                  {appointmentData.selectedUnity?.unity_name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-semibold">Especialidade</div>
                <div className="text-sm text-gray-600">
                  {appointmentData.selectedSpecialty?.specialty_name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-semibold">Profissional</div>
                <div className="text-sm text-gray-600">
                  {appointmentData.selectedProfessional?.professional_name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-orange-500" />
              <div>
                <div className="font-semibold">Convênio</div>
                <div className="text-sm text-gray-600">
                  {appointmentData.selectedInsurance?.insurance_name}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-semibold">Data</div>
                <div className="text-sm text-gray-600">
                  {format(new Date(appointmentData.selectedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-semibold">Horário</div>
                <div className="text-sm text-gray-600">
                  {appointmentData.selectedTime}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-semibold">Paciente</div>
                <div className="text-sm text-gray-600">
                  {appointmentData.patient?.patient_name}
                </div>
                <div className="text-sm text-gray-600">
                  {appointmentData.patient?.patient_phone}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t">
          <Button
            onClick={handleConfirm}
            disabled={confirming}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            size="lg"
          >
            {confirming ? 'Confirmando...' : 'Confirmar Agendamento'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
