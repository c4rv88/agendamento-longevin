
import React, { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ChevronDown } from 'lucide-react';

interface AvailableTimesProps {
  times: string[];
  selectedTime: string;
  selectedDate: string;
  onSelectTime: (time: string) => void;
}

// TimeButton component to reduce re-renders
const TimeButton = memo(({ 
  time, 
  isSelected, 
  onSelect 
}: { 
  time: string; 
  isSelected: boolean; 
  onSelect: () => void 
}) => {
  // Format time (remove seconds)
  const formattedTime = time.includes(':') ? time.split(':').slice(0, 2).join(':') : time;
  
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      onClick={onSelect}
      className="text-sm w-full"
    >
      {formattedTime}
    </Button>
  );
});
TimeButton.displayName = 'TimeButton';

// TimePeriod component to reduce re-renders
const TimePeriod = memo(({ 
  title, 
  times, 
  selectedTime, 
  onSelectTime 
}: { 
  title: string; 
  times: string[]; 
  selectedTime: string; 
  onSelectTime: (time: string) => void 
}) => {
  if (times.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {times.map(time => (
          <TimeButton 
            key={time} 
            time={time} 
            isSelected={selectedTime === time}
            onSelect={() => onSelectTime(time)}
          />
        ))}
      </div>
    </div>
  );
});
TimePeriod.displayName = 'TimePeriod';

// Main component using memo to prevent unnecessary re-renders
export const AvailableTimes = memo(({
  times,
  selectedTime,
  selectedDate,
  onSelectTime
}: AvailableTimesProps) => {
  const [showAllTimes, setShowAllTimes] = useState(false);
  
  // If no times or no date selected, show message
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
  
  // Get closest 4 times if not showing all
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
          {/* Morning times */}
          <TimePeriod 
            title="Manhã" 
            times={groupedTimes.morning}
            selectedTime={selectedTime}
            onSelectTime={onSelectTime}
          />

          {/* Afternoon times */}
          <TimePeriod 
            title="Tarde" 
            times={groupedTimes.afternoon}
            selectedTime={selectedTime}
            onSelectTime={onSelectTime}
          />

          {/* Evening times */}
          <TimePeriod 
            title="Noite" 
            times={groupedTimes.evening}
            selectedTime={selectedTime}
            onSelectTime={onSelectTime}
          />
          
          {/* Button to show all times or less times */}
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
});
AvailableTimes.displayName = 'AvailableTimes';
