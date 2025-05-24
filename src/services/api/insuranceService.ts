
import { Insurance } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const InsuranceService = {
  getInsurances: async (professionalId: number): Promise<Insurance[]> => {
    try {
      console.log('Fetching insurances for professional ID:', professionalId);
      
      const url = `${API_BASE_URL}/api/professional/insurance?profissional_id=${professionalId}`;
      console.log('Insurance request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      const data = await response.json();
      console.log('API response for insurances:', data);
      
      if (!data.success) {
        console.error('API returned error:', data);
        return [];
      }
      
      const insurances: Insurance[] = [];
      
      // Always add "Particular" as the first option
      insurances.push({
        insurance_id: 0,
        insurance_name: 'Particular',
        professional_id: professionalId
      });
      
      // Add the insurance plans returned by the API
      if (data.content && Array.isArray(data.content)) {
        data.content.forEach((ins: any) => {
          insurances.push({
            insurance_id: parseInt(ins.convenio_id),
            insurance_name: ins.nome_convenio,
            professional_id: professionalId
          });
        });
      }
      
      console.log('Transformed insurances:', insurances);
      return insurances;
    } catch (error) {
      console.error('Erro ao buscar convênios:', error);
      return [{
        insurance_id: 0,
        insurance_name: 'Particular',
        professional_id: professionalId
      }];
    }
  }
};
