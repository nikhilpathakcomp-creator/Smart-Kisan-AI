import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, Lock, Phone, MapPin, Sprout, Shield, LogOut, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, login, register, logout } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'farmer' | 'admin'>('farmer');
  const [district, setDistrict] = useState('Nashik');
  const [state, setState] = useState('Maharashtra');
  const [landSizeAcres, setLandSizeAcres] = useState('4.5');
  const [soilType, setSoilType] = useState('Black Cotton');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        if (!phone) {
          setError('Please enter your 10-digit phone number');
          setLoading(false);
          return;
        }
        await login(phone, role);
      } else {
        if (!phone || !name) {
          setError('Please fill in required fields (Name & Phone)');
          setLoading(false);
          return;
        }
        await register({
          name,
          phone,
          role,
          district,
          state,
          landSizeAcres: parseFloat(landSizeAcres) || 3,
          soilType,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-emerald-900/10 text-slate-900 dark:text-white animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#1a3c34] text-emerald-400 font-black flex items-center justify-center text-lg">
              K
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#1a3c34] dark:text-emerald-400">
                {user ? 'Kisan Account' : mode === 'login' ? 'Farmer Login' : 'Register New Farmer'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Secure JWT Authentication & Farm Profile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold p-1 text-lg"
          >
            ✕
          </button>
        </div>

        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</span>
                <span className="bg-[#1a3c34] text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">Phone: +91 {user.phone}</p>
              <p className="text-slate-600 dark:text-slate-300">Location: {user.location.district}, {user.location.state}</p>
              <p className="text-slate-600 dark:text-slate-300">Land Size: {user.farmInfo.landSizeAcres} Acres ({user.farmInfo.soilType})</p>
            </div>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Account</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-2.5 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold border border-rose-200">
                {error}
              </div>
            )}

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full font-bold text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-1.5 rounded-full transition-all ${
                  mode === 'login'
                    ? 'bg-[#1a3c34] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-1.5 rounded-full transition-all ${
                  mode === 'register'
                    ? 'bg-[#1a3c34] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                New Registration
              </button>
            </div>

            {mode === 'register' && (
              <div>
                <label className="font-semibold block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-semibold block mb-1">Mobile Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              >
                <option value="farmer">Farmer / Kisan</option>
                <option value="admin">Administrator / Krishi Vigyan Kendra</option>
              </select>
            </div>

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Land Size (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={landSizeAcres}
                      onChange={(e) => setLandSizeAcres(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Soil Type</label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                    >
                      <option value="Black Cotton">Black Cotton Soil</option>
                      <option value="Alluvial">Alluvial Soil</option>
                      <option value="Red Soil">Red Soil</option>
                      <option value="Loamy">Loamy Soil</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1a3c34] hover:bg-emerald-900 text-white font-bold text-xs rounded-full shadow-md transition-all mt-2"
            >
              {loading ? 'Processing JWT Session...' : mode === 'login' ? 'Login with Phone' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
