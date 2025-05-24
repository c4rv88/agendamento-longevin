
import { Professional } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const ProfessionalService = {
  getProfessionals: async (unityId?: number, specialtyId?: number): Promise<Professional[]> => {
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
};
