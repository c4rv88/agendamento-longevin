
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
            className="w-full bg-gradient-to-r from-blue-800 via-white to-blue-800 text-blue-900 hover:from-blue-900 hover:via-blue-50 hover:to-blue-900 border border-blue-800"
            size="lg"
          >
            {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
