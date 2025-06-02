
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AppointmentDetailProps {
  icon: LucideIcon;
  label: string;
  value: string | undefined;
  secondaryValue?: string;
  iconColor?: string;
}

export const AppointmentDetail: React.FC<AppointmentDetailProps> = ({
  icon: Icon,
  label,
  value,
  secondaryValue,
  iconColor = 'text-[#8B8B8B]'
}) => {
  return (
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-sm text-gray-600">
          {value || '-'}
        </div>
        {secondaryValue && (
          <div className="text-sm text-gray-600">
            {secondaryValue}
          </div>
        )}
      </div>
    </div>
  );
};
