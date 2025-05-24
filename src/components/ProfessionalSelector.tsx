
import React, { useEffect, useState } from 'react';
import { Professional } from '@/types/feegow';
import { FeegowApiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfessionalSelectorProps {
  selectedProfessional: Professional | null;
  specialtyId?: number;
  unityId?: number;
  onSelect: (professional: Professional) => void;
}

export const ProfessionalSelector: React.FC<ProfessionalSelectorProps> = ({ 
  selectedProfessional, 
  specialtyId,
  unityId,
  onSelect 
}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      if (!specialtyId) {
        setLoading(false);
        setError('Por favor, selecione uma especialidade primeiro.');
        return;
      }
      
      try {
        console.log('Fetching professionals with filters:', { specialtyId, unityId });
        setLoading(true);
        setError(null);
        const data = await FeegowApiService.getProfessionals(specialtyId, unityId);
        console.log('Professionals fetched:', data);
        setProfessionals(data);
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
        setError('Falha ao carregar profissionais. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [specialtyId, unityId]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Selecione o Profissional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Selecione o Profissional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (professionals.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Selecione o Profissional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-gray-500">Nenhum profissional encontrado para esta especialidade.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Selecione o Profissional
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {professionals.map((professional) => (
            <Button
              key={professional.professional_id}
              variant={selectedProfessional?.professional_id === professional.professional_id ? "default" : "outline"}
              className="p-4 h-auto justify-start"
              onClick={() => onSelect(professional)}
            >
              <div className="text-left">
                <div className="font-semibold">{professional.professional_name}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
