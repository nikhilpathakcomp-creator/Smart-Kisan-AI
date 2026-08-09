import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LayoutDashboard, Bot, TrendingUp, User, CloudSun, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    
    { id: 'chatbot', label: 'Krishi Bot', icon: Bot },
    { id: 'mandi', label: t('marketPrices'), icon: TrendingUp },
    { id: user?.role === 'admin' ? 'admin' : 'profile', label: user?.role === 'admin' ? 'Admin' : t('profile'), icon: user?.role === 'admin' ? ShieldCheck : User },
  ];

  return (
    <nav className="bg-[#f4f7f2] border-t border-emerald-900/10 px-3 py-2 flex justify-around items-center sticky bottom-0 z-30 shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center py-1.5 px-3 rounded-full transition-all ${
              isActive
                ? 'text-white bg-[#1a3c34] font-bold shadow-xs scale-105'
                : 'text-emerald-950/70 hover:text-[#1a3c34] font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-emerald-400' : 'stroke-[1.75px]'}`} />
            <span className="text-[10px] mt-0.5 whitespace-nowrap">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
