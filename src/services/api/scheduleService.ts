
import { AvailableSchedulesService } from './availableSchedulesService';
import { DailyScheduleService } from './dailyScheduleService';

/**
 * Combines all schedule-related services
 */
export const ScheduleService = {
  ...AvailableSchedulesService,
  ...DailyScheduleService
};
