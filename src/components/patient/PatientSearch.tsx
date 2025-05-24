
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatCpf, formatPhone } from '@/utils/formatters';
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
  const [searchPhone, setSearchPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchCpf && !searchPhone) {
      toast({
        title: "Erro",
        description: "Informe o CPF ou telefone para buscar",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);
    try {
      // Garantir que o CPF esteja sendo enviado apenas com números
      const cleanCpf = searchCpf.replace(/\D/g, '');
      const cleanPhone = searchPhone.replace(/\D/g, '');
      
      console.log('Buscando paciente com CPF limpo:', cleanCpf);
      console.log('Buscando paciente com telefone limpo:', cleanPhone);
      
      const foundPatient = await FeegowApiService.searchPatient(
        cleanCpf,
        cleanPhone
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
        onSearchComplete(false, cleanCpf, cleanPhone);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <Label htmlFor="searchPhone">Telefone</Label>
            <Input
              id="searchPhone"
              placeholder="(00) 00000-0000"
              value={searchPhone}
              onChange={(e) => setSearchPhone(formatPhone(e.target.value))}
              maxLength={15}
            />
          </div>
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
