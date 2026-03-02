import { Unity } from '@/types/feegow';
import { feegowFetch, ALLOWED_UNITS } from './apiConfig';

export const UnityService = {
  getUnities: async (professionalId?: number, specialtyId?: number): Promise<Unity[]> => {
    try {
      console.log('Calling Feegow API for unities with filters:', { professionalId, specialtyId });
      
      let endpoint = `/api/company/list-unity`;
      const params = new URLSearchParams();
      if (professionalId) params.append('professional_id', professionalId.toString());
      if (specialtyId) params.append('specialty_id', specialtyId.toString());
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      console.log('Unity request endpoint:', endpoint);
      
      const data = await feegowFetch(endpoint);
      console.log('API response for unities:', data);
      
      if (!data.success) {
        console.error('API returned error:', data);
        return [];
      }
      
      const unities: Unity[] = [];
      
      if (data.content && data.content.matriz) {
        data.content.matriz.forEach((unit: any) => {
          if (ALLOWED_UNITS.includes(unit.nome_fantasia) && unit.ExibirAgendamentoOnline === 1) {
            unities.push({
              unity_id: parseInt(unit.unidade_id),
              unity_name: unit.nome_fantasia,
              unity_address: unit.endereco,
              unity_phone: unit.telefone_1
            });
          }
        });
      }
      
      if (data.content && data.content.unidades) {
        data.content.unidades.forEach((unit: any) => {
          if (ALLOWED_UNITS.includes(unit.nome_fantasia) && unit.ExibirAgendamentoOnline === 1) {
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
};
