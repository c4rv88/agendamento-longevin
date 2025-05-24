
import React, { useEffect, useState } from 'react';
import { Specialty } from '@/types/feegow';
import { FeegowApiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SpecialtySelectorProps {
  selectedSpecialty: Specialty | null;
  unityId?: number;
  onSelect: (specialty: Specialty) => void;
}

export const SpecialtySelector: React.FC<SpecialtySelectorProps> = ({ 
  selectedSpecialty, 
  unityId, 
  onSelect 
}) => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialties = async () => {
      if (!unityId) {
        setLoading(false);
        setError('Por favor, selecione uma unidade primeiro.');
        return;
      }
    
      try {
        console.log("Fetching specialties for unity ID:", unityId);
        setLoading(true);
        setError(null);
        const data = await FeegowApiService.getSpecialties(unityId);
        console.log("Specialties fetched:", data);
        setSpecialties(data);
      } catch (error) {
        console.error('Erro ao carregar especialidades:', error);
        setError('Falha ao carregar especialidades. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, [unityId]);

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
            Selecione a Especialidade
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
          {specialties.length === 0 ? (
            <p className="text-center text-gray-500 py-4 col-span-2">Nenhuma especialidade encontrada para esta unidade</p>
          ) : (
            specialties.map((specialty) => (
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
