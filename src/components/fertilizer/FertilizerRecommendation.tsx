import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { FertilizerRecommendationResult } from '../../types';
import {
  FlaskConical,
  Camera,
  Sparkles,
  RefreshCw,
  ScanText,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const FertilizerRecommendation: React.FC = () => {
  const { t } = useLanguage();

  const [cropName, setCropName] = useState('Onion');
  const [growthStage, setGrowthStage] = useState('Vegetative (30 Days After Transplanting)');
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<FertilizerRecommendationResult | null>(null);

  // Label OCR State
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any | null>(null);

  const handleCalculateGuide = async () => {
    setLoading(true);
    try {
      const res = await api.getFertilizerGuide({ cropName, growthStage });
      setGuide(res);
    } catch (err) {
      console.error('Fertilizer guide error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOcrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOcrLoading(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await api.ocrFertilizerLabel(base64);
          setOcrResult(res);
        } catch (err) {
          console.error('OCR error:', err);
        } finally {
          setOcrLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('fertilizer')} & OCR Bag Scanner</h2>
            <p className="text-xs text-slate-500">NPK Nutrient Dosage Calculator & Fertilizer Label OCR Reader</p>
          </div>
        </div>
      </div>

      {/* Bag Label OCR Scanner Section */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScanText className="w-5 h-5 text-purple-300" />
            <h3 className="font-bold text-sm text-white">{t('scanFertilizerLabel')}</h3>
          </div>
          <span className="text-[10px] bg-purple-500/30 border border-purple-400/30 text-purple-200 px-2 py-0.5 rounded-full font-medium">
            Gemini Vision OCR
          </span>
        </div>

        <p className="text-xs text-purple-200 font-light leading-relaxed">
          Snap or upload a photo of your fertilizer bag, urea sack, or pesticide bottle label to automatically detect N-P-K percentages, dosage rules, and toxic safety warnings.
        </p>

        <label className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-purple-950 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all">
          <Camera className="w-4 h-4" />
          <span>{ocrLoading ? 'Scanning Label OCR...' : 'Scan Fertilizer Bag / Bottle Photo'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleOcrUpload}
            disabled={ocrLoading}
            className="hidden"
          />
        </label>

        {ocrResult && (
          <div className="bg-white text-slate-900 rounded-xl p-4 space-y-2 mt-3 animate-in fade-in border border-purple-300">
            <span className="text-[10px] font-bold uppercase text-purple-700 block tracking-wider">
              OCR Scanned Product Analysis
            </span>
            <h4 className="font-bold text-sm text-slate-900">{ocrResult.productName}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-purple-50 p-2 rounded-lg">
                <span className="font-bold text-purple-900 block">NPK Ratio / Chemical:</span>
                <span className="text-slate-700">{ocrResult.npkRatio}</span>
              </div>
              <div className="bg-purple-50 p-2 rounded-lg">
                <span className="font-bold text-purple-900 block">Dosage Rate:</span>
                <span className="text-slate-700">{ocrResult.dosagePerAcre}</span>
              </div>
            </div>
            <p className="text-xs text-rose-800 font-medium bg-rose-50 p-2 rounded-lg">
              ⚠️ Cautions: {ocrResult.safetyCautions}
            </p>
          </div>
        )}
      </div>

      {/* Dosage Calculator Form */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Crop Stage Fertilizer Dosage Calculator
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Target Crop</label>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Growth Stage</label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-purple-500"
            >
              <option value="Basal Dose (Pre-sowing)">Basal Dose (Pre-sowing / Land Prep)</option>
              <option value="Vegetative (30 Days After Transplanting)">Vegetative (30 Days After Sowing)</option>
              <option value="Flowering & Tuber Formation">Flowering & Tuber/Fruit Formation</option>
              <option value="Fruit Maturity Stage">Fruit Maturity Stage</option>
            </select>
          </div>
        </div>

        <button
          id="fertilizer-dosage-btn"
          onClick={handleCalculateGuide}
          disabled={loading}
          className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-purple-200" />
              <span>Calculating Fertilizer Schedule...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{t('fertilizerDosage')}</span>
            </>
          )}
        </button>
      </div>

      {/* Fertilizer Schedule Output */}
      {guide && (
        <div className="bg-white rounded-2xl border-2 border-purple-500 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase">
                {guide.cropName} • {guide.growthStage}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Recommended Fertilizer Schedule</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {guide.recommendedFertilizers.map((f, i) => (
              <div key={i} className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 space-y-1">
                <span className="text-xs font-black text-purple-950 block">{f.name}</span>
                <span className="text-xs font-bold text-slate-800 block">Dosage: {f.dosagePerAcre}</span>
                <span className="text-[11px] text-slate-600 block">{f.applicationMethod}</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-800 block">Safety & Handling Cautions:</span>
            <ul className="text-xs text-slate-700 space-y-1">
              {guide.safetyTips.map((tip, i) => (
                <li key={i}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
