import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { CheckCircle2, MessageCircle, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import { formatCurrency, WHATSAPP_NUMBER } from '../constants';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total,
          items: cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price }))
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        const orderData = await res.json();
        
        // Prepare WhatsApp message
        const itemsList = cart.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
        const message = `Olá! Acabei de fazer o pedido #${orderData.id} no site.\n\nItens:\n${itemsList}\n\nTotal: ${formatCurrency(total)}\n\nAguardo instruções para o pagamento dos 50%.`;
        
        setTimeout(() => {
          window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
          clearCart();
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-serif font-medium text-white mb-4">Pedido Confirmado!</h2>
          <p className="text-white/40 mb-10">O seu pedido foi registado com sucesso. Estamos a redirecioná-lo para o WhatsApp para finalizar o pagamento.</p>
          <div className="flex items-center justify-center gap-3 text-gold font-bold uppercase tracking-[0.3em] text-[10px]">
            <div className="w-2 h-2 bg-gold rounded-full animate-ping" />
            A abrir WhatsApp...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-6 pt-32">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif font-medium text-dark mb-12">Finalizar Pedido</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-10 rounded-[2.5rem] border border-dark/5 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-gold/10 text-gold rounded-xl flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <h3 className="text-xl font-serif font-medium text-dark">Entrega ao Domicílio</h3>
              </div>
              <p className="text-dark/50 text-sm leading-relaxed mb-6">
                As entregas são feitas em toda a cidade de Luanda. O custo de entrega será calculado e informado via WhatsApp após a confirmação do pedido.
              </p>
              <div className="p-4 bg-cream-2 rounded-2xl border border-dark/5 text-dark/60 text-xs font-medium">
                📍 Luanda, Angola
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] border border-dark/5 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-gold/10 text-gold rounded-xl flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <h3 className="text-xl font-serif font-medium text-dark">Método de Pagamento</h3>
              </div>
              <div className="space-y-4">
                <div className="p-6 border-2 border-gold bg-gold/5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold text-dark rounded-full flex items-center justify-center font-bold">50/50</div>
                    <div>
                      <p className="font-bold text-dark">Modelo 50% / 50%</p>
                      <p className="text-xs text-dark/40">Metade agora, metade na entrega</p>
                    </div>
                  </div>
                  <CheckCircle2 className="text-gold" size={24} />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-dark/30 font-bold text-center px-10">
                  Aceitamos Transferência, Multicaixa Express e Dinheiro na entrega.
                </p>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-dark text-white p-10 rounded-[2.5rem] shadow-2xl sticky top-32">
              <h3 className="text-xl font-serif font-medium mb-8">O Seu Pedido</h3>
              
              <div className="space-y-4 mb-8 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white/60">{item.name} <span className="text-gold">x{item.quantity}</span></span>
                    <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/10 my-6" />

              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-white/40 text-sm">
                  <span>Total do Pedido</span>
                  <span className="text-xl font-serif font-medium text-white">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-gold font-bold text-xs uppercase tracking-widest pt-2">
                  <span>Sinal (50%)</span>
                  <span>{formatCurrency(total / 2)}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full bg-gold text-dark py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gold-lt transition-all shadow-lg shadow-gold/20 disabled:opacity-50"
              >
                {isSubmitting ? 'A processar...' : 'Confirmar Pedido'} <MessageCircle size={16} />
              </button>

              <div className="mt-8 flex items-center justify-center gap-2 text-white/30 text-[10px] uppercase tracking-widest font-bold">
                <ShieldCheck size={14} /> Compra 100% Segura
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
