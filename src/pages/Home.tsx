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
  X,
  Image as ImageIcon
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
  formatCurrency,
  GALLERY
} from '../constants';
import { Product, GalleryItem, Testimonial } from '../types';
import { useCart } from '../context/CartContext';

import { ProductService } from '../services/product.service';
import { GalleryService } from '../services/gallery.service';
import { TestimonialService } from '../services/testimonial.service';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'seed-12',
      name: 'Fato Executivo Premium Blue',
      price: 25000,
      category: 'roupas',
      image: 'https://images.unsplash.com/photo-1594932224828-b4b057b7d6ee?q=80&w=1000&auto=format&fit=crop',
      badge: 'Novo',
      description: 'Fato executivo clássico em tom azul, com corte impecável e tecido de alta qualidade para um visual profissional e elegante.'
    },
    {
      id: 'seed-13',
      name: 'Fato Executivo Charcoal',
      price: 25000,
      category: 'roupas',
      image: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=1000&auto=format&fit=crop',
      badge: 'Novo',
      description: 'Fato executivo em tom carvão, com corte moderno e acabamento de luxo.'
    },
    {
      id: 'seed-14',
      name: 'Tênis Premium Urban',
      price: 35000,
      category: 'tenis',
      image: 'https://i.imgur.com/piCJQwF.jpeg',
      badge: 'Destaque',
      description: 'Tênis moderno com design urbano e conforto excepcional para o dia a dia.'
    },
    {
      id: 'seed-15',
      name: 'Conjunto Elegance Classic',
      price: 45000,
      category: 'roupas',
      image: 'https://i.imgur.com/QqnZKtp.jpeg',
      badge: 'Premium',
      description: 'Conjunto clássico e sofisticado, ideal para ocasiões especiais que exigem um toque de classe.'
    },
    {
      id: 'seed-16',
      name: 'Acessório Luxo Gold',
      price: 15000,
      category: 'acessorios',
      image: 'https://i.imgur.com/uR2WGsi.jpeg',
      badge: 'Exclusivo',
      description: 'Acessório refinado que complementa seu visual com elegância e brilho.'
    },
    {
      id: 'seed-17',
      name: 'Tênis Exclusivo Special',
      price: 15000,
      category: 'tenis',
      image: 'https://i.imgur.com/bK4iXV0.jpeg',
      badge: 'Exclusivo',
      description: 'Tênis exclusivo para ocasiões especiais, unindo estilo e sofisticação.'
    },
    {
      id: 'seed-18',
      name: 'Fato Executivo Classic Grey',
      price: 18000,
      category: 'roupas',
      image: 'https://i.imgur.com/wcS9mZp.jpeg',
      badge: 'Clássico',
      description: 'Fato executivo clássico em tom cinza, ideal para reuniões e eventos formais.'
    },
    {
      id: 'seed-19',
      name: 'Tênis Urban Style White',
      price: 12000,
      category: 'tenis',
      image: 'https://i.imgur.com/Q3V8gOW.jpeg',
      badge: 'Moderno',
      description: 'Tênis urbano com design moderno e conforto excepcional para o dia a dia.'
    },
    {
      id: 'seed-20',
      name: 'Fato Slim Fit Midnight',
      price: 20000,
      category: 'roupas',
      image: 'https://i.imgur.com/1pM8G9T.jpeg',
      badge: 'Slim Fit',
      description: 'Fato slim fit em azul meia-noite, corte moderno e elegante.'
    },
    {
      id: 'seed-21',
      name: 'Conjunto Casual Modern',
      price: 14000,
      category: 'roupas',
      image: 'https://i.imgur.com/2tuVlTn.jpeg',
      badge: 'Casual',
      description: 'Conjunto casual versátil, perfeito para um visual despojado e sofisticado.'
    },
    {
      id: 'seed-22',
      name: 'Sapato Social Premium',
      price: 16000,
      category: 'tenis',
      image: 'https://i.imgur.com/o5Av0V1.jpeg',
      badge: 'Premium',
      description: 'Sapato social de couro premium, acabamento impecável para ocasiões de gala.'
    }
  ]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'tenis' | 'roupas' | 'acessorios'>('todos');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, galleryData, testimonialsData] = await Promise.all([
          ProductService.getProducts(),
          GalleryService.getGalleryItems(),
          TestimonialService.getTestimonials()
        ]);
        
        // Only update if we have data in Supabase, otherwise keep our defaults
        if (productsData.length > 0) {
          // Check if all our seeds exist in Supabase
          const seedNames = [
            'Fato Executivo Premium Blue', 
            'Fato Executivo Charcoal',
            'Tênis Premium Urban',
            'Conjunto Elegance Classic',
            'Acessório Luxo Gold',
            'Tênis Exclusivo Special',
            'Fato Executivo Classic Grey',
            'Tênis Urban Style White',
            'Fato Slim Fit Midnight',
            'Conjunto Casual Modern',
            'Sapato Social Premium'
          ];
          const missingSeeds = products.filter(p => !productsData.some(pd => pd.name === p.name));
          const outdatedSeeds = products.filter(p => {
            const pd = productsData.find(pd => pd.name === p.name);
            return pd && (pd.image !== p.image || pd.price !== p.price);
          });

          // Delete products that are not in our seed list (the ones we want to remove)
          const productsToDelete = productsData.filter(pd => 
            !seedNames.includes(pd.name) && 
            ['Tênis Urban Gold', 'Vestido Elegance', 'Relógio Chrono', 'Bolsa Lacoste Celeste', 'Tênis Adidas Urban White', 'Tênis Casual Branco Premium', 'Tênis New Balance Classic', 'Nem Balence', 'Nem balance', 'Tênis Adidas Urban Black', 'Fato Executivo Slim Premium', 'Fato Executivo Modern Slim', 'Bolsa Elegance Premium', 'New balance'].includes(pd.name)
          );

          if (productsToDelete.length > 0) {
            for (const p of productsToDelete) {
              await ProductService.deleteProduct(p.id);
            }
            // Refresh data after deletion
            const refreshedProducts = await ProductService.getProducts();
            setProducts(refreshedProducts);
          } else if (missingSeeds.length > 0 || outdatedSeeds.length > 0) {
            for (const p of missingSeeds) {
              const { id, ...productData } = p as any;
              await ProductService.createProduct(productData);
            }
            for (const p of outdatedSeeds) {
              const pd = productsData.find(pd => pd.name === p.name);
              if (pd) {
                const { id, ...productData } = p as any;
                await ProductService.updateProduct(pd.id, productData);
              }
            }
            const updatedProducts = await ProductService.getProducts();
            setProducts(updatedProducts);
          } else {
            setProducts(productsData);
          }
        } else {
          // If Supabase is empty, seed it with our defaults
          for (const p of products) {
            const { id, ...productData } = p as any;
            await ProductService.createProduct(productData);
          }
        }

        if (galleryData.length > 0) {
          // Check for old gallery items to remove (the ones we just cleared from constants)
          const oldGalleryTitles = ['Tênis Adidas Urban Black', 'Fato Executivo Slim Premium', 'Fato Executivo Modern Slim', 'Bolsa Elegance Premium'];
          const itemsToDelete = galleryData.filter(item => oldGalleryTitles.includes(item.title));
          
          // Check for missing items from GALLERY
          const missingGalleryItems = GALLERY.filter(item => !galleryData.some(gd => gd.title === item.title));
          
          if (itemsToDelete.length > 0 || missingGalleryItems.length > 0) {
            if (itemsToDelete.length > 0) {
              for (const item of itemsToDelete) {
                await GalleryService.deleteGalleryItem(item.id);
              }
            }
            if (missingGalleryItems.length > 0) {
              for (const item of missingGalleryItems) {
                const { id, ...itemData } = item as any;
                await GalleryService.createGalleryItem(itemData);
              }
            }
            const refreshedGallery = await GalleryService.getGalleryItems();
            setGallery(refreshedGallery);
          } else {
            setGallery(galleryData);
          }
        } else {
          // Seed gallery if constants.ts has items
          if (GALLERY.length > 0) {
            for (const item of GALLERY) {
              const { id, ...itemData } = item as any;
              await GalleryService.createGalleryItem(itemData);
            }
            const updatedGallery = await GalleryService.getGalleryItems();
            setGallery(updatedGallery);
          } else {
            setGallery([]);
          }
        }
        
        if (testimonialsData.length > 0) {
          setTestimonials(testimonialsData);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = activeFilter === 'todos' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  const whatsappLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-gold-dk font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Carregando Charme...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero" 
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white pt-24">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-9xl font-serif font-medium mb-8 leading-[1.1] drop-shadow-2xl"
          >
            Charme &<br />
            <em className="italic font-normal text-gold-lt">Elegância</em>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-white mb-12 max-w-2xl mx-auto font-light tracking-widest px-4 sm:px-0 drop-shadow-lg"
          >
            A sofisticação do clássico em um cenário moderno. Descubra a coleção que define o seu estilo.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a href="#produtos" className="group w-full sm:w-auto bg-gold text-dark px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:bg-gold-dk hover:text-white shadow-xl">
              Ver Coleção <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href={whatsappLink('Olá! Vim pelo site.')} target="_blank" className="w-full sm:w-auto border border-white/50 backdrop-blur-sm hover:bg-white/20 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl">
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

          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[10px] bg-cream-2 mb-4 shadow-sm group-hover:shadow-xl transition-all duration-700">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {p.badge && (
                        <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full text-white shadow-lg backdrop-blur-md ${p.badge === 'Exclusivo' ? 'bg-dark/80' : 'bg-gold/80'}`}>
                          {p.badge}
                        </span>
                      )}
                    </div>

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <button 
                      onClick={() => addToCart(p)}
                      className="absolute bottom-4 left-4 right-4 bg-white text-dark py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center gap-2 hover:bg-gold hover:text-dark shadow-2xl"
                    >
                      <Plus size={14} /> <span className="hidden sm:inline">Adicionar</span>
                    </button>
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] text-gold-dk uppercase tracking-[0.2em] font-bold">
                        {p.category}
                      </span>
                    </div>
                    
                    <h3 className="text-sm md:text-base font-bold text-dark mb-1 line-clamp-1 group-hover:text-gold-dk transition-colors">
                      {p.name}
                    </h3>
                    
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <p className="text-lg md:text-xl font-serif font-medium text-dark">
                        Preço: {formatCurrency(p.price)}
                      </p>
                      
                      <button 
                        onClick={() => addToCart(p)}
                        className="sm:hidden w-8 h-8 bg-dark text-white rounded-full flex items-center justify-center hover:bg-gold hover:text-dark transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
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
      <section id="portfolio" className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <p className="text-gold-dk font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Portfólio</p>
              <h2 className="text-4xl md:text-6xl font-serif font-medium text-dark mb-6">A Nossa Galeria</h2>
              <p className="text-dark/50 font-light text-lg">Explore os nossos produtos em detalhe e veja a qualidade das nossas peças reais.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
            {gallery.length > 0 ? (
              gallery.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedImage(item)}
                  className={`group relative overflow-hidden rounded-[2rem] cursor-pointer ${
                    item.wide ? 'lg:col-span-2' : ''
                  } ${
                    item.tall ? 'lg:row-span-2' : ''
                  }`}
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                    <p className="text-gold-lt text-[10px] uppercase tracking-[0.3em] font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {STORE_NAME}
                    </p>
                    <h4 className="text-white text-2xl font-serif font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                      {item.title}
                    </h4>
                    <div className="mt-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-dark scale-0 group-hover:scale-100 transition-transform duration-500 delay-150">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-cream-2 rounded-[2rem] border-2 border-dashed border-dark/5">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-6">
                  <ImageIcon size={32} />
                </div>
                <h3 className="text-xl font-serif font-medium text-dark mb-2">Galeria em Atualização</h3>
                <p className="text-dark/40 text-sm font-light">Estamos a preparar novas imagens incríveis para si.</p>
              </div>
            )}
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
