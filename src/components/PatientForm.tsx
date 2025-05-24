import React, { useState } from 'react';
import { Patient } from '@/types/feegow';
import { FeegowApiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper function to mask personal data for privacy
const maskData = {
  email: (email: string): string => {
    if (!email || email.length === 0) return '';
    const [username, domain] = email.split('@');
    if (!domain) return email;
    const maskedUsername = username.slice(0, 2) + '*'.repeat(username.length > 3 ? username.length - 3 : 1) + (username.length > 2 ? username.slice(-1) : '');
    return `${maskedUsername}@${domain}`;
  },
  phone: (phone: string): string => {
    if (!phone || phone.length < 8) return phone;
    return phone.slice(0, 4) + '*'.repeat(phone.length - 7) + phone.slice(-3);
  }
};

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
  // Store original data for submission purposes
  const [originalData, setOriginalData] = useState<{
    patient_email: string;
    patient_phone: string;
  }>({
    patient_email: '',
    patient_phone: '',
  });
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
        // Store original sensitive data
        setOriginalData({
          patient_email: foundPatient.patient_email || '',
          patient_phone: foundPatient.patient_phone || '',
        });

        // Create masked version for display
        const maskedPatient = {
          ...foundPatient,
          patient_email: maskData.email(foundPatient.patient_email || ''),
          patient_phone: maskData.phone(foundPatient.patient_phone || ''),
          // Remove address for privacy
          patient_address: '',
        };

        setFormData(maskedPatient);
        // Keep original data in what we pass to the parent
        onPatientUpdate({
          ...foundPatient,
          // Still remove address as requested
          patient_address: '',
        });
        
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
          patient_cpf: cleanCpf,
          patient_phone: cleanPhone,
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
    
    // If updating email or phone and we have original values, keep them for submission
    if ((field === 'patient_email' || field === 'patient_phone') && originalData[field]) {
      // User is changing the masked field, override original data
      setOriginalData(prev => ({
        ...prev,
        [field]: value,
      }));
      onPatientUpdate({
        ...updatedData,
        [field]: value,
      });
    } else {
      // For other fields or when originals don't exist
      onPatientUpdate({
        ...updatedData,
        // Always restore original email/phone if they exist
        patient_email: originalData.patient_email || updatedData.patient_email,
        patient_phone: originalData.patient_phone || updatedData.patient_phone,
      });
    }
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
          </div>
          <div className="text-xs text-muted-foreground">
            * Campos obrigatórios
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
