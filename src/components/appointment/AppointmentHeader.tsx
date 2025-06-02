
import React from 'react';

export const AppointmentHeader: React.FC = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-[#7B8466]/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            <img 
              src="https://longevin.site/wp-content/uploads/2025/05/logo-longevin-horizontal.png" 
              alt="Logo Longevin" 
              className="h-12 w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
