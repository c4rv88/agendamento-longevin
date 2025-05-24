
import { Patient } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const PatientService = {
  searchPatient: async (cpf?: string, phone?: string): Promise<Patient | null> => {
    try {
      const params = new URLSearchParams();
      if (cpf) params.append('paciente_cpf', cpf);
      if (phone) params.append('telefone', phone);

      const response = await fetch(`${API_BASE_URL}/api/patient/search?${params.toString()}`, {
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
      
      return data.success && data.data && data.data.length > 0 ? data.data[0] : null;
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
        const [year, month, day] = patient.patient_birth.split('-');
        formattedPatient.patient_birth = `${day}-${month}-${year}`;
      }
      
      // Ensure CPF has only numbers
      formattedPatient.patient_cpf = patient.patient_cpf.replace(/\D/g, '');
      
      // Ensure phone has only numbers
      if (patient.patient_phone) {
        formattedPatient.patient_phone = patient.patient_phone.replace(/\D/g, '');
      }
      
      console.log('Creating patient with data:', formattedPatient);
      
      const response = await fetch(`${API_BASE_URL}/api/patient/create`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify({
          nome_completo: formattedPatient.patient_name,
          cpf: formattedPatient.patient_cpf,
          data_nascimento: formattedPatient.patient_birth,
          telefone: formattedPatient.patient_phone,
          email: formattedPatient.patient_email,
          endereco: formattedPatient.patient_address
        }),
      });
      
      const data = await response.json();
      console.log('Patient creation response:', data);
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      return null;
    }
  }
};
