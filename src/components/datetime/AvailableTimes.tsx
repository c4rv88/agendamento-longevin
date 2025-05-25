
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  
  // Show only first 4 times or all times based on state
  const timesToShow = showAllTimes ? times : times.slice(0, 4);
  
  // Group times by period
  const groupedTimes = {
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

  const renderTimePeriod = (title: string, periodTimes: string[]) => {
    if (periodTimes.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {periodTimes.map(time => {
            const formattedTime = time.includes(':') ? time.split(':').slice(0, 2).join(':') : time;
            const isSelected = selectedTime === time;
            
            return (
              <Button
                key={time}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectTime(time)}
                className="text-sm w-full"
              >
                {formattedTime}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {showAllTimes 
            ? `Horários disponíveis`
            : `Próximos horários disponíveis`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {renderTimePeriod("Manhã", groupedTimes.morning)}
          {renderTimePeriod("Tarde", groupedTimes.afternoon)}
          {renderTimePeriod("Noite", groupedTimes.evening)}
          
          {times.length > 4 && (
            <div className="pt-2 flex justify-center">
              <Button 
                variant="outline"
                onClick={() => setShowAllTimes(prev => !prev)}
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
