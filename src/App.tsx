import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MobileFrame } from './components/MobileFrame';
import { Dashboard } from './components/dashboard/Dashboard';
import { DiseaseDetection } from './components/disease/DiseaseDetection';
import { AiChatbot } from './components/chatbot/AiChatbot';
import { WeatherForecast } from './components/weather/WeatherForecast';
import { CropRecommendation } from './components/crops/CropRecommendation';
import { SmartIrrigation } from './components/irrigation/SmartIrrigation';

import { MarketPrices } from './components/mandi/MarketPrices';
import { GovernmentSchemes } from './components/schemes/GovernmentSchemes';
import { FarmerProfile } from './components/profile/FarmerProfile';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { CodeExportModal } from './components/codeExport/CodeExportModal';
import { AuthModal } from './components/auth/AuthModal';
import { api } from './services/api';
import { NotificationItem } from './types';

function MainApp() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileView, setIsMobileView] = useState<boolean>(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isCodeExportOpen, setIsCodeExportOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    api.getNotifications()
      .then((data) => setNotifications(data))
      .catch((err) => console.error('Notifications error:', err));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkNotificationsRead = async () => {
    await api.markNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const renderTabContent = () => {
  console.log('ACTIVE TAB:', activeTab);
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'disease':
        return <DiseaseDetection />;
      case 'chatbot':
        return <AiChatbot />;
      case 'weather':
        return <WeatherForecast />;
      case 'crops':
        return <CropRecommendation />;
      case 'irrigation':
        return <SmartIrrigation />;
      case 'fertilizer':
        return <FertilizerRecommendation />;
      case 'mandi':
        return <MarketPrices />;
      case 'schemes':
        return <GovernmentSchemes />;
      case 'profile':
        return <FarmerProfile />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} flex flex-col`}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileView={isMobileView}
        setIsMobileView={setIsMobileView}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadCount}
        onOpenCodeExport={() => setIsCodeExportOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main View Area wrapped in optional Smartphone Frame or Fullscreen */}
      <main className="flex-1">
        <MobileFrame isMobileView={isMobileView}>
          {renderTabContent()}
        </MobileFrame>
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Slide-over Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationsRead}
      />

      {/* Source Code & Deployment Exporter Modal */}
      <CodeExportModal
        isOpen={isCodeExportOpen}
        onClose={() => setIsCodeExportOpen(false)}
      />

      {/* Farmer Auth & Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
