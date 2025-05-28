
import React, { useEffect, useState } from 'react';
import { Professional } from '@/types/feegow';
import { FeegowApiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAutoScroll } from '@/hooks/useAutoScroll';

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
  const { scrollToElement } = useAutoScroll();

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

  const handleSelectProfessional = (professionalId: string) => {
    const professional = professionals.find(p => p.professional_id.toString() === professionalId);
    if (professional) {
      onSelect(professional);
      // Rolar para baixo após selecionar profissional
      setTimeout(() => {
        window.scrollBy({ top: 300, behavior: 'smooth' });
      }, 300);
    }
  };

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
            <User className="w-5 h-5" />
            Selecione o Profissional
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
        <Select 
          value={selectedProfessional?.professional_id.toString() || ""} 
          onValueChange={handleSelectProfessional}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Escolha um profissional" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {professionals.map((professional) => (
              <SelectItem 
                key={professional.professional_id} 
                value={professional.professional_id.toString()}
              >
                {professional.professional_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
