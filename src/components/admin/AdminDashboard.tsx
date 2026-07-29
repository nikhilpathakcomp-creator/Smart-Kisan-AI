import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldCheck, Users, Activity, AlertTriangle, TrendingUp, Plus } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminAnalytics()
      .then((data) => setAnalytics(data))
      .catch((err) => console.error('Admin analytics error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="bg-amber-900 text-white rounded-2xl p-5 border border-amber-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Administrator Management Dashboard</h2>
            <p className="text-xs text-amber-200">Krishi Vigyan Kendra & Admin Control Panel</p>
          </div>
        </div>

        <span className="text-xs bg-amber-500/30 text-amber-200 border border-amber-400/30 px-2.5 py-1 rounded-full font-bold">
          ADMIN ACTIVE
        </span>
      </div>

      {analytics && (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <Users className="w-5 h-5 text-emerald-600 mb-2" />
              <span className="text-xs text-slate-500 block font-medium">Registered Farmers</span>
              <span className="text-xl font-black text-slate-900">{analytics.totalRegisteredFarmers.toLocaleString()}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <Activity className="w-5 h-5 text-blue-600 mb-2" />
              <span className="text-xs text-slate-500 block font-medium">AI Disease Scans</span>
              <span className="text-xl font-black text-slate-900">{analytics.totalScansPerformed.toLocaleString()}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
              <AlertTriangle className="w-5 h-5 text-rose-600 mb-2" />
              <span className="text-xs text-slate-500 block font-medium">Outbreak Warnings</span>
              <span className="text-xl font-black text-rose-600">{analytics.diseaseOutbreaksAlerts.length} Districts</span>
            </div>
          </div>

          {/* Outbreak Warnings List */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>District Outbreak Surveillance</span>
            </h3>

            <div className="space-y-2">
              {analytics.diseaseOutbreaksAlerts.map((o: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{o.district} District • {o.crop}</span>
                    <span className="text-rose-900">Detected Outbreak: {o.disease}</span>
                  </div>
                  <span className="font-bold text-rose-800 bg-rose-200/80 px-2.5 py-0.5 rounded-full text-[10px]">
                    {o.risk} Risk Level
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
