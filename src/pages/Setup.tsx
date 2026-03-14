import React, { useState, useEffect } from 'react';
import { Settings, Database, Shield, CheckCircle2, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface ConfigStatus {
  supabaseUrl: boolean;
  supabaseServiceKey: boolean;
  jwtSecret: boolean;
  isConfigured: boolean;
}

export default function Setup() {
  const [status, setStatus] = useState<ConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/config/status');
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to check config status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="w-20 h-20 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Settings size={40} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Configuração do Sistema</h1>
          <p className="text-white/40 text-lg font-light max-w-xl mx-auto">
            Para que a <span className="text-gold font-medium">Luzes de Charme</span> funcione corretamente, é necessário configurar a ligação com o Supabase e as chaves de segurança.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Supabase URL', active: status?.supabaseUrl, icon: <Database size={20} /> },
              { label: 'Service Key', active: status?.supabaseServiceKey, icon: <Shield size={20} /> },
              { label: 'JWT Secret', active: status?.jwtSecret, icon: <CheckCircle2 size={20} /> }
            ].map((item, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${item.active ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/5 bg-white/2'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${item.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/20'}`}>
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-1">{item.label}</h3>
                <p className={`text-xs font-bold ${item.active ? 'text-emerald-500' : 'text-white/20'}`}>
                  {item.active ? 'CONFIGURADO' : 'PENDENTE'}
                </p>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-white/2 border border-white/5 rounded-3xl p-10">
            <div className="flex items-start gap-6 mb-10">
              <div className="w-12 h-12 bg-gold/10 text-gold rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Como configurar?</h2>
                <p className="text-white/40 text-sm leading-relaxed">
                  As chaves de segurança devem ser inseridas no menu de <strong>Settings &gt; Secrets</strong> do AI Studio. 
                  O sistema detetará as alterações automaticamente assim que forem guardadas.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { id: 'SUPABASE_URL', label: 'SUPABASE_URL', desc: 'O URL do seu projeto Supabase (ex: https://xyz.supabase.co)' },
                { id: 'SUPABASE_SERVICE_KEY', label: 'SUPABASE_SERVICE_KEY', desc: 'A sua service_role key do Supabase' },
                { id: 'JWT_SECRET', label: 'JWT_SECRET', desc: 'Uma chave aleatória para assinar os tokens (mín. 32 caracteres)' }
              ].map((field) => (
                <div key={field.id} className="group">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/60">{field.label}</label>
                    <button 
                      onClick={() => handleCopy(field.id, field.id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-gold hover:text-white transition-colors flex items-center gap-2"
                    >
                      {copied === field.id ? 'Copiado!' : <><Copy size={12} /> Copiar Nome</>}
                    </button>
                  </div>
                  <div className="p-4 bg-dark border border-white/10 rounded-xl text-sm font-mono text-white/40 group-hover:border-gold/30 transition-colors">
                    {field.desc}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full animate-pulse ${status?.isConfigured ? 'bg-emerald-500' : 'bg-gold'}`}></div>
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                  {status?.isConfigured ? 'Sistema Pronto' : 'A aguardar configuração...'}
                </span>
              </div>
              
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold hover:underline"
              >
                Abrir Supabase Dashboard <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {status?.isConfigured && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500 text-dark p-8 rounded-3xl text-center"
            >
              <h3 className="text-xl font-bold mb-2">Tudo pronto!</h3>
              <p className="text-dark/70 text-sm mb-6">O backend foi configurado com sucesso e a base de dados está ligada.</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-dark text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform"
              >
                Aceder à Loja
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
