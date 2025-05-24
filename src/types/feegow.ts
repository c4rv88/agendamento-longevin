
export interface Unity {
  unity_id: number;
  unity_name: string;
  unity_address: string;
  unity_phone: string;
}

export interface Specialty {
  specialty_id: number;
  specialty_name: string;
  specialty_description?: string;
}

export interface Professional {
  professional_id: number;
  professional_name: string;
  professional_email?: string;
  specialty_id?: number;
  unity_id?: number;
}

export interface Insurance {
  insurance_id: number;
  insurance_name: string;
  professional_id: number;
}

export interface AvailableSchedule {
  date: string;
  times: string[];
  professional_id: number;
}

export interface Patient {
  patient_id?: number;
  patient_name: string;
  patient_cpf: string;
  patient_email?: string;
  patient_phone: string;
  patient_birth?: string;
  patient_address?: string;
}

export interface AppointmentData {
  unity_id: number;
  specialty_id: number;
  professional_id: number;
  insurance_id?: number;
  date: string;
  time: string;
  patient: Patient;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
