
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AvailableTimesProps {
  times: string[];
  selectedTime: string;
  selectedDate: string;
  onSelectTime: (time: string) => void;
}

export const AvailableTimes: React.FC<AvailableTimesProps> = ({
  times,
  selectedTime,
  selectedDate,
  onSelectTime
}) => {
  // Function to format date for display
  const formatDisplayDate = (dateString: string): string => {
    try {
      // Check if date is in yyyy-MM-dd format (API format)
      if (dateString.includes('-') && dateString.split('-').length === 3) {
        const parts = dateString.split('-');
        
        // If the first part is 4 characters (year), it's in yyyy-MM-dd format
        if (parts[0].length === 4) {
          const date = parse(dateString, 'yyyy-MM-dd', new Date());
          return format(date, "dd 'de' MMMM", { locale: ptBR });
        } 
        // Parse in yyyy-mm-dd format
        else {
          const date = parse(dateString, 'dd-MM-yyyy', new Date());
          return format(date, "dd 'de' MMMM", { locale: ptBR });
        }
      }
      return dateString;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Function to format time for display (remove seconds)
  const formatTime = (time: string): string => {
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    }
    return time;
  };

  if (!selectedDate) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Horários Disponíveis - {formatDisplayDate(selectedDate)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {times.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectTime(time)}
              className="text-sm"
            >
              {formatTime(time)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
