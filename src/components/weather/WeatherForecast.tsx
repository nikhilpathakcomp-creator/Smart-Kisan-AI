import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { WeatherData } from '../../types';
import {
  CloudSun,
  CloudRain,
  Sun,
  Droplets,
  Wind,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Umbrella
} from 'lucide-react';

export const WeatherForecast: React.FC = () => {
  const { t } = useLanguage();

  const [district, setDistrict] = useState<string>('Nashik');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const districtsList = ['Nashik', 'Pune', 'Ludhiana', 'Indore', 'Nagpur', 'Kolhapur', 'Patna', 'Aurangabad'];

  const fetchWeather = (dist: string) => {
    setLoading(true);
    api.getWeather(dist)
      .then((data) => setWeather(data))
      .catch((err) => console.error('Weather error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWeather(district);
  }, [district]);

  return (
    <div className="space-y-5 pb-8">
      {/* Header & District Selector */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('weather')}</h2>
            <p className="text-xs text-slate-500">Real-time IMD Agricultural Weather Alerts & 7-Day Forecast</p>
          </div>
        </div>

        {/* District Switcher */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {districtsList.map((d) => (
              <option key={d} value={d}>
                {d} District
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Fetching agricultural weather data...</p>
        </div>
      ) : weather ? (
        <>
          {/* Weather Alert Banner */}
          {weather.alerts.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-sm space-y-1.5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>{t('rainAlert')} & Spray Advisory</span>
              </div>
              <p className="text-xs text-amber-950 font-medium pl-7 leading-relaxed">
                {weather.alerts[0]}
              </p>
            </div>
          )}

          {/* Current Weather Main Card */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-md space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block">
                  Current Condition
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {weather.city}, {weather.state}
                </h3>
                <span className="text-xs text-slate-300 font-light">{weather.condition}</span>
              </div>

              <div className="text-right">
                <span className="text-4xl font-black text-amber-400">{weather.tempC}°C</span>
                <span className="text-xs text-emerald-200 block mt-0.5">UV Index: {weather.uvIndex}</span>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 border-t border-emerald-800/60 pt-4">
              <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-700/40 text-center">
                <Droplets className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <span className="text-[10px] text-emerald-200 uppercase block font-medium">{t('humidity')}</span>
                <span className="text-sm font-bold text-white">{weather.humidity}%</span>
              </div>

              <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-700/40 text-center">
                <Wind className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
                <span className="text-[10px] text-emerald-200 uppercase block font-medium">{t('windSpeed')}</span>
                <span className="text-sm font-bold text-white">{weather.windKmvh} km/h</span>
              </div>

              <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-700/40 text-center">
                <Umbrella className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <span className="text-[10px] text-emerald-200 uppercase block font-medium">{t('rainfall')}</span>
                <span className="text-sm font-bold text-white">{weather.rainfallMm} mm</span>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">{t('sevenDayForecast')}</h3>

            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {weather.forecast.map((f, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    f.day === 'Today'
                      ? 'bg-emerald-50 border-emerald-500 font-bold'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-800 block">{f.day}</span>
                  <span className="text-[10px] text-slate-400 block mb-2">{f.date}</span>

                  <div className="my-1 text-center">
                    {f.rainProb > 50 ? (
                      <CloudRain className="w-6 h-6 text-blue-600 mx-auto" />
                    ) : f.rainProb > 20 ? (
                      <CloudSun className="w-6 h-6 text-amber-500 mx-auto" />
                    ) : (
                      <Sun className="w-6 h-6 text-amber-400 mx-auto" />
                    )}
                  </div>

                  <span className="text-xs font-black text-slate-900 block mt-1">
                    {f.highC}° / {f.lowC}°
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 block mt-0.5">
                    🌧 {f.rainProb}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
