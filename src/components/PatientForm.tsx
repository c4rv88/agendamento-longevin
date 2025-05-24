import React, { useState } from 'react';
import { Patient } from '@/types/feegow';
import { PatientSearch } from '@/components/patient/PatientSearch';
import { PatientData } from '@/components/patient/PatientData';
import { maskEmail, maskPhone } from '@/utils/formatters';

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

  return (
    <div className="space-y-6">
      <PatientSearch 
        onPatientFound={handlePatientFound}
        onSearchComplete={handleSearchComplete}
      />
      
      <PatientData 
        formData={formData}
        onInputChange={handleInputChange}
      />
    </div>
  );
};
