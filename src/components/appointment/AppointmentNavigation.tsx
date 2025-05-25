
import React from 'react';

interface AppointmentNavigationProps {
  currentStep: number;
  canProceed: boolean;
  onNext: () => void;
  onPrev: () => void;
  onReset?: () => void;
}

export const AppointmentNavigation: React.FC<AppointmentNavigationProps> = () => {
  // Component kept for compatibility but navigation is now handled in AppointmentScheduler
  return null;
};
