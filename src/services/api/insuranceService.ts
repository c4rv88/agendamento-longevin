
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
      
      const insurances: Insurance[] = [];
      
      // Always add "Particular" as the first option
      insurances.push({
        insurance_id: 0,
        insurance_name: 'Particular',
        professional_id: professionalId
      });
      
      // Check if data has the expected structure
      if (data.success && data.content && Array.isArray(data.content)) {
        // Map the API response to our Insurance type
        data.content.forEach((ins: any) => {
          // Avoid duplicating "Particular"
          if (parseInt(ins.convenio_id) !== 0 && ins.nome.toLowerCase() !== 'particular') {
            insurances.push({
              insurance_id: parseInt(ins.convenio_id),
              insurance_name: ins.nome,
              professional_id: professionalId
            });
          }
        });
      } else if (Array.isArray(data) && data[0]?.success && data[0]?.content) {
        // Handle alternative response format - array with nested content
        const contentArray = data[0].content;
        if (Array.isArray(contentArray)) {
          contentArray.forEach((ins: any) => {
            if (parseInt(ins.convenio_id) !== 0 && ins.nome.toLowerCase() !== 'particular') {
              insurances.push({
                insurance_id: parseInt(ins.convenio_id),
                insurance_name: ins.nome,
                professional_id: professionalId
              });
            }
          });
        }
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
