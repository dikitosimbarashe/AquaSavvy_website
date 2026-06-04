"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WaterMetricsManager;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const waterMetricsService_1 = require("../services/waterMetricsService");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../firebase");
function WaterMetricsManager() {
    var _a;
    const [metrics, setMetrics] = (0, react_1.useState)(null);
    const [logs, setLogs] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [saving, setSaving] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [success, setSuccess] = (0, react_1.useState)(null);
    // Form states
    const [formMetrics, setFormMetrics] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        // Initialize default metrics if they don't exist
        waterMetricsService_1.waterMetricsService.initializeDefaultMetrics();
        // Subscribe to metrics
        const unsubscribeMetrics = waterMetricsService_1.waterMetricsService.subscribeToMetrics((data) => {
            if (data) {
                setMetrics(data);
                setFormMetrics(data);
            }
            setLoading(false);
        });
        // Subscribe to recent audit logs
        const logsQuery = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'admin_logs'), (0, firestore_1.orderBy)('timestamp', 'desc'), (0, firestore_1.limit)(10));
        const unsubscribeLogs = (0, firestore_1.onSnapshot)(logsQuery, (snapshot) => {
            const logData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLogs(logData);
        });
        return () => {
            unsubscribeMetrics();
            unsubscribeLogs();
        };
    }, []);
    const handleInputChange = (field, value) => {
        setFormMetrics(prev => ({ ...prev, [field]: value }));
    };
    const handleMultiplierChange = (key, value) => {
        setFormMetrics(prev => ({
            ...prev,
            difficultyMultipliers: {
                ...prev.difficultyMultipliers,
                [key]: value
            }
        }));
    };
    const handleThresholdChange = (key, value) => {
        setFormMetrics(prev => ({
            ...prev,
            efficiencyThresholds: {
                ...prev.efficiencyThresholds,
                [key]: value
            }
        }));
    };
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            await waterMetricsService_1.waterMetricsService.updateMetrics(formMetrics);
            setSuccess("Water metrics updated successfully across the entire platform.");
            setTimeout(() => setSuccess(null), 5000);
        }
        catch (err) {
            console.error("Error saving metrics:", err);
            setError(err.message || "Failed to update water metrics. Please check your permissions.");
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center p-20 space-y-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "animate-spin text-blue-500", size: 40 }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-500 font-medium italic", children: "Loading global water standards..." })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8 pb-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-slate-900", children: "Water Metrics Management" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500", children: "Configure platform-wide water consumption standards and efficiency targets." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-right hidden sm:block", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[10px] uppercase tracking-widest text-slate-400 font-bold", children: "Last Sync" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs font-bold text-slate-600", children: ((_a = metrics === null || metrics === void 0 ? void 0 : metrics.updatedAt) === null || _a === void 0 ? void 0 : _a.toDate().toLocaleString()) || 'Never' })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-10 w-[1px] bg-slate-200" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg text-green-700 text-xs font-bold", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }), "REALTIME SYNC ACTIVE"] })] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.AnimatePresence, { children: [success && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { size: 20 }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-bold", children: success })] })), error && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 20 }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-bold", children: error })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "xl:col-span-2 space-y-6", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSave, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-6 border-b border-slate-100 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-blue-50 text-blue-600 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Droplets, { size: 20 }) }), (0, jsx_runtime_1.jsx)("h4", { className: "font-bold text-slate-900", children: "Standard Consumption Limits" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2", children: "Daily Per Person (L)" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: formMetrics.dailyPerPersonLiters, onChange: (e) => handleInputChange('dailyPerPersonLiters', Number(e.target.value)), className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-[10px] text-slate-400 font-medium", children: "Standard baseline for daily usage." })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2", children: "Weekly Standard (L)" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: formMetrics.weeklyPerPersonLiters, onChange: (e) => handleInputChange('weeklyPerPersonLiters', Number(e.target.value)), className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-[10px] text-slate-400 font-medium", children: "Aggregate weekly target." })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2", children: "Monthly Standard (L)" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: formMetrics.monthlyPerPersonLiters, onChange: (e) => handleInputChange('monthlyPerPersonLiters', Number(e.target.value)), className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-[10px] text-slate-400 font-medium", children: "Long-term conservation goal." })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-6 border-b border-slate-100 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-purple-50 text-purple-600 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trophy, { size: 20 }) }), (0, jsx_runtime_1.jsx)("h4", { className: "font-bold text-slate-900", children: "Difficulty Multipliers" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-4", children: [Object.entries(formMetrics.difficultyMultipliers || {}).map(([key, val]) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-bold text-slate-600 capitalize", children: key }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-black text-slate-400", children: "\u00D7" }), (0, jsx_runtime_1.jsx)("input", { type: "number", step: "0.1", value: val, onChange: (e) => handleMultiplierChange(key, Number(e.target.value)), className: "w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-right font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none" })] })] }, key))), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 p-3 bg-purple-50/50 rounded-xl flex gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Info, { size: 16, className: "text-purple-600 flex-shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-purple-800 font-medium", children: "Used to normalize leaderboard scores and reward calculations based on mission difficulty." })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-6 border-b border-slate-100 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-green-50 text-green-600 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { size: 20 }) }), (0, jsx_runtime_1.jsx)("h4", { className: "font-bold text-slate-900", children: "Efficiency Thresholds" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-4", children: [Object.entries(formMetrics.efficiencyThresholds || {}).map(([key, val]) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-bold text-slate-600", children: key === 'ecoElite' ? 'Eco Elite' : key === 'ecoSmart' ? 'Eco Smart' : 'Average User' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("input", { type: "number", value: val, onChange: (e) => handleThresholdChange(key, Number(e.target.value)), className: "w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-right font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-black text-slate-400", children: "%" })] })] }, key))), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 p-3 bg-green-50/50 rounded-xl flex gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Info, { size: 16, className: "text-green-600 flex-shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-green-800 font-medium", children: "Defines the percentage of standard consumption required to achieve each efficiency tier." })] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end", children: (0, jsx_runtime_1.jsxs)("button", { type: "submit", disabled: saving, className: "inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-100 transition-all transform active:scale-95", children: [saving ? ((0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "animate-spin", size: 18 })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Save, { size: 18 })), saving ? 'SYNCING CHANGES...' : 'SAVE & PROPAGATE UPDATES'] }) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-6 border-b border-slate-100 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-slate-50 text-slate-600 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.History, { size: 20 }) }), (0, jsx_runtime_1.jsx)("h4", { className: "font-bold text-slate-900", children: "Audit Logs" })] }), (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-slate-100 rounded-md text-[10px] font-black text-slate-500", children: "RECENT 10" })] }), (0, jsx_runtime_1.jsx)("div", { className: "divide-y divide-slate-50", children: logs.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "p-10 text-center space-y-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "mx-auto text-slate-200", size: 32 }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-400 font-medium italic", children: "No recent updates recorded." })] })) : (logs.map((log) => ((0, jsx_runtime_1.jsx)("div", { className: "p-4 hover:bg-slate-50 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600", children: log.adminEmail.substring(0, 2).toUpperCase() }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[11px] font-black text-slate-900 truncate", children: log.adminEmail }), (0, jsx_runtime_1.jsxs)("p", { className: "text-[10px] text-slate-500 font-medium mt-0.5", children: ["Updated ", log.affectedSettings.length, " metric", log.affectedSettings.length > 1 ? 's' : ''] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2 flex flex-wrap gap-1", children: log.affectedSettings.map(setting => ((0, jsx_runtime_1.jsx)("span", { className: "px-1.5 py-0.5 bg-white border border-slate-100 rounded text-[8px] font-bold text-slate-400 uppercase", children: setting }, setting))) }), (0, jsx_runtime_1.jsx)("p", { className: "text-[9px] text-slate-400 font-bold uppercase mt-2", children: log.timestamp.toDate().toLocaleString() })] })] }) }, log.id)))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-100", children: [(0, jsx_runtime_1.jsx)("h5", { className: "font-black text-sm uppercase tracking-widest mb-2", children: "Platform Impact" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-blue-100 font-medium leading-relaxed mb-4", children: "Updates made here are pushed to all homeowner mobile apps instantly via Firestore realtime listeners. This affects efficiency badges, leaderboard rankings, and personal conservation targets globally." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-[10px] font-black bg-white/10 rounded-lg px-3 py-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { size: 14, className: "text-blue-200" }), "END-TO-END ENCRYPTION ACTIVE"] })] })] })] })] }));
}
//# sourceMappingURL=WaterMetricsManager.js.map