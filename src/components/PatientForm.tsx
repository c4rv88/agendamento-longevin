import React, { useState, useEffect } from 'react';
import { Patient } from '@/types/feegow';
import { PatientSearch } from '@/components/patient/PatientSearch';
import { PatientData } from '@/components/patient/PatientData';
import { maskEmail, maskPhone } from '@/utils/formatters';
import { getCpfValidationError } from '@/utils/cpfValidator';
import { useToast } from '@/hooks/use-toast';

interface PatientFormProps {
  patient: Patient | null;
  onPatientUpdate: (patient: Patient) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ patient, onPatientUpdate }) => {
  // Store original data for submission purposes
  const [originalData, setOriginalData] = useState<{
    patient_email: string;
    patient_phone: string;
  }>({
    patient_email: '',
    patient_phone: '',
  });
  
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Validate form when data changes
  useEffect(() => {
    validateForm(formData);
  }, [formData]);

  const validateForm = (data: Patient): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!data.patient_name || data.patient_name.trim() === '') {
      newErrors.patient_name = 'Nome é obrigatório';
    } else if (data.patient_name.trim().length < 3) {
      newErrors.patient_name = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    // Validate CPF using the new validator
    const cpfError = getCpfValidationError(data.patient_cpf);
    if (cpfError) {
      newErrors.patient_cpf = cpfError;
    }
    
    // Validate phone
    if (!data.patient_phone || data.patient_phone.replace(/\D/g, '').length === 0) {
      newErrors.patient_phone = 'Telefone é obrigatório';
    } else if (data.patient_phone.replace(/\D/g, '').length < 10) {
      newErrors.patient_phone = 'Telefone deve ter pelo menos 10 dígitos';
    }
    
    // Validate birth date (now required)
    if (!data.patient_birth || data.patient_birth.trim() === '') {
      newErrors.patient_birth = 'Data de nascimento é obrigatória';
    }
    
    // Optional validation for email if provided
    if (data.patient_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.patient_email)) {
      newErrors.patient_email = 'E-mail inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePatientFound = (foundPatient: Patient) => {
    setOriginalData({
      patient_email: foundPatient.patient_email || '',
      patient_phone: foundPatient.patient_phone || '',
    });

    const maskedPatient = {
      ...foundPatient,
      patient_email: maskEmail(foundPatient.patient_email || ''),
      patient_phone: foundPatient.patient_phone || '',
      patient_address: '',
    };

    setFormData(maskedPatient);
    onPatientUpdate({
      ...foundPatient,
      patient_address: '',
    });

    setErrors({});
  };

  const handleSearchComplete = (found: boolean, cpf?: string, phone?: string) => {
    if (!found && (cpf || phone)) {
      setFormData(prev => ({
        ...prev,
        patient_cpf: cpf || prev.patient_cpf,
        patient_phone: phone || prev.patient_phone,
      }));
    }
  };

  const handleInputChange = (field: keyof Patient, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    
    const isValid = validateForm(updatedData);
    
    if (field === 'patient_email' && originalData[field]) {
      setOriginalData(prev => ({
        ...prev,
        [field]: value,
      }));
      
      if (isValid) {
        onPatientUpdate({
          ...updatedData,
          [field]: value,
        });
      }
    } else {
      if (isValid) {
        onPatientUpdate({
          ...updatedData,
          patient_email: originalData.patient_email || updatedData.patient_email,
          patient_phone: updatedData.patient_phone,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <PatientSearch 
        onPatientFound={handlePatientFound}
        onSearchComplete={handleSearchComplete}
      />
      
      <PatientData 
        formData={formData}
        onInputChange={handleInputChange}
        errors={errors}
      />
    </div>
  );
};
