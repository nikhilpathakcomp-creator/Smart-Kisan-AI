import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { CropRecommendationResult } from '../../types';
import { Sprout, Sparkles, RefreshCw, CheckCircle2, TrendingUp, Calendar, Droplets } from 'lucide-react';

export const CropRecommendation: React.FC = () => {
  const { t } = useLanguage();

  const [soilType, setSoilType] = useState('Black Cotton');
  const [season, setSeason] = useState('Kharif');
  const [rainfall, setRainfall] = useState('Moderate (800mm)');
  const [npk, setNpk] = useState({ n: 40, p: 30, k: 20 });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CropRecommendationResult[] | null>(null);

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const res = await api.getCropRecommendations({
        soilType,
        season,
        rainfall,
        npk
      });
      setResults(res);
    } catch (err) {
      console.error('Crop recommendation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-green-50 text-green-600">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('cropRecommend')}</h2>
            <p className="text-xs text-slate-500">AI Soil & Seasonal Crop Yield Maximizer</p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Step 1: Farm Parameters & Soil Test Data
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">{t('soilType')}</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Black Cotton">Black Cotton Soil (Regur)</option>
              <option value="Alluvial">Alluvial Soil</option>
              <option value="Red Soil">Red / Yellow Soil</option>
              <option value="Loamy">Sandy Loamy Soil</option>
              <option value="Laterite">Laterite Soil</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">{t('season')}</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Kharif">Kharif (Monsoon / June - Oct)</option>
              <option value="Rabi">Rabi (Winter / Nov - March)</option>
              <option value="Zaid">Zaid (Summer / April - May)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Expected Rainfall</label>
            <select
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Low (400mm)">Low (300 - 500mm)</option>
              <option value="Moderate (800mm)">Moderate (600 - 1000mm)</option>
              <option value="High (1400mm)">High (&gt;1200mm)</option>
            </select>
          </div>
        </div>

        {/* NPK Inputs */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-800 block mb-2">Soil N-P-K Levels (kg/Acre):</span>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">Nitrogen (N)</span>
              <input
                type="number"
                value={npk.n}
                onChange={(e) => setNpk({ ...npk, n: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-lg text-center font-bold text-xs py-1.5 text-slate-800"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">Phosphorus (P)</span>
              <input
                type="number"
                value={npk.p}
                onChange={(e) => setNpk({ ...npk, p: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-lg text-center font-bold text-xs py-1.5 text-slate-800"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">Potassium (K)</span>
              <input
                type="number"
                value={npk.k}
                onChange={(e) => setNpk({ ...npk, k: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-lg text-center font-bold text-xs py-1.5 text-slate-800"
              />
            </div>
          </div>
        </div>

        <button
          id="crop-recommend-btn"
          onClick={handleRecommend}
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-200" />
              <span>Calculating AI Crop Suitability...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{t('recommendCrops')}</span>
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 text-sm px-1">
            Top 3 Recommended Crops for Your Farm
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {results.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-slate-200 p-4 hover:border-emerald-500 shadow-sm transition-all space-y-3"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{item.cropName}</h4>
                      <span className="text-[11px] text-slate-500">Planting Window: {item.bestPlantingMonth}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500 block">Suitability Score</span>
                    <span className="text-lg font-black text-emerald-600">{item.suitabilityScore}%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  💡 {item.reasoning}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/60">
                    <span className="text-[10px] text-slate-500 block font-medium">Expected Yield</span>
                    <span className="font-bold text-slate-800">{item.expectedYieldPerAcre}</span>
                  </div>

                  <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                    <span className="text-[10px] text-slate-500 block font-medium">Growth Duration</span>
                    <span className="font-bold text-slate-800">{item.growthDurationDays} Days</span>
                  </div>

                  <div className="bg-blue-50/60 p-2 rounded-lg border border-blue-200/60">
                    <span className="text-[10px] text-slate-500 block font-medium">Mandi Price Est.</span>
                    <span className="font-bold text-slate-800">₹{item.avgMarketPricePerQuintal}/Qtl</span>
                  </div>

                  <div className="bg-cyan-50/60 p-2 rounded-lg border border-cyan-200/60">
                    <span className="text-[10px] text-slate-500 block font-medium">Water Need</span>
                    <span className="font-bold text-slate-800">{item.waterRequirement}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
