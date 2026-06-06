import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Notification: React.FC = () => {
  const { notification } = useStore();
  if (!notification) return null;

  const icons = { success: <CheckCircle size={18} className="text-green-500" />, error: <AlertCircle size={18} className="text-red-500" />, info: <Info size={18} className="text-blue-500" /> };
  const colors = { success: 'border-green-200 bg-green-50', error: 'border-red-200 bg-red-50', info: 'border-blue-200 bg-blue-50' };

  return (
    <div className={`fixed bottom-4 right-4 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm ${colors[notification.type]} animate-in slide-in-from-right`}>
      {icons[notification.type]}
      <p className="text-sm font-medium text-gray-800">{notification.message}</p>
    </div>
  );
};
