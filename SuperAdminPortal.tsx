import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Users,
  LogOut,
  Menu,
  X,
  UserCheck,
  ShoppingCart,
  Droplets
} from 'lucide-react';
import AdminDashboard from './admin/AdminDashboard';
import DailyChallengesManager from './admin/DailyChallengesManager';
import WeeklyChallengesManager from './admin/WeeklyChallengesManager';
import CommunityChallengesManager from './admin/CommunityChallengesManager';
import PlumberVerificationManager from './admin/PlumberVerificationManager';
import MarketManager from './admin/MarketManager';
import WaterMetricsManager from './admin/WaterMetricsManager';

interface SuperAdminPortalProps {
  onLogout: () => void;
}

export default function SuperAdminPortal({ onLogout }: SuperAdminPortalProps) {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'daily' | 'weekly' | 'community' | 'plumbers' | 'market' | 'metrics'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'daily' as const, label: 'Daily Challenges', icon: Calendar },
    { id: 'weekly' as const, label: 'Weekly Challenges', icon: CalendarDays },
    { id: 'community' as const, label: 'Community Challenges', icon: Users },
    { id: 'plumbers' as const, label: 'Plumber Verification', icon: UserCheck },
    { id: 'market' as const, label: 'Market Management', icon: ShoppingCart },
    { id: 'metrics' as const, label: 'Water Metrics', icon: Droplets },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'daily':
        return <DailyChallengesManager />;
      case 'weekly':
        return <WeeklyChallengesManager />;
      case 'community':
        return <CommunityChallengesManager />;
      case 'plumbers':
        return <PlumberVerificationManager />;
      case 'market':
        return <MarketManager />;
      case 'metrics':
        return <WaterMetricsManager />;
      default:
        return <AdminDashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-[#8B5CF6] to-[#4C1D95] text-white transition-all duration-300 flex flex-col shadow-2xl z-50`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h1 className="text-xl font-black tracking-tight">AquaSavvy</h1>
                <p className="text-[10px] text-purple-200 font-bold uppercase tracking-widest mt-1">SuperAdmin Portal</p>
              </motion.div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-white/20 text-white shadow-lg ring-1 ring-white/30'
                    : 'text-purple-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-purple-300'} />
                {isSidebarOpen && (
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-purple-100 hover:bg-red-500/20 hover:text-red-100 transition-all font-bold text-sm"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-10 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                {currentPage === 'dashboard' ? 'Manage and control all challenges across the platform' : 'Platform Management & Insights'}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">Super Admin</p>
                <p className="text-[11px] text-slate-400 font-medium tracking-tight">admin@aquasavvy.com</p>
              </div>
              <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg shadow-purple-100 flex items-center justify-center text-white font-black text-sm">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50 custom-scrollbar">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
