
import React, { useEffect, useState } from 'react';
import { Unity } from '@/types/feegow';
import { FeegowApiService } from '@/services/feegowApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface UnitySelectorProps {
  selectedUnity: Unity | null;
  onSelect: (unity: Unity) => void;
}

export const UnitySelector: React.FC<UnitySelectorProps> = ({ selectedUnity, onSelect }) => {
  const [unities, setUnities] = useState<Unity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnities = async () => {
      try {
        console.log("Fetching unities...");
        const data = await FeegowApiService.getUnities();
        console.log("Unities fetched:", data);
        setUnities(data);
      } catch (error) {
        console.error('Erro ao carregar unidades:', error);
        setError('Falha ao carregar unidades. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchUnities();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Selecione a Unidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
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
            <MapPin className="w-5 h-5" />
            Selecione a Unidade
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
          <MapPin className="w-5 h-5" />
          Selecione a Unidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {unities.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Nenhuma unidade encontrada</p>
          ) : (
            unities.map((unity) => (
              <Button
                key={unity.unity_id}
                variant={selectedUnity?.unity_id === unity.unity_id ? "default" : "outline"}
                className="w-full p-4 h-auto justify-start"
                onClick={() => onSelect(unity)}
              >
                <div className="text-left">
                  <div className="font-semibold">{unity.unity_name}</div>
                  <div className="text-sm text-muted-foreground">{unity.unity_address}</div>
                  <div className="text-sm text-muted-foreground">{unity.unity_phone}</div>
                </div>
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
