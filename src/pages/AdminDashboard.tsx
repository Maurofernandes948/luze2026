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
  Tag,
  Upload,
  Loader2
} from 'lucide-react';
import { formatCurrency } from '../constants';
import { Product } from '../types';

import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { GalleryService } from '../services/gallery.service';
import { supabase } from '../config/supabase';
import { GalleryItem as GalleryItemType } from '../types';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'gallery'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItemType[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItemType | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'tenis',
    image: '',
    badge: '',
    description: ''
  });

  const [galleryFormData, setGalleryFormData] = useState({
    title: '',
    image: '',
    tall: false,
    wide: false
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchClientCount();
    fetchGallery();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await ProductService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    }
  };

  const fetchGallery = async () => {
    try {
      const data = await GalleryService.getGalleryItems();
      setGallery(data);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
      setGallery([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string | number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const fetchClientCount = async () => {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      setClientCount(count || 0);
    } catch (err) {
      console.error('Failed to fetch client count:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productPayload = {
        ...formData,
        price: parseInt(formData.price, 10)
      };

      if (editingProduct) {
        await ProductService.updateProduct(editingProduct.id, productPayload);
      } else {
        await ProductService.createProduct(productPayload);
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', category: 'tenis', image: '', badge: '', description: '' });
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Tem a certeza que deseja eliminar este produto?')) {
      try {
        await ProductService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGallery) {
        await GalleryService.updateGalleryItem(editingGallery.id, galleryFormData);
      } else {
        await GalleryService.createGalleryItem(galleryFormData);
      }
      setIsGalleryModalOpen(false);
      setEditingGallery(null);
      setGalleryFormData({ title: '', image: '', tall: false, wide: false });
      fetchGallery();
    } catch (err) {
      console.error('Failed to save gallery item:', err);
    }
  };

  const handleDeleteGallery = async (id: string | number) => {
    if (confirm('Tem a certeza que deseja eliminar esta imagem da galeria?')) {
      try {
        await GalleryService.deleteGalleryItem(id);
        fetchGallery();
      } catch (err) {
        console.error('Failed to delete gallery item:', err);
      }
    }
  };

  const openEditGallery = (item: GalleryItemType) => {
    setEditingGallery(item);
    setGalleryFormData({
      title: item.title,
      image: item.image,
      tall: !!item.tall,
      wide: !!item.wide
    });
    setIsGalleryModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      if (type === 'product') {
        setFormData({ ...formData, image: publicUrl });
      } else {
        setGalleryFormData({ ...galleryFormData, image: publicUrl });
      }
    } catch (err: any) {
      console.error('Error uploading image:', err);
      if (err.message === 'Bucket not found') {
        alert('Erro: O bucket "images" não foi encontrado no seu Supabase Storage. Por favor, crie um bucket público chamado "images" no seu painel do Supabase para ativar o carregamento de fotos.');
      } else {
        alert(`Erro ao carregar imagem: ${err.message || 'Erro desconhecido'}`);
      }
    } finally {
      setIsUploading(false);
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
            <p className="text-white/40 text-sm">Gerencie os seus produtos, galeria e visualize as encomendas.</p>
          </div>
          <div className="flex gap-4">
            {activeTab === 'products' && (
              <button 
                onClick={() => { setEditingProduct(null); setFormData({ name: '', price: '', category: 'tenis', image: '', badge: '', description: '' }); setIsModalOpen(true); }}
                className="bg-gold text-dark px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gold-lt transition-all shadow-lg shadow-gold/20"
              >
                <Plus size={18} /> Novo Produto
              </button>
            )}
            {activeTab === 'gallery' && (
              <button 
                onClick={() => { setEditingGallery(null); setGalleryFormData({ title: '', image: '', tall: false, wide: false }); setIsGalleryModalOpen(true); }}
                className="bg-gold text-dark px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gold-lt transition-all shadow-lg shadow-gold/20"
              >
                <Plus size={18} /> Nova Imagem
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-12 border-b border-white/5">
          {[
            { id: 'products', label: 'Produtos', icon: <Package size={16} /> },
            { id: 'gallery', label: 'Galeria / Portfólio', icon: <ImageIcon size={16} /> },
            { id: 'orders', label: 'Encomendas', icon: <ShoppingBag size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all relative ${
                activeTab === tab.id ? 'text-gold' : 'text-white/40 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Produtos', val: products.length, icon: <Package />, color: 'text-blue-400' },
            { label: 'Encomendas', val: orders.length, icon: <ShoppingBag />, color: 'text-gold' },
            { label: 'Clientes', val: clientCount, icon: <Users />, color: 'text-emerald-400' },
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
          {activeTab === 'products' && (
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif font-medium text-white">Produtos Disponíveis</h3>
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">{products.length} Total</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.id} className="bg-dark-2 p-4 sm:p-6 rounded-3xl border border-white/5 flex flex-col sm:flex-row gap-4 sm:gap-6 group">
                    <div className="w-full sm:w-24 h-48 sm:h-24 rounded-2xl overflow-hidden bg-dark-3 shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="truncate">
                          <h4 className="font-bold text-white truncate text-lg sm:text-base">{p.name}</h4>
                          <p className="text-[10px] uppercase tracking-widest text-gold font-bold">{p.category}</p>
                        </div>
                      </div>
                      <p className="text-xl sm:text-lg font-serif text-white mb-4">{formatCurrency(p.price)}</p>
                      <div className="flex items-center gap-3 mt-auto">
                        <button 
                          onClick={() => openEdit(p)}
                          className="flex-1 sm:flex-none p-3 sm:p-2.5 bg-white/5 text-white/40 hover:text-gold hover:bg-gold/10 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Edit2 size={16} /> <span className="sm:hidden text-[10px] uppercase font-bold">Editar</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="flex-1 sm:flex-none p-3 sm:p-2.5 bg-white/5 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 size={16} /> <span className="sm:hidden text-[10px] uppercase font-bold">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif font-medium text-white">Imagens do Portfólio</h3>
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">{gallery.length} Total</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {gallery.map((item) => (
                  <div key={item.id} className="bg-dark-2 p-4 rounded-3xl border border-white/5 group">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-dark-3 mb-4">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <div className="flex gap-2 mb-4">
                      {item.tall && <span className="text-[8px] uppercase bg-white/5 px-2 py-1 rounded text-white/40">Vertical</span>}
                      {item.wide && <span className="text-[8px] uppercase bg-white/5 px-2 py-1 rounded text-white/40">Largo</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openEditGallery(item)}
                        className="flex-1 p-2 bg-white/5 text-white/40 hover:text-gold hover:bg-gold/10 rounded-xl transition-all flex items-center justify-center"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteGallery(item.id)}
                        className="flex-1 p-2 bg-white/5 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-xl font-serif font-medium text-white mb-4">Todas as Encomendas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.slice().reverse().map((o) => (
                  <div key={o.id} className="bg-dark-2 p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">#{o.id}</span>
                      <select 
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-dark-3 border border-white/5 outline-none cursor-pointer ${o.status === 'pendente' ? 'text-gold' : 'text-emerald-500'}`}
                      >
                        <option value="pendente">Pendente</option>
                        <option value="pago">Pago</option>
                        <option value="entregue">Entregue</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
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
          )}
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
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-4">Imagem do Produto</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'product')}
                          className="hidden"
                          id="product-image-upload"
                        />
                        <label 
                          htmlFor="product-image-upload"
                          className="flex flex-col items-center justify-center w-full h-32 bg-dark-3 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all"
                        >
                          {isUploading ? (
                            <Loader2 className="text-gold animate-spin" size={24} />
                          ) : (
                            <>
                              <Upload className="text-white/20 mb-2" size={24} />
                              <span className="text-[10px] uppercase font-bold text-white/40">Carregar Foto</span>
                            </>
                          )}
                        </label>
                      </div>
                      <div className="relative">
                        <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="url" required 
                          value={formData.image}
                          onChange={e => setFormData({...formData, image: e.target.value})}
                          className="w-full h-full bg-dark-3 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:border-gold outline-none transition-all"
                          placeholder="Ou cole o URL da imagem..."
                        />
                      </div>
                    </div>
                    {formData.image && (
                      <div className="mt-2 flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                        <img src={formData.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg" referrerPolicy="no-referrer" />
                        <span className="text-[10px] text-white/40 truncate flex-1">{formData.image}</span>
                      </div>
                    )}
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

      {/* Gallery Modal */}
      <AnimatePresence>
        {isGalleryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsGalleryModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-dark-2 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-serif font-medium text-white">
                    {editingGallery ? 'Editar Imagem' : 'Nova Imagem'}
                  </h2>
                  <button onClick={() => setIsGalleryModalOpen(false)} className="text-white/20 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleGallerySubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-4">Título da Imagem</label>
                    <input 
                      type="text" required 
                      value={galleryFormData.title}
                      onChange={e => setGalleryFormData({...galleryFormData, title: e.target.value})}
                      className="w-full bg-dark-3 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:border-gold outline-none transition-all"
                      placeholder="Ex: Coleção Verão"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-4">Imagem da Galeria</label>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'gallery')}
                          className="hidden"
                          id="gallery-image-upload"
                        />
                        <label 
                          htmlFor="gallery-image-upload"
                          className="flex flex-col items-center justify-center w-full h-32 bg-dark-3 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all"
                        >
                          {isUploading ? (
                            <Loader2 className="text-gold animate-spin" size={24} />
                          ) : (
                            <>
                              <Upload className="text-white/20 mb-2" size={24} />
                              <span className="text-[10px] uppercase font-bold text-white/40">Carregar Foto da Galeria</span>
                            </>
                          )}
                        </label>
                      </div>
                      <div className="relative">
                        <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="url" required 
                          value={galleryFormData.image}
                          onChange={e => setGalleryFormData({...galleryFormData, image: e.target.value})}
                          className="w-full bg-dark-3 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:border-gold outline-none transition-all"
                          placeholder="Ou cole o URL da imagem..."
                        />
                      </div>
                    </div>
                    {galleryFormData.image && (
                      <div className="mt-2 flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                        <img src={galleryFormData.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg" referrerPolicy="no-referrer" />
                        <span className="text-[10px] text-white/40 truncate flex-1">{galleryFormData.image}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={galleryFormData.tall}
                        onChange={e => setGalleryFormData({...galleryFormData, tall: e.target.checked})}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${galleryFormData.tall ? 'bg-gold border-gold' : 'border-white/20'}`}>
                        {galleryFormData.tall && <Plus size={12} className="text-dark rotate-45" />}
                      </div>
                      <span className="text-xs text-white/60 group-hover:text-white">Formato Vertical</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={galleryFormData.wide}
                        onChange={e => setGalleryFormData({...galleryFormData, wide: e.target.checked})}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${galleryFormData.wide ? 'bg-gold border-gold' : 'border-white/20'}`}>
                        {galleryFormData.wide && <Plus size={12} className="text-dark rotate-45" />}
                      </div>
                      <span className="text-xs text-white/60 group-hover:text-white">Formato Largo</span>
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gold text-dark py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gold-lt transition-all shadow-lg shadow-gold/20"
                  >
                    <Save size={18} /> {editingGallery ? 'Guardar Alterações' : 'Adicionar à Galeria'}
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
