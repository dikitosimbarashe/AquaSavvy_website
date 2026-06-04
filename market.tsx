import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplet,
  ShoppingCart,
  Plus,
  Minus,
  X,
  CheckCircle,
  Truck,
  Star,
  ArrowLeft,
  ArrowRight,
  Search,
  Filter,
  ShoppingBag,
  Shield,
  Zap,
  ChevronRight,
  Heart,
  Loader2
} from 'lucide-react';
import { createOrder, OrderPayload } from './services/paymentService';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  badge?: string;
  outOfStock?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface DeliveryAddress {
  fullName: string;
  phoneNumber: string;
  city: string;
  address: string;
  landmark?: string;
}

interface OrderData {
  deliveryMethod: 'pickup' | 'zimpost' | 'local-courier';
  deliveryAddress?: DeliveryAddress;
  paymentMethod?: string;
}

interface WebsiteMarketPageProps {
  onBack: () => void;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Smart Water Meter Pro',
    price: 89.99,
    category: 'SMART DEVICES',
    rating: 4.8,
    reviews: 234,
    description: 'AI-powered monitoring with real-time leak detection and smartphone alerts.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600',
    badge: 'Best Seller'
  },
  {
    id: 2,
    name: 'Water Filter System',
    price: 149.99,
    category: 'FILTERS',
    rating: 4.9,
    reviews: 456,
    description: 'Advanced 5-stage filtration system for pure, clean drinking water.',
    image: 'https://images.unsplash.com/photo-1585837554808-a1856d322999?auto=format&fit=crop&q=80&w=600',
    badge: 'Premium'
  },
  {
    id: 3,
    name: 'Eco Flow Restrictor',
    price: 24.99,
    category: 'WATER SAVERS',
    rating: 4.6,
    reviews: 189,
    description: 'Simple attachment that reduces water consumption by up to 40% without losing pressure.',
    image: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 4,
    name: 'Smart Shower Head',
    price: 59.99,
    category: 'WATER SAVERS',
    rating: 4.5,
    reviews: 312,
    description: 'Luxury shower experience with integrated water-saving technology.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 5,
    name: 'Leak Detection Kit',
    price: 129.99,
    category: 'SAFETY',
    rating: 4.9,
    reviews: 267,
    description: 'Ultra-sensitive sensors that detect even the smallest moisture changes.',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=600',
    badge: 'New'
  },
  {
    id: 6,
    name: 'Rain Water System',
    price: 399.99,
    category: 'ECO SOLUTIONS',
    rating: 4.7,
    reviews: 145,
    description: 'Complete rainwater harvesting and purification solution.',
    image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=600',
    badge: 'Eco'
  },
  {
    id: 7,
    name: 'Water Softener Tablets',
    price: 19.99,
    category: 'ACCESSORIES',
    rating: 4.8,
    reviews: 523,
    description: 'High-quality tablets for hard water treatment.',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 8,
    name: 'Smart Irrigation Controller',
    price: 179.99,
    category: 'SMART DEVICES',
    rating: 4.9,
    reviews: 198,
    description: 'Weather-based irrigation control for your garden or lawn.',
    image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&q=80&w=600',
    outOfStock: true
  },
  {
    id: 9,
    name: 'Premium Faucet Set',
    price: 79.99,
    category: 'ACCESSORIES',
    rating: 4.8,
    reviews: 312,
    description: 'Stylish and durable faucet set with easy installation.',
    image: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 10,
    name: 'Water Pressure Monitor',
    price: 44.99,
    category: 'SAFETY',
    rating: 4.6,
    reviews: 198,
    description: 'Real-time monitoring of your household water pressure.',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=600'
  }
];

export default function WebsiteMarketPage({ onBack }: WebsiteMarketPageProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const recipientEmailDefault = 'dikitosimbarashe@gmail.com';
  const [recipientEmail, setRecipientEmail] = useState(recipientEmailDefault);
  const senderPhone = '+263000000000';
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({ deliveryMethod: 'pickup' });
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: '',
    phoneNumber: '',
    city: '',
    address: '',
    landmark: ''
  });

  const categories = ['ALL', 'ACCESSORIES', 'SMART DEVICES', 'FILTERS', 'WATER SAVERS', 'SAFETY', 'ECO SOLUTIONS'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    if (product.outOfStock) return;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setShowCart(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const handleCheckout = async (): Promise<boolean> => {
    setPaymentError(null);

    if (cartTotal <= 0 || cartTotal >= 481) {
      setPaymentError('Order total must be greater than 0 and less than 481 USD.');
      return false;
    }

    const orderId = Date.now().toString();
    const sender = senderPhone;
    const recipient = recipientEmail.trim();

    if (!recipient || !recipient.includes('@')) {
      setPaymentError('Please enter a valid recipient email address.');
      return false;
    }

    setIsProcessing(true);
    let success = false;
    try {
      const payload: OrderPayload = {
        order_id: orderId,
        sender,
        recipient,
        amount: Number(cartTotal.toFixed(2)),
        currency: 'USD',
        redirect_url: `${window.location.origin}/market`,
        mode: 'test'
      };

      const data = await createOrder(payload);

      if (data?.status === 'success') {
        localStorage.setItem('dischub_pending_order_id', orderId);
        window.location.href = `https://dischub.co.zw/api/make/payment/to/${orderId}`;
        success = true;
      } else {
        const message = data?.message || 'Unable to initiate payment.';
        setPaymentError('Payment initiation failed: ' + message);
      }
    } catch (error) {
      console.error('Checkout error', error);
      const errorMessage = error instanceof Error ? error.message : String(error || 'Unknown error.');
      setPaymentError('An error occurred during checkout: ' + errorMessage);
    } finally {
      setIsProcessing(false);
    }

    return success;
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      return;
    }
    setShowCart(false);
    setShowDeliveryModal(true);
  };

  const handleDeliveryMethodSelect = (method: 'pickup' | 'zimpost' | 'local-courier') => {
    setOrderData({ ...orderData, deliveryMethod: method });
    if (method === 'pickup') {
      setShowDeliveryModal(false);
      setShowPaymentModal(true);
    }
  };

  const handleDeliverySubmit = () => {
    if (orderData.deliveryMethod !== 'pickup') {
      if (!deliveryAddress.fullName || !deliveryAddress.phoneNumber || !deliveryAddress.city || !deliveryAddress.address) {
        setPaymentError('Please fill in all required delivery fields.');
        return;
      }
      setOrderData({ ...orderData, deliveryAddress });
    }

    setPaymentError(null);
    setShowDeliveryModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (method: string) => {
    setOrderData({ ...orderData, paymentMethod: method });
    setShowPaymentModal(false);
    const success = await handleCheckout();
    if (success) {
      setShowOrderSuccess(true);
    } else {
      setShowPaymentModal(true);
    }
  };

  const closeOrderSuccess = () => {
    setShowOrderSuccess(false);
    setOrderData({ deliveryMethod: 'pickup' });
    setDeliveryAddress({ fullName: '', phoneNumber: '', city: '', address: '', landmark: '' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="bg-white px-6 py-4 sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-shrink-0">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 font-semibold hover:text-blue-600 transition-colors text-sm"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00A3FF] rounded-lg flex items-center justify-center">
                <Droplet className="text-white fill-white" size={20} />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">AquaSavvy</span>
            </div>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3FF] focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95 text-sm"
          >
            <ShoppingCart size={18} />
            <span className="font-bold">Cart</span>
            {cartCount > 0 && (
              <span className="bg-[#00A3FF] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border border-slate-900">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-6 pb-20">
        {/* Hero Section */}
        <section className="bg-slate-50 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between mb-12 overflow-hidden border border-slate-100">
          <div className="max-w-xl">
            <span className="text-[#00A3FF] font-bold text-sm mb-3 block uppercase tracking-wider">AquaSavvy Pro</span>
            <h1 className="text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Smart Water<br />Management System
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
              Monitor and optimize your water consumption with AI-powered insights.
            </p>
            <button className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-red-200 active:scale-95">
              Shop Now
            </button>
          </div>
          <div className="relative mt-12 md:mt-0 flex-shrink-0">
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100">
              <img
                src="/images/smart-tap-hero.png"
                alt="Smart Tap Water System"
                className="w-[400px] h-[300px] object-cover rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#FFF5EB] p-8 rounded-2xl relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all border border-orange-100">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Devices</h3>
            <p className="text-sm text-slate-500 font-semibold mb-6">IoT Sensors & Meters</p>
            <button className="flex items-center gap-2 font-bold text-sm text-slate-900 hover:text-[#00A3FF] transition-colors group">
              Browse Now <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-[#E6FFFA] p-8 rounded-2xl relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all border border-teal-100">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Save Water</h3>
            <p className="text-sm text-slate-500 font-semibold mb-6">Eco-Friendly Solutions</p>
            <button className="flex items-center gap-2 font-bold text-sm text-slate-900 hover:text-[#00A3FF] transition-colors group">
              Shop Now <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-[#EBF8FF] p-8 rounded-2xl relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all border border-blue-100">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Premium Filters</h3>
            <p className="text-sm text-slate-500 font-semibold mb-6">Clean & Safe Water</p>
            <button className="flex items-center gap-2 font-bold text-sm text-slate-900 hover:text-[#00A3FF] transition-colors group">
              View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Products Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 tracking-tight">All Products</h2>
          <div className="flex flex-wrap justify-center gap-8 border-b border-slate-100 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`pb-4 text-xs font-bold transition-all relative tracking-widest ${selectedCategory === category
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {category}
                {selectedCategory === category && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${product.outOfStock ? 'grayscale opacity-60' : ''}`}
                />

                {product.badge && (
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-sm ${product.badge === 'Best Seller' || product.badge === 'Premium' || product.badge === 'New'
                    ? 'bg-[#FF4D4D]'
                    : 'bg-[#48BB78]'
                    }`}>
                    {product.badge}
                  </div>
                )}

                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-300 hover:text-[#FF4D4D] transition-all shadow-md z-20">
                  <Heart size={16} />
                </button>

                {product.outOfStock && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <div className="bg-white px-4 py-1.5 rounded-lg font-bold text-xs text-slate-900 shadow-lg border border-slate-100">
                      Out of Stock
                    </div>
                  </div>
                )}

                {!product.outOfStock && (
                  <div className="absolute inset-x-3 bottom-3 translate-y-16 group-hover:translate-y-0 transition-transform duration-300 z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl shadow-lg hover:bg-[#00A3FF] transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      <Plus size={14} /> Add to Cart
                    </button>
                  </div>
                )}
              </div>

              <div className="px-1">
                <h3 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-[#00A3FF] transition-colors truncate">
                  {product.name}
                </h3>

                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">({product.reviews})</span>
                </div>

                <div className="text-lg font-bold text-slate-900 tracking-tight">
                  ${product.price}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00A3FF] rounded-xl flex items-center justify-center">
                  <Droplet className="text-white fill-white" size={24} />
                </div>
                <span className="text-2xl font-bold tracking-tight">AquaSavvy</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Smart water management solutions for sustainable living.
              </p>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="text-lg font-bold mb-6">Shop</h3>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="hover:text-[#00A3FF] cursor-pointer transition-colors">Smart Devices</li>
                <li className="hover:text-[#00A3FF] cursor-pointer transition-colors">Filters & Purifiers</li>
                <li className="hover:text-[#00A3FF] cursor-pointer transition-colors">Water Savers</li>
                <li className="hover:text-[#00A3FF] cursor-pointer transition-colors">Safety Equipment</li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-bold mb-6">Support</h3>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="hover:text-[#00A3FF] cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-[#00A3FF] cursor-pointer transition-colors">Shipping Info</li>
                <li className="hover:text-[#00A3FF] cursor-pointer transition-colors">Returns & Refunds</li>
                <li className="hover:text-[#00A3FF] cursor-pointer transition-colors">Contact Us</li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-bold mb-6">Company</h3>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="hover:text-[#00A3FF] cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-[#00A3FF] cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-[#00A3FF] cursor-pointer transition-colors">Press Kit</li>
                <li className="hover:text-[#00A3FF] cursor-pointer transition-colors">Privacy Policy</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-xs">
              © 2026 AquaSavvy. All rights reserved. Built with care for a sustainable future.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={24} className="text-[#00A3FF]" />
                  <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
                </div>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingCart size={40} className="text-slate-200" />
                    </div>
                    <p className="text-lg font-bold text-slate-900 mb-1">Your cart is empty</p>
                    <p className="text-sm text-slate-400 font-medium">Add some products to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 mb-1 truncate">
                              {item.name}
                            </h3>
                            <p className="text-base text-[#00A3FF] font-bold">
                              ${item.price}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 hover:bg-slate-50 rounded transition-colors"
                              >
                                <Minus size={14} className="text-slate-900" />
                              </button>
                              <span className="w-4 text-center font-bold text-slate-900 text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 hover:bg-slate-50 rounded transition-colors"
                              >
                                <Plus size={14} className="text-slate-900" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-white">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="text-slate-900 font-bold">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-slate-500">Shipping</span>
                      <span className="text-[#48BB78] font-bold uppercase tracking-wider">FREE</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-lg font-bold text-slate-900">Total</span>
                      <span className="text-2xl font-black text-slate-900">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Dischub recipient email</label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={e => setRecipientEmail(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-slate-300 outline-none"
                        placeholder="dikitosimbarashe@gmail.com"
                      />
                    </div>
                  </div>

                  {paymentError && (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-900">
                      <p className="font-semibold">Payment error</p>
                      <p className="text-sm mt-1">{paymentError}</p>
                    </div>
                  )}

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full py-4 bg-slate-900 text-white text-base font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <CheckCircle size={20} />
                    )}
                    {isProcessing ? 'Processing Payment...' : 'Place Order'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delivery Method Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowDeliveryModal(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-slate-900">Delivery Method</h2>
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Choose Delivery Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['pickup', 'zimpost', 'local-courier'].map((method) => {
                    const label = method === 'pickup' ? 'Pickup' : method === 'zimpost' ? 'Zimpost Delivery' : 'Local Courier';
                    return (
                      <button
                        key={method}
                        onClick={() => handleDeliveryMethodSelect(method as 'pickup' | 'zimpost' | 'local-courier')}
                        className={`p-4 border-2 rounded-2xl text-left transition-all ${orderData.deliveryMethod === method ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{label}</p>
                            <p className="text-sm text-slate-600">{method === 'pickup' ? 'Collect from store' : method === 'zimpost' ? '3-5 business days' : '1-2 business days'}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${orderData.deliveryMethod === method ? 'border-blue-500' : 'border-slate-300'}`}>
                            {orderData.deliveryMethod === method && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {orderData.deliveryMethod !== 'pickup' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Delivery Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={deliveryAddress.fullName}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, fullName: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        value={deliveryAddress.phoneNumber}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phoneNumber: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="+263 77 123 4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">City <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={deliveryAddress.city}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Harare"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Address <span className="text-red-500">*</span></label>
                      <textarea
                        value={deliveryAddress.address}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value })}
                        rows={3}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        placeholder="123 Main Street, Apartment 4B"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Landmark (optional)</label>
                      <input
                        type="text"
                        value={deliveryAddress.landmark}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, landmark: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Near ABC Shopping Center"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleDeliverySubmit}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowPaymentModal(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-50 rounded-3xl p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Items ({cartCount})</span>
                    <span className="font-semibold text-slate-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Delivery</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-slate-900 text-lg">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900">Select Payment Method</h3>
                {['EcoCash', 'OneMoney', 'InnBucks', 'DiscHub', 'Card'].map((method) => (
                  <button
                    key={method}
                    onClick={() => handlePaymentComplete(method)}
                    className="w-full p-4 border-2 border-slate-200 rounded-3xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{method}</p>
                        <p className="text-sm text-slate-600">{method === 'Card' ? 'Visa, Mastercard' : `Pay with ${method}`}</p>
                      </div>
                      <ArrowRight size={20} className="text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-2xl">
                <Shield size={14} />
                All payments are secure and encrypted.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {showOrderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-slate-600 mb-6">
              You will receive SMS updates on your order status at {deliveryAddress.phoneNumber || 'your phone number'}.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-4 mb-6">
              <p className="text-sm font-semibold text-blue-900 mb-1">Order Total</p>
              <p className="text-3xl font-bold text-blue-600">${cartTotal.toFixed(2)}</p>
            </div>
            <button
              onClick={closeOrderSuccess}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-3xl hover:bg-blue-700 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
