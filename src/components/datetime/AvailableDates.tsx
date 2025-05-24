
import React from 'react';
import { AvailableSchedule } from '@/types/feegow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck } from 'lucide-react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="w-5 h-5" />
          Próximas Datas Disponíveis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableSchedules.map((schedule) => (
            <Button
              key={schedule.date}
              variant={selectedDate === schedule.date ? "default" : "outline"}
              className="p-3 h-auto justify-start"
              onClick={() => onSelectDate(schedule.date)}
            >
              <div className="text-left">
                <div className="font-semibold">
                  {formatDisplayDate(schedule.date)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {schedule.times.length} horários disponíveis
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
