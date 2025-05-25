
import React from 'react';

export const AppointmentHeader: React.FC = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Agendamento
              </h1>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Desenvolvido por Sauv®
          </div>
        </div>
      </div>
    </div>
  );
};
