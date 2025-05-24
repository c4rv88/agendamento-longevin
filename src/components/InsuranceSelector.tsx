
import React, { useEffect, useState } from 'react';
import { Insurance } from '@/types/feegow';
import { FeegowApiService } from '@/services/feegowApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

interface InsuranceSelectorProps {
  selectedInsurance: Insurance | null;
  professionalId?: number;
  onSelect: (insurance: Insurance) => void;
}

export const InsuranceSelector: React.FC<InsuranceSelectorProps> = ({ 
  selectedInsurance, 
  professionalId, 
  onSelect 
}) => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsurances = async () => {
      if (!professionalId) return;
      
      try {
        setLoading(true);
        const data = await FeegowApiService.getInsurances(professionalId);
        setInsurances(data);
      } catch (error) {
        console.error('Erro ao carregar convênios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsurances();
  }, [professionalId]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Selecione o Convênio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Selecione o Convênio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            variant={!selectedInsurance ? "default" : "outline"}
            className="w-full p-4 h-auto justify-start"
            onClick={() => onSelect({ insurance_id: 0, insurance_name: 'Particular', professional_id: professionalId! })}
          >
            <div className="text-left">
              <div className="font-semibold">Particular</div>
              <div className="text-sm text-muted-foreground">Pagamento direto</div>
            </div>
          </Button>
          
          {insurances.map((insurance) => (
            <Button
              key={insurance.insurance_id}
              variant={selectedInsurance?.insurance_id === insurance.insurance_id ? "default" : "outline"}
              className="w-full p-4 h-auto justify-start"
              onClick={() => onSelect(insurance)}
            >
              <div className="text-left">
                <div className="font-semibold">{insurance.insurance_name}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
