import { useState, useRef } from 'react';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Eye,
  X,
  Save,
  Star,
  AlertCircle,
  CheckCircle,
  Box,
  BarChart3,
  Upload,
  Loader2
} from 'lucide-react';
import { db } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  image: string;
  badge?: string;
  savings?: string;
  createdDate: string;
  sales: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  products: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
}

const mockProducts: Product[] = [
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

const mockOrders: Order[] = [
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

export default function MarketManager() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'out-of-stock'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProduct) return;

    setIsUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setSelectedProduct({ ...selectedProduct, image: url });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
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
    const newProduct: Product = {
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
      createdDate: new Date().toISOString().split('T')[0]!,
      sales: 0
    };
    setSelectedProduct(newProduct);
    setIsEditing(true);
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
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
      } else {
        setProducts([...products, selectedProduct]);
      }
    }
    setShowProductModal(false);
    setSelectedProduct(null);
    setIsEditing(false);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1"><CheckCircle size={12} />Active</span>;
      case 'inactive':
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full flex items-center gap-1"><AlertCircle size={12} />Inactive</span>;
      case 'out-of-stock':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1"><X size={12} />Out of Stock</span>;
      default:
        return null;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    const configs = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Shipped' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
    };
    const config = configs[status as keyof typeof configs];
    return <span className={`px-3 py-1 ${config.bg} ${config.text} text-xs font-semibold rounded-full`}>{config.label}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Package size={24} />
            <span className="text-3xl font-bold">{stats.totalProducts}</span>
          </div>
          <p className="text-sm text-blue-100">Total Products</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={24} />
            <span className="text-3xl font-bold">${stats.totalRevenue.toFixed(0)}</span>
          </div>
          <p className="text-sm text-green-100">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart size={24} />
            <span className="text-3xl font-bold">{stats.totalOrders}</span>
          </div>
          <p className="text-sm text-purple-100">Total Orders</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle size={24} />
            <span className="text-3xl font-bold">{stats.lowStock}</span>
          </div>
          <p className="text-sm text-orange-100">Low Stock Items</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 flex gap-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'products'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'orders'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'analytics'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'products' && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    statusFilter === 'all'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    statusFilter === 'active'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('out-of-stock')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    statusFilter === 'out-of-stock'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Out of Stock
                </button>
              </div>

              <button
                onClick={handleCreateProduct}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                Add Product
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Sales</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                          <div>
                            <p className="font-semibold text-slate-900">{product.name}</p>
                            <p className="text-xs text-slate-400">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="text-sm text-slate-700">{product.category}</span></td>
                      <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-900">${product.price}</span></td>
                      <td className="px-6 py-4"><span className={`text-sm font-semibold ${product.stock === 0 ? 'text-red-600' : product.stock < 20 ? 'text-orange-600' : 'text-green-600'}`}>{product.stock}</span></td>
                      <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-900">{product.sales}</span></td>
                      <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditProduct(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">No products found</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4"><span className="font-semibold text-slate-900">{order.id}</span></td>
                    <td className="px-6 py-4"><div><p className="font-semibold text-slate-900">{order.customerName}</p><p className="text-xs text-slate-500">{order.customerEmail}</p></div></td>
                    <td className="px-6 py-4"><span className="text-sm text-slate-700">{order.products.length} items</span></td>
                    <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-900">${order.total.toFixed(2)}</span></td>
                    <td className="px-6 py-4"><span className="text-sm text-slate-700">{order.orderDate}</span></td>
                    <td className="px-6 py-4">{getOrderStatusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="text-blue-500" size={20} />Top Selling Products</h3>
            <div className="space-y-3">
              {products
                .slice()
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5)
                .map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">{index + 1}</div>
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${(product.price * product.sales).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><BarChart3 className="text-purple-500" size={20} />Revenue by Category</h3>
            <div className="space-y-3">
              {Array.from(new Set(products.map(p => p.category))).map((category) => {
                const categoryProducts = products.filter(p => p.category === category);
                const revenue = categoryProducts.reduce((sum, p) => sum + (p.price * p.sales), 0);
                const maxRevenue = Math.max(...Array.from(new Set(products.map(p => p.category))).map(cat => {
                  return products.filter(p => p.category === cat).reduce((sum, p) => sum + (p.price * p.sales), 0);
                }));
                const percentage = maxRevenue ? (revenue / maxRevenue) * 100 : 0;

                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">{category}</span>
                      <span className="text-sm font-bold text-purple-600">${revenue.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">{isEditing ? 'Edit Product' : 'Product Details'}</h3>
              <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><X size={24} className="text-slate-600" /></button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Product Image</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200">
                      <img 
                        src={selectedProduct.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 size={24} className="text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-all flex items-center gap-2"
                        >
                          <Upload size={16} />
                          {isUploading ? 'Uploading...' : 'Change Photo'}
                        </button>
                        <p className="text-[10px] text-slate-500">JPG, PNG or WEBP. Max 2MB.</p>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          className="hidden" 
                          accept="image/*"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={selectedProduct.description}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={selectedProduct.price}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) || 0 })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Stock</label>
                    <input
                      type="number"
                      value={selectedProduct.stock}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value) || 0 })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select
                      value={selectedProduct.category}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                    >
                      <option>Smart Devices</option>
                      <option>Filters</option>
                      <option>Water Savers</option>
                      <option>Safety</option>
                      <option>Eco Solutions</option>
                      <option>Consumables</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                    <select
                      value={selectedProduct.status}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, status: e.target.value as any })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Badge (Optional)</label>
                  <input
                    type="text"
                    value={selectedProduct.badge || ''}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, badge: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., Best Seller, New, Premium"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Savings Info (Optional)</label>
                  <input
                    type="text"
                    value={selectedProduct.savings || ''}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, savings: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., Save 15L/day, Save 40%"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setShowProductModal(false)}
                className="px-6 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              {isEditing && (
                <button
                  onClick={handleSaveProduct}
                  className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Product
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
