
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Patient } from '@/types/feegow';
import { formatCpf, formatPhone } from '@/utils/formatters';

interface PatientDataProps {
  formData: Patient;
  onInputChange: (field: keyof Patient, value: string) => void;
}

export const PatientData: React.FC<PatientDataProps> = ({ 
  formData, 
  onInputChange 
}) => {
  return (
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
              onChange={(e) => onInputChange('patient_name', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={formatCpf(formData.patient_cpf)}
              onChange={(e) => onInputChange('patient_cpf', e.target.value.replace(/\D/g, ''))}
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
              onChange={(e) => onInputChange('patient_email', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              value={formatPhone(formData.patient_phone)}
              onChange={(e) => onInputChange('patient_phone', e.target.value.replace(/\D/g, ''))}
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
              onChange={(e) => onInputChange('patient_birth', e.target.value)}
            />
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          * Campos obrigatórios
        </div>
      </CardContent>
    </Card>
  );
};
