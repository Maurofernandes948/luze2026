import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  ChevronRight, 
  ArrowUpRight,
  ShoppingCart,
  Plus,
  Instagram,
  Mail,
  X
} from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { 
  STATS, 
  WHATSAPP_NUMBER, 
  WHATSAPP_DISPLAY,
  INSTAGRAM_HANDLE, 
  EMAIL_ADDRESS,
  STORE_NOTICE,
  STORE_CITY,
  STORE_NAME,
  STORE_SLOGAN,
  STORE_DESCRIPTION,
  formatCurrency
} from '../constants';
import { Product, GalleryItem } from '../types';
import { useCart } from '../context/CartContext';

import { ProductService } from '../services/product.service';
import { GalleryService } from '../services/gallery.service';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'tenis' | 'roupas' | 'acessorios'>('todos');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, galleryData] = await Promise.all([
          ProductService.getProducts(),
          GalleryService.getGalleryItems()
        ]);
        setProducts(productsData);
        setGallery(galleryData);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    loadData();
  }, []);

  const filteredProducts = activeFilter === 'todos' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  const whatsappLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80" 
            alt="Hero" 
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-gold/10 border border-gold/30 rounded-full text-gold-lt text-[10px] uppercase tracking-[0.3em] font-bold mb-8"
          >
            Nova Coleção 2025
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-8xl font-serif font-medium mb-8 leading-[1.1]"
          >
            Vista-se com<br />
            <em className="italic font-normal text-gold-lt">Charme</em> & Elegância
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-cream-3 mb-12 max-w-2xl mx-auto font-light tracking-wide px-4 sm:px-0"
          >
            {STORE_DESCRIPTION}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a href="#produtos" className="group w-full sm:w-auto bg-gold text-dark px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:bg-gold-dk hover:text-white">
              Ver Coleção <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href={whatsappLink('Olá! Vim pelo site.')} target="_blank" className="w-full sm:w-auto border border-white/30 hover:bg-white/10 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all">
              <WhatsAppIcon size={16} /> Falar Connosco
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 flex items-center justify-center gap-8 md:gap-16"
          >
            {STATS.map((stat, i) => (
              <React.Fragment key={i}>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-medium">{stat.label}</div>
                </div>
                {i < STATS.length - 1 && <div className="h-8 w-px bg-white/10" />}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50">
          <div className="w-5 h-8 border-2 border-white rounded-full flex justify-center p-1">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-1 bg-white rounded-full" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white font-bold">Scroll</span>
        </div>
      </section>

      {/* Products Section */}
      <section id="produtos" className="py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-gold-dk font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Catálogo</p>
            <h2 className="text-4xl md:text-6xl font-serif font-medium text-dark mb-6">Os Nossos Produtos</h2>
            <p className="text-dark/60 max-w-2xl mx-auto font-light text-lg">Escolha a sua peça favorita e adicione ao carrinho para finalizar a sua encomenda.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { id: 'todos', label: 'Todos', icon: '✦' },
              { id: 'tenis', label: 'Tênis', icon: '👟' },
              { id: 'roupas', label: 'Roupas', icon: '👗' },
              { id: 'acessorios', label: 'Acessórios', icon: '👜' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${
                  activeFilter === f.id ? 'bg-gold text-dark shadow-2xl shadow-gold/20' : 'bg-cream-2 text-dark/50 hover:bg-cream-3'
                }`}
              >
                <span>{f.icon}</span> {f.label}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-2 mb-6 shadow-sh hover:shadow-sh-lg transition-all duration-500">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    {p.badge && (
                      <span className={`absolute top-5 left-5 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full text-white shadow-lg ${p.badge === 'Exclusivo' ? 'bg-dark' : 'bg-gold'}`}>
                        {p.badge}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => addToCart(p)}
                        className="bg-white/90 backdrop-blur-sm text-dark px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform flex items-center gap-2 hover:bg-gold hover:text-dark"
                      >
                        <Plus size={14} /> Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="flex items-center gap-2 text-[10px] text-gold-dk uppercase tracking-widest font-bold mb-3">
                      <Tag size={12} className="text-gold" /> {p.category}
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-gold-dk transition-colors">{p.name}</h3>
                    <p className="text-2xl font-serif font-medium text-dark mb-6">
                      {formatCurrency(p.price)}
                    </p>
                    <button 
                      onClick={() => addToCart(p)}
                      className="btn-wa w-full bg-dark text-white hover:bg-gold hover:text-dark"
                    >
                      <ShoppingCart size={18} /> Adicionar ao Carrinho
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Payment Section */}
      <section id="pagamento" className="py-32 bg-dark-2 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <p className="text-gold-lt font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Transparência</p>
            <h2 className="text-4xl md:text-6xl font-serif font-medium text-white mb-6">Como Funciona o Pagamento</h2>
            <p className="text-white/50 max-w-2xl mx-auto font-light text-lg">Simples, seguro e sem surpresas.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-24">
            <div className="bg-dark-3 backdrop-blur-sm rounded-[2.5rem] border border-white/10 p-10 md:p-16 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-gold/20" />
              
              <div className="flex items-center gap-5 mb-16 justify-center md:justify-start">
                <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center text-gold-lt shadow-inner border border-gold/30">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Forma de pagamento da loja <strong className="text-gold-lt font-extrabold">Luzes de Charme</strong></h3>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-12 relative">
                <div className="flex-1 flex items-center gap-8 w-full">
                  <div className="w-28 h-28 shrink-0 rounded-full border-[6px] border-gold flex items-center justify-center text-3xl font-black text-white bg-dark shadow-2xl shadow-gold/20">50%</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">No momento da encomenda</h4>
                    <p className="text-white/50 text-sm font-light leading-relaxed">Pague metade para confirmar e reservar o seu produto exclusivo.</p>
                  </div>
                </div>
                
                <div className="hidden md:block text-5xl text-white/10 font-thin">/</div>
                <div className="md:hidden w-full h-px bg-white/10 my-4" />

                <div className="flex-1 flex items-center gap-8 w-full">
                  <div className="w-28 h-28 shrink-0 rounded-full border-[6px] border-white/10 flex items-center justify-center text-3xl font-black text-gold-lt bg-dark shadow-2xl">50%</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">No momento da entrega</h4>
                    <p className="text-white/50 text-sm font-light leading-relaxed">Pague o restante quando receber o produto em mãos no conforto do seu lar.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: '🏦', title: 'Transferência Bancária', desc: 'Transfira para a nossa conta e envie o comprovativo por WhatsApp.' },
              { icon: '📱', title: 'Multicaixa Express', desc: 'Pague de forma rápida e segura via Multicaixa Express ou e-Kwanza.' },
              { icon: '💵', title: 'Dinheiro na Entrega', desc: 'Pague os 50% restantes em dinheiro quando o produto chegar até si.' }
            ].map((m, i) => (
              <div key={i} className="p-10 bg-dark-3 rounded-3xl border border-white/5 hover:bg-dark-4 transition-all text-center group">
                <div className="text-5xl mb-8 transform transition-transform group-hover:scale-110">{m.icon}</div>
                <h4 className="text-lg font-bold text-white mb-4">{m.title}</h4>
                <p className="text-white/40 text-sm font-light leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-gold-dk font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Galeria</p>
            <h2 className="text-4xl md:text-6xl font-serif font-medium text-dark mb-6">O Nosso Portfólio</h2>
            <p className="text-dark/50 max-w-2xl mx-auto font-light text-lg">Uma amostra dos produtos que já passaram pelas nossas mãos.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 auto-rows-[250px] md:auto-rows-[350px]">
            {gallery.map((item) => (
              <div 
                key={item.id} 
                className={`group relative overflow-hidden rounded-3xl cursor-pointer ${item.tall ? 'row-span-2' : ''} ${item.wide ? 'md:col-span-2' : ''}`}
                onClick={() => setSelectedImage(item)}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <span className="text-white font-bold tracking-[0.2em] uppercase text-xs">{item.title}</span>
                    <div className="mt-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto text-white">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-32 bg-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-gold-dk font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Contacto</p>
            <h2 className="text-4xl md:text-6xl font-serif font-medium text-dark mb-6">Fale Connosco</h2>
            <p className="text-dark/50 max-w-2xl mx-auto font-light text-lg">Estamos sempre disponíveis para responder às suas dúvidas.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              {[
                { icon: <WhatsAppIcon size={24} />, title: 'WhatsApp', val: WHATSAPP_DISPLAY, link: whatsappLink('Olá!'), color: 'bg-wa/10 text-wa' },
                { icon: <Instagram size={24} />, title: 'Instagram', val: `@${INSTAGRAM_HANDLE}`, link: `https://instagram.com/${INSTAGRAM_HANDLE}`, color: 'bg-pink-50 text-pink-600' },
                { icon: <Mail size={24} />, title: 'Email', val: EMAIL_ADDRESS, link: `mailto:${EMAIL_ADDRESS}`, color: 'bg-gold/10 text-gold-dk' }
              ].map((c, i) => (
                <a 
                  key={i} 
                  href={c.link} 
                  target="_blank" 
                  className="group flex items-center justify-between p-10 bg-white rounded-3xl border border-dark/5 hover:border-gold transition-all shadow-sh hover:shadow-sh-lg"
                >
                  <div className="flex items-center gap-8">
                    <div className={`w-16 h-16 ${c.color} rounded-2xl flex items-center justify-center`}>
                      {c.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-dark mb-1">{c.title}</h4>
                      <p className="text-dark/50 font-medium">{c.val}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-dark/20 group-hover:text-gold transition-colors" />
                </a>
              ))}
            </div>

            <div className="bg-dark rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden group">
              <div className="cta-glow" />
              <div className="relative z-10">
                <p className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-6">Pronto para encomendar?</p>
                <h3 className="text-4xl md:text-5xl font-serif font-medium mb-8 leading-tight">Faça a sua encomenda agora</h3>
                <p className="text-white/40 mb-12 font-light text-lg leading-relaxed">
                  Escolha o produto, clique em WhatsApp e nós tratamos do resto — rápido, seguro e com entrega ao domicílio em <span className="text-gold-lt font-bold">{STORE_CITY}</span>.
                </p>
                <a 
                  href={whatsappLink('Olá! Quero fazer uma encomenda.')}
                  target="_blank"
                  className="bg-wa text-white px-12 py-6 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-4 transition-all hover:bg-wa-dk shadow-2xl shadow-wa/20"
                >
                  <WhatsAppIcon size={20} /> Encomendar pelo WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-10 right-10 text-white hover:text-gold transition-colors">
              <X size={40} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-5xl w-full max-h-full relative"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title} 
                className="w-full h-full object-contain rounded-2xl shadow-sh-lg"
              />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
                <h4 className="text-white text-2xl font-serif font-medium mb-2">{selectedImage.title}</h4>
                <p className="text-gold-lt text-[10px] uppercase tracking-[0.3em] font-bold">{STORE_NAME}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
