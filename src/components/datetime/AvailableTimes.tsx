
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock } from 'lucide-react';

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
      let date;
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
        return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
      }
      return dateString;
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
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

  // Group times by morning, afternoon and evening
  const groupedTimes = {
    morning: times.filter(time => {
      const hour = parseInt(time.split(':')[0], 10);
      return hour >= 6 && hour < 12;
    }),
    afternoon: times.filter(time => {
      const hour = parseInt(time.split(':')[0], 10);
      return hour >= 12 && hour < 18;
    }),
    evening: times.filter(time => {
      const hour = parseInt(time.split(':')[0], 10);
      return hour >= 18 || hour < 6;
    })
  };

  // Debug logs
  console.log('Available times component rendering with:', {
    timesCount: times.length,
    selectedTime,
    selectedDate,
    times,
    groupedTimes
  });

  if (!selectedDate || times.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horários Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-muted-foreground">
              {selectedDate 
                ? "Nenhum horário disponível para esta data."
                : "Selecione uma data para ver os horários disponíveis."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Horários para {formatDisplayDate(selectedDate)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Morning times */}
          {groupedTimes.morning.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Manhã</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {groupedTimes.morning.map((time) => (
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
            </div>
          )}

          {/* Afternoon times */}
          {groupedTimes.afternoon.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Tarde</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {groupedTimes.afternoon.map((time) => (
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
            </div>
          )}

          {/* Evening times */}
          {groupedTimes.evening.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Noite</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {groupedTimes.evening.map((time) => (
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
