
import React, { useState, useEffect } from 'react';
import { Patient } from '@/types/feegow';
import { PatientSearch } from '@/components/patient/PatientSearch';
import { PatientData } from '@/components/patient/PatientData';
import { maskEmail, maskPhone } from '@/utils/formatters';
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
    
    // Validate CPF
    if (!data.patient_cpf || data.patient_cpf.replace(/\D/g, '').length === 0) {
      newErrors.patient_cpf = 'CPF é obrigatório';
    } else if (data.patient_cpf.replace(/\D/g, '').length !== 11) {
      newErrors.patient_cpf = 'CPF deve ter 11 dígitos';
    }
    
    // Validate phone
    if (!data.patient_phone || data.patient_phone.replace(/\D/g, '').length === 0) {
      newErrors.patient_phone = 'Telefone é obrigatório';
    } else if (data.patient_phone.replace(/\D/g, '').length < 10) {
      newErrors.patient_phone = 'Telefone deve ter pelo menos 10 dígitos';
    }
    
    // Optional validation for email if provided
    if (data.patient_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.patient_email)) {
      newErrors.patient_email = 'E-mail inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePatientFound = (foundPatient: Patient) => {
    // Store original sensitive data
    setOriginalData({
      patient_email: foundPatient.patient_email || '',
      patient_phone: foundPatient.patient_phone || '',
    });

    // Create masked version for display
    const maskedPatient = {
      ...foundPatient,
      patient_email: maskEmail(foundPatient.patient_email || ''),
      patient_phone: maskPhone(foundPatient.patient_phone || ''),
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

    // Clear any existing errors when a patient is found
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
    
    // Run validation on the updated data
    const isValid = validateForm(updatedData);
    
    // If updating email or phone and we have original values, keep them for submission
    if ((field === 'patient_email' || field === 'patient_phone') && originalData[field]) {
      // User is changing the masked field, override original data
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
      // For other fields or when originals don't exist
      if (isValid) {
        onPatientUpdate({
          ...updatedData,
          // Always restore original email/phone if they exist
          patient_email: originalData.patient_email || updatedData.patient_email,
          patient_phone: originalData.patient_phone || updatedData.patient_phone,
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
