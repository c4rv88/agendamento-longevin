
import React from 'react';
import { Calendar, MapPin, User, CreditCard, Clock } from 'lucide-react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { AppointmentDetail } from './AppointmentDetail';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentSummaryDetailsProps {
  appointmentData: AppointmentState;
}

export const AppointmentSummaryDetails: React.FC<AppointmentSummaryDetailsProps> = ({
  appointmentData
}) => {
  // Function to safely format the date
  const formatSelectedDate = (dateString: string): string => {
    try {
      // Check if date is in dd-mm-yyyy format (from API)
      if (dateString && dateString.includes('-') && dateString.split('-').length === 3) {
        const parts = dateString.split('-');
        
        // If the first part is 4 characters (year), it's in yyyy-MM-dd format
        if (parts[0].length === 4) {
          const date = parse(dateString, 'yyyy-MM-dd', new Date());
          return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        } else {
          // It's in dd-MM-yyyy format
          const date = parse(dateString, 'dd-MM-yyyy', new Date());
          return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        }
      }
      // Fallback for empty or invalid dates
      return dateString || 'Data não selecionada';
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return dateString || 'Data não selecionada';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <AppointmentDetail
          icon={MapPin}
          label="Unidade"
          value={appointmentData.selectedUnity?.unity_name}
        />
        <AppointmentDetail
          icon={User}
          label="Especialidade"
          value={appointmentData.selectedSpecialty?.specialty_name}
          iconColor="text-[#8B8B8B]"
        />
        <AppointmentDetail
          icon={User}
          label="Profissional"
          value={appointmentData.selectedProfessional?.professional_name}
          iconColor="text-green-500"
        />
        <AppointmentDetail
          icon={CreditCard}
          label="Convênio"
          value={appointmentData.selectedInsurance?.insurance_name}
          iconColor="text-orange-500"
        />
      </div>

      <div className="space-y-4">
        <AppointmentDetail
          icon={Calendar}
          label="Data"
          value={formatSelectedDate(appointmentData.selectedDate)}
        />
        <AppointmentDetail
          icon={Clock}
          label="Horário"
          value={appointmentData.selectedTime}
          iconColor="text-[#8B8B8B]"
        />
        <AppointmentDetail
          icon={User}
          label="Paciente"
          value={appointmentData.patient?.patient_name}
          secondaryValue={appointmentData.patient?.patient_phone}
          iconColor="text-green-500"
        />
      </div>
    </div>
  );
};
