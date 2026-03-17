import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AuthService } from '../services/auth.service';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await AuthService.resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao enviar o email de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-6 pt-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-dark-2 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif font-medium text-white mb-4">Email Enviado</h2>
          <p className="text-white/40 text-sm mb-10">
            Enviámos as instruções de recuperação para <strong>{email}</strong>. Por favor, verifique a sua caixa de entrada.
          </p>
          <Link 
            to="/login"
            className="inline-block text-gold font-bold uppercase tracking-widest text-xs hover:underline"
          >
            Voltar ao Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6 pt-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-dark-2 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-medium text-white mb-2">Recuperar Senha</h2>
          <p className="text-white/40 text-sm">Introduza o seu email para receber um link de recuperação</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-bold uppercase tracking-widest mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-4">Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-3 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:border-gold outline-none transition-all"
                placeholder="exemplo@email.com"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-dark py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gold-lt transition-all shadow-lg shadow-gold/20 disabled:opacity-50"
          >
            {loading ? 'A enviar...' : 'Enviar Link'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-10 text-center">
          <Link to="/login" className="text-white/40 text-sm hover:text-gold transition-colors">
            Voltar ao Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
