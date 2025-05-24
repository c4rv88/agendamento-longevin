
import React, { useEffect, useState } from 'react';
import { Professional } from '@/types/feegow';
import { FeegowApiService } from '@/services/feegowApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface ProfessionalSelectorProps {
  selectedProfessional: Professional | null;
  unityId?: number;
  specialtyId?: number;
  onSelect: (professional: Professional) => void;
}

export const ProfessionalSelector: React.FC<ProfessionalSelectorProps> = ({ 
  selectedProfessional, 
  unityId, 
  specialtyId, 
  onSelect 
}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      if (!unityId || !specialtyId) return;
      
      try {
        setLoading(true);
        const data = await FeegowApiService.getProfessionals(unityId, specialtyId);
        setProfessionals(data);
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [unityId, specialtyId]);

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
                {professional.professional_email && (
                  <div className="text-sm text-muted-foreground">
                    {professional.professional_email}
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
