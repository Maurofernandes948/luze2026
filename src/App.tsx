import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Setup from './pages/Setup';
import { STORE_NOTICE, STORE_NAME, INSTAGRAM_HANDLE, EMAIL_ADDRESS, WHATSAPP_DISPLAY, STORE_CITY } from './constants';
import { MapPin, Instagram, Mail } from 'lucide-react';
import WhatsAppIcon from './components/WhatsAppIcon';

function Footer() {
  const whatsappLink = (text: string) => `https://wa.me/244941540638?text=${encodeURIComponent(text)}`;

  return (
    <footer className="bg-dark pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gold text-dark flex items-center justify-center font-serif text-xl font-bold rounded-lg">{STORE_NAME[0]}</div>
              <span className="text-xl font-bold tracking-tight text-white">{STORE_NAME}</span>
            </div>
            <p className="text-white/40 text-sm font-light leading-relaxed mb-10">
              Moda premium com elegância, estilo e personalidade. Cada peça é escolhida com cuidado especialmente para si.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <WhatsAppIcon size={18} />, link: whatsappLink('Olá!') },
                { icon: <Instagram size={18} />, link: `https://instagram.com/${INSTAGRAM_HANDLE}` },
                { icon: <Mail size={18} />, link: `mailto:${EMAIL_ADDRESS}` }
              ].map((s, i) => (
                <a key={i} href={s.link} target="_blank" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-gold hover:text-gold transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-white/40 font-bold uppercase tracking-widest text-xs mb-8">Navegação</h5>
            <ul className="space-y-5">
              {['Início', 'Produtos', 'Pagamento', 'Portfólio', 'Contacto'].map((item) => (
                <li key={item}>
                  <a href={`/#${item.toLowerCase()}`} className="text-white/50 text-sm font-light hover:text-gold transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-white/40 font-bold uppercase tracking-widest text-xs mb-8">Categorias</h5>
            <ul className="space-y-5">
              {['Tênis', 'Roupas', 'Acessórios'].map((cat) => (
                <li key={cat}>
                  <a href="/#produtos" className="text-white/50 text-sm font-light hover:text-gold transition-colors">{cat}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-white/40 font-bold uppercase tracking-widest text-xs mb-8">Informações</h5>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-white/50 text-sm font-light">
                <MapPin size={18} className="text-gold shrink-0" /> {STORE_CITY}
              </li>
              <li className="flex items-center gap-4 text-white/50 text-sm font-light">
                <WhatsAppIcon size={18} className="text-gold shrink-0" /> {WHATSAPP_DISPLAY}
              </li>
              <li className="flex items-center gap-4 text-white/50 text-sm font-light">
                <Instagram size={18} className="text-gold shrink-0" /> @{INSTAGRAM_HANDLE}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
            © 2025 <strong className="text-gold">{STORE_NAME}</strong>. Todos os direitos reservados.
          </p>
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">Desenvolvido com ❤️ em {STORE_CITY}</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [isConfigured, setIsConfigured] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkConfig = async () => {
      try {
        const res = await fetch('/api/config/status');
        const data = await res.json();
        setIsConfigured(data.isConfigured);
      } catch (error) {
        setIsConfigured(false);
      }
    };
    checkConfig();
  }, []);

  if (isConfigured === null) {
    return <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col selection:bg-gold/30 selection:text-dark">
            {/* Top Bar */}
            <div className="bg-dark text-white py-2.5 px-6 text-center text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-bold z-[60] border-b border-white/5">
              <p>{STORE_NOTICE}</p>
            </div>

            {!isConfigured ? (
              <Routes>
                <Route path="*" element={<Setup />} />
              </Routes>
            ) : (
              <>
                <Header />

                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/setup" element={<Setup />} />
                  </Routes>
                </main>

                <Footer />

                {/* Floating WhatsApp Button */}
                <a 
                  href={`https://wa.me/244941540638?text=${encodeURIComponent('Olá! Vim pelo site e quero fazer uma encomenda.')}`}
                  target="_blank"
                  className="fixed bottom-10 right-10 z-50 w-20 h-20 bg-wa text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-500 group"
                >
                  <WhatsAppIcon size={36} />
                  <div className="absolute right-full mr-6 bg-dark text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Encomendar agora!
                  </div>
                </a>
              </>
            )}
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
