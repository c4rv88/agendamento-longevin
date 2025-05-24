
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, ChevronDown } from 'lucide-react';

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
  const [showAllTimes, setShowAllTimes] = useState(false);
  
  // Format date for display - using useMemo to prevent recalculation
  const formattedDate = useMemo(() => {
    try {
      if (!selectedDate) return '';
      
      let date;
      // Check if date is in dd-mm-yyyy or yyyy-mm-dd format
      if (selectedDate.includes('-') && selectedDate.split('-').length === 3) {
        const parts = selectedDate.split('-');
        
        // If the first part is 4 characters (year), it's in yyyy-MM-dd format
        if (parts[0].length === 4) {
          date = parse(selectedDate, 'yyyy-MM-dd', new Date());
        } else {
          // Otherwise it's in dd-MM-yyyy format
          date = parse(selectedDate, 'dd-MM-yyyy', new Date());
        }
        return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
      }
      return selectedDate;
    } catch (error) {
      console.error('Error formatting date:', error, selectedDate);
      return selectedDate;
    }
  }, [selectedDate]);

  // Function to format time for display (remove seconds)
  const formatTime = (time: string): string => {
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    }
    return time;
  };

  // Get closest 4 times - sorted by time of day
  const getClosestTimes = useMemo(() => {
    if (!times.length) return [];
    
    // Sort times chronologically
    const sortedTimes = [...times].sort((a, b) => {
      const timeA = a.split(':').map(Number);
      const timeB = b.split(':').map(Number);
      
      if (timeA[0] !== timeB[0]) {
        return timeA[0] - timeB[0]; // Compare hours
      }
      return timeA[1] - timeB[1]; // Compare minutes if hours are equal
    });
    
    // Return first 4 times
    return sortedTimes.slice(0, 4);
  }, [times]);

  // Group times by morning, afternoon and evening - using useMemo to prevent recalculation
  const groupedTimes = useMemo(() => {
    const timesToShow = showAllTimes ? times : getClosestTimes;
    
    return {
      morning: timesToShow.filter(time => {
        const hour = parseInt(time.split(':')[0], 10);
        return hour >= 6 && hour < 12;
      }),
      afternoon: timesToShow.filter(time => {
        const hour = parseInt(time.split(':')[0], 10);
        return hour >= 12 && hour < 18;
      }),
      evening: timesToShow.filter(time => {
        const hour = parseInt(time.split(':')[0], 10);
        return hour >= 18 || hour < 6;
      })
    };
  }, [times, showAllTimes, getClosestTimes]);

  // Debug logs
  console.log('Available times component rendering with:', {
    timesCount: times.length,
    closestTimesCount: getClosestTimes.length,
    selectedTime,
    selectedDate,
    showAllTimes
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
          {showAllTimes 
            ? `Horários para ${formattedDate}`
            : `Próximos horários para ${formattedDate}`}
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
                    key={`morning-${time}`}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectTime(time)}
                    className="text-sm w-full"
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
                    key={`afternoon-${time}`}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectTime(time)}
                    className="text-sm w-full"
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
                    key={`evening-${time}`}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectTime(time)}
                    className="text-sm w-full"
                  >
                    {formatTime(time)}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Button to show all times or less times */}
          {times.length > 4 && (
            <div className="pt-2 flex justify-center">
              <Button 
                variant="outline"
                onClick={() => setShowAllTimes(!showAllTimes)}
                className="text-sm w-full max-w-xs flex items-center gap-2"
              >
                {showAllTimes ? "Mostrar apenas próximos horários" : "Ver mais opções de horários"}
                <ChevronDown className={`w-4 h-4 transition-transform ${showAllTimes ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
