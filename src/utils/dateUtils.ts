
/**
 * Date utility functions for the schedule service
 */

/**
 * Format a date as dd-mm-YYYY
 */
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Convert from ISO format (YYYY-MM-DD) to dd-mm-YYYY
 */
export const formatDateFromISO = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`;
};

/**
 * Get a date range starting from a specified number of days ahead
 * @param daysAhead Number of days ahead from today for start date
 * @param rangeDays Number of days for the range
 * @returns Object with formatted startDate and endDate
 */
export const getDateRange = (daysAhead: number = 2, rangeDays: number = 30) => {
  const today = new Date();
  today.setDate(today.getDate() + daysAhead);
  const startDate = formatDate(today);
  
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + rangeDays);
  const endDateStr = formatDate(endDate);
  
  return { startDate, endDateStr };
};
