
import React from 'react';

interface AppointmentHeaderProps {
  logoUrl: string;
  setLogoUrl: (url: string) => void;
}

export const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({ logoUrl, setLogoUrl }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {logoUrl && (
              <img src={logoUrl} alt="Logo da Clínica" className="h-12 w-auto object-contain" />
            )}
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Agendamento Online
              </h1>
              <p className="text-sm text-gray-600">Sistema Feegow</p>
            </div>
          </div>
          <div className="hidden md:block">
            <input
              type="url"
              placeholder="URL do logotipo da clínica"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
