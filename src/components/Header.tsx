import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Language, UserRole } from '../types';
import { Sprout, Bell, Smartphone, Monitor, ShieldCheck, UserCheck, Code, Globe, User, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileView: boolean;
  setIsMobileView: (val: boolean) => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  onOpenCodeExport: () => void;
  onOpenAuth: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMobileView,
  setIsMobileView,
  onOpenNotifications,
  unreadCount,
  onOpenCodeExport,
  onOpenAuth,
  darkMode,
  setDarkMode,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, switchRole } = useAuth();

  return (
    <header className="bg-[#1a3c34] text-white border-b border-emerald-950/60 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Logo & App Title */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-emerald-400 text-[#1a3c34] flex items-center justify-center font-black text-xl shadow-sm">
            K
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif font-bold text-lg sm:text-xl tracking-tight text-white leading-none">
                {t('appTitle')}
              </h1>
              <span className="text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                AI v2.6
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 hidden sm:block mt-0.5 font-light">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Language Switcher */}
          <div className="flex items-center bg-black/20 border border-white/10 rounded-full p-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-emerald-400 ml-1.5 mr-1 hidden sm:inline" />
            {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
              <button
                key={lang}
                id={`lang-btn-${lang}`}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all ${
                  language === lang
                    ? 'bg-[#1a3c34] text-white shadow-xs border border-emerald-500/40'
                    : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'HI' : 'MR'}
              </button>
            ))}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-emerald-100 hover:text-white bg-black/20 border border-white/10 rounded-full hover:bg-white/10 transition-all"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-emerald-200" />}
          </button>

          {/* Farmer Login/Auth Modal Trigger */}
          <button
            id="auth-modal-trigger-btn"
            onClick={onOpenAuth}
            className="flex items-center gap-1 text-xs bg-black/20 border border-white/10 hover:bg-white/10 text-white px-3 py-1.5 rounded-full font-bold transition-all"
            title="Farmer Account Login & JWT Auth"
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">{user ? user.name.split(' ')[0] : 'Login'}</span>
          </button>

          {/* Role Toggle Pill (Farmer vs Admin) */}
          <button
            id="role-switch-btn"
            onClick={() => switchRole(user?.role === 'admin' ? 'farmer' : 'admin')}
            title="Switch User Role"
            className={`hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-bold transition-all ${
              user?.role === 'admin'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30 hover:bg-emerald-500/30'
            }`}
          >
            {user?.role === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Farmer</span>
              </>
            )}
          </button>

          {/* Source Code Modal Exporter Button */}
          <button
            id="code-exporter-btn"
            onClick={onOpenCodeExport}
            className="flex items-center gap-1.5 text-xs bg-emerald-500 text-[#1a3c34] hover:bg-emerald-400 px-3 py-1.5 rounded-full font-bold transition-all shadow-xs"
            title="Export Flutter & Python Source Code"
          >
            <Code className="w-4 h-4 text-[#1a3c34]" />
            <span className="hidden sm:inline">Source Code</span>
          </button>

          {/* Device Frame View Toggle */}
          <button
            id="device-frame-toggle"
            onClick={() => setIsMobileView(!isMobileView)}
            className="p-2 text-emerald-100 hover:text-white bg-black/20 border border-white/10 rounded-full hover:bg-white/10 transition-all"
            title={isMobileView ? 'Switch to Fullscreen Layout' : 'Switch to Mobile Smartphone Frame'}
          >
            {isMobileView ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4 text-emerald-300" />}
          </button>

          {/* Notification Bell */}
          <button
            id="notification-bell-btn"
            onClick={onOpenNotifications}
            className="relative p-2 text-emerald-100 hover:text-white bg-black/20 border border-white/10 rounded-full hover:bg-white/10 transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#1a3c34]"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
