
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
      if (!professionalId) {
        setLoading(false);
        setError('ID do profissional não fornecido');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching insurances for professional:', professionalId);
        const data = await FeegowApiService.getInsurances(professionalId);
        
        console.log('Insurance data received:', data);
        setInsurances(data);
        
        // If no insurances found (only "Particular"), show appropriate message
        if (data.length === 1 && data[0].insurance_name === 'Particular') {
          console.log('Only "Particular" option available for professional:', professionalId);
        }
        
      } catch (error) {
        console.error('Error loading insurances:', error);
        setError('Falha ao carregar convênios. Verifique a conexão com a API.');
        
        // Set only "Particular" as fallback
        setInsurances([{
          insurance_id: 0,
          insurance_name: 'Particular',
          professional_id: professionalId
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsurances();
  }, [professionalId]);

  const handleSelectInsurance = (insuranceId: string) => {
    const insurance = insurances.find(i => i.insurance_id.toString() === insuranceId);
    if (insurance) {
      console.log('Selected insurance:', insurance);
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
            <p className="text-red-500 text-sm">{error}</p>
            <p className="text-gray-500 text-xs mt-2">Apenas consultas particulares disponíveis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasOnlyParticular = insurances.length === 1 && insurances[0].insurance_name === 'Particular';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Selecione o Convênio
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasOnlyParticular ? (
          <div className="p-4 text-center bg-blue-50 rounded-lg border">
            <p className="text-blue-700 font-medium">Apenas consultas particulares disponíveis</p>
            <p className="text-blue-600 text-sm mt-1">
              Este profissional não possui convênios cadastrados
            </p>
          </div>
        ) : (
          <Select 
            value={selectedInsurance?.insurance_id.toString() || ""} 
            onValueChange={handleSelectInsurance}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Escolha um convênio" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {insurances.map((insurance) => (
                <SelectItem 
                  key={insurance.insurance_id} 
                  value={insurance.insurance_id.toString()}
                  className="cursor-pointer hover:bg-blue-50"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>{insurance.insurance_name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {insurances.length > 1 && (
          <p className="text-xs text-gray-500 mt-2">
            {insurances.length - 1} convênio(s) + Particular disponíveis
          </p>
        )}
      </CardContent>
    </Card>
  );
};
