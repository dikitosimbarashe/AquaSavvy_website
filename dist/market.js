"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WebsiteMarketPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const paymentService_1 = require("./services/paymentService");
const products = [
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
function WebsiteMarketPage({ onBack }) {
    const [cart, setCart] = (0, react_1.useState)([]);
    const [showCart, setShowCart] = (0, react_1.useState)(false);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('ALL');
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const [paymentError, setPaymentError] = (0, react_1.useState)(null);
    const recipientEmailDefault = 'dikitosimbarashe@gmail.com';
    const [recipientEmail, setRecipientEmail] = (0, react_1.useState)(recipientEmailDefault);
    const senderPhone = '+263000000000';
    const [showDeliveryModal, setShowDeliveryModal] = (0, react_1.useState)(false);
    const [showPaymentModal, setShowPaymentModal] = (0, react_1.useState)(false);
    const [showOrderSuccess, setShowOrderSuccess] = (0, react_1.useState)(false);
    const [orderData, setOrderData] = (0, react_1.useState)({ deliveryMethod: 'pickup' });
    const [deliveryAddress, setDeliveryAddress] = (0, react_1.useState)({
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
    const addToCart = (product) => {
        if (product.outOfStock)
            return;
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setShowCart(true);
    };
    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };
    const updateQuantity = (id, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };
    const cartTotal = (0, react_1.useMemo)(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cart]);
    const cartCount = (0, react_1.useMemo)(() => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    }, [cart]);
    const handleCheckout = async () => {
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
            const payload = {
                order_id: orderId,
                sender,
                recipient,
                amount: Number(cartTotal.toFixed(2)),
                currency: 'USD',
                redirect_url: `${window.location.origin}/market`,
                mode: 'test'
            };
            const data = await (0, paymentService_1.createOrder)(payload);
            if ((data === null || data === void 0 ? void 0 : data.status) === 'success') {
                localStorage.setItem('dischub_pending_order_id', orderId);
                window.location.href = `https://dischub.co.zw/api/make/payment/to/${orderId}`;
                success = true;
            }
            else {
                const message = (data === null || data === void 0 ? void 0 : data.message) || 'Unable to initiate payment.';
                setPaymentError('Payment initiation failed: ' + message);
            }
        }
        catch (error) {
            console.error('Checkout error', error);
            const errorMessage = error instanceof Error ? error.message : String(error || 'Unknown error.');
            setPaymentError('An error occurred during checkout: ' + errorMessage);
        }
        finally {
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
    const handleDeliveryMethodSelect = (method) => {
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
    const handlePaymentComplete = async (method) => {
        setOrderData({ ...orderData, paymentMethod: method });
        setShowPaymentModal(false);
        const success = await handleCheckout();
        if (success) {
            setShowOrderSuccess(true);
        }
        else {
            setShowPaymentModal(true);
        }
    };
    const closeOrderSuccess = () => {
        setShowOrderSuccess(false);
        setOrderData({ deliveryMethod: 'pickup' });
        setDeliveryAddress({ fullName: '', phoneNumber: '', city: '', address: '', landmark: '' });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-white font-sans text-slate-900", children: [(0, jsx_runtime_1.jsx)("nav", { className: "bg-white px-6 py-4 sticky top-0 z-40 border-b border-slate-100", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto flex items-center justify-between gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6 flex-shrink-0", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: onBack, className: "flex items-center gap-2 text-slate-600 font-semibold hover:text-blue-600 transition-colors text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 18 }), (0, jsx_runtime_1.jsx)("span", { children: "Back" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-[#00A3FF] rounded-lg flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Droplet, { className: "text-white fill-white", size: 20 }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-xl font-bold text-slate-900 tracking-tight", children: "AquaSavvy" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 max-w-2xl", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400", size: 18 }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search products...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3FF] focus:border-transparent text-sm transition-all" })] }) }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setShowCart(true), className: "flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShoppingCart, { size: 18 }), (0, jsx_runtime_1.jsx)("span", { className: "font-bold", children: "Cart" }), cartCount > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "bg-[#00A3FF] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border border-slate-900", children: cartCount }))] })] }) }), (0, jsx_runtime_1.jsxs)("main", { className: "max-w-7xl mx-auto px-6 pt-6 pb-20", children: [(0, jsx_runtime_1.jsxs)("section", { className: "bg-slate-50 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between mb-12 overflow-hidden border border-slate-100", children: [(0, jsx_runtime_1.jsxs)("div", { className: "max-w-xl", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[#00A3FF] font-bold text-sm mb-3 block uppercase tracking-wider", children: "AquaSavvy Pro" }), (0, jsx_runtime_1.jsxs)("h1", { className: "text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight", children: ["Smart Water", (0, jsx_runtime_1.jsx)("br", {}), "Management System"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-slate-600 mb-8 leading-relaxed font-medium", children: "Monitor and optimize your water consumption with AI-powered insights." }), (0, jsx_runtime_1.jsx)("button", { className: "bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-red-200 active:scale-95", children: "Shop Now" })] }), (0, jsx_runtime_1.jsx)("div", { className: "relative mt-12 md:mt-0 flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white p-2 rounded-2xl shadow-xl border border-slate-100", children: (0, jsx_runtime_1.jsx)("img", { src: "/images/smart-tap-hero.png", alt: "Smart Tap Water System", className: "w-[400px] h-[300px] object-cover rounded-xl" }) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-16", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-[#FFF5EB] p-8 rounded-2xl relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all border border-orange-100", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-slate-900 mb-2", children: "Smart Devices" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500 font-semibold mb-6", children: "IoT Sensors & Meters" }), (0, jsx_runtime_1.jsxs)("button", { className: "flex items-center gap-2 font-bold text-sm text-slate-900 hover:text-[#00A3FF] transition-colors group", children: ["Browse Now ", (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { size: 16, className: "group-hover:translate-x-1 transition-transform" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-[#E6FFFA] p-8 rounded-2xl relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all border border-teal-100", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-slate-900 mb-2", children: "Save Water" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500 font-semibold mb-6", children: "Eco-Friendly Solutions" }), (0, jsx_runtime_1.jsxs)("button", { className: "flex items-center gap-2 font-bold text-sm text-slate-900 hover:text-[#00A3FF] transition-colors group", children: ["Shop Now ", (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { size: 16, className: "group-hover:translate-x-1 transition-transform" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-[#EBF8FF] p-8 rounded-2xl relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all border border-blue-100", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-slate-900 mb-2", children: "Premium Filters" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500 font-semibold mb-6", children: "Clean & Safe Water" }), (0, jsx_runtime_1.jsxs)("button", { className: "flex items-center gap-2 font-bold text-sm text-slate-900 hover:text-[#00A3FF] transition-colors group", children: ["View All ", (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { size: 16, className: "group-hover:translate-x-1 transition-transform" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-12", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold text-slate-900 mb-10 tracking-tight", children: "All Products" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap justify-center gap-8 border-b border-slate-100 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide", children: categories.map(category => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setSelectedCategory(category), className: `pb-4 text-xs font-bold transition-all relative tracking-widest ${selectedCategory === category
                                        ? 'text-slate-900'
                                        : 'text-slate-400 hover:text-slate-600'}`, children: [category, selectedCategory === category && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { layoutId: "activeCategory", className: "absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-full" }))] }, category))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6", children: filteredProducts.map(product => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { layout: true, initial: { opacity: 0 }, animate: { opacity: 1 }, className: "group cursor-pointer", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative aspect-square mb-4 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100", children: [(0, jsx_runtime_1.jsx)("img", { src: product.image, alt: product.name, className: `w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${product.outOfStock ? 'grayscale opacity-60' : ''}` }), product.badge && ((0, jsx_runtime_1.jsx)("div", { className: `absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-sm ${product.badge === 'Best Seller' || product.badge === 'Premium' || product.badge === 'New'
                                                ? 'bg-[#FF4D4D]'
                                                : 'bg-[#48BB78]'}`, children: product.badge })), (0, jsx_runtime_1.jsx)("button", { className: "absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-300 hover:text-[#FF4D4D] transition-all shadow-md z-20", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { size: 16 }) }), product.outOfStock && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-10", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white px-4 py-1.5 rounded-lg font-bold text-xs text-slate-900 shadow-lg border border-slate-100", children: "Out of Stock" }) })), !product.outOfStock && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-x-3 bottom-3 translate-y-16 group-hover:translate-y-0 transition-transform duration-300 z-30", children: (0, jsx_runtime_1.jsxs)("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    addToCart(product);
                                                }, className: "w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl shadow-lg hover:bg-[#00A3FF] transition-all flex items-center justify-center gap-2 text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 14 }), " Add to Cart"] }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "px-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-sm text-slate-900 mb-1 group-hover:text-[#00A3FF] transition-colors truncate", children: product.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex gap-0.5", children: [...Array(5)].map((_, i) => ((0, jsx_runtime_1.jsx)(lucide_react_1.Star, { size: 12, className: i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200' }, i))) }), (0, jsx_runtime_1.jsxs)("span", { className: "text-[10px] font-bold text-slate-400", children: ["(", product.reviews, ")"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-lg font-bold text-slate-900 tracking-tight", children: ["$", product.price] })] })] }, product.id))) })] }), (0, jsx_runtime_1.jsx)("footer", { className: "bg-[#0F172A] text-white pt-16 pb-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto px-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-12 mb-16", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-[#00A3FF] rounded-xl flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Droplet, { className: "text-white fill-white", size: 24 }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-2xl font-bold tracking-tight", children: "AquaSavvy" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-400 text-sm leading-relaxed max-w-xs", children: "Smart water management solutions for sustainable living." })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold mb-6", children: "Shop" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-4 text-slate-400 text-sm", children: [(0, jsx_runtime_1.jsx)("li", { className: "hover:text-[#00A3FF] cursor-pointer transition-colors", children: "Smart Devices" }), (0, jsx_runtime_1.jsx)("li", { className: "hover:text-[#00A3FF] cursor-pointer transition-colors", children: "Filters & Purifiers" }), (0, jsx_runtime_1.jsx)("li", { className: "hover:text-[#00A3FF] cursor-pointer transition-colors", children: "Water Savers" }), (0, jsx_runtime_1.jsx)("li", { className: "hover:text-[#00A3FF] cursor-pointer transition-colors", children: "Safety Equipment" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold mb-6", children: "Support" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-4 text-slate-400 text-sm", children: [(0, jsx_runtime_1.jsx)("li", { className: "hover:text-[#00A3FF] cursor-pointer transition-colors", children: "Help Center" }), (0, jsx_runtime_1.jsx)("li", { className: "hover:text-[#00A3FF] cursor-pointer transition-colors", children: "Shipping Info" }), (0, jsx_runtime_1.jsx)("li", { className: "hover:text-[#00A3FF] cursor-pointer transition-colors", children: "Returns & Refunds" }), (0, jsx_runtime_1.jsx)("li", { className: "hover:text-[#00A3FF] cursor-pointer transition-colors", children: "Contact Us" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold mb-6", children: "Company" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-4 text-slate-400 text-sm", children: [(0, jsx_runtime_1.jsx)("li", { className: "hover:text-[#00A3FF] cursor-pointer transition-colors", children: "About Us" }), (0, jsx_runtime_1.jsx)("li", { className: "hover:text-[#00A3FF] cursor-pointer transition-colors", children: "Careers" }), (0, jsx_runtime_1.jsx)("li", { className: "hover:text-[#00A3FF] cursor-pointer transition-colors", children: "Press Kit" }), (0, jsx_runtime_1.jsx)("li", { className: "hover:text-[#00A3FF] cursor-pointer transition-colors", children: "Privacy Policy" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "pt-8 border-t border-slate-800 text-center", children: (0, jsx_runtime_1.jsx)("p", { className: "text-slate-500 text-xs", children: "\u00A9 2026 AquaSavvy. All rights reserved. Built with care for a sustainable future." }) })] }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: showCart && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-50", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setShowCart(false), className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm" }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' }, transition: { type: 'spring', damping: 25, stiffness: 200 }, className: "absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-slate-100", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShoppingBag, { size: 24, className: "text-[#00A3FF]" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-slate-900", children: "Your Cart" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowCart(false), className: "p-2 hover:bg-slate-50 rounded-xl transition-all", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 24, className: "text-slate-400" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-auto p-6", children: cart.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-20", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ShoppingCart, { size: 40, className: "text-slate-200" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg font-bold text-slate-900 mb-1", children: "Your cart is empty" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-400 font-medium", children: "Add some products to get started" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: cart.map((item) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm", children: (0, jsx_runtime_1.jsx)("img", { src: item.image, alt: item.name, className: "w-full h-full object-cover" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0 flex flex-col justify-between py-0.5", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-sm text-slate-900 mb-1 truncate", children: item.name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-base text-[#00A3FF] font-bold", children: ["$", item.price] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mt-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => updateQuantity(item.id, -1), className: "p-1 hover:bg-slate-50 rounded transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Minus, { size: 14, className: "text-slate-900" }) }), (0, jsx_runtime_1.jsx)("span", { className: "w-4 text-center font-bold text-slate-900 text-sm", children: item.quantity }), (0, jsx_runtime_1.jsx)("button", { onClick: () => updateQuantity(item.id, 1), className: "p-1 hover:bg-slate-50 rounded transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 14, className: "text-slate-900" }) })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => removeFromCart(item.id), className: "p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 18 }) })] })] })] }, item.id))) })) }), cart.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 border-t border-slate-100 bg-white", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm font-semibold", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-500", children: "Subtotal" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-slate-900 font-bold", children: ["$", cartTotal.toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm font-semibold", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-500", children: "Shipping" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[#48BB78] font-bold uppercase tracking-wider", children: "FREE" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "pt-4 border-t border-slate-100 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg font-bold text-slate-900", children: "Total" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-2xl font-black text-slate-900", children: ["$", cartTotal.toFixed(2)] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4 mb-6", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Dischub recipient email" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: recipientEmail, onChange: e => setRecipientEmail(e.target.value), className: "w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-slate-300 outline-none", placeholder: "dikitosimbarashe@gmail.com" })] }) }), paymentError && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-900", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold", children: "Payment error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm mt-1", children: paymentError })] })), (0, jsx_runtime_1.jsxs)("button", { onClick: handlePlaceOrder, disabled: isProcessing, className: "w-full py-4 bg-slate-900 text-white text-base font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed", children: [isProcessing ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { size: 20, className: "animate-spin" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 20 })), isProcessing ? 'Processing Payment...' : 'Place Order'] })] }))] })] })) }), showDeliveryModal && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [(0, jsx_runtime_1.jsx)("div", { onClick: () => setShowDeliveryModal(false), className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-auto max-h-[90vh]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-slate-900", children: "Delivery Method" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowDeliveryModal(false), className: "p-2 hover:bg-slate-100 rounded-xl transition-all", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 24, className: "text-slate-600" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-slate-900 mb-4", children: "Choose Delivery Method" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: ['pickup', 'zimpost', 'local-courier'].map((method) => {
                                                    const label = method === 'pickup' ? 'Pickup' : method === 'zimpost' ? 'Zimpost Delivery' : 'Local Courier';
                                                    return ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleDeliveryMethodSelect(method), className: `p-4 border-2 rounded-2xl text-left transition-all ${orderData.deliveryMethod === method ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-slate-900", children: label }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600", children: method === 'pickup' ? 'Collect from store' : method === 'zimpost' ? '3-5 business days' : '1-2 business days' })] }), (0, jsx_runtime_1.jsx)("div", { className: `w-5 h-5 rounded-full border-2 flex items-center justify-center ${orderData.deliveryMethod === method ? 'border-blue-500' : 'border-slate-300'}`, children: orderData.deliveryMethod === method && (0, jsx_runtime_1.jsx)("div", { className: "w-2.5 h-2.5 bg-blue-500 rounded-full" }) })] }) }, method));
                                                }) })] }), orderData.deliveryMethod !== 'pickup' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-slate-900", children: "Delivery Address" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: ["Full Name ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: deliveryAddress.fullName, onChange: (e) => setDeliveryAddress({ ...deliveryAddress, fullName: e.target.value }), className: "w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none", placeholder: "John Doe" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: ["Phone Number ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)("input", { type: "tel", value: deliveryAddress.phoneNumber, onChange: (e) => setDeliveryAddress({ ...deliveryAddress, phoneNumber: e.target.value }), className: "w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none", placeholder: "+263 77 123 4567" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: ["City ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: deliveryAddress.city, onChange: (e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value }), className: "w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none", placeholder: "Harare" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2", children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: ["Address ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)("textarea", { value: deliveryAddress.address, onChange: (e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value }), rows: 3, className: "w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none", placeholder: "123 Main Street, Apartment 4B" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Landmark (optional)" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: deliveryAddress.landmark, onChange: (e) => setDeliveryAddress({ ...deliveryAddress, landmark: e.target.value }), className: "w-full rounded-2xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none", placeholder: "Near ABC Shopping Center" })] })] })] })), (0, jsx_runtime_1.jsx)("button", { onClick: handleDeliverySubmit, className: "w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all", children: "Continue to Payment" })] })] })] })), showPaymentModal && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [(0, jsx_runtime_1.jsx)("div", { onClick: () => setShowPaymentModal(false), className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-slate-900", children: "Payment Method" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowPaymentModal(false), className: "p-2 hover:bg-slate-100 rounded-xl transition-all", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 24, className: "text-slate-600" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-50 rounded-3xl p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-slate-900 mb-3", children: "Order Summary" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-slate-600", children: ["Items (", cartCount, ")"] }), (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold text-slate-900", children: ["$", cartTotal.toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-600", children: "Delivery" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-green-600", children: "FREE" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "pt-2 border-t border-slate-200 flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-bold text-slate-900", children: "Total" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-bold text-slate-900 text-lg", children: ["$", cartTotal.toFixed(2)] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-slate-900", children: "Select Payment Method" }), ['EcoCash', 'OneMoney', 'InnBucks', 'DiscHub', 'Card'].map((method) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => handlePaymentComplete(method), className: "w-full p-4 border-2 border-slate-200 rounded-3xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-slate-900", children: method }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600", children: method === 'Card' ? 'Visa, Mastercard' : `Pay with ${method}` })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 20, className: "text-slate-400" })] }) }, method)))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-2xl", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { size: 14 }), "All payments are secure and encrypted."] })] })] })] })), showOrderSuccess && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 40, className: "text-green-600" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-slate-900 mb-2", children: "Order Placed Successfully!" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-slate-600 mb-6", children: ["You will receive SMS updates on your order status at ", deliveryAddress.phoneNumber || 'your phone number', "."] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 border border-blue-200 rounded-3xl p-4 mb-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold text-blue-900 mb-1", children: "Order Total" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-3xl font-bold text-blue-600", children: ["$", cartTotal.toFixed(2)] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: closeOrderSuccess, className: "w-full py-4 bg-blue-600 text-white font-bold rounded-3xl hover:bg-blue-700 transition-all", children: "Continue Shopping" })] })] }))] }));
}
//# sourceMappingURL=market.js.map