
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DateTimeStatusProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  noDataMessage?: string;
  showNoData?: boolean;
}

export const DateTimeStatus: React.FC<DateTimeStatusProps> = ({
  loading = false,
  error = null,
  onRetry,
  noDataMessage = "Nenhuma data disponível para este profissional.",
  showNoData = false
}) => {
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
            {onRetry && (
              <Button 
                onClick={onRetry} 
                className="mt-4"
                variant="outline"
              >
                Tentar Novamente
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showNoData) {
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
            <p className="text-gray-500">{noDataMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
