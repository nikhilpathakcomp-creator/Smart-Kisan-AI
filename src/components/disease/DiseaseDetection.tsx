import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { DiseaseAnalysisResult } from '../../types';
import { sampleCropPhotos } from '../../data/mockData';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Leaf,
  FlaskConical,
  RefreshCw,
  Printer,
  ChevronRight
} from 'lucide-react';

export const DiseaseDetection: React.FC = () => {
  const { t, language } = useLanguage();

  const [selectedImage, setSelectedImage] = useState<string | null>(sampleCropPhotos[2].imageUrl);
  const [cropHint, setCropHint] = useState<string>('Tomato');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<DiseaseAnalysisResult | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await api.detectDisease(selectedImage, cropHint, language);
      setResult(res);
    } catch (err) {
      console.error('Disease detection failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const selectPreset = (sample: typeof sampleCropPhotos[0]) => {
    setSelectedImage(sample.imageUrl);
    setCropHint(sample.crop);
    setResult(null);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('diseaseDetect')}</h2>
            <p className="text-xs text-slate-500">AI Plant Pathology Diagnostic Engine powered by Gemini 3.6 Flash</p>
          </div>
        </div>
      </div>

      {/* Image Capture & Dropzone */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Step 1: Upload or Capture Crop Photo
          </label>
          <span className="text-xs text-emerald-600 font-semibold">Supports Leaf / Stem / Fruit</span>
        </div>

        {/* Selected Image Preview Box */}
        <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-all">
          {selectedImage ? (
            <div className="space-y-3">
              <div className="relative max-h-64 mx-auto rounded-xl overflow-hidden shadow-inner bg-slate-900 border border-slate-200 inline-block">
                <img
                  src={selectedImage}
                  alt="Selected Crop"
                  className="max-h-60 object-contain mx-auto"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 rounded-full text-xs"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-bold text-slate-700">Crop Type:</span>
                <input
                  type="text"
                  value={cropHint}
                  onChange={(e) => setCropHint(e.target.value)}
                  placeholder="e.g. Tomato, Rice, Cotton..."
                  className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          ) : (
            <div className="py-8 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{t('captureImage')}</p>
                <p className="text-xs text-slate-500 mt-0.5">JPEG, PNG files up to 10MB</p>
              </div>

              <label className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all">
                <Camera className="w-4 h-4" />
                <span>Select File or Take Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Sample Preset Photos for Instant Testing */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2">{t('sampleImages')}:</span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {sampleCropPhotos.map((sample) => (
              <button
                key={sample.id}
                onClick={() => selectPreset(sample)}
                className={`p-1.5 rounded-xl border text-left transition-all ${
                  selectedImage === sample.imageUrl
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <img
                  src={sample.imageUrl}
                  alt={sample.crop}
                  className="w-full h-16 object-cover rounded-lg mb-1"
                />
                <span className="text-[11px] font-bold text-slate-800 block truncate">{sample.crop}</span>
                <span className="text-[9px] text-slate-500 block truncate">{sample.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <button
          id="disease-analyze-btn"
          onClick={handleAnalyze}
          disabled={!selectedImage || analyzing}
          className={`w-full py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
            analyzing
              ? 'bg-emerald-800 text-emerald-200 cursor-wait'
              : selectedImage
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {analyzing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-300" />
              <span>{t('analyzingImage')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Run AI Disease Diagnosis</span>
            </>
          )}
        </button>
      </div>

      {/* AI Diagnostic Result Report */}
      {result && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500 p-5 shadow-lg space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                  {result.cropName}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    result.severity === 'Severe' || result.severity === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : result.severity === 'Moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {result.severity} Severity
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">{result.diseaseName}</h3>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block font-medium">{t('confidenceScore')}</span>
              <span className="text-2xl font-black text-emerald-600">{result.confidenceScore}%</span>
            </div>
          </div>

          {/* Symptoms & Causes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{t('symptoms')}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {result.symptoms.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>{t('causes')}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {result.causes.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Treatment Guide */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              <span>{t('treatment')}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Organic Treatment */}
              <div className="bg-green-50/70 p-4 rounded-xl border border-green-200">
                <h5 className="font-bold text-green-900 text-xs mb-2 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-green-700" />
                  <span>{t('organicTreatment')}</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-green-950 font-medium">
                  {result.treatments.organic.map((t, i) => (
                    <li key={i}>✓ {t}</li>
                  ))}
                </ul>
              </div>

              {/* Chemical Treatment */}
              <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200">
                <h5 className="font-bold text-purple-900 text-xs mb-2 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-purple-700" />
                  <span>{t('chemicalTreatment')}</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-purple-950 font-medium">
                  {result.treatments.chemical.map((t, i) => (
                    <li key={i}>✓ {t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          {result.recommendedProducts && result.recommendedProducts.length > 0 && (
            <div className="bg-emerald-900 text-white rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block">
                  Recommended Fungicides & Biocontrols
                </span>
                <span className="text-xs text-emerald-100 font-medium">
                  {result.recommendedProducts.join(' • ')}
                </span>
              </div>
              <button
                onClick={() => window.print()}
                className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Save Report</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
