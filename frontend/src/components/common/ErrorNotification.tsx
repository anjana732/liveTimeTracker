import { XCircle } from 'lucide-react';
import React, { useEffect } from 'react';

interface ErrorNotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export function ErrorNotification({ message, isVisible, onClose }: ErrorNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg transition-all duration-500">
      <XCircle className="w-5 h-5 mr-2" />
      {message}
    </div>
  );
}
