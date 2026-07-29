import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { SmartIrrigationSchedule } from '../../types';
import { Droplets, Sparkles, RefreshCw, Calendar, CheckCircle2, Clock } from 'lucide-react';

export const SmartIrrigation: React.FC = () => {
  const { t } = useLanguage();

  const [cropName, setCropName] = useState('Tomato');
  const [cropStage, setCropStage] = useState('Flowering & Fruit Setting');
  const [soilMoisture, setSoilMoisture] = useState<number>(42);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<SmartIrrigationSchedule | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await api.getIrrigationSchedule({ cropName, cropStage, soilMoisture });
      setSchedule(res);
    } catch (err) {
      console.error('Irrigation schedule error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('smartIrrigation')}</h2>
            <p className="text-xs text-slate-500">Precision Drip Water Schedule & Moisture Management</p>
          </div>
        </div>
      </div>

      {/* Calculator Form */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Crop Growth Stage & Moisture Sensor Data
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Crop Name</label>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Growth Stage</label>
            <select
              value={cropStage}
              onChange={(e) => setCropStage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Sowing & Germination">Sowing & Germination (0-15 Days)</option>
              <option value="Vegetative Stage">Vegetative Stage (15-40 Days)</option>
              <option value="Flowering & Fruit Setting">Flowering & Fruit Setting (40-75 Days)</option>
              <option value="Fruit Maturation">Fruit Maturation & Harvesting</option>
            </select>
          </div>
        </div>

        {/* Moisture Slider Gauge */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">Current Soil Moisture Level:</span>
            <span
              className={`font-black text-sm ${
                soilMoisture < 45 ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {soilMoisture}% {soilMoisture < 45 ? '(Dry / Deficit)' : '(Sufficient)'}
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="90"
            value={soilMoisture}
            onChange={(e) => setSoilMoisture(Number(e.target.value))}
            className="w-full accent-cyan-600 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>10% (Critically Dry)</span>
            <span>50% (Optimal)</span>
            <span>90% (Saturated / Wet)</span>
          </div>
        </div>

        <button
          id="calculate-water-btn"
          onClick={handleCalculate}
          disabled={loading}
          className="w-full py-3 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-cyan-200" />
              <span>Calculating Water Requirement...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{t('calculateWater')}</span>
            </>
          )}
        </button>
      </div>

      {/* Irrigation Recommendation Output */}
      {schedule && (
        <div className="bg-white rounded-2xl border-2 border-cyan-500 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-cyan-700 bg-cyan-100 px-2.5 py-0.5 rounded-full uppercase">
                {schedule.cropName} • {schedule.cropStage}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Smart Drip Schedule</h3>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 block">Next Water Cycle</span>
              <span className="text-sm font-black text-cyan-700">{schedule.nextWateringTime}</span>
            </div>
          </div>

          <div className="bg-cyan-50/80 p-3.5 rounded-xl border border-cyan-200">
            <p className="text-xs font-bold text-cyan-950 leading-relaxed">
              💡 {schedule.recommendation}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Water Volume per Acre</span>
              <span className="text-sm font-bold text-slate-800">{schedule.waterVolumeLitersPerAcre.toLocaleString()} Liters</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Recommended Method</span>
              <span className="text-sm font-bold text-slate-800">{schedule.irrigationMethod}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-light italic">
            *Weather Sync Notice: {schedule.weatherImpactAdvice}
          </p>
        </div>
      )}
    </div>
  );
};
