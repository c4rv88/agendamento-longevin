
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConfirmationSuccessProps {
  onConfirm: () => void;
}

export const ConfirmationSuccess: React.FC<ConfirmationSuccessProps> = ({ onConfirm }) => {
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
        <Button 
          onClick={onConfirm} 
          className="bg-gradient-to-r from-blue-800 via-white to-blue-800 text-blue-900 hover:from-blue-900 hover:via-blue-50 hover:to-blue-900 border border-blue-800"
        >
          Novo Agendamento
        </Button>
      </CardContent>
    </Card>
  );
};
