
import { Specialty } from '@/types/feegow';
import { API_BASE_URL, apiHeaders } from './apiConfig';

export const SpecialtyService = {
  getSpecialties: async (unityId?: number): Promise<Specialty[]> => {
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
};
