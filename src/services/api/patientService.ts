
import { Patient } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const PatientService = {
  searchPatient: async (cpf?: string, phone?: string): Promise<Patient | null> => {
    try {
      const params = new URLSearchParams();
      if (cpf) {
        // Garante que o CPF tenha apenas números
        const cleanCpf = cpf.replace(/\D/g, '');
        params.append('paciente_cpf', cleanCpf);
      }
      
      if (phone) {
        // Garante que o telefone tenha apenas números
        const cleanPhone = phone.replace(/\D/g, '');
        params.append('telefone', cleanPhone);
      }

      const url = `${API_BASE_URL}/api/patient/search?${params.toString()}`;
      console.log('Sending patient search request to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('Patient search response:', data);
      
      // Check for 409 error which means patient not found
      if (!data.success && data.content === "Paciente não encontrado") {
        console.log('Patient not found with the provided CPF/phone');
        return null;
      }
      
      return data.success && data.content ? {
        patient_id: data.content.id,
        patient_name: data.content.nome,
        patient_cpf: data.content.documentos?.cpf || '',
        patient_email: data.content.email?.[0] || '',
        patient_phone: data.content.celulares?.[0] || '',
        patient_birth: data.content.nascimento || '',
        patient_address: data.content.endereco || '',
      } : null;
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
      return null;
    }
  },
  
  createPatient: async (patient: Patient): Promise<Patient | null> => {
    try {
      // Format the date from YYYY-MM-DD to DD-MM-YYYY if it exists
      let formattedPatient = { ...patient };
      
      if (patient.patient_birth) {
        // Verificar se a data está no formato DD-MM-YYYY e converter para YYYY-MM-DD
        if (patient.patient_birth.match(/^\d{2}-\d{2}-\d{4}$/)) {
          // Converter de DD-MM-YYYY para YYYY-MM-DD
          const [day, month, year] = patient.patient_birth.split('-');
          formattedPatient.patient_birth = `${year}-${month}-${day}`;
        }
        // Se já está em YYYY-MM-DD, manter como está
      }
      
      // Ensure CPF has only numbers
      formattedPatient.patient_cpf = patient.patient_cpf.replace(/\D/g, '');
      
      // Ensure phone has only numbers
      if (patient.patient_phone) {
        formattedPatient.patient_phone = patient.patient_phone.replace(/\D/g, '');
      }
      
      // Ensure address is not empty
      if (!formattedPatient.patient_address || formattedPatient.patient_address.trim() === '') {
        formattedPatient.patient_address = 'Não informado';
      }
      
      // Prepare request body
      const requestBody = {
        nome_completo: formattedPatient.patient_name,
        cpf: formattedPatient.patient_cpf,
        data_nascimento: formattedPatient.patient_birth,
        telefone: formattedPatient.patient_phone,
        email: formattedPatient.patient_email || '',
        endereco: formattedPatient.patient_address
      };
      
      console.log('Creating patient with formatted data:', formattedPatient);
      console.log('Request body for patient creation:', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/api/patient/create`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      console.log('Patient creation response:', data);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('Patient creation failed with status:', response.status);
        console.error('Error response:', data);
        return null;
      }
      
      // Return the patient with the new ID
      if (data.success && data.content) {
        return {
          patient_id: data.content.id,
          patient_name: formattedPatient.patient_name,
          patient_cpf: formattedPatient.patient_cpf,
          patient_email: formattedPatient.patient_email,
          patient_phone: formattedPatient.patient_phone,
          patient_birth: formattedPatient.patient_birth,
          patient_address: formattedPatient.patient_address
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      return null;
    }
  }
};
