
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
      // Check if date is in dd-mm-yyyy format
      if (dateString.includes('-') && dateString.split('-').length === 3) {
        const [day, month, year] = dateString.split('-');
        // Parse in dd-mm-yyyy format
        if (day.length === 2) {
          const date = parse(dateString, 'dd-MM-yyyy', new Date());
          return format(date, "dd 'de' MMMM", { locale: ptBR });
        } 
        // Parse in yyyy-mm-dd format
        else {
          const date = parse(dateString, 'yyyy-MM-dd', new Date());
          return format(date, "dd 'de' MMMM", { locale: ptBR });
        }
      }
      return dateString;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
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
              {time}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
