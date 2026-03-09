import { Specialty } from '@/types/feegow';
import { feegowFetch } from './apiConfig';

export const SpecialtyService = {
  getSpecialties: async (unityId?: number | null): Promise<Specialty[]> => {
    // Guard: don't fetch without a valid unityId (0 is valid)
    if (unityId === undefined || unityId === null) {
      console.log('getSpecialties: unityId not provided, skipping fetch');
      return [];
    }

    try {
      console.log('Calling Feegow API for specialties with unityId:', unityId);
      
      const endpoint = `/api/specialties/list?unidade_id=${unityId}`;
      
      const data = await feegowFetch(endpoint);
      console.log('API response for specialties:', data);
      
      if (!data.success) {
        console.error('API returned error:', data);
        return [];
      }
      
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
