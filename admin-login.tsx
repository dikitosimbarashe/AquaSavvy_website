import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AdminLoginPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginPage({ onBack, onLoginSuccess }: AdminLoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('dikitosimbarashe@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user has admin/superAdmin role
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin' || userData.role === 'superAdmin') {
          onLoginSuccess();
        } else {
          setError('Access denied: You do not have administrator privileges.');
          await auth.signOut();
        }
      } else {
        setError('User record not found in the database.');
        await auth.signOut();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#8B5CF6] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Animated Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[5%] left-[5%] w-[400px] h-[400px] bg-purple-200 rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 100, 0],
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white rounded-full"
        />
        <motion.div
          animate={{
            x: [0, 80, 0],
            scale: [1, 1.3, 1],
            opacity: [0.35, 0.65, 0.35]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[30%] right-[10%] w-[350px] h-[350px] bg-purple-100 rounded-full"
        />
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-semibold text-sm group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to App
      </button>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl p-8 md:p-10 relative z-10"
      >
        {/* Logo/Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#8B5CF6] rounded-2xl flex items-center justify-center mb-6 relative shadow-lg shadow-purple-200">
            <div className="absolute -top-2 -right-2">
              <Sparkles size={20} className="text-yellow-400 fill-yellow-400" />
            </div>
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">SuperAdmin Portal</h1>
          <p className="text-slate-400 text-xs font-medium text-center">Sign in to access the admin dashboard</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-xl flex items-center gap-2">
            <Info size={16} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#8B5CF6] transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dikitosimbarashe@gmail.com"
                className="w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-white transition-all text-xs font-medium placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#8B5CF6] transition-colors" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-11 pr-11 py-3.5 bg-[#F8FAFC] border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-white transition-all text-xs font-medium placeholder:text-slate-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8B5CF6] text-white font-bold py-4 rounded-xl shadow-xl shadow-purple-200 hover:bg-[#7C3AED] hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Shield size={18} />
                Sign In Securely
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-[9px] text-slate-400 font-medium">
            Protected by end-to-end encryption • <span className="text-[#8B5CF6] hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </motion.div>

      {/* Page Footer */}
      <div className="mt-10 flex items-center gap-2 text-white/50 text-[10px] font-medium tracking-wide">
        <Shield size={12} />
        Secured by AquaSavvy Authentication System
      </div>
    </div>
  );
}
