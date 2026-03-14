import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../constants';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 pt-32">
        <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-8">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-serif font-medium text-dark mb-4">O seu carrinho está vazio</h2>
        <p className="text-dark/50 mb-10 text-center max-w-xs">Parece que ainda não adicionou nenhuma peça à sua coleção.</p>
        <Link to="/#produtos" className="bg-dark text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-dark transition-all">
          Ver Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-6 pt-32">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-serif font-medium text-dark">O Seu Carrinho</h1>
          <span className="text-xs font-bold uppercase tracking-widest text-dark/40">{cart.length} Itens</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-6 rounded-3xl border border-dark/5 flex items-center gap-6 shadow-sm"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-cream-2 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-dark">{item.name}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-gold-dk font-bold">{item.category}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-dark/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 bg-cream-2 rounded-xl p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-dark/40 hover:text-dark transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold text-dark w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-dark/40 hover:text-dark transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-serif font-medium text-lg text-dark">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-dark text-white p-10 rounded-[2.5rem] shadow-2xl sticky top-32">
              <h3 className="text-xl font-serif font-medium mb-8">Resumo</h3>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-white/40 text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-white/40 text-sm">
                  <span>Entrega</span>
                  <span className="text-gold font-bold uppercase tracking-widest text-[10px]">Sob consulta</span>
                </div>
                <div className="h-px bg-white/10 my-6" />
                <div className="flex justify-between items-end">
                  <span className="text-white/60 text-sm">Total Estimado</span>
                  <span className="text-3xl font-serif font-medium text-gold">{formatCurrency(total)}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-gold text-dark py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gold-lt transition-all shadow-lg shadow-gold/20"
              >
                Finalizar Compra <ArrowRight size={16} />
              </button>

              <p className="mt-6 text-[10px] text-white/30 text-center uppercase tracking-widest leading-relaxed">
                Pagamento de 50% na encomenda <br /> e 50% na entrega.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
