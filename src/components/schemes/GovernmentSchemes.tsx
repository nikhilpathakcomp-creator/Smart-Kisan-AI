import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { GovernmentScheme } from '../../types';
import { Landmark, CheckCircle2, FileText, ExternalLink, Sparkles, ChevronRight } from 'lucide-react';

export const GovernmentSchemes: React.FC = () => {
  const { t, language } = useLanguage();

  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSchemes()
      .then((data) => setSchemes(data))
      .catch((err) => console.error('Schemes fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-900 text-emerald-400">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('schemes')}</h2>
            <p className="text-xs text-slate-500">Government Agriculture Subsidies, Insurance & Credit Schemes</p>
          </div>
        </div>
      </div>

      {/* Scheme Cards */}
      <div className="grid grid-cols-1 gap-3">
        {schemes.map((s) => {
          const schemeTitle = s.title[language] || s.title.en;
          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-emerald-500 transition-all space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                      {s.category}
                    </span>
                    {s.popular && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Popular
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{schemeTitle}</h3>
                </div>

                <a
                  href={s.officialLink}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-xl transition-all"
                  title="Official Govt Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Financial Benefit Banner */}
              <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-950">
                💰 Benefit: {s.financialBenefit}
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block">{t('eligibility')}:</span>
                <ul className="space-y-1 pl-1">
                  {s.eligibility.map((e, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <button
                  onClick={() => setSelectedScheme(s)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>View Required Documents & Application Guide</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details & Documents Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                  {selectedScheme.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  {selectedScheme.title[language] || selectedScheme.title.en}
                </h3>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>{t('documentsNeeded')}:</span>
                </span>
                <ul className="space-y-1 text-slate-700 pl-2">
                  {selectedScheme.documentsRequired.map((doc, idx) => (
                    <li key={idx}>• {doc}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-1">Step-by-Step Application Guide:</span>
                <p className="text-emerald-950 font-medium leading-relaxed">{selectedScheme.applicationProcess}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={selectedScheme.officialLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl text-center shadow-md flex items-center justify-center gap-1.5"
              >
                <span>{t('applyNow')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
