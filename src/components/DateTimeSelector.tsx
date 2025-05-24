
import React, { useEffect, useState } from 'react';
import { AvailableSchedule } from '@/types/feegow';
import { FeegowApiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck } from 'lucide-react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface DateTimeSelectorProps {
  selectedDate: string;
  selectedTime: string;
  professionalId: number;
  unityId?: number;
  specialtyId?: number;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  professionalId,
  unityId,
  specialtyId,
  onSelectDate,
  onSelectTime,
}) => {
  const [availableSchedules, setAvailableSchedules] = useState<AvailableSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableSchedules = async () => {
      if (!professionalId) {
        setLoading(false);
        setError('Por favor, selecione um profissional primeiro.');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const schedules = await FeegowApiService.getAvailableSchedules(
          professionalId,
          unityId,
          specialtyId
        );
        
        setAvailableSchedules(schedules);
        
        // Automatically select the first available date if there is one
        if (schedules.length > 0) {
          onSelectDate(schedules[0].date);
          
          // And automatically select the first available time if there is one
          if (schedules[0].times.length > 0) {
            onSelectTime(schedules[0].times[0]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar horários:', error);
        setError('Falha ao carregar horários disponíveis. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSchedules();
  }, [professionalId, unityId, specialtyId, onSelectDate, onSelectTime]);

  const getAvailableTimesForDate = (date: string): string[] => {
    const schedule = availableSchedules.find(s => s.date === date);
    return schedule ? schedule.times : [];
  };

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

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" />
            Próximas Datas Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-12 rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" />
            Próximas Datas Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (availableSchedules.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" />
            Próximas Datas Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-gray-500">
              Nenhuma data disponível para este profissional.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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

      {selectedDate && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              Horários Disponíveis - {formatDisplayDate(selectedDate)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {getAvailableTimesForDate(selectedDate).map((time) => (
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
      )}
    </div>
  );
};
