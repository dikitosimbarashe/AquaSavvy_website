import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Droplet,
  Shield,
  LineChart,
  Wrench,
  Users,
  Award,
  CheckCircle,
  ChevronRight,
  Lock,
  Zap,
  TrendingDown,
  Bell,
  Star,
  Globe,
  ArrowRight,
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface AquaSavvyWebsiteProps {
  onAdminLogin: () => void;
  onGetStarted: () => void;
  onBackToApp: () => void;
  onMarketClick: () => void;
}

import PlumberVerificationForm from './PlumberVerificationForm';

export default function AquaSavvyWebsite({ onAdminLogin, onGetStarted, onBackToApp, onMarketClick }: AquaSavvyWebsiteProps) {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isPlumberFormOpen, setIsPlumberFormOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'checking' | 'success' | 'failed' | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pendingOrderId = localStorage.getItem('dischub_pending_order_id');
    if (pendingOrderId) {
      setPaymentStatus('checking');
      fetch("/api/payment/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: "084978e58f844ea5aaee1960d4f997ba",
          order_id: pendingOrderId,
          recipient: "dikitosimbarashe@gmail.com"
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === "success") {
            setPaymentStatus('success');
            localStorage.removeItem('dischub_pending_order_id');
          } else if (data.status === "failed") {
            setPaymentStatus('failed');
            localStorage.removeItem('dischub_pending_order_id');
          } else if (data.status === "pending") {
            setPaymentStatus('checking');
          } else {
            setPaymentStatus('failed');
            localStorage.removeItem('dischub_pending_order_id');
          }
        })
        .catch(err => {
          console.error("Payment status check error", err);
          setPaymentStatus('failed');
          localStorage.removeItem('dischub_pending_order_id');
        });
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const features = [
    {
      icon: Droplet,
      title: 'Smart Monitoring',
      description: 'Real-time water usage tracking with AI-powered insights and predictive analytics.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Bell,
      title: 'Leak Detection',
      description: 'Instant alerts for anomalies, leaks, and unusual consumption patterns.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: LineChart,
      title: 'Usage Analytics',
      description: 'Detailed consumption reports with trends, forecasts, and cost optimization.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Wrench,
      title: 'Verified Plumbers',
      description: 'Access certified professionals with verified credentials and transparent pricing.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Active Users', icon: Users },
    { value: '1.2M', label: 'Liters Saved', icon: Droplet },
    { value: '98%', label: 'Satisfaction Rate', icon: Star },
    { value: '500+', label: 'Verified Plumbers', icon: Award }
  ];

  const benefits = [
    'Reduce water bills by up to 30%',
    'Real-time monitoring and alerts',
    'Verified professional network',
    'Gamified water-saving rewards',
    'Multi-payment options',
    'Enterprise-grade security'
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Scan & Register',
      description: 'Use your phone to scan QR codes on water taps and add them to your system instantly.',
      icon: Phone
    },
    {
      step: '02',
      title: 'Monitor Usage',
      description: 'Track real-time water consumption with detailed analytics and insights.',
      icon: LineChart
    },
    {
      step: '03',
      title: 'Get Alerts',
      description: 'Receive instant notifications for leaks, anomalies, and maintenance needs.',
      icon: Bell
    },
    {
      step: '04',
      title: 'Connect & Save',
      description: 'Find verified plumbers and optimize your water usage to save money.',
      icon: Wrench
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-slate-900" />
            </button>

            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 md:gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBackToApp}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Droplet className="text-white" size={20} />
              </div>
              <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AquaSavvy
              </span>
            </motion.div>

            {/* Navigation Items - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                How It Works
              </a>
              <a href="#plumbers" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                For Plumbers
              </a>
              <button
                onClick={onMarketClick}
                className="text-slate-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
              >
                <ShoppingCart size={16} />
                Shop
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="text-slate-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
                >
                  <Lock size={16} />
                  Admin
                </button>

                {showAdminMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2"
                  >
                    <button
                      onClick={onAdminLogin}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                    >
                      <Shield size={16} />
                      SuperAdmin Portal
                    </button>
                  </motion.div>
                )}
              </div>

              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                Get Started
              </motion.button>
            </div>

            {/* Mobile Get Started Button */}
            <motion.button
              onClick={onGetStarted}
              whileTap={{ scale: 0.95 }}
              className="md:hidden px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-lg"
            >
              Start
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            onClick={() => setShowMobileMenu(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-0 top-0 bottom-0 w-2/3 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Droplet className="text-white" size={20} />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  AquaSavvy
                </span>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            <div className="overflow-y-auto h-[calc(100%-60px)]">
              <div className="p-4 space-y-2">
                <a
                  href="#features"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                >
                  How It Works
                </a>
                <a
                  href="#plumbers"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                >
                  For Plumbers
                </a>
                <button
                  onClick={() => {
                    onMarketClick();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Shop
                </button>

                <div className="border-t border-slate-200 my-3" />

                <button
                  onClick={() => {
                    onAdminLogin();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  <Lock size={16} />
                  SuperAdmin Portal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <div ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background with Parallax */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100"
        >
          {/* Animated Water Circles */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl"
          />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6"
            >
              <Zap size={16} />
              Smart Water Management Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold text-slate-900 mb-6 leading-tight"
            >
              Save Water.<br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Save Money.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-slate-600 mb-8 leading-relaxed"
            >
              Monitor, manage, and optimize your water consumption with AI-powered insights and verified professional support.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg font-semibold rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center gap-2"
              >
                Start Free Trial
                <ChevronRight size={20} />
              </motion.button>

              <motion.button
                onClick={() => setIsDemoOpen(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                Watch Demo
                <ArrowRight size={20} />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center gap-6 text-sm text-slate-600"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" />
                14-day free trial
              </div>
            </motion.div>

            {/* Demo Video Modal */}
            {isDemoOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/60"
                  onClick={() => {
                    setIsDemoOpen(false);
                    if (videoRef.current) {
                      videoRef.current.pause();
                      videoRef.current.currentTime = 0;
                    }
                  }}
                />

                <div className="relative w-full max-w-3xl mx-4">
                  <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="font-semibold">AquaSavvy — Demo</div>
                      <button
                        onClick={() => {
                          setIsDemoOpen(false);
                          if (videoRef.current) {
                            videoRef.current.pause();
                            videoRef.current.currentTime = 0;
                          }
                        }}
                        className="p-2"
                        aria-label="Close demo"
                      >
                        <X />
                      </button>
                    </div>

                    <div className="w-full bg-black">
                      <video
                        ref={videoRef}
                        src="/videos/aquasavvy_video.mp4"
                        controls
                        autoPlay
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Today's Usage</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Droplet className="text-white" size={24} />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-5xl font-bold text-slate-900 mb-2">247L</div>
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <TrendingDown size={18} />
                    <span>18% less than yesterday</span>
                  </div>
                </div>

                {/* Mock Chart */}
                <div className="h-32 flex items-end gap-2 mb-6">
                  {[40, 65, 45, 80, 60, 90, 55, 70, 50, 75, 45, 60].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">124L</div>
                    <div className="text-xs text-slate-500">Kitchen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-600">89L</div>
                    <div className="text-xs text-slate-500">Bathroom</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">34L</div>
                    <div className="text-xs text-slate-500">Garden</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Alert Card */}
              <motion.div
                initial={{ opacity: 0, x: 50, y: 50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -right-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white max-w-xs z-20"
              >
                <div className="flex items-start gap-3">
                  <Bell size={24} />
                  <div>
                    <div className="font-bold mb-1">Leak Detected!</div>
                    <div className="text-sm text-orange-100">Bathroom tap - 2.5L/hour</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <Icon size={32} className="mx-auto text-cyan-400 mb-3" />
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-slate-400 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive water management tools designed for modern living
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Marketplace Section */}
      <div className="py-32 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-semibold mb-6">
                <ShoppingCart size={16} />
                AquaSavvy Marketplace
              </div>

              <h2 className="text-5xl font-bold mb-6">
                Premium Water-Saving Products
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Shop our curated collection of smart devices, filters, and eco-friendly solutions designed to maximize your water efficiency.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-white" size={16} />
                  </div>
                  <span className="text-lg text-slate-200">Smart water meters & sensors</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-white" size={16} />
                  </div>
                  <span className="text-lg text-slate-200">Premium filtration systems</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-white" size={16} />
                  </div>
                  <span className="text-lg text-slate-200">Eco-friendly water savers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-white" size={16} />
                  </div>
                  <span className="text-lg text-slate-200">Free shipping on all orders</span>
                </div>
              </div>

              <motion.button
                onClick={onMarketClick}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg font-bold rounded-xl shadow-2xl hover:shadow-cyan-500/50 transition-all flex items-center gap-3"
              >
                Browse Marketplace
                <ShoppingCart size={20} />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {/* Product Cards */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl mb-4 flex items-center justify-center">
                  <Droplet size={48} className="text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Smart Water Meter</h3>
                <p className="text-sm text-slate-300 mb-3">AI-powered monitoring</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-cyan-400">$89</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-white">4.8</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="w-full h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl mb-4 flex items-center justify-center">
                  <Shield size={48} className="text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Filter System</h3>
                <p className="text-sm text-slate-300 mb-3">5-stage filtration</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-cyan-400">$149</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-white">4.9</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="w-full h-32 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl mb-4 flex items-center justify-center">
                  <Zap size={48} className="text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Flow Restrictor</h3>
                <p className="text-sm text-slate-300 mb-3">Save 40% water</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-cyan-400">$24</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-white">4.6</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="w-full h-32 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl mb-4 flex items-center justify-center">
                  <Bell size={48} className="text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Leak Detector</h3>
                <p className="text-sm text-slate-300 mb-3">Early warning kit</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-cyan-400">$129</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-white">4.9</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-32 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in minutes and start saving water today
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="text-8xl font-bold text-blue-100 mb-4">{item.step}</div>
                  <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 mt-8">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold text-slate-900 mb-6">
                Why Choose AquaSavvy?
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Join thousands of users saving water and money with smart technology
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-lg text-slate-700 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-slate-900">Monthly Savings</h3>
                    <TrendingDown size={24} className="text-green-500" />
                  </div>
                  <div className="text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    $127
                  </div>
                  <p className="text-slate-600">Average savings per household</p>
                </div>

                <div className="space-y-4">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-xl"
                  >
                    <span className="font-semibold text-slate-700">Water Bill Reduction</span>
                    <span className="text-blue-600 font-bold">-30%</span>
                  </motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-xl"
                  >
                    <span className="font-semibold text-slate-700">Leak Prevention</span>
                    <span className="text-green-600 font-bold">-45%</span>
                  </motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex items-center justify-between p-4 bg-purple-50 rounded-xl"
                  >
                    <span className="font-semibold text-slate-700">Efficiency Gain</span>
                    <span className="text-purple-600 font-bold">+52%</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* For Plumbers CTA */}
      <div id="plumbers" className="py-32 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Wrench size={64} className="mx-auto mb-6" />
            <h2 className="text-5xl font-bold mb-6">
              Are You a Plumber?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our network of verified professionals and get access to thousands of customers looking for quality plumbing services.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                onClick={() => setIsPlumberFormOpen(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-xl shadow-2xl hover:shadow-white/30 transition-all"
              >
                Join Our Network
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Droplet className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold">AquaSavvy</span>
              </div>
              <p className="text-slate-400 mb-6">
                Smart water management for sustainable living.
              </p>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Globe size={20} />
                </motion.a>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <div className="space-y-3 text-slate-400 text-sm">
                <div className="hover:text-white transition-colors cursor-pointer">Features</div>
                <div className="hover:text-white transition-colors cursor-pointer">Pricing</div>
                <div className="hover:text-white transition-colors cursor-pointer">Enterprise</div>
                <div className="hover:text-white transition-colors cursor-pointer">Updates</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <div className="space-y-3 text-slate-400 text-sm">
                <div className="hover:text-white transition-colors cursor-pointer">About Us</div>
                <div className="hover:text-white transition-colors cursor-pointer">Careers</div>
                <div className="hover:text-white transition-colors cursor-pointer">Press</div>
                <div className="hover:text-white transition-colors cursor-pointer">Contact</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="space-y-3 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>hello@aquasavvy.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>+263 781 312 088</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>630 Churchill Avenue, Mount Pleasant, Harare, Zimbabwe</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
              <div>© 2026 AquaSavvy. All rights reserved.</div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PlumberVerificationForm
        isOpen={isPlumberFormOpen}
        onClose={() => setIsPlumberFormOpen(false)}
        onSubmit={() => {
          setIsPlumberFormOpen(false);
          alert('Application submitted successfully!');
        }}
      />

      {/* Payment Status Modal */}
      {paymentStatus && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => paymentStatus !== 'checking' && setPaymentStatus(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center"
          >
            {paymentStatus !== 'checking' && (
              <button
                onClick={() => setPaymentStatus(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            )}

            {paymentStatus === 'checking' && (
              <>
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <Loader2 size={32} className="text-[#00A3FF] animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Verifying Payment</h3>
                <p className="text-slate-500 mb-6">Please wait while we confirm your transaction...</p>
              </>
            )}

            {paymentStatus === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
                <p className="text-slate-500 mb-8">Thank you for your purchase. Your order has been confirmed.</p>
                <button
                  onClick={() => setPaymentStatus(null)}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  Continue Shopping
                </button>
              </>
            )}

            {paymentStatus === 'failed' && (
              <>
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                  <X size={32} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h3>
                <p className="text-slate-500 mb-8">We couldn't process your payment. Please try again or contact support.</p>
                <button
                  onClick={() => setPaymentStatus(null)}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  Close
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
