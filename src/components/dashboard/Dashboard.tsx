import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { MandiPriceItem, WeatherData } from '../../types';
import {
  
  Bot,
  CloudSun,
  Sprout,
  Droplets,
  
  TrendingUp,
  Landmark,
  Sparkles,
  MapPin,
  ChevronRight,
  TrendingDown,
  AlertTriangle,
  FileSearch
} from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [mandis, setMandis] = useState<MandiPriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getWeather(), api.getMandiPrices()])
      .then(([wData, mData]) => {
        setWeather(wData);
        setMandis(mData.slice(0, 4));
      })
      .catch((err) => console.error('Dashboard data load error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 pb-6">
      {/* Welcome Banner */}
      <div className="bg-[#1a3c34] rounded-[1.75rem] p-5 text-white shadow-md relative overflow-hidden border border-emerald-900/50">
        <div className="absolute -right-6 -bottom-8 opacity-15 pointer-events-none">
          <Sprout className="w-56 h-56 text-white" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 border border-white/10 mb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{user?.location.district}, {user?.location.state}</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
              {t('welcomeFarmer')}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-light mt-0.5">
              Smart Kisan AI active for {user?.farmInfo.landSizeAcres} Acres land ({user?.farmInfo.soilType} Soil).
            </p>
          </div>

          
        </div>
      </div>

      {/* Quick AI Agriculture Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-serif text-lg font-bold text-[#1a3c34] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{t('quickActions')}</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">6 Intelligent AI Services</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Tool 1: Disease AI */}
          

          {/* Tool 2: AI Voice Chatbot */}
          <button
            id="tool-chatbot"
            onClick={() => setActiveTab('chatbot')}
            className="group bg-white p-4 rounded-[1.25rem] border border-slate-200/80 hover:border-emerald-600 hover:shadow-md transition-all text-left flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:bg-blue-700 group-hover:text-white transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
                {t('chatbot')}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 font-normal line-clamp-2">
                24/7 Krishi Mitra voice & text farming expert.
              </p>
            </div>
          </button>

          {/* Tool 3: Weather Forecast */}
          <button
            id="tool-weather"
            onClick={() => setActiveTab('weather')}
            className="group bg-white p-4 rounded-[1.25rem] border border-slate-200/80 hover:border-emerald-600 hover:shadow-md transition-all text-left flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-700 group-hover:text-white transition-colors">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-700 transition-colors">
                {t('weather')}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 font-normal line-clamp-2">
                7-day forecast & emergency rain warnings.
              </p>
            </div>
          </button>

          {/* Tool 4: Crop Recommendation */}
          <button
            id="tool-crop-recommend"
            onClick={() => setActiveTab('crops')}
            className="group bg-white p-4 rounded-[1.25rem] border border-slate-200/80 hover:border-emerald-600 hover:shadow-md transition-all text-left flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-green-50 text-[#1a3c34] flex items-center justify-center mb-3 group-hover:bg-[#1a3c34] group-hover:text-emerald-400 transition-colors">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#1a3c34] transition-colors">
                {t('cropRecommend')}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 font-normal line-clamp-2">
                Soil NPK & seasonal suitability analyzer.
              </p>
            </div>
          </button>

          {/* Tool 5: Smart Irrigation */}
          <button
            id="tool-smart-irrigation"
            onClick={() => setActiveTab('irrigation')}
            className="group bg-white p-4 rounded-[1.25rem] border border-slate-200/80 hover:border-emerald-600 hover:shadow-md transition-all text-left flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3 group-hover:bg-cyan-700 group-hover:text-white transition-colors">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-cyan-700 transition-colors">
                {t('smartIrrigation')}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 font-normal line-clamp-2">
                Drip watering calculator & moisture gauge.
              </p>
            </div>
          </button>

          
          
        </div>
      </div>

      {/* Weather Snapshot Widget & Alert */}
      {weather && (
        <div className="bg-white rounded-[1.5rem] border border-slate-200/80 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <CloudSun className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  {weather.city}, {weather.state} Weather
                </h4>
                <span className="text-xs text-slate-500 font-medium">
                  {weather.condition} • Humidity: {weather.humidity}%
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">{weather.tempC}°C</span>
              <button
                onClick={() => setActiveTab('weather')}
                className="block text-xs font-semibold text-[#1a3c34] hover:underline"
              >
                Full Forecast →
              </button>
            </div>
          </div>

          {weather.alerts.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{t('rainAlert')}: </span>
                <span>{weather.alerts[0]}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mandi Market Rates Snapshot */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#1a3c34]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{t('nearbyMandis')}</h4>
              <p className="text-xs text-slate-500 font-normal">Real-time modal price per Quintal (100kg)</p>
            </div>
          </div>

          <button
            id="dash-view-all-mandis"
            onClick={() => setActiveTab('mandi')}
            className="text-xs font-bold text-[#1a3c34] hover:text-emerald-800 flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {mandis.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-[#f4f7f2]/60 border border-emerald-900/10 rounded-xl flex items-center justify-between hover:border-emerald-500 transition-all"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">{item.cropName}</span>
                <span className="text-[11px] text-slate-500 font-medium block">{item.mandiName}</span>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-slate-900">₹{item.modalPrice.toLocaleString()}</span>
                <span
                  className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                    item.priceTrend === 'up'
                      ? 'text-emerald-700'
                      : item.priceTrend === 'down'
                      ? 'text-rose-600'
                      : 'text-slate-500'
                  }`}
                >
                  {item.priceTrend === 'up' ? '▲ Up' : item.priceTrend === 'down' ? '▼ Down' : '● Stable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Govt Schemes Quick Portal Banner */}
      <div className="bg-[#1a3c34] rounded-[1.5rem] p-4 text-white shadow-xs flex items-center justify-between border border-emerald-950/60">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-white">{t('schemes')}</h4>
            <p className="text-xs text-emerald-100/80 font-light">PM-Kisan, PMFBY & Soil Health Card eligibility</p>
          </div>
        </div>

        <button
          id="dash-explore-schemes-btn"
          onClick={() => setActiveTab('schemes')}
          className="bg-emerald-400 hover:bg-emerald-300 text-[#1a3c34] font-bold text-xs px-4 py-2 rounded-full transition-all whitespace-nowrap shadow-xs"
        >
          Check Schemes
        </button>
      </div>
    </div>
  );
};
