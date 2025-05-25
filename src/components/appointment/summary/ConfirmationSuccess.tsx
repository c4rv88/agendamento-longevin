
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
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
          <span className="relative z-10 font-medium">
            Novo Agendamento
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};
