import { Unity, Specialty, Professional, Insurance, AvailableSchedule, Patient, ApiResponse } from '@/types/feegow';

const API_BASE_URL = 'https://api.feegow.com/v1';
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3MjE5Njk3OTUsImxpY2Vuc2VJRCI6ODg3OX0.-_HMD-eocb0AM2xXUaF9lGnJxiohFZ9lSa5ri2ev-3Y';

const apiHeaders = {
  'Content-Type': 'application/json',
  'x-access-token': ACCESS_TOKEN,
  'Host': 'api.feegow.com/v1'
};

export class FeegowApiService {
  static async getUnities(): Promise<Unity[]> {
    try {
      console.log('Calling Feegow API for unities');
      const response = await fetch(`${API_BASE_URL}/api/company/list-unity`, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('API response:', data);
      
      if (!data.success) {
        console.error('API returned error:', data);
        return [];
      }
      
      // Transform the API response structure into our Unity[] format
      const unities: Unity[] = [];
      
      // Add matriz if it exists
      if (data.content && data.content.matriz) {
        data.content.matriz.forEach((unit: any) => {
          unities.push({
            unity_id: parseInt(unit.unidade_id),
            unity_name: unit.nome_fantasia,
            unity_address: unit.endereco,
            unity_phone: unit.telefone_1
          });
        });
      }
      
      // Add unidades if they exist
      if (data.content && data.content.unidades) {
        data.content.unidades.forEach((unit: any) => {
          unities.push({
            unity_id: parseInt(unit.unidade_id),
            unity_name: unit.nome_fantasia,
            unity_address: unit.endereco,
            unity_phone: unit.telefone_1
          });
        });
      }
      
      console.log('Transformed unities:', unities);
      return unities;
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
      return [];
    }
  }

  static async getSpecialties(): Promise<Specialty[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/specialties/list`, {
        method: 'GET',
        headers: apiHeaders,
      });
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error);
      return [];
    }
  }

  static async getProfessionals(unityId?: number, specialtyId?: number): Promise<Professional[]> {
    try {
      let url = `${API_BASE_URL}/api/professional/list`;
      const params = new URLSearchParams();
      
      if (unityId) params.append('unity_id', unityId.toString());
      if (specialtyId) params.append('specialty_id', specialtyId.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      return [];
    }
  }

  static async getInsurances(professionalId: number): Promise<Insurance[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/professional/insurance?professional_id=${professionalId}`, {
        method: 'GET',
        headers: apiHeaders,
      });
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Erro ao buscar convênios:', error);
      return [];
    }
  }

  static async getAvailableSchedule(professionalId: number, date: string): Promise<AvailableSchedule | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appoints/available-schedule?professional_id=${professionalId}&date=${date}`, {
        method: 'GET',
        headers: apiHeaders,
      });
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      return null;
    }
  }

  static async searchPatient(cpf?: string, phone?: string): Promise<Patient | null> {
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
  }

  static async createPatient(patient: Patient): Promise<Patient | null> {
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

  static async createAppointment(appointmentData: any): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appoints/new-appoint`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(appointmentData),
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return false;
    }
  }
}
