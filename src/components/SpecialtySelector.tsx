
import React, { useEffect, useState } from 'react';
import { Specialty } from '@/types/feegow';
import { FeegowApiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
      try {
        console.log("Fetching specialties with unityId:", unityId);
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
            Especialidade
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
            Especialidade
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
          Especialidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        {specialties.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Nenhuma especialidade encontrada</p>
        ) : (
          <Select 
            value={selectedSpecialty?.specialty_id.toString() || ""} 
            onValueChange={(value) => {
              const specialty = specialties.find(s => s.specialty_id.toString() === value);
              if (specialty) {
                onSelect(specialty);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Escolha uma especialidade..." />
            </SelectTrigger>
            <SelectContent side="bottom" position="popper" className="bg-white z-50">
              {specialties.map((specialty) => (
                <SelectItem 
                  key={specialty.specialty_id} 
                  value={specialty.specialty_id.toString()}
                >
                  {specialty.specialty_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
};
