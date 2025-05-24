
import { Insurance } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const InsuranceService = {
  getInsurances: async (professionalId: number): Promise<Insurance[]> => {
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
};
