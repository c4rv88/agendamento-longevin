
import { Unity } from '@/types/feegow';
import { API_BASE_URL, apiHeaders, ALLOWED_UNITS } from './apiConfig';

export const UnityService = {
  getUnities: async (professionalId?: number, specialtyId?: number): Promise<Unity[]> => {
    try {
      console.log('Calling Feegow API for unities with filters:', { professionalId, specialtyId });
      
      let url = `${API_BASE_URL}/api/company/list-unity`;
      
      // We're still fetching all units and then filtering them client-side
      // since the API doesn't provide direct filtering by professional and specialty
      const response = await fetch(url, {
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
      
      // Add unidades if they exist
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
