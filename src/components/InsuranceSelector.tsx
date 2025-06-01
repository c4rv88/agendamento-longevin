
import React, { useEffect, useState } from 'react';
import { Insurance } from '@/types/feegow';
import { FeegowApiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsurances = async () => {
      if (!professionalId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await FeegowApiService.getInsurances(professionalId);
        console.log('Fetched insurances:', data);
        setInsurances(data);
      } catch (error) {
        console.error('Erro ao carregar convênios:', error);
        setError('Falha ao carregar convênios. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsurances();
  }, [professionalId]);

  const handleSelectInsurance = (insuranceId: string) => {
    const insurance = insurances.find(i => i.insurance_id.toString() === insuranceId);
    if (insurance) {
      onSelect(insurance);
    }
  };

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
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Selecione o Convênio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insurances.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Selecione o Convênio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-gray-500">Nenhum convênio disponível para este profissional.</p>
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
        <Select 
          value={selectedInsurance?.insurance_id.toString() || ""} 
          onValueChange={handleSelectInsurance}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Escolha um convênio" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {insurances.map((insurance) => (
              <SelectItem 
                key={insurance.insurance_id} 
                value={insurance.insurance_id.toString()}
              >
                {insurance.insurance_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
