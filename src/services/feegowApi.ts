import { Unity, Specialty, Professional, Insurance, AvailableSchedule, Patient, ApiResponse } from '@/types/feegow';

const API_BASE_URL = 'https://api.feegow.com/v1';
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3MjE5Njk3OTUsImxpY2Vuc2VJRCI6ODg3OX0.-_HMD-eocb0AM2xXUaF9lGnJxiohFZ9lSa5ri2ev-3Y';

const apiHeaders = {
  'Content-Type': 'application/json',
  'x-access-token': ACCESS_TOKEN,
  'Host': 'api.feegow.com/v1'
};

// List of allowed unit names
const ALLOWED_UNITS = ['ISV - Papicu', 'ISV - Meireles', 'ISV - Oliveira Paiva'];

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
          if (ALLOWED_UNITS.includes(unit.nome_fantasia)) {
            unities.push({
              unity_id: parseInt(unit.unidade_id),
              unity_name: unit.nome_fantasia,
              unity_address: unit.endereco,
              unity_phone: unit.telefone_1
            });
          }
        });
      }
      
      // Add unidades if they exist
      if (data.content && data.content.unidades) {
        data.content.unidades.forEach((unit: any) => {
          if (ALLOWED_UNITS.includes(unit.nome_fantasia)) {
            unities.push({
              unity_id: parseInt(unit.unidade_id),
              unity_name: unit.nome_fantasia,
              unity_address: unit.endereco,
              unity_phone: unit.telefone_1
            });
          }
        });
      }
      
      console.log('Filtered unities:', unities);
      return unities;
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
      return [];
    }
  }

  static async getSpecialties(unityId?: number): Promise<Specialty[]> {
    try {
      console.log('Calling Feegow API for specialties with unityId:', unityId);
      
      let url = `${API_BASE_URL}/api/specialties/list`;
      if (unityId) {
        url += `?unity_id=${unityId}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('API response for specialties:', data);
      
      if (!data.success) {
        console.error('API returned error:', data);
        return [];
      }
      
      // Transform the API response structure into our Specialty[] format
      const specialties: Specialty[] = [];
      
      if (data.content) {
        data.content.forEach((specialty: any) => {
          specialties.push({
            specialty_id: parseInt(specialty.especialidade_id),
            specialty_name: specialty.nome,
            specialty_description: specialty.codigo_tiss || ''
          });
        });
      }
      
      console.log('Transformed specialties:', specialties);
      return specialties;
    } catch (error) {
      console.error('Erro ao buscar especialidades:', error);
      return [];
    }
  }

  static async getProfessionals(unityId?: number, specialtyId?: number): Promise<Professional[]> {
    try {
      console.log('Calling Feegow API for professionals with params:', { unityId, specialtyId });
      
      let url = `${API_BASE_URL}/api/professional/list`;
      const params = new URLSearchParams();
      
      if (unityId) params.append('unity_id', unityId.toString());
      if (specialtyId) params.append('specialty_id', specialtyId.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('API response for professionals:', data);
      
      if (!data.success) {
        console.error('API returned error:', data);
        return [];
      }
      
      // Transform the API response structure into our Professional[] format
      const professionals: Professional[] = [];
      
      if (data.content) {
        data.content.forEach((prof: any) => {
          professionals.push({
            professional_id: parseInt(prof.profissional_id),
            professional_name: prof.nome,
            professional_email: prof.email || '',
            specialty_id: specialtyId,
            unity_id: unityId
          });
        });
      }
      
      console.log('Transformed professionals:', professionals);
      return professionals;
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      return [];
    }
  }

  static async getAvailableSchedules(professionalId: number): Promise<AvailableSchedule[]> {
    try {
      console.log('Fetching available schedules for professional ID:', professionalId);
      
      // Get current date in YYYY-MM-DD format
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      
      const url = `${API_BASE_URL}/api/appoints/available-schedule?professional_id=${professionalId}&date=${formattedDate}`;
      
      console.log('Request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('API response for available schedules:', data);
      
      if (!data.success) {
        console.error('API returned error:', data);
        return [];
      }
      
      // Transform the API response structure to get the next available dates and times
      const schedules: AvailableSchedule[] = [];
      
      if (data.content && Array.isArray(data.content)) {
        data.content.forEach((dateItem: any) => {
          if (dateItem.date && dateItem.horarios && dateItem.horarios.length > 0) {
            schedules.push({
              date: dateItem.date,
              times: dateItem.horarios,
              professional_id: professionalId
            });
          }
        });
      }
      
      console.log('Available schedules:', schedules);
      return schedules;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
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
