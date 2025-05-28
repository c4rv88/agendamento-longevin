
import React, { useState } from 'react';
import { AvailableSchedule } from '@/types/feegow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Calendar as CalendarIcon } from 'lucide-react';
import { format, parse, isValid, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

interface AvailableDatesProps {
  availableSchedules: AvailableSchedule[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const AvailableDates: React.FC<AvailableDatesProps> = ({
  availableSchedules,
  selectedDate,
  onSelectDate
}) => {
  // Function to parse dates from string to Date object with better error handling
  const parseDate = (dateString: string): Date | null => {
    try {
      if (!dateString) return null;
      
      let date: Date | null = null;
      
      // Handle dd-mm-yyyy format (most common from our API)
      if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        date = parse(dateString, 'dd-MM-yyyy', new Date());
      }
      // Handle yyyy-mm-dd format
      else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        date = parse(dateString, 'yyyy-MM-dd', new Date());
      }
      // Handle dd/mm/yyyy format
      else if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        date = parse(dateString, 'dd/MM/yyyy', new Date());
      }
      // Handle yyyy/mm/dd format
      else if (dateString.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
        date = parse(dateString, 'yyyy/MM/dd', new Date());
      }
      
      console.log('Parsed date:', dateString, '→', date, 'Valid:', isValid(date));
      return isValid(date) ? date : null;
    } catch (error) {
      console.error('Error parsing date:', error, dateString);
      return null;
    }
  };

  // Get all dates that have available schedules
  const availableDates: Date[] = availableSchedules
    .map(schedule => parseDate(schedule.date))
    .filter((date): date is Date => date !== null);

  // Get currently selected date as Date object
  const parsedSelectedDate = selectedDate ? parseDate(selectedDate) : null;

  // Function to check if a date has available schedules
  const isDateAvailable = (date: Date): boolean => {
    return availableDates.some(availableDate => 
      availableDate && isSameDay(availableDate, date)
    );
  };

  // Function to format date back to string format expected by the API
  const formatDateToString = (date: Date): string => {
    // Find the corresponding schedule for this date
    const matchingSchedule = availableSchedules.find(schedule => {
      const scheduleDate = parseDate(schedule.date);
      return scheduleDate && isSameDay(scheduleDate, date);
    });
    
    // If found, return the original string format
    if (matchingSchedule) {
      return matchingSchedule.date;
    }
    
    // Fallback: format to dd-mm-yyyy (our standard format)
    return format(date, 'dd-MM-yyyy');
  };

  // Function to handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date && isDateAvailable(date)) {
      const dateString = formatDateToString(date);
      console.log('Selected date:', date, '→', dateString);
      onSelectDate(dateString);
    }
  };

  // Debug logs
  console.log('Calendar component rendering with:', {
    availableDatesCount: availableDates.length,
    selectedDate,
    parsedSelectedDate,
    availableSchedules: availableSchedules.map(s => ({ date: s.date, times: s.times.length }))
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="w-5 h-5" />
          Datas Disponíveis ({availableSchedules.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <Calendar
              mode="single"
              selected={parsedSelectedDate || undefined}
              onSelect={handleDateSelect}
              disabled={(date) => !isDateAvailable(date)}
              modifiers={{
                available: availableDates
              }}
              modifiersClassNames={{
                available: "bg-blue-100 text-blue-900 font-bold"
              }}
              className="rounded-md border p-3 pointer-events-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Próximas datas com horários
            </h4>
            <div className="grid grid-cols-1 gap-2 max-h-[260px] overflow-y-auto pr-2">
              {availableSchedules.map((schedule) => {
                const date = parseDate(schedule.date);
                const isSelected = selectedDate === schedule.date;
                
                if (!date) {
                  console.warn('Could not parse date:', schedule.date);
                  return null;
                }
                
                return (
                  <button
                    key={schedule.date}
                    className={`text-left p-3 rounded-md border transition-colors ${
                      isSelected 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => onSelectDate(schedule.date)}
                  >
                    <div className="font-medium">
                      {format(date, "EEE, dd 'de' MMMM", { locale: ptBR })}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm">
                        {schedule.times.length} horários
                      </span>
                      {isSelected && (
                        <Badge variant="outline" className="bg-primary/20 border-primary/30">
                          Selecionado
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
