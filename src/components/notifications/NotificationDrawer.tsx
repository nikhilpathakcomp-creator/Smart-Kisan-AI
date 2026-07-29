import React from 'react';
import { NotificationItem } from '../../types';
import { Bell, CloudRain, Droplets, FlaskConical, AlertTriangle, TrendingUp, Landmark, CheckCheck } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'weather':
        return <CloudRain className="w-4 h-4 text-blue-600" />;
      case 'irrigation':
        return <Droplets className="w-4 h-4 text-cyan-600" />;
      case 'fertilizer':
        return <FlaskConical className="w-4 h-4 text-purple-600" />;
      case 'disease':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'price':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'scheme':
        return <Landmark className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex justify-end">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl p-4 flex flex-col space-y-4 animate-in slide-in-from-right duration-250">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">Farm Alerts & Reminders</h3>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">{notifications.length} Total Alerts</span>
          <button
            onClick={onMarkRead}
            className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                !n.isRead ? 'bg-emerald-50/60 border-emerald-300 font-medium' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  {getIcon(n.type)}
                  <span>{n.title}</span>
                </div>
                <span className="text-[9px] text-slate-400">{n.timestamp}</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
