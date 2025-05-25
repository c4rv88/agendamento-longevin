
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatCpf } from '@/utils/formatters';
import { FeegowApiService } from '@/services/api';
import { Patient } from '@/types/feegow';

interface PatientSearchProps {
  onPatientFound: (patient: Patient) => void;
  onSearchComplete: (found: boolean, cpf?: string, phone?: string) => void;
}

export const PatientSearch: React.FC<PatientSearchProps> = ({ 
  onPatientFound, 
  onSearchComplete 
}) => {
  const [searchCpf, setSearchCpf] = useState('');
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchCpf) {
      toast({
        title: "Erro",
        description: "Informe o CPF para buscar",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);
    try {
      // Garantir que o CPF esteja sendo enviado apenas com números
      const cleanCpf = searchCpf.replace(/\D/g, '');
      
      console.log('Buscando paciente com CPF limpo:', cleanCpf);
      
      const foundPatient = await FeegowApiService.searchPatient(
        cleanCpf,
        undefined // Removido o telefone da busca
      );

      if (foundPatient) {
        onPatientFound(foundPatient);
        onSearchComplete(true);
        
        toast({
          title: "Paciente encontrado",
          description: `Dados de ${foundPatient.patient_name} carregados`,
        });
      } else {
        toast({
          title: "Paciente não encontrado",
          description: "Preencha os dados para criar um novo cadastro",
        });
        onSearchComplete(false, cleanCpf);
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar o paciente",
        variant: "destructive",
      });
      onSearchComplete(false);
    } finally {
      setSearching(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Já sou paciente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="searchCpf">CPF</Label>
          <Input
            id="searchCpf"
            placeholder="000.000.000-00"
            value={searchCpf}
            onChange={(e) => setSearchCpf(formatCpf(e.target.value))}
            maxLength={14}
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={searching}
          className="w-full"
        >
          {searching ? 'Buscando...' : 'Buscar Paciente'}
        </Button>
      </CardContent>
    </Card>
  );
};
