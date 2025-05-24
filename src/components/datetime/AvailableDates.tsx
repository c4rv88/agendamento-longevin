
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
  // Function to parse dates from string to Date object
  const parseDate = (dateString: string): Date | null => {
    try {
      if (!dateString) return null;
      
      let date: Date | null = null;
      // Check if date is in dd-mm-yyyy or yyyy-mm-dd format
      if (dateString.includes('-') && dateString.split('-').length === 3) {
        const parts = dateString.split('-');
        
        // If the first part is 4 characters (year), it's in yyyy-MM-dd format
        if (parts[0].length === 4) {
          date = parse(dateString, 'yyyy-MM-dd', new Date());
        } else {
          // Otherwise it's in dd-MM-yyyy format
          date = parse(dateString, 'dd-MM-yyyy', new Date());
        }
      }
      
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
    
    // Fallback: format to yyyy-MM-dd
    return format(date, 'yyyy-MM-dd');
  };

  // Function to handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date && isDateAvailable(date)) {
      const dateString = formatDateToString(date);
      onSelectDate(dateString);
    }
  };

  // Get the count of available times for the selected date
  const getTimesCountForDate = (dateStr: string): number => {
    const schedule = availableSchedules.find(s => s.date === dateStr);
    return schedule ? schedule.times.length : 0;
  };

  // Debug logs
  console.log('Calendar component rendering with:', {
    availableDatesCount: availableDates.length,
    selectedDate,
    parsedSelectedDate,
    availableSchedules
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="w-5 h-5" />
          Datas Disponíveis
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
                
                if (!date) return null;
                
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
