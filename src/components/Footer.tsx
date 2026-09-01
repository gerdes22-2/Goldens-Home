import React, { useState } from 'react';
import { PawPrint, MapPin, Mail, Heart, Award, ShieldCheck, Send, Instagram, Facebook, Youtube } from 'lucide-react';

interface FooterProps {
  setTab: (tab: string) => void;
}

export default function Footer({ setTab }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (tabId: string) => {
    setTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-navy-950 border-t-2 border-gold-500/20 text-gray-400">
      
      {/* BREEDER PLEDGE BANNER */}
      <div className="bg-navy-900/50 py-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <h4 className="font-black text-white text-xs uppercase tracking-widest">Certified Pedigree</h4>
              <p className="text-[11px] text-gray-500 mt-1">Direct AKC breeder transparency with verifiable 5-generation data.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 border-y md:border-y-0 md:border-x border-white/10 py-6 md:py-0 md:px-8">
            <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <h4 className="font-black text-white text-xs uppercase tracking-widest">Health Clearances</h4>
              <p className="text-[11px] text-gray-500 mt-1">OFA Excellent/Good joints, eyes, and cardiac certification compliance.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <h4 className="font-black text-white text-xs uppercase tracking-widest">Lifetime Rehoming</h4>
              <p className="text-[11px] text-gray-500 mt-1">We always receive our dogs back if your circumstances shift unexpectedly.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
          
          {/* COL 1: About & Newsletter */}
          <div className="md:col-span-12 lg:col-span-5 flex flex-col space-y-8">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleLinkClick('home')}>
              <img
                id="footer-logo-img"
                src="https://cdn.corenexis.com/f/9GnFhiW4aBT.png"
                alt="Golden Paws Home Logo"
                referrerPolicy="no-referrer"
                className="w-12 h-12 object-cover rounded-full border border-gold-500 shadow-lg"
              />
              <span className="text-2xl font-black text-white tracking-tight">
                Golden Paws <span className="text-gold-500 italic font-serif">Home</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              Specializing in champion-line, OFA health-certified Golden Retriever puppies. Our family breeding standards foster exceptional temperaments and radiant health on our 150-acre private family ranch.
            </p>
            
            <div className="space-y-4">
              <h4 className="text-white text-xs font-black uppercase tracking-widest">Join our Inner Circle</h4>
              <p className="text-xs text-gray-500">Receive priority alerts for upcoming litters and ranch updates.</p>
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="bg-white/5 border border-white/10 rounded-l-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold-500 w-full transition-all"
                  required
                />
                <button 
                  type="submit"
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 px-5 py-3 rounded-r-xl transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {subscribed && (
                <p className="text-[10px] font-mono text-gold-500 animate-pulse">Welcome to the Goldens family! Check your inbox soon.</p>
              )}
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* COL 2: Links */}
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="text-white text-xs font-black tracking-widest uppercase mb-6">Program</h3>
            <ul className="space-y-4 text-xs font-medium">
              <li><button onClick={() => handleLinkClick('about')} className="hover:text-gold-500 transition-colors">About Us</button></li>
              <li><button onClick={() => handleLinkClick('puppies')} className="hover:text-gold-500 transition-colors">Available Puppies</button></li>
              <li><button onClick={() => handleLinkClick('process')} className="hover:text-gold-500 transition-colors">Adoption Process</button></li>
              <li><button onClick={() => handleLinkClick('health')} className="hover:text-gold-500 transition-colors">Health Audit</button></li>
              <li><button onClick={() => handleLinkClick('waitlist')} className="hover:text-gold-500 transition-colors">Master Waitlist</button></li>
            </ul>
          </div>

          {/* COL 3: Links */}
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="text-white text-xs font-black tracking-widest uppercase mb-6">Resources</h3>
            <ul className="space-y-4 text-xs font-medium">
              <li><button onClick={() => handleLinkClick('resources')} className="hover:text-gold-500 transition-colors">Care Guides</button></li>
              <li><button onClick={() => handleLinkClick('faqs')} className="hover:text-gold-500 transition-colors">FAQs</button></li>
              <li><button onClick={() => handleLinkClick('reviews')} className="hover:text-gold-500 transition-colors">Testimonials</button></li>
              <li><button onClick={() => handleLinkClick('contact')} className="hover:text-gold-500 transition-colors">Contact Us</button></li>
              <li><button onClick={() => handleLinkClick('apply')} className="hover:text-gold-500 transition-colors">Apply Now</button></li>
            </ul>
          </div>

          {/* COL 4: Info */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="text-white text-xs font-black tracking-widest uppercase mb-6">Information</h3>
            <ul className="space-y-5 text-xs text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">Golden Paws Home<br />Private Family Ranch, USA</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <span>goldenpupshome22@gmail.com</span>
              </li>
            </ul>
            <div className="mt-8 p-4 bg-gold-400/5 border border-gold-500/10 rounded-2xl">
              <p className="text-[10px] text-gold-500 uppercase font-mono font-black mb-1">Status:</p>
              <div className="flex items-center text-white text-[10px] font-bold">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                ACCEPTING APPLICATIONS
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 space-y-4 sm:space-y-0 uppercase tracking-[0.2em] font-mono font-bold">
          <p>
            © {currentYear} Golden Paws Home. Crafted for Excellence
            <span 
              onClick={() => handleLinkClick('breeder-portal')} 
              className="cursor-pointer hover:text-gold-500 transition-colors select-none font-black text-xs inline-block ml-0.5 active:scale-95"
              title="Console"
            >
              .
            </span>
          </p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Genetic Guarantee</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
