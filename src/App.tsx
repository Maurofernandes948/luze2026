import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { STORE_NOTICE, STORE_NAME, INSTAGRAM_HANDLE, EMAIL_ADDRESS, WHATSAPP_DISPLAY, STORE_CITY, WHATSAPP_NUMBER } from './constants';
import { MapPin, Instagram, Mail } from 'lucide-react';
import WhatsAppIcon from './components/WhatsAppIcon';

function Footer() {
  const whatsappLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  return (
    <footer className="bg-dark pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <img 
                src="https://i.imgur.com/an34kDV.png" 
                alt={STORE_NAME}
                referrerPolicy="no-referrer"
                className="h-12 object-contain"
              />
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
              {[
                { label: 'Início', id: 'inicio' },
                { label: 'Produtos', id: 'produtos' },
                { label: 'Pagamento', id: 'pagamento' },
                { label: 'Portfólio', id: 'portfolio' },
                { label: 'Contacto', id: 'contacto' }
              ].map((item) => (
                <li key={item.label}>
                  <a href={`/#${item.id}`} className="text-white/50 text-sm font-light hover:text-gold transition-colors">{item.label}</a>
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

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="min-h-screen flex flex-col selection:bg-gold/30 selection:text-dark">
      {!isAdminPage && (
        <>
          {/* Top Bar */}
          <div className="bg-dark text-white py-2.5 px-6 text-center text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-bold z-[60] border-b border-white/5">
            <p>{STORE_NOTICE}</p>
          </div>
          <Header />
        </>
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      {!isAdminPage && (
        <>
          <Footer />
          {/* Floating WhatsApp Button */}
          <a 
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Vim pelo site e quero fazer uma encomenda.')}`}
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
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
