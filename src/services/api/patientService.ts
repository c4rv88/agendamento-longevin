import { Patient } from '@/types/feegow';
import { feegowFetch } from './apiConfig';

export const PatientService = {
  searchPatient: async (cpf?: string, phone?: string): Promise<Patient | null> => {
    try {
      const params = new URLSearchParams();
      if (cpf) {
        const cleanCpf = cpf.replace(/\D/g, '');
        params.append('paciente_cpf', cleanCpf);
      }
      
      if (phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        params.append('telefone', cleanPhone);
      }

      const endpoint = `/api/patient/search?${params.toString()}`;
      console.log('Sending patient search request to:', endpoint);
      
      const data = await feegowFetch(endpoint);
      console.log('Patient search response:', data);
      
      if (!data.success && data.content === "Paciente não encontrado") {
        console.log('Patient not found with the provided CPF/phone');
        return null;
      }
      
      let formattedBirthDate = '';
      if (data.content?.nascimento) {
        const birthDate = data.content.nascimento;
        if (birthDate.includes('-')) {
          const [day, month, year] = birthDate.split('-');
          formattedBirthDate = `${year}-${month}-${day}`;
        } else if (birthDate.includes('/')) {
          const [day, month, year] = birthDate.split('/');
          formattedBirthDate = `${year}-${month}-${day}`;
        } else {
          formattedBirthDate = birthDate;
        }
      }
      
      return data.success && data.content ? {
        patient_id: data.content.id,
        patient_name: data.content.nome,
        patient_cpf: data.content.documentos?.cpf || '',
        patient_email: data.content.email?.[0] || '',
        patient_phone: data.content.celulares?.[0] || '',
        patient_birth: formattedBirthDate,
        patient_address: data.content.endereco || '',
      } : null;
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
      return null;
    }
  },
  
  createPatient: async (patient: Patient): Promise<Patient | null> => {
    try {
      let formattedPatient = { ...patient };
      
      if (patient.patient_birth) {
        if (patient.patient_birth.match(/^\d{2}-\d{2}-\d{4}$/)) {
          const [day, month, year] = patient.patient_birth.split('-');
          formattedPatient.patient_birth = `${year}-${month}-${day}`;
        }
      }
      
      formattedPatient.patient_cpf = patient.patient_cpf.replace(/\D/g, '');
      
      if (patient.patient_phone) {
        formattedPatient.patient_phone = patient.patient_phone.replace(/\D/g, '');
      }
      
      if (!formattedPatient.patient_address || formattedPatient.patient_address.trim() === '') {
        formattedPatient.patient_address = 'Não informado';
      }
      
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
      
      const data = await feegowFetch('/api/patient/create', 'POST', requestBody);
      console.log('Patient creation response:', data);
      
      if (data.success && data.content && data.content.paciente_id) {
        const newPatient = {
          patient_id: data.content.paciente_id,
          patient_name: formattedPatient.patient_name,
          patient_cpf: formattedPatient.patient_cpf,
          patient_email: formattedPatient.patient_email,
          patient_phone: formattedPatient.patient_phone,
          patient_birth: formattedPatient.patient_birth,
          patient_address: formattedPatient.patient_address
        };
        
        console.log('Returning new patient with ID:', newPatient);
        return newPatient;
      } else {
        console.error('Patient creation response missing required data:', data);
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      return null;
    }
  }
};
