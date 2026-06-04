"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MarketManager;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const storage_1 = require("firebase/storage");
const mockProducts = [
    {
        id: 'P001',
        name: 'Smart Water Meter Pro',
        description: 'AI-powered water meter with real-time monitoring and leak detection',
        price: 89.99,
        category: 'Smart Devices',
        stock: 45,
        rating: 4.8,
        reviews: 234,
        status: 'active',
        image: 'https://i.pravatar.cc/400?img=1',
        badge: 'Best Seller',
        savings: 'Save 15L/day',
        createdDate: '2026-03-15',
        sales: 156
    },
    {
        id: 'P002',
        name: 'Water Filter System',
        description: '5-stage filtration system for clean, safe drinking water',
        price: 149.99,
        category: 'Filters',
        stock: 28,
        rating: 4.9,
        reviews: 456,
        status: 'active',
        image: 'https://i.pravatar.cc/400?img=2',
        badge: 'Premium',
        createdDate: '2026-02-20',
        sales: 203
    },
    {
        id: 'P003',
        name: 'Eco Flow Restrictor',
        description: 'Reduce water flow by 40% without compromising pressure',
        price: 24.99,
        category: 'Water Savers',
        stock: 120,
        rating: 4.6,
        reviews: 189,
        status: 'active',
        image: 'https://i.pravatar.cc/400?img=3',
        savings: 'Save 40%',
        createdDate: '2026-01-10',
        sales: 412
    },
    {
        id: 'P004',
        name: 'Smart Shower Head',
        description: 'LED temperature display with water-saving spray patterns',
        price: 59.99,
        category: 'Smart Devices',
        stock: 0,
        rating: 4.7,
        reviews: 312,
        status: 'out-of-stock',
        image: 'https://i.pravatar.cc/400?img=4',
        savings: 'Save 25L/shower',
        createdDate: '2026-03-01',
        sales: 187
    },
    {
        id: 'P005',
        name: 'Leak Detection Kit',
        description: 'Professional kit with sensors and indicators for early leak detection',
        price: 129.99,
        category: 'Safety',
        stock: 15,
        rating: 4.9,
        reviews: 267,
        status: 'active',
        image: 'https://i.pravatar.cc/400?img=5',
        badge: 'New',
        createdDate: '2026-04-01',
        sales: 89
    }
];
const mockOrders = [
    {
        id: 'ORD-001',
        customerName: 'John Mukuwa',
        customerEmail: 'john.m@example.com',
        products: [
            { productId: 'P001', productName: 'Smart Water Meter Pro', quantity: 2, price: 89.99 },
            { productId: 'P003', productName: 'Eco Flow Restrictor', quantity: 1, price: 24.99 }
        ],
        total: 204.97,
        status: 'delivered',
        orderDate: '2026-04-05'
    },
    {
        id: 'ORD-002',
        customerName: 'Sarah Moyo',
        customerEmail: 'sarah.m@example.com',
        products: [
            { productId: 'P002', productName: 'Water Filter System', quantity: 1, price: 149.99 }
        ],
        total: 149.99,
        status: 'shipped',
        orderDate: '2026-04-07'
    },
    {
        id: 'ORD-003',
        customerName: 'Michael Ndlovu',
        customerEmail: 'michael.n@example.com',
        products: [
            { productId: 'P005', productName: 'Leak Detection Kit', quantity: 1, price: 129.99 },
            { productId: 'P004', productName: 'Smart Shower Head', quantity: 2, price: 59.99 }
        ],
        total: 249.97,
        status: 'processing',
        orderDate: '2026-04-08'
    },
    {
        id: 'ORD-004',
        customerName: 'Grace Sibanda',
        customerEmail: 'grace.s@example.com',
        products: [
            { productId: 'P003', productName: 'Eco Flow Restrictor', quantity: 5, price: 24.99 }
        ],
        total: 124.95,
        status: 'pending',
        orderDate: '2026-04-09'
    }
];
function MarketManager() {
    const [activeTab, setActiveTab] = (0, react_1.useState)('products');
    const [products, setProducts] = (0, react_1.useState)(mockProducts);
    const [orders] = (0, react_1.useState)(mockOrders);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('all');
    const [selectedProduct, setSelectedProduct] = (0, react_1.useState)(null);
    const [showProductModal, setShowProductModal] = (0, react_1.useState)(false);
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [isUploading, setIsUploading] = (0, react_1.useState)(false);
    const fileInputRef = (0, react_1.useRef)(null);
    const handleImageUpload = async (e) => {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file || !selectedProduct)
            return;
        setIsUploading(true);
        try {
            const storage = (0, storage_1.getStorage)();
            const storageRef = (0, storage_1.ref)(storage, `products/${Date.now()}_${file.name}`);
            await (0, storage_1.uploadBytes)(storageRef, file);
            const url = await (0, storage_1.getDownloadURL)(storageRef);
            setSelectedProduct({ ...selectedProduct, image: url });
        }
        catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image");
        }
        finally {
            setIsUploading(false);
        }
    };
    const stats = {
        totalProducts: products.length,
        activeProducts: products.filter(p => p.status === 'active').length,
        totalRevenue: products.reduce((sum, p) => sum + (p.price * p.sales), 0),
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        lowStock: products.filter(p => p.stock < 20 && p.stock > 0).length
    };
    const filteredProducts = products.filter(product => {
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });
    const handleCreateProduct = () => {
        const newProduct = {
            id: `P${String(products.length + 1).padStart(3, '0')}`,
            name: 'New Product',
            description: 'Product description',
            price: 0,
            category: 'Smart Devices',
            stock: 0,
            rating: 0,
            reviews: 0,
            status: 'inactive',
            image: 'https://i.pravatar.cc/400?img=10',
            createdDate: new Date().toISOString().split('T')[0],
            sales: 0
        };
        setSelectedProduct(newProduct);
        setIsEditing(true);
        setShowProductModal(true);
    };
    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsEditing(true);
        setShowProductModal(true);
    };
    const handleSaveProduct = () => {
        if (selectedProduct) {
            const existingIndex = products.findIndex(p => p.id === selectedProduct.id);
            if (existingIndex >= 0) {
                const updatedProducts = [...products];
                updatedProducts[existingIndex] = selectedProduct;
                setProducts(updatedProducts);
            }
            else {
                setProducts([...products, selectedProduct]);
            }
        }
        setShowProductModal(false);
        setSelectedProduct(null);
        setIsEditing(false);
    };
    const handleDeleteProduct = (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== productId));
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (0, jsx_runtime_1.jsxs)("span", { className: "px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 12 }), "Active"] });
            case 'inactive':
                return (0, jsx_runtime_1.jsxs)("span", { className: "px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 12 }), "Inactive"] });
            case 'out-of-stock':
                return (0, jsx_runtime_1.jsxs)("span", { className: "px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 12 }), "Out of Stock"] });
            default:
                return null;
        }
    };
    const getOrderStatusBadge = (status) => {
        const configs = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
            processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing' },
            shipped: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Shipped' },
            delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
        };
        const config = configs[status];
        return (0, jsx_runtime_1.jsx)("span", { className: `px-3 py-1 ${config.bg} ${config.text} text-xs font-semibold rounded-full`, children: config.label });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Package, { size: 24 }), (0, jsx_runtime_1.jsx)("span", { className: "text-3xl font-bold", children: stats.totalProducts })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-blue-100", children: "Total Products" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { size: 24 }), (0, jsx_runtime_1.jsxs)("span", { className: "text-3xl font-bold", children: ["$", stats.totalRevenue.toFixed(0)] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-green-100", children: "Total Revenue" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShoppingCart, { size: 24 }), (0, jsx_runtime_1.jsx)("span", { className: "text-3xl font-bold", children: stats.totalOrders })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-purple-100", children: "Total Orders" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 24 }), (0, jsx_runtime_1.jsx)("span", { className: "text-3xl font-bold", children: stats.lowStock })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-orange-100", children: "Low Stock Items" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-2 flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('products'), className: `flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'products'
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-100'}`, children: "Products" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('orders'), className: `flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'orders'
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-100'}`, children: "Orders" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('analytics'), className: `flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'analytics'
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-100'}`, children: "Analytics" })] }), activeTab === 'products' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col md:flex-row gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { size: 20, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search products...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setStatusFilter('all'), className: `px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === 'all'
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`, children: "All" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setStatusFilter('active'), className: `px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === 'active'
                                                ? 'bg-green-500 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`, children: "Active" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setStatusFilter('out-of-stock'), className: `px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === 'out-of-stock'
                                                ? 'bg-red-500 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`, children: "Out of Stock" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleCreateProduct, className: "px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 20 }), "Add Product"] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: (0, jsx_runtime_1.jsxs)("div", { className: "overflow-x-auto", children: [(0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-slate-50 border-b border-slate-200", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider", children: "Product" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider", children: "Category" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider", children: "Price" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider", children: "Stock" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider", children: "Sales" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-slate-200", children: filteredProducts.map((product) => ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-slate-50 transition-colors", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("img", { src: product.image, alt: product.name, className: "w-12 h-12 rounded-lg object-cover bg-slate-100" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-slate-900", children: product.name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-slate-400", children: ["ID: ", product.id] })] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-slate-700", children: product.category }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-semibold text-slate-900", children: ["$", product.price] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsx)("span", { className: `text-sm font-semibold ${product.stock === 0 ? 'text-red-600' : product.stock < 20 ? 'text-orange-600' : 'text-green-600'}`, children: product.stock }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-semibold text-slate-900", children: product.sales }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: getStatusBadge(product.status) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleEditProduct(product), className: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { size: 18 }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleDeleteProduct(product.id), className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 18 }) })] }) })] }, product.id))) })] }), filteredProducts.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Package, { size: 48, className: "mx-auto text-slate-300 mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-500 font-medium", children: "No products found" })] }))] }) })] })), activeTab === 'orders' && ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-slate-50 border-b border-slate-200", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider", children: "Order ID" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider", children: "Customer" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider", children: "Products" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider", children: "Total" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider", children: "Date" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider", children: "Status" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-slate-200", children: orders.map((order) => ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-slate-50 transition-colors", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-slate-900", children: order.id }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-slate-900", children: order.customerName }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500", children: order.customerEmail })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-slate-700", children: [order.products.length, " items"] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-semibold text-slate-900", children: ["$", order.total.toFixed(2)] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-slate-700", children: order.orderDate }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4", children: getOrderStatusBadge(order.status) })] }, order.id))) })] }) }) })), activeTab === 'analytics' && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "text-blue-500", size: 20 }), "Top Selling Products"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: products
                                    .slice()
                                    .sort((a, b) => b.sales - a.sales)
                                    .slice(0, 5)
                                    .map((product, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 p-3 bg-slate-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold", children: index + 1 }), (0, jsx_runtime_1.jsx)("img", { src: product.image, alt: product.name, className: "w-10 h-10 rounded object-cover" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-slate-900 text-sm", children: product.name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-slate-500", children: [product.sales, " sales"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right", children: (0, jsx_runtime_1.jsxs)("p", { className: "font-bold text-green-600", children: ["$", (product.price * product.sales).toFixed(2)] }) })] }, product.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "text-purple-500", size: 20 }), "Revenue by Category"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: Array.from(new Set(products.map(p => p.category))).map((category) => {
                                    const categoryProducts = products.filter(p => p.category === category);
                                    const revenue = categoryProducts.reduce((sum, p) => sum + (p.price * p.sales), 0);
                                    const maxRevenue = Math.max(...Array.from(new Set(products.map(p => p.category))).map(cat => {
                                        return products.filter(p => p.category === cat).reduce((sum, p) => sum + (p.price * p.sales), 0);
                                    }));
                                    const percentage = maxRevenue ? (revenue / maxRevenue) * 100 : 0;
                                    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-semibold text-slate-700", children: category }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-bold text-purple-600", children: ["$", revenue.toFixed(2)] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full h-2 bg-slate-100 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full", style: { width: `${percentage}%` } }) })] }, category));
                                }) })] })] })), showProductModal && selectedProduct && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-slate-200", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-slate-900", children: isEditing ? 'Edit Product' : 'Product Details' }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowProductModal(false), className: "p-2 hover:bg-slate-100 rounded-lg transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 24, className: "text-slate-600" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 overflow-auto max-h-[calc(90vh-180px)]", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Product Image" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200", children: [(0, jsx_runtime_1.jsx)("img", { src: selectedProduct.image, alt: "Preview", className: "w-full h-full object-cover" }), isUploading && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-black/40 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { size: 24, className: "text-white animate-spin" }) }))] }), isEditing && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, disabled: isUploading, className: "px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-all flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { size: 16 }), isUploading ? 'Uploading...' : 'Change Photo'] }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-slate-500", children: "JPG, PNG or WEBP. Max 2MB." }), (0, jsx_runtime_1.jsx)("input", { type: "file", ref: fileInputRef, onChange: handleImageUpload, className: "hidden", accept: "image/*" })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Product Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: selectedProduct.name, onChange: (e) => setSelectedProduct({ ...selectedProduct, name: e.target.value }), disabled: !isEditing, className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: selectedProduct.description, onChange: (e) => setSelectedProduct({ ...selectedProduct, description: e.target.value }), disabled: !isEditing, rows: 3, className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 resize-none" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Price ($)" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: selectedProduct.price, onChange: (e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) || 0 }), disabled: !isEditing, className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Stock" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: selectedProduct.stock, onChange: (e) => setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value) || 0 }), disabled: !isEditing, className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Category" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedProduct.category, onChange: (e) => setSelectedProduct({ ...selectedProduct, category: e.target.value }), disabled: !isEditing, className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100", children: [(0, jsx_runtime_1.jsx)("option", { children: "Smart Devices" }), (0, jsx_runtime_1.jsx)("option", { children: "Filters" }), (0, jsx_runtime_1.jsx)("option", { children: "Water Savers" }), (0, jsx_runtime_1.jsx)("option", { children: "Safety" }), (0, jsx_runtime_1.jsx)("option", { children: "Eco Solutions" }), (0, jsx_runtime_1.jsx)("option", { children: "Consumables" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Status" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedProduct.status, onChange: (e) => setSelectedProduct({ ...selectedProduct, status: e.target.value }), disabled: !isEditing, className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100", children: [(0, jsx_runtime_1.jsx)("option", { value: "active", children: "Active" }), (0, jsx_runtime_1.jsx)("option", { value: "inactive", children: "Inactive" }), (0, jsx_runtime_1.jsx)("option", { value: "out-of-stock", children: "Out of Stock" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Badge (Optional)" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: selectedProduct.badge || '', onChange: (e) => setSelectedProduct({ ...selectedProduct, badge: e.target.value }), disabled: !isEditing, placeholder: "e.g., Best Seller, New, Premium", className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Savings Info (Optional)" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: selectedProduct.savings || '', onChange: (e) => setSelectedProduct({ ...selectedProduct, savings: e.target.value }), disabled: !isEditing, placeholder: "e.g., Save 15L/day, Save 40%", className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100" })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setShowProductModal(false), className: "px-6 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors", children: "Cancel" }), isEditing && ((0, jsx_runtime_1.jsxs)("button", { onClick: handleSaveProduct, className: "px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { size: 18 }), "Save Product"] }))] })] }) }))] }));
}
//# sourceMappingURL=MarketManager.js.map