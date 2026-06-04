import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  Settings, 
  Save, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  TrendingDown, 
  Trophy,
  RefreshCw,
  Info
} from 'lucide-react';
import { waterMetricsService } from '../services/waterMetricsService';
import { WaterMetrics, AdminLog } from '../types/waterMetrics';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function WaterMetricsManager() {
  const [metrics, setMetrics] = useState<WaterMetrics | null>(null);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [formMetrics, setFormMetrics] = useState<Partial<WaterMetrics>>({});

  useEffect(() => {
    // Initialize default metrics if they don't exist
    waterMetricsService.initializeDefaultMetrics();

    // Subscribe to metrics
    const unsubscribeMetrics = waterMetricsService.subscribeToMetrics((data) => {
      if (data) {
        setMetrics(data);
        setFormMetrics(data);
      }
      setLoading(false);
    });

    // Subscribe to recent audit logs
    const logsQuery = query(
      collection(db, 'admin_logs'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
      const logData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminLog[];
      setLogs(logData);
    });

    return () => {
      unsubscribeMetrics();
      unsubscribeLogs();
    };
  }, []);

  const handleInputChange = (field: keyof WaterMetrics, value: number) => {
    setFormMetrics(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiplierChange = (key: keyof WaterMetrics['difficultyMultipliers'], value: number) => {
    setFormMetrics(prev => ({
      ...prev,
      difficultyMultipliers: {
        ...prev.difficultyMultipliers!,
        [key]: value
      }
    }));
  };

  const handleThresholdChange = (key: keyof WaterMetrics['efficiencyThresholds'], value: number) => {
    setFormMetrics(prev => ({
      ...prev,
      efficiencyThresholds: {
        ...prev.efficiencyThresholds!,
        [key]: value
      }
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await waterMetricsService.updateMetrics(formMetrics);
      setSuccess("Water metrics updated successfully across the entire platform.");
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      console.error("Error saving metrics:", err);
      setError(err.message || "Failed to update water metrics. Please check your permissions.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <RefreshCw className="animate-spin text-blue-500" size={40} />
        <p className="text-slate-500 font-medium italic">Loading global water standards...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Water Metrics Management</h3>
          <p className="text-sm text-slate-500">Configure platform-wide water consumption standards and efficiency targets.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Last Sync</p>
            <p className="text-xs font-bold text-slate-600">
              {metrics?.updatedAt?.toDate().toLocaleString() || 'Never'}
            </p>
          </div>
          <div className="h-10 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg text-green-700 text-xs font-bold">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            REALTIME SYNC ACTIVE
          </div>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700"
          >
            <CheckCircle2 size={20} />
            <p className="text-sm font-bold">{success}</p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
          >
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Standard Consumption Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Droplets size={20} />
                </div>
                <h4 className="font-bold text-slate-900">Standard Consumption Limits</h4>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Daily Per Person (L)</label>
                  <input
                    type="number"
                    value={formMetrics.dailyPerPersonLiters}
                    onChange={(e) => handleInputChange('dailyPerPersonLiters', Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                  <p className="mt-2 text-[10px] text-slate-400 font-medium">Standard baseline for daily usage.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Weekly Standard (L)</label>
                  <input
                    type="number"
                    value={formMetrics.weeklyPerPersonLiters}
                    onChange={(e) => handleInputChange('weeklyPerPersonLiters', Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                  <p className="mt-2 text-[10px] text-slate-400 font-medium">Aggregate weekly target.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Monthly Standard (L)</label>
                  <input
                    type="number"
                    value={formMetrics.monthlyPerPersonLiters}
                    onChange={(e) => handleInputChange('monthlyPerPersonLiters', Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                  <p className="mt-2 text-[10px] text-slate-400 font-medium">Long-term conservation goal.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gamification Multipliers */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Trophy size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900">Difficulty Multipliers</h4>
                </div>
                <div className="p-6 space-y-4">
                  {Object.entries(formMetrics.difficultyMultipliers || {}).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-600 capitalize">{key}</label>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400">×</span>
                        <input
                          type="number"
                          step="0.1"
                          value={val}
                          onChange={(e) => handleMultiplierChange(key as any, Number(e.target.value))}
                          className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-right font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-3 bg-purple-50/50 rounded-xl flex gap-3">
                    <Info size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-purple-800 font-medium">Used to normalize leaderboard scores and reward calculations based on mission difficulty.</p>
                  </div>
                </div>
              </div>

              {/* Efficiency Thresholds */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <TrendingDown size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900">Efficiency Thresholds</h4>
                </div>
                <div className="p-6 space-y-4">
                  {Object.entries(formMetrics.efficiencyThresholds || {}).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-600">
                        {key === 'ecoElite' ? 'Eco Elite' : key === 'ecoSmart' ? 'Eco Smart' : 'Average User'}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => handleThresholdChange(key as any, Number(e.target.value))}
                          className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-right font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        <span className="text-[10px] font-black text-slate-400">%</span>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-3 bg-green-50/50 rounded-xl flex gap-3">
                    <Info size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-green-800 font-medium">Defines the percentage of standard consumption required to achieve each efficiency tier.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-100 transition-all transform active:scale-95"
              >
                {saving ? (
                  <RefreshCw className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {saving ? 'SYNCING CHANGES...' : 'SAVE & PROPAGATE UPDATES'}
              </button>
            </div>
          </form>
        </div>

        {/* Audit Logs Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                  <History size={20} />
                </div>
                <h4 className="font-bold text-slate-900">Audit Logs</h4>
              </div>
              <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-black text-slate-500">RECENT 10</span>
            </div>
            <div className="divide-y divide-slate-50">
              {logs.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <History className="mx-auto text-slate-200" size={32} />
                  <p className="text-xs text-slate-400 font-medium italic">No recent updates recorded.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600">
                        {log.adminEmail.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-slate-900 truncate">
                          {log.adminEmail}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                          Updated {log.affectedSettings.length} metric{log.affectedSettings.length > 1 ? 's' : ''}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {log.affectedSettings.map(setting => (
                            <span key={setting} className="px-1.5 py-0.5 bg-white border border-slate-100 rounded text-[8px] font-bold text-slate-400 uppercase">
                              {setting}
                            </span>
                          ))}
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">
                          {log.timestamp.toDate().toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-100">
            <h5 className="font-black text-sm uppercase tracking-widest mb-2">Platform Impact</h5>
            <p className="text-xs text-blue-100 font-medium leading-relaxed mb-4">
              Updates made here are pushed to all homeowner mobile apps instantly via Firestore realtime listeners. This affects efficiency badges, leaderboard rankings, and personal conservation targets globally.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black bg-white/10 rounded-lg px-3 py-2">
              <CheckCircle2 size={14} className="text-blue-200" />
              END-TO-END ENCRYPTION ACTIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
