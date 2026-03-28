import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { STORE_NAME, STORE_SLOGAN, WHATSAPP_NUMBER } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: 'Início', path: '/' },
    { label: 'Produtos', path: '/#produtos' },
    { label: 'Pagamento', path: '/#pagamento' },
    { label: 'Portfólio', path: '/#portfolio' },
    { label: 'Contacto', path: '/#contacto' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-dark/90 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <img 
            src="https://i.imgur.com/an34kDV.png" 
            alt={STORE_NAME}
            referrerPolicy="no-referrer"
            className={`object-contain transition-all ${scrolled ? 'h-8' : 'h-10 sm:h-12'}`}
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.path.startsWith('/#') ? (
                <a 
                  href={item.path}
                  className="text-xs uppercase tracking-widest font-semibold text-white/80 hover:text-gold transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link 
                  to={item.path}
                  className="text-xs uppercase tracking-widest font-semibold text-white/80 hover:text-gold transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
          
          <div className="h-4 w-px bg-white/10 mx-2" />

          <Link to="/cart" className="relative p-2 text-white hover:text-gold transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' && (
                <Link to="/admin" className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-white transition-colors">
                  Admin
                </Link>
              )}
              <button onClick={logout} className="p-2 text-white/60 hover:text-white transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="p-2 text-white/80 hover:text-gold transition-colors">
              <User size={20} />
            </Link>
          )}

          <a 
            href={whatsappLink('Olá!')}
            target="_blank"
            className="bg-wa hover:bg-wa-dk text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-wa/20 flex items-center gap-2"
          >
            <WhatsAppIcon size={14} /> WhatsApp
          </a>
        </ul>

        <div className="flex items-center gap-4 lg:hidden">
          <Link to="/cart" className="relative p-2 text-white">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-dark-2 border-b border-white/10 overflow-hidden lg:hidden"
          >
            <ul className="flex flex-col p-6 gap-4">
              {navItems.map((item) => (
                <li key={item.label}>
                  {item.path.startsWith('/#') ? (
                    <a 
                      href={item.path}
                      className="text-sm uppercase tracking-widest font-bold text-white block py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link 
                      to={item.path}
                      className="text-sm uppercase tracking-widest font-bold text-white block py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <div className="h-px bg-white/10 my-2" />
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <li>
                      <Link to="/admin" className="text-sm uppercase tracking-widest font-bold text-gold block py-2" onClick={() => setIsMenuOpen(false)}>
                        Painel Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-sm uppercase tracking-widest font-bold text-white/60 block py-2">
                      Sair
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className="text-sm uppercase tracking-widest font-bold text-white block py-2" onClick={() => setIsMenuOpen(false)}>
                    Entrar / Registar
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
