import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { MandiPriceItem } from '../../types';
import { TrendingUp, Search, Plus, MapPin, RefreshCw, CheckCircle2 } from 'lucide-react';

export const MarketPrices: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [mandis, setMandis] = useState<MandiPriceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Admin Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    mandiName: '',
    district: '',
    state: 'Maharashtra',
    cropName: '',
    variety: '',
    minPrice: '',
    maxPrice: '',
    modalPrice: '',
    priceTrend: 'up'
  });

  const fetchPrices = (query?: string) => {
    setLoading(true);
    api.getMandiPrices(query)
      .then((data) => setMandis(data))
      .catch((err) => console.error('Mandi prices fetch error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPrices(searchQuery);
  }, [searchQuery]);

  const handleAddMandi = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await api.addMandiPrice(formData);
      setMandis((prev) => [added, ...prev]);
      setShowAddModal(false);
      setFormData({
        mandiName: '',
        district: '',
        state: 'Maharashtra',
        cropName: '',
        variety: '',
        minPrice: '',
        maxPrice: '',
        modalPrice: '',
        priceTrend: 'up'
      });
    } catch (err) {
      console.error('Add mandi error:', err);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t('marketPrices')}</h2>
            <p className="text-xs text-slate-500">Live APMC Mandi Commodity Rates (₹ / Quintal)</p>
          </div>
        </div>

        {user?.role === 'admin' && (
          <button
            id="admin-add-mandi-btn"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Mandi Rate</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          id="mandi-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchMandi')}
          className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
        />
      </div>

      {/* Mandi List Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Fetching APMC mandi commodity rates...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mandis.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-emerald-500 transition-all space-y-3"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase">
                    {item.cropName} ({item.variety})
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{item.mandiName}</h3>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {item.district}, {item.state} • {item.distanceKm} km away
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-400 block">{t('modalPrice')}</span>
                  <span className="text-lg font-black text-slate-900">₹{item.modalPrice.toLocaleString()}</span>
                  <span
                    className={`text-[10px] font-bold block ${
                      item.priceTrend === 'up'
                        ? 'text-emerald-600'
                        : item.priceTrend === 'down'
                        ? 'text-rose-600'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.priceTrend === 'up' ? '▲ Price Surged' : item.priceTrend === 'down' ? '▼ Price Dropped' : '● Stable'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span>Min: <strong className="text-slate-900">₹{item.minPrice}</strong></span>
                <span>Max: <strong className="text-slate-900">₹{item.maxPrice}</strong></span>
                <span className="text-[10px] text-slate-400">Updated {item.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Modal for Adding New Mandi Rate */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-slate-900 text-sm">Add APMC Mandi Rate (Admin)</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMandi} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Mandi Name</label>
                <input
                  type="text"
                  required
                  value={formData.mandiName}
                  onChange={(e) => setFormData({ ...formData, mandiName: e.target.value })}
                  placeholder="e.g. Nashik APMC Main Market"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Crop Name</label>
                  <input
                    type="text"
                    required
                    value={formData.cropName}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                    placeholder="e.g. Red Onion"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Nashik"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Min Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.minPrice}
                    onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                    placeholder="1800"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Max Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.maxPrice}
                    onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                    placeholder="2500"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Modal Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.modalPrice}
                    onChange={(e) => setFormData({ ...formData, modalPrice: e.target.value })}
                    placeholder="2200"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all mt-2"
              >
                Publish Rate Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
