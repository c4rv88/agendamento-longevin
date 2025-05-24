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
      let date;
      // Check if date is in dd-mm-yyyy format
      if (dateString.includes('-') && dateString.split('-').length === 3) {
        const parts = dateString.split('-');
        
        // If the first part is 4 characters (year), it's in yyyy-MM-dd format
        if (parts[0].length === 4) {
          date = parse(dateString, 'yyyy-MM-dd', new Date());
        } else {
          // Otherwise it's in dd-MM-yyyy format
          date = parse(dateString, 'dd-MM-yyyy', new Date());
        }
        return format(date, "EEE, dd 'de' MMMM", { locale: ptBR });
      }
      return dateString;
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
