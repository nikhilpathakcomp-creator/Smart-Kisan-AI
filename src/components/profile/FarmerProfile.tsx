import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User, DiseaseAnalysisResult } from '../../types';
import { User as UserIcon, MapPin, Sprout, ShieldCheck, Save, FileText, CheckCircle2 } from 'lucide-react';

export const FarmerProfile: React.FC = () => {
  const { t } = useLanguage();
  const { user, switchRole, updateUser } = useAuth();

  const [savedReports, setSavedReports] = useState<DiseaseAnalysisResult[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [landSize, setLandSize] = useState(user?.farmInfo.landSizeAcres || 4.5);
  const [soilType, setSoilType] = useState(user?.farmInfo.soilType || 'Black Cotton');

  useEffect(() => {
    api.getProfile()
      .then((data) => {
        if (data.savedReports) setSavedReports(data.savedReports);
      })
      .catch((err) => console.error('Profile fetch error:', err));
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      phone,
      farmInfo: {
        ...user!.farmInfo,
        landSizeAcres: Number(landSize),
        soilType
      }
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('profile')}</h2>
            <p className="text-xs text-slate-500">Kisan ID, Land Records & Saved AI Reports</p>
          </div>
        </div>

        <button
          id="profile-role-toggle-btn"
          onClick={() => switchRole(user?.role === 'admin' ? 'farmer' : 'admin')}
          className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-3 py-1.5 rounded-xl transition-all"
        >
          {user?.role === 'admin' ? 'Switch to Farmer View' : 'Switch to Admin Mode'}
        </button>
      </div>

      {/* Personal & Farm Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{user?.name}</h3>
              <span className="text-xs text-slate-500 font-medium">
                📱 +91 {user?.phone} • {user?.location.district}, {user?.location.state}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            {isEditing ? 'Cancel' : 'Edit Info'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Farmer Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Land Size (Acres)</label>
                <input
                  type="number"
                  value={landSize}
                  onChange={(e) => setLandSize(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Soil Type</label>
                <input
                  type="text"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2 px-4 bg-emerald-600 text-white font-bold rounded-xl shadow-sm text-xs"
            >
              Save Profile
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Total Land</span>
              <span className="font-bold text-slate-800 text-sm">{user?.farmInfo.landSizeAcres} Acres</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Soil Type</span>
              <span className="font-bold text-slate-800 text-sm">{user?.farmInfo.soilType}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Irrigation</span>
              <span className="font-bold text-slate-800 text-sm">{user?.farmInfo.irrigationSource}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Active Crops</span>
              <span className="font-bold text-slate-800 text-sm">{user?.farmInfo.primaryCrops.join(', ')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Saved Diagnostic Reports */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>{t('savedReports')} ({savedReports.length})</span>
        </h3>

        {savedReports.length === 0 ? (
          <p className="text-xs text-slate-400">No disease reports saved yet.</p>
        ) : (
          <div className="space-y-2">
            {savedReports.map((rep) => (
              <div
                key={rep.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{rep.cropName} - {rep.diseaseName}</span>
                  <span className="text-[10px] text-slate-500">Confidence: {rep.confidenceScore}% • Analyzed {rep.analyzedAt}</span>
                </div>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                  {rep.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
