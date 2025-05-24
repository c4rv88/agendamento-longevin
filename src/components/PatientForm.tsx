
import React, { useState } from 'react';
import { Patient } from '@/types/feegow';
import { FeegowApiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PatientFormProps {
  patient: Patient | null;
  onPatientUpdate: (patient: Patient) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ patient, onPatientUpdate }) => {
  const [searchCpf, setSearchCpf] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [formData, setFormData] = useState<Patient>(
    patient || {
      patient_name: '',
      patient_cpf: '',
      patient_email: '',
      patient_phone: '',
      patient_birth: '',
      patient_address: '',
    }
  );
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
      const foundPatient = await FeegowApiService.searchPatient(
        searchCpf.replace(/\D/g, ''),
        searchPhone.replace(/\D/g, '')
      );

      if (foundPatient) {
        setFormData(foundPatient);
        onPatientUpdate(foundPatient);
        toast({
          title: "Paciente encontrado",
          description: `Dados de ${foundPatient.patient_name} carregados`,
        });
      } else {
        toast({
          title: "Paciente não encontrado",
          description: "Preencha os dados para criar um novo cadastro",
        });
        setFormData(prev => ({
          ...prev,
          patient_cpf: searchCpf.replace(/\D/g, ''),
          patient_phone: searchPhone.replace(/\D/g, ''),
        }));
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar o paciente",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (field: keyof Patient, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onPatientUpdate(updatedData);
  };

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2');
  };

  return (
    <div className="space-y-6">
      {/* Busca de Paciente */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Paciente Existente
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

      {/* Formulário do Paciente */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Dados do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                placeholder="Nome completo"
                value={formData.patient_name}
                onChange={(e) => handleInputChange('patient_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={formatCpf(formData.patient_cpf)}
                onChange={(e) => handleInputChange('patient_cpf', e.target.value.replace(/\D/g, ''))}
                maxLength={14}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.patient_email || ''}
                onChange={(e) => handleInputChange('patient_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={formatPhone(formData.patient_phone)}
                onChange={(e) => handleInputChange('patient_phone', e.target.value.replace(/\D/g, ''))}
                maxLength={15}
                required
              />
            </div>
            <div>
              <Label htmlFor="birth">Data de Nascimento</Label>
              <Input
                id="birth"
                type="date"
                value={formData.patient_birth || ''}
                onChange={(e) => handleInputChange('patient_birth', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Endereço completo"
                value={formData.patient_address || ''}
                onChange={(e) => handleInputChange('patient_address', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
