import { feegowFetch } from './apiConfig';

interface Procedure {
  procedimento_id: number;
  nome: string;
  especialidade_id: number[];
}

let cachedProcedures: Procedure[] | null = null;

export const ProcedureService = {
  /**
   * Fetch all procedures from Feegow API (cached after first call)
   */
  listProcedures: async (): Promise<Procedure[]> => {
    if (cachedProcedures) return cachedProcedures;

    try {
      const data = await feegowFetch('/api/procedures/list');
      if (data?.content && Array.isArray(data.content)) {
        cachedProcedures = data.content;
        return cachedProcedures;
      }
      return [];
    } catch (error) {
      console.error('Error fetching procedures:', error);
      return [];
    }
  },

  /**
   * Find the first valid procedimento_id for a given specialty.
   * Prefers "PRIMEIRA CONSULTA" procedures.
   */
  getProcedureIdForSpecialty: async (specialtyId: number): Promise<number | null> => {
    const procedures = await ProcedureService.listProcedures();
    
    const matching = procedures.filter(p => 
      p.especialidade_id?.includes(specialtyId)
    );

    if (matching.length === 0) {
      console.warn(`No procedure found for specialty ${specialtyId}`);
      return null;
    }

    // Prefer "PRIMEIRA CONSULTA" 
    const primeiraConsulta = matching.find(p => 
      p.nome?.toUpperCase().includes('PRIMEIRA CONSULTA')
    );

    const selected = primeiraConsulta || matching[0];
    console.log(`Resolved procedimento_id=${selected.procedimento_id} (${selected.nome}) for specialty ${specialtyId}`);
    return selected.procedimento_id;
  }
};
