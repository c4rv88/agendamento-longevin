import { Professional } from '@/types/feegow';
import { feegowFetch } from './apiConfig';

export const ProfessionalService = {
  getProfessionals: async (specialtyId?: number, unityId?: number): Promise<Professional[]> => {
    try {
      console.log('Calling Feegow API for professionals with filters:', { specialtyId, unityId });
      
      let endpoint = `/api/professional/list`;
      const params = new URLSearchParams();
      
      if (specialtyId) params.append('especialidade_id', specialtyId.toString());
      if (unityId !== undefined) params.append('unidade_id', unityId.toString());
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      console.log('Professional request endpoint:', endpoint);

      const data = await feegowFetch(endpoint);
      console.log('API response for professionals:', data);
      
      if (!data.success) {
        console.error('API returned error:', data);
        return [];
      }
      
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
};
