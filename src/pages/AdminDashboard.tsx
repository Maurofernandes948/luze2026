import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  X, 
  Image as ImageIcon,
  Save,
  Tag
} from 'lucide-react';
import { formatCurrency } from '../constants';
import { Product } from '../types';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'tenis',
    image: '',
    badge: '',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('Expected array of products, got:', data);
        setProducts([]);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('Expected array of orders, got:', data);
        setOrders([]);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price: parseInt(formData.price, 10)
      }),
    });

    if (res.ok) {
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', category: 'tenis', image: '', badge: '', description: '' });
      fetchProducts();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem a certeza que deseja eliminar este produto?')) {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    }
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      price: p.price.toString(),
      category: p.category,
      image: p.image,
      badge: p.badge || '',
      description: p.description || ''
    });
    setIsModalOpen(true);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-6">
        <h2 className="text-white text-2xl font-serif">Acesso Negado</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-medium text-white mb-2">Painel de Controlo</h1>
            <p className="text-white/40 text-sm">Gerencie os seus produtos e visualize as encomendas.</p>
          </div>
          <button 
            onClick={() => { setEditingProduct(null); setFormData({ name: '', price: '', category: 'tenis', image: '', badge: '', description: '' }); setIsModalOpen(true); }}
            className="bg-gold text-dark px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gold-lt transition-all shadow-lg shadow-gold/20"
          >
            <Plus size={18} /> Novo Produto
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Produtos', val: products.length, icon: <Package />, color: 'text-blue-400' },
            { label: 'Encomendas', val: orders.length, icon: <ShoppingBag />, color: 'text-gold' },
            { label: 'Clientes', val: '124', icon: <Users />, color: 'text-emerald-400' },
            { label: 'Vendas (Mês)', val: formatCurrency(orders.reduce((sum, o) => sum + o.total, 0)), icon: <TrendingUp />, color: 'text-purple-400' }
          ].map((s, i) => (
            <div key={i} className="bg-dark-2 p-8 rounded-3xl border border-white/5 flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Products List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-serif font-medium text-white">Produtos Disponíveis</h3>
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">{products.length} Total</span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-dark-2 p-6 rounded-3xl border border-white/5 flex gap-6 group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-dark-3 shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="truncate">
                        <h4 className="font-bold text-white truncate">{p.name}</h4>
                        <p className="text-[10px] uppercase tracking-widest text-gold font-bold">{p.category}</p>
                      </div>
                    </div>
                    <p className="text-lg font-serif text-white mb-4">{formatCurrency(p.price)}</p>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => openEdit(p)}
                        className="p-2.5 bg-white/5 text-white/40 hover:text-gold hover:bg-gold/10 rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2.5 bg-white/5 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-serif font-medium text-white mb-4">Encomendas Recentes</h3>
            <div className="space-y-4">
              {orders.slice().reverse().map((o) => (
                <div key={o.id} className="bg-dark-2 p-6 rounded-3xl border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">#{o.id}</span>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${o.status === 'pendente' ? 'bg-gold/10 text-gold' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{o.email}</p>
                  <p className="text-xs text-white/40 mb-4">{new Date(o.created_at).toLocaleDateString('pt-PT')}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-white/40">Total</span>
                    <span className="font-serif font-medium text-gold">{formatCurrency(o.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-dark-2 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-serif font-medium text-white">
                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-white/20 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-4">Nome do Produto</label>
                      <div className="relative">
                        <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="text" required 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-dark-3 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:border-gold outline-none transition-all"
                          placeholder="Ex: Tênis Urban Gold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-4">Preço (KZ)</label>
                      <div className="relative">
                        <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="number" required 
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: e.target.value})}
                          className="w-full bg-dark-3 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:border-gold outline-none transition-all"
                          placeholder="Ex: 45000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-4">Categoria</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-dark-3 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:border-gold outline-none transition-all appearance-none"
                      >
                        <option value="tenis">Tênis</option>
                        <option value="roupas">Roupas</option>
                        <option value="acessorios">Acessórios</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-4">Badge (Opcional)</label>
                      <input 
                        type="text"
                        value={formData.badge}
                        onChange={e => setFormData({...formData, badge: e.target.value})}
                        className="w-full bg-dark-3 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:border-gold outline-none transition-all"
                        placeholder="Ex: Exclusivo, Novo"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-4">URL da Imagem</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input 
                        type="url" required 
                        value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        className="w-full bg-dark-3 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:border-gold outline-none transition-all"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-4">Descrição</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-dark-3 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:border-gold outline-none transition-all h-32 resize-none"
                      placeholder="Descreva o produto..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gold text-dark py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gold-lt transition-all shadow-lg shadow-gold/20"
                  >
                    <Save size={18} /> {editingProduct ? 'Guardar Alterações' : 'Criar Produto'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
