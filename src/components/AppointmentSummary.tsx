
import React from 'react';
import { AppointmentState } from '@/hooks/useAppointmentFlow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { ConfirmationSuccess } from './appointment/summary/ConfirmationSuccess';
import { AppointmentSummaryDetails } from './appointment/summary/AppointmentSummaryDetails';

interface AppointmentSummaryProps {
  appointmentData: AppointmentState;
  onConfirm: () => void;
  loading?: boolean;
  success?: boolean;
  onReset?: () => void;
}

export const AppointmentSummary: React.FC<AppointmentSummaryProps> = ({ 
  appointmentData, 
  onConfirm,
  loading = false,
  success = false,
  onReset
}) => {
  if (success) {
    return <ConfirmationSuccess onConfirm={onReset || onConfirm} />;
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
        <AppointmentSummaryDetails appointmentData={appointmentData} />

        <div className="pt-6 border-t">
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:hover:shadow-lg"
            size="lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative z-10 font-medium">
              {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
