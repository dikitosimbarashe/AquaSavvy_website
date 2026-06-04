"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SuperAdminPortal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const AdminDashboard_1 = __importDefault(require("./admin/AdminDashboard"));
const DailyChallengesManager_1 = __importDefault(require("./admin/DailyChallengesManager"));
const WeeklyChallengesManager_1 = __importDefault(require("./admin/WeeklyChallengesManager"));
const CommunityChallengesManager_1 = __importDefault(require("./admin/CommunityChallengesManager"));
const PlumberVerificationManager_1 = __importDefault(require("./admin/PlumberVerificationManager"));
const MarketManager_1 = __importDefault(require("./admin/MarketManager"));
const WaterMetricsManager_1 = __importDefault(require("./admin/WaterMetricsManager"));
function SuperAdminPortal({ onLogout }) {
    var _a;
    const [currentPage, setCurrentPage] = (0, react_1.useState)('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = (0, react_1.useState)(true);
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: lucide_react_1.LayoutDashboard },
        { id: 'daily', label: 'Daily Challenges', icon: lucide_react_1.Calendar },
        { id: 'weekly', label: 'Weekly Challenges', icon: lucide_react_1.CalendarDays },
        { id: 'community', label: 'Community Challenges', icon: lucide_react_1.Users },
        { id: 'plumbers', label: 'Plumber Verification', icon: lucide_react_1.UserCheck },
        { id: 'market', label: 'Market Management', icon: lucide_react_1.ShoppingCart },
        { id: 'metrics', label: 'Water Metrics', icon: lucide_react_1.Droplets },
    ];
    const renderContent = () => {
        switch (currentPage) {
            case 'dashboard':
                return (0, jsx_runtime_1.jsx)(AdminDashboard_1.default, { onNavigate: setCurrentPage });
            case 'daily':
                return (0, jsx_runtime_1.jsx)(DailyChallengesManager_1.default, {});
            case 'weekly':
                return (0, jsx_runtime_1.jsx)(WeeklyChallengesManager_1.default, {});
            case 'community':
                return (0, jsx_runtime_1.jsx)(CommunityChallengesManager_1.default, {});
            case 'plumbers':
                return (0, jsx_runtime_1.jsx)(PlumberVerificationManager_1.default, {});
            case 'market':
                return (0, jsx_runtime_1.jsx)(MarketManager_1.default, {});
            case 'metrics':
                return (0, jsx_runtime_1.jsx)(WaterMetricsManager_1.default, {});
            default:
                return (0, jsx_runtime_1.jsx)(AdminDashboard_1.default, { onNavigate: setCurrentPage });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-slate-50 flex font-sans", children: [(0, jsx_runtime_1.jsxs)("aside", { className: `${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-[#8B5CF6] to-[#4C1D95] text-white transition-all duration-300 flex flex-col shadow-2xl z-50`, children: [(0, jsx_runtime_1.jsx)("div", { className: "p-6 border-b border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [isSidebarOpen && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl font-black tracking-tight", children: "AquaSavvy" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-purple-200 font-bold uppercase tracking-widest mt-1", children: "SuperAdmin Portal" })] })), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsSidebarOpen(!isSidebarOpen), className: "p-2 hover:bg-white/10 rounded-xl transition-colors", children: isSidebarOpen ? (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { size: 20 }) })] }) }), (0, jsx_runtime_1.jsx)("nav", { className: "flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar", children: menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPage === item.id;
                            return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setCurrentPage(item.id), className: `w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isActive
                                    ? 'bg-white/20 text-white shadow-lg ring-1 ring-white/30'
                                    : 'text-purple-100 hover:bg-white/10 hover:text-white'}`, children: [(0, jsx_runtime_1.jsx)(Icon, { size: 20, className: isActive ? 'text-white' : 'text-purple-300' }), isSidebarOpen && ((0, jsx_runtime_1.jsx)("span", { className: "font-bold text-sm tracking-tight", children: item.label }))] }, item.id));
                        }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 border-t border-white/10", children: (0, jsx_runtime_1.jsxs)("button", { onClick: onLogout, className: "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-purple-100 hover:bg-red-500/20 hover:text-red-100 transition-all font-bold text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { size: 20 }), isSidebarOpen && (0, jsx_runtime_1.jsx)("span", { children: "Logout" })] }) })] }), (0, jsx_runtime_1.jsxs)("main", { className: "flex-1 flex flex-col h-screen overflow-hidden", children: [(0, jsx_runtime_1.jsx)("header", { className: "bg-white border-b border-slate-200 px-10 py-5 flex-shrink-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-black text-slate-900 tracking-tight", children: ((_a = menuItems.find(item => item.id === currentPage)) === null || _a === void 0 ? void 0 : _a.label) || 'Dashboard' }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-400 font-bold uppercase tracking-widest mt-1", children: currentPage === 'dashboard' ? 'Manage and control all challenges across the platform' : 'Platform Management & Insights' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-right hidden sm:block", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-black text-slate-900", children: "Super Admin" }), (0, jsx_runtime_1.jsx)("p", { className: "text-[11px] text-slate-400 font-medium tracking-tight", children: "admin@aquasavvy.com" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-11 h-11 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg shadow-purple-100 flex items-center justify-center text-white font-black text-sm", children: "SA" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-y-auto p-10 bg-slate-50/50 custom-scrollbar", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 }, children: renderContent() }, currentPage) })] })] }));
}
//# sourceMappingURL=SuperAdminPortal.js.map