
import { UnityService } from './unityService';
import { SpecialtyService } from './specialtyService';
import { ProfessionalService } from './professionalService';
import { ScheduleService } from './scheduleService';
import { InsuranceService } from './insuranceService';
import { PatientService } from './patientService';
import { AppointmentService } from './appointmentService';
import { ProcedureService } from './procedureService';

// Re-export all services
export const FeegowApiService = {
  ...UnityService,
  ...SpecialtyService,
  ...ProfessionalService,
  ...ScheduleService,
  ...InsuranceService,
  ...PatientService,
  ...AppointmentService,
  ...ProcedureService
};
