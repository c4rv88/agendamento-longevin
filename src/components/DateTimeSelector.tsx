
import React, { useEffect, useState } from 'react';
import { FeegowApiService } from '@/services/feegowApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarCheck } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateTimeSelectorProps {
  selectedDate: string;
  selectedTime: string;
  professionalId: number;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  professionalId,
  onSelectDate,
  onSelectTime,
}) => {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDateObj, setSelectedDateObj] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );

  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDateObj(date);
    const dateString = format(date, 'yyyy-MM-dd');
    onSelectDate(dateString);
    onSelectTime(''); // Reset selected time
    
    setLoading(true);
    try {
      const schedule = await FeegowApiService.getAvailableSchedule(professionalId, dateString);
      setAvailableTimes(schedule?.times || []);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      setAvailableTimes([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate next 30 days for calendar
  const today = new Date();
  const maxDate = addDays(today, 30);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" />
            Selecione a Data
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDateObj}
            onSelect={handleDateSelect}
            disabled={(date) => date < today || date > maxDate}
            locale={ptBR}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {selectedDate && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              Horários Disponíveis - {format(new Date(selectedDate), "dd 'de' MMMM", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : availableTimes.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {availableTimes.map((time) => (
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
            ) : (
              <p className="text-center text-gray-500 py-4">
                Nenhum horário disponível para esta data
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
