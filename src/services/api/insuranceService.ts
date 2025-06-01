
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
      
      if (!response.ok) {
        console.error('API response error:', response.status, response.statusText);
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response for insurances:', data);
      
      const insurances: Insurance[] = [];
      
      // Always add "Particular" as the first option
      insurances.push({
        insurance_id: 0,
        insurance_name: 'Particular',
        professional_id: professionalId
      });
      
      // Process API response to extract real insurance data
      let insuranceData = [];
      
      // Handle different response formats from the API
      if (data.success && data.content) {
        if (Array.isArray(data.content)) {
          insuranceData = data.content;
        } else if (data.content.data && Array.isArray(data.content.data)) {
          insuranceData = data.content.data;
        }
      } else if (Array.isArray(data)) {
        // Handle case where response is directly an array
        insuranceData = data;
      }
      
      console.log('Processed insurance data:', insuranceData);
      
      // Filter and map only valid insurance entries
      insuranceData.forEach((insurance: any) => {
        // Check for valid insurance data structure
        const insuranceId = insurance.convenio_id || insurance.insurance_id || insurance.id;
        const insuranceName = insurance.nome || insurance.insurance_name || insurance.name;
        
        if (insuranceId && insuranceName && 
            parseInt(insuranceId) !== 0 && 
            insuranceName.toLowerCase() !== 'particular') {
          
          // Only add if it's a real insurance entry with proper data
          insurances.push({
            insurance_id: parseInt(insuranceId),
            insurance_name: insuranceName.trim(),
            professional_id: professionalId
          });
        }
      });
      
      console.log('Final filtered insurances for professional', professionalId, ':', insurances);
      
      // Remove duplicates based on insurance_id
      const uniqueInsurances = insurances.filter((insurance, index, self) => 
        index === self.findIndex(i => i.insurance_id === insurance.insurance_id)
      );
      
      return uniqueInsurances;
      
    } catch (error) {
      console.error('Error fetching insurances:', error);
      
      // Return only "Particular" option in case of error
      return [{
        insurance_id: 0,
        insurance_name: 'Particular',
        professional_id: professionalId
      }];
    }
  }
};
