import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Phone, ShieldCheck } from 'lucide-react';

interface LiveConsoleProps {
  setTab?: (tab: string) => void;
}

export default function LiveConsole({ setTab }: LiveConsoleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'breeder', text: string }[]>([
    { role: 'breeder', text: 'Hello! I am Katrina Mahra, the head breeder here at Golden Paws Home. How can I help you find your perfect Golden Retriever companion today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const updatedMessages = [...messages, { role: 'user' as const, text: userText }];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'breeder',
        text: data.response || "I appreciate your patience. Could you expand on that question for me?"
      }]);
    } catch (err) {
      console.error("Katrina Mahra Chat error:", err);
      setMessages(prev => [...prev, {
        role: 'breeder',
        text: "I'm currently looking after our gorgeous Goldens out on our private ranch, but I would love to answer your questions! Please submit an application or let me know a good phone number and time so we can chat directly."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePresetCallback = () => {
    if (isTyping) return;
    
    // Add user message asking for callback
    const text = "I'd like to request a callback about available puppies.";
    const updatedMessages = [...messages, { role: 'user' as const, text }];
    setMessages(updatedMessages);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'breeder',
        text: "I would be happy to call you for a friendly, informative 1-on-1 chat! Please let me know your preferred phone number and the best window of time to call you. I can tell you all about our puppies, parents, or upcoming ranch litters!"
      }]);
    }, 1200);
  };

  const handleViewDossier = () => {
    if (setTab) {
      setTab('health');
      setIsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[60] p-4 bg-navy-950 text-white hover:text-gold-400 rounded-2xl shadow-2xl border-2 border-gold-500/40 hover:border-gold-500 flex items-center space-x-2 font-black text-xs uppercase tracking-widest transition-all"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-gold-500" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-navy-950 animate-pulse"></span>
        </div>
        <span className="hidden md:inline">Consult Head Breeder</span>
      </motion.button>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 right-8 z-[70] w-[350px] md:w-[420px] bg-white rounded-3xl shadow-2xl border-2 border-gold-500/20 overflow-hidden flex flex-col max-h-[550px]"
          >
            {/* Header */}
            <div className="bg-navy-950 p-6 text-white flex items-center justify-between border-b border-gold-500/10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src="/images/golden_paws_logo_1783021185349.jpg" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold-500" 
                    alt="Katrina Mahra" 
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-navy-950 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight flex items-center">
                    Katrina Mahra
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-500 ml-1.5" />
                  </h4>
                  <p className="text-[9px] text-gold-500 font-mono font-bold uppercase tracking-widest mt-0.5">Head Breeder • Golden Paws</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#fcfaf7] to-white h-[320px]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-navy-900 text-white rounded-tr-none border border-navy-800' 
                      : 'bg-white text-navy-950 border border-gold-500/10 rounded-tl-none font-medium'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl border border-gold-500/10 flex space-x-1.5 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Actions Panel */}
            <div className="px-6 py-2 bg-gold-50/40 border-t border-gold-500/10 flex items-center justify-around">
              <button 
                onClick={handlePresetCallback}
                type="button" 
                className="text-[9px] font-mono font-black text-navy-950 hover:text-gold-600 flex items-center uppercase tracking-widest transition-colors py-1 px-2 hover:bg-gold-500/10 rounded-lg"
              >
                <Phone className="w-3 h-3 mr-1 text-gold-500" /> Request Callback
              </button>
              <div className="w-px h-3 bg-gold-500/20"></div>
              <button 
                onClick={handleViewDossier}
                type="button" 
                className="text-[9px] font-mono font-black text-navy-950 hover:text-gold-600 flex items-center uppercase tracking-widest transition-colors py-1 px-2 hover:bg-gold-500/10 rounded-lg"
              >
                <Sparkles className="w-3 h-3 mr-1 text-gold-500 animate-pulse" /> View Health Clearances
              </button>
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-gold-500/10 bg-white">
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Katrina about available puppies, delivery, or breeding..." 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold-500 focus:bg-white transition-all font-medium text-navy-950"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-3 bg-gold-500 text-navy-950 rounded-xl hover:bg-gold-400 disabled:opacity-50 transition-all active:scale-95 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
