
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
      return data.success && data.data.length > 0 ? data.data[0] : null;
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
      return null;
    }
  },
  
  createPatient: async (patient: Patient): Promise<Patient | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patient/create`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(patient),
      });
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      return null;
    }
  }
};
