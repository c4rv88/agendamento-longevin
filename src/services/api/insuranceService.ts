import { Insurance } from '@/types/feegow';
import { feegowFetch } from './apiConfig';

export const InsuranceService = {
  getInsurances: async (professionalId: number): Promise<Insurance[]> => {
    try {
      console.log('Fetching insurances for professional ID:', professionalId);
      
      const endpoint = `/api/professional/insurance?profissional_id=${professionalId}`;
      console.log('Insurance request endpoint:', endpoint);
      
      const data = await feegowFetch(endpoint);
      console.log('API response for insurances:', data);
      
      const insurances: Insurance[] = [];
      
      insurances.push({
        insurance_id: 0,
        insurance_name: 'Particular',
        professional_id: professionalId
      });
      
      if (data.success && data.content && Array.isArray(data.content)) {
        data.content.forEach((ins: any) => {
          if (parseInt(ins.convenio_id) !== 0 && ins.nome.toLowerCase() !== 'particular') {
            insurances.push({
              insurance_id: parseInt(ins.convenio_id),
              insurance_name: ins.nome,
              professional_id: professionalId
            });
          }
        });
      } else if (Array.isArray(data) && data[0]?.success && data[0]?.content) {
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
