
import React, { useEffect, useState } from 'react';
import { Specialty } from '@/types/feegow';
import { FeegowApiService } from '@/services/feegowApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface SpecialtySelectorProps {
  selectedSpecialty: Specialty | null;
  onSelect: (specialty: Specialty) => void;
}

export const SpecialtySelector: React.FC<SpecialtySelectorProps> = ({ selectedSpecialty, onSelect }) => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await FeegowApiService.getSpecialties();
        setSpecialties(data);
      } catch (error) {
        console.error('Erro ao carregar especialidades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Selecione a Especialidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
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
          Selecione a Especialidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {specialties.map((specialty) => (
            <Button
              key={specialty.specialty_id}
              variant={selectedSpecialty?.specialty_id === specialty.specialty_id ? "default" : "outline"}
              className="p-4 h-auto justify-start"
              onClick={() => onSelect(specialty)}
            >
              <div className="text-left">
                <div className="font-semibold">{specialty.specialty_name}</div>
                {specialty.specialty_description && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {specialty.specialty_description}
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
