import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PawPrint, Menu, X, Heart, ShieldCheck, Mail, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export default function Header({ currentTab, setTab }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNav = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'Experience' },
    { id: 'parents', label: 'Breeder Lines' },
    { id: 'puppies', label: 'Available Puppies' },
  ];

  const secondaryNav = [
    { id: 'process', label: 'Process' },
    { id: 'matcher', label: 'Match Tool' },
    { id: 'health', label: 'Health Audit' },
    { id: 'journal', label: 'Journal' },
    { id: 'resources', label: 'Resources' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const handleNavClick = (tabId: string) => {
    setTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: scrolled ? 'smooth' : 'auto' });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
      
      {/* TOP ANNOUNCEMENT BAR */}
      <div className={`hidden md:flex bg-navy-950/80 backdrop-blur-md text-white/50 text-[10px] font-mono font-black uppercase tracking-[0.2em] py-2.5 transition-transform duration-500 pointer-events-auto border-b border-white/5 ${scrolled ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="max-w-7xl mx-auto px-8 w-full flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center"><Mail className="w-3 h-3 mr-2 text-gold-500" /> goldenpupshome22@gmail.com</span>
          </div>
          <p className="animate-pulse text-gold-500">NOW ACCEPTING APPLICATIONS FOR WINTER 2026</p>
        </div>
      </div>

      <div className={`transition-all duration-500 pointer-events-auto ${scrolled ? 'p-4' : 'pt-2 px-8 pb-4'}`}>
        <div className={`mx-auto max-w-7xl transition-all duration-500 ${scrolled ? 'bg-navy-900/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 px-8 py-3' : 'bg-transparent py-4'}`}>
          <div className="flex items-center justify-between">
            
            {/* LOGO */}
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gold-400 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity"></div>
                <img
                  id="header-logo-img"
                  src="/images/golden_paws_logo_1783021185349.jpg"
                  alt="Golden Paws Home Logo"
                  referrerPolicy="no-referrer"
                  className="relative w-12 h-12 object-cover rounded-full border-2 border-gold-500 shadow-xl"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black text-white leading-none tracking-tight">
                  Golden Paws <span className="text-gold-500 italic font-serif pl-0.5">Home</span>
                </span>
                <div className="flex items-center space-x-1 mt-1">
                  <ShieldCheck className="w-3 h-3 text-gold-500" />
                  <span className="font-mono text-[9px] text-gold-500 tracking-[0.2em] uppercase font-black">
                    Registry Breeder
                  </span>
                </div>
              </div>
            </div>

            {/* NAVIGATION MAP */}
            <nav className="hidden lg:flex items-center space-x-1">
              {[...mainNav, ...secondaryNav].map((link) => {
                const isActive = currentTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                      isActive
                        ? 'text-gold-500 bg-white/5'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div 
                        layoutId="navUnderline"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-gold-500 rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* ACTION CTAs */}
            <div className="hidden sm:flex items-center space-x-4">
              <button
                onClick={() => handleNavClick('apply')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all duration-300 transform active:scale-95 ${
                  currentTab === 'apply'
                    ? 'bg-gold-500 text-navy-950 shadow-gold-500/20'
                    : 'bg-white text-navy-950 hover:bg-gold-500'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Reserve Now</span>
              </button>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <div className="lg:hidden flex items-center space-x-4">
              <button
                onClick={() => handleNavClick('apply')}
                className="p-3 bg-gold-500 text-navy-950 rounded-2xl"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden p-4 pt-0 pointer-events-auto"
          >
            <div className="bg-navy-900 rounded-[2.5rem] border border-white/10 p-8 shadow-2xl space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[...mainNav, ...secondaryNav].map((link) => {
                  const isActive = currentTab === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-left ${
                        isActive
                          ? 'bg-gold-500 text-navy-950'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handleNavClick('apply')}
                className="w-full py-5 bg-white text-navy-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em]"
              >
                Start Adoption Application
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
