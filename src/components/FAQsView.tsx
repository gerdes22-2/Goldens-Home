import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, ChevronUp, Search, HelpCircle, MessageCircle, 
  ShieldCheck, Heart, DollarSign, Clipboard, Send, User, 
  Sparkles, Bot, Clock, AlertCircle, X, Check, FileText, ShieldAlert
} from 'lucide-react';
import { FAQS } from '../data';

export default function FAQsView() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Chat Simulation States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    sender: 'user' | 'breeder';
    text: string;
    time: string;
  }>>([
    {
      sender: 'breeder',
      text: "Hello! Welcome to our Golden Paws Breeder Concierge Support. How can I help you regarding our genetic lines, health clearances, or adoption mechanics today?",
      time: 'Just now'
    }
  ]);
  const [chatTyping, setChatTyping] = useState(false);

  // Interactive Scientific AI Counselor Simulator States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiIsTyping, setAiIsTyping] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [activeAiTab, setActiveAiTab] = useState<string | null>(null);

  const categories = ['all', 'Adoption', 'Health', 'Pricing', 'Puppy Care'];

  const filteredFAQs = FAQS.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (idx: number) => {
    setActiveFAQ(activeFAQ === idx ? null : idx);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Adoption': return <Clipboard className="w-4 h-4 text-navy-950" />;
      case 'Health': return <ShieldCheck className="w-4 h-4 text-green-600" />;
      case 'Pricing': return <DollarSign className="w-4 h-4 text-yellow-600" />;
      case 'Puppy Care': return <Heart className="w-4 h-4 text-red-500" />;
      default: return <HelpCircle className="w-4 h-4 text-stone-400" />;
    }
  };

  // Pre-configured advanced scientific prompts for the AI Breeder Advisor
  const scientificPrompts = [
    {
      id: 'ofa-hips',
      label: 'OFA Hip Heredity Genetics',
      query: 'OFA Hip Dysplasia heredity & selective screening mechanics',
      response: `🧬 BREEDER CLINICAL INSIGHT: OFA HIP HEREDITY MECHANICS
      
Hip Dysplasia is a polygenic trait influenced by both genetic markers and lifestyle factors during development. Our breeding program addresses this with extreme selectivity:

1. OFA Radiographic Evaluations: Both Sires and Dams are radiographed under anesthesia to inspect joint congruence, subluxation, and acetabular rim depth. We breed only "Excellent" or "Good" lines.
2. Pedigree Co-efficiency: We map 5-generation pedigree lines to ensure zero history of juvenile joint laxity.
3. DNA Biomarker Screening: We actively cross-reference with canine orthopaedic genome markers.
4. Nutritional Protocol: All Golden Paws puppies are raised on targeted Calcium-to-Phosphorus ratios to prevent growth acceleration spikes that stress growth plates.`
    },
    {
      id: 'ens-social',
      label: 'ENS Stimulation Science',
      query: 'Early Neurological Stimulation (ENS) schedule & scientific benefits',
      response: `🧠 CLINICAL RESEARCH: EARLY NEUROLOGICAL STIMULATION (ENS)
      
Developed by the U.S. Military canine program under the "Bio-Sensor" program, ENS subjects puppies to five mild thermal and tactile stressors from Days 3 to 16:

1. Tactile Stimulation: Tickling between toes with a sterile cotton swab (5s).
2. Head Erect position: Holding the puppy vertically upwards relative to gravity (5s).
3. Head Down position: Suspending head downwards carefully (5s).
4. Supine Position: Laying the puppy flat on its back in our palms (5s).
5. Thermal Stress: Placing the puppy on a cooled sterile towel (5s).

SCIENTIFIC BENEFITS OBSERVED:
• Superior cardiovascular performance & slower resting heart rates.
• Stronger adrenal gland responses & resistance to adult anxiety/phobias.
• Enhanced physiological immunity to pathogens and chronic stress.`
    },
    {
      id: 'microchip',
      label: 'Microchip & Theft Registry',
      query: 'Microchip recovery network & registry safety metrics',
      response: `🛰️ REGISTRY SECURITY: MICROCHIP RECOVERY INFRASTRUCTURE
      
Our puppies receive an ISO-compliant 134.2 kHz 15-digit sub-dermal microchip implanted under the scapula. Here is our security protocol:

1. Lifetime Auto-Enrollment: We cover the initial registration fees and enroll the puppy with our permanent Breeder Identifier linked alongside your owner account.
2. Dual-Recovery Ring: If the puppy is ever scanned at a hospital or shelter, the national registry triggers a simultaneous SMS alerts to both the Breeder Headquarters and the primary Adopter's mobile.
3. Absolute Protection: Our microchips never require battery power and last over 25 years. This provides a bulletproof shield against loss, theft, or catastrophic displacement.`
    },
    {
      id: 'flight-nanny',
      label: 'Flight Nanny Cabin Transit',
      query: 'Flight nanny cabin logistics & cross-state transition safety',
      response: `✈️ LOGISTICS BLUEPRINT: CABIN TRANSIT & FLIGHT NANNIES
      
For out-of-state families, we reject standard commercial cargo holds entirely. Our flight nanny service operates under strict cabin parameters:

1. FAA-Approved Soft Cabin Carriers: The puppy remains under-seat in the passenger cabin at all times, never leaving the nanny's sight.
2. Sensory Stress Management: We pack lavender aromatherapy blankets, hydration syringes (pure coconut water/glucose), and chew-toys to manage cabin pressure.
3. Real-Time Tracking: You receive live text messages, airport photo check-ins, and GPS coordinates during transfers.
4. Airport Transfer Hand-off: We meet you in person at the passenger terminal baggage claim or designated security exit with original paper contracts and certified medical records.`
    }
  ];

  const handleScientificQuery = (id: string, query: string, response: string) => {
    setActiveAiTab(id);
    setAiPrompt(query);
    setAiIsTyping(true);
    setAiResponse(null);

    setTimeout(() => {
      setAiIsTyping(false);
      setAiResponse(response);
    }, 1200);
  };

  const handleCustomAiQuery = (e: FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiIsTyping(true);
    setAiResponse(null);
    setActiveAiTab(null);

    setTimeout(() => {
      setAiIsTyping(false);
      const query = aiPrompt.toLowerCase();
      let reply = '';

      if (query.includes('hip') || query.includes('joint') || query.includes('dysplasia') || query.includes('elbow')) {
        reply = `🧬 REPUTABLE GENETIC DISCLOSURE:
Our breeding parent stock is certified by the Orthopedic Foundation for Animals (OFA). We perform deep radiographic checks on hips/elbows. Puppies undergo sensory joint evaluations before leaving. We guarantee hip soundness in our signed 1-Year Contract.`;
      } else if (query.includes('diet') || query.includes('food') || query.includes('feed') || query.includes('nutrition')) {
        reply = `🍖 VETERINARY NUTRITION GUIDE:
We feed our puppies high-grade Royal Canin Large Breed Puppy kibbles to promote steady skeletal growth. We provide a starter 3lb bag of food, a feeding clock template, and lifetime nutrition consulting with every Golden Paws companion.`;
      } else if (query.includes('ship') || query.includes('delivery') || query.includes('travel') || query.includes('state') || query.includes('nanny')) {
        reply = `✈️ BIOMEDICAL TRANSIT STANDARDS:
We transport puppies inside passenger cabins with accredited Flight Nannies. Puppies are kept under stress-free conditions with real-time text/photo updates. Delivery to your nearest airport is coordinated seamlessly.`;
      } else if (query.includes('insurance') || query.includes('health') || query.includes('guarantee') || query.includes('contract')) {
        reply = `📜 LEGAL WARRANTY SUMMARY:
Every golden puppy includes a signed, legally-binding contract with a 1-Year Genetic Health Guarantee, complete vaccine history sheets, microchipping, and vet signature clearances. We also recommend enrolling in 30 days of complimentary medical insurance.`;
      } else if (query.includes('waitlist') || query.includes('apply') || query.includes('deposit') || query.includes('price')) {
        reply = `💳 ADOPTION TRANSACTION STANDARDS:
Our adoption price is a flat $850. The application process is transparent: submit the online form, pass the basic screening, and secure your spot on the Master Waitlist. Selections are made sequentially as litters are logged.`;
      } else {
        reply = `🩺 BREEDER CLINICAL ADVISORY:
Thank you for your inquiry: "${aiPrompt}". Our clinical breeding directors screen for 230+ DNA biomarkers, maintain strict biosafety quarantines, and socialize puppies from Day 3. For custom inquiries, click 'CHAT WITH OUR BREEDERS' below to speak directly with an expert.`;
      }

      setAiResponse(reply);
    }, 1000);
  };

  const handleSendChatMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatHistory(prev => [...prev, {
      sender: 'user',
      text: userMsg,
      time: timestamp
    }]);

    setChatMessage('');
    setChatTyping(true);

    // Simulate highly realistic breeder response
    setTimeout(() => {
      setChatTyping(false);
      let replyText = '';
      const lower = userMsg.toLowerCase();

      if (lower.includes('available') || lower.includes('puppy') || lower.includes('buy') || lower.includes('have')) {
        replyText = "We currently have beautiful available puppies in our Pink Girl, Blue Boy, and Yellow Girl litters! You can explore them on our 'Available Puppies' tab and immediately fill out the application to reserve.";
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
        replyText = "All our purebred puppies are priced at a transparent rate of $850. This covers complete vaccinations, OFA pedigree records, microchipping, and our signed health guarantee contract.";
      } else if (lower.includes('visit') || lower.includes('address') || lower.includes('where')) {
        replyText = "Our beautiful acreage is located in our private Valley Ranch. For biosafety and puppy quarantine, we schedule physical visits exclusively for approved adopters. We are happy to coordinate a video call too!";
      } else {
        replyText = "Thank you for reaching out! A breeding director has received your message and is reviewing your request. We will coordinate details with you shortly. You can also proceed by completing our Adoption Application.";
      }

      setChatHistory(prev => [...prev, {
        sender: 'breeder',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  // SEO Schema Markup for FAQs Page
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="bg-[#fcfaf7] min-h-screen pt-32 pb-24 text-navy-950">
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER HERO */}
        <section className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-yellow-600 tracking-widest uppercase mb-3 block">
            ADOPTER EDUCATION PORTAL
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-navy-950 tracking-tight leading-none">
            Frequently Asked <span className="text-gold-500 italic font-serif">Questions</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4 leading-relaxed">
            Get instant clinical, medical, and logistical answers regarding our high-integrity breeding programs and post-adoption lifetime guidelines.
          </p>
        </section>

        {/* SCIENTIFIC AI COUNSELOR SIMULATOR */}
        <section className="mb-16">
          <div className="bg-navy-950 text-white rounded-[2.5rem] border border-white/10 shadow-2xl p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Selector Prompts */}
              <div className="lg:col-span-5 text-left space-y-6">
                <div>
                  <div className="inline-flex items-center space-x-1.5 bg-gold-500/10 border border-gold-500/20 px-3 py-1 rounded-full text-gold-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-spin" />
                    <span>Scientific Advisory Engine</span>
                  </div>
                  <h3 className="text-2xl font-black text-white leading-tight">Breeder Genetic & Medical Advisor</h3>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                    Select a scientific topic below to examine our clinical approach, genetic screening databases, or neurological conditioning procedures.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {scientificPrompts.map((p) => {
                    const isActive = activeAiTab === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleScientificQuery(p.id, p.query, p.response)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between font-bold ${
                          isActive
                            ? 'bg-gold-500 text-navy-950 border-gold-400 shadow-md scale-[1.02]'
                            : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{p.label}</span>
                        <Bot className={`w-4 h-4 shrink-0 ml-2 ${isActive ? 'text-navy-950' : 'text-stone-400'}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Manual Typing Form */}
                <form onSubmit={handleCustomAiQuery} className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask customized medical/diet questions..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="flex-grow p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-gold-500 focus:bg-white/10"
                    />
                    <button
                      type="submit"
                      className="px-4 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow"
                    >
                      ASK
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Dynamic Simulated Response Terminal */}
              <div className="lg:col-span-7 h-full flex flex-col">
                <div className="bg-navy-900 border border-white/10 rounded-3xl p-6 flex-grow flex flex-col justify-between min-h-[300px] text-left relative">
                  
                  {/* Top terminal bar */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider">
                      CLINICAL RESPONSE CONSOLE v1.2
                    </span>
                  </div>

                  <div className="flex-grow flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {aiIsTyping ? (
                        <motion.div
                          key="typing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center space-y-3 py-12"
                        >
                          <Bot className="w-10 h-10 text-gold-500 animate-bounce" />
                          <div className="flex space-x-1.5 items-center">
                            <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                            <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                          </div>
                          <span className="text-[11px] font-mono text-stone-400 tracking-widest font-black uppercase">
                            Querying Genetic Database...
                          </span>
                        </motion.div>
                      ) : aiResponse ? (
                        <motion.div
                          key="response"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <div className="text-xs sm:text-sm text-stone-200 leading-relaxed font-mono whitespace-pre-line bg-navy-950/40 p-5 rounded-2xl border border-white/5">
                            {aiResponse}
                          </div>
                          <div className="flex items-center space-x-2 text-[10px] font-mono text-stone-400">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span>Verified Scientific Breeder Protocol. Golden Paws Home standards applied.</span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12 space-y-3"
                        >
                          <Bot className="w-12 h-12 text-stone-600 mx-auto" />
                          <h4 className="text-sm font-black text-white">Console Awaiting Directives</h4>
                          <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                            Select one of the genetic topics on the left, or input a custom keyword like "joints", "waitlist", or "vaccines" to query our scientific databases.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ACCORDION FAQ PORTAL */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Category tabs - Left Sidebar */}
            <div className="lg:col-span-3 text-left space-y-2 lg:sticky lg:top-28">
              <h3 className="text-xs font-mono font-black text-stone-400 uppercase tracking-widest pl-3 mb-4">
                Knowledge Domains
              </h3>
              {categories.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setActiveFAQ(null); }}
                    className={`w-full px-5 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl border transition-all text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-navy-950 text-white border-gold-500 shadow-md font-black'
                        : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat === 'all' ? 'View All Domains' : cat}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isSelected ? '-rotate-90 text-gold-500' : 'text-stone-300'}`} />
                  </button>
                );
              })}
            </div>

            {/* Accordions - Right Main */}
            <div className="lg:col-span-9 text-left space-y-4">
              
              {/* Search Toolbar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter questions by keyword (e.g. 'OFA', 'diet', 'shipping')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-gold-500 focus:bg-white transition-all text-navy-950"
                />
              </div>

              {filteredFAQs.map((faq, idx) => {
                const isOpen = activeFAQ === idx;
                return (
                  <div
                    key={idx}
                    className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                      isOpen 
                        ? 'border-gold-500 shadow-md ring-1 ring-gold-500/10' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFAQ(idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-navy-950 font-black text-left focus:outline-none"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2.5 rounded-xl transition-colors ${isOpen ? 'bg-gold-500/10 text-gold-600' : 'bg-stone-50'}`}>
                          {getCategoryIcon(faq.category)}
                        </div>
                        <span className="text-xs sm:text-sm pr-4 leading-tight tracking-tight uppercase font-mono">{faq.question}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-stone-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gold-500' : ''}`} />
                    </button>

                    {/* Framer motion transition on collapse */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-6 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100/60 pt-4 pl-16">
                            <p className="bg-stone-50/50 p-4 rounded-xl border border-stone-100 text-stone-600 leading-relaxed font-sans font-medium">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })}

              {filteredFAQs.length === 0 && (
                <div className="py-20 text-center space-y-4 bg-white border border-stone-200 rounded-3xl">
                  <div className="inline-flex p-4 bg-stone-50 rounded-full text-stone-300">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-navy-950">No questions match your query</h3>
                  <p className="text-xs text-stone-400">Try broad terms like "health", "waitlist", "vaccines" or clear filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="px-4 py-2.5 bg-navy-950 text-white font-mono font-black text-xs uppercase tracking-widest rounded-xl"
                  >
                    RESET SEARCH FILTER
                  </button>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* SUPPORT INTERACTIVE CHAT FOOTER */}
        <section className="max-w-4xl mx-auto mt-24">
          <div className="bg-navy-950 p-10 sm:p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden text-center border border-white/5">
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <MessageCircle className="w-12 h-12 text-gold-500 mx-auto" />
              <h2 className="text-3xl font-black tracking-tight leading-none">Still have specific questions?</h2>
              <p className="text-stone-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                Our Breeder Concierge team is standing by to assist with lineage certifications, shipping pathways, and dynamic parent temperament logs.
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={() => setChatOpen(true)}
                  className="px-8 py-4 bg-gold-500 text-navy-950 hover:bg-gold-400 font-black text-xs rounded-2xl shadow-xl transition-all tracking-widest uppercase"
                >
                  CHAT WITH OUR BREEDERS (LIVE SIMULATOR)
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* CHAT CONSOLE SIMULATOR DRAWER (FLOATING BOTTOM RIGHT) */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[160] w-[350px] sm:w-[400px] h-[500px] bg-white border-2 border-gold-500 rounded-[2rem] shadow-2xl flex flex-col justify-between overflow-hidden text-left"
          >
            {/* Header */}
            <div className="bg-navy-950 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-gold-500 text-navy-950 rounded-xl flex items-center justify-center font-black text-xs font-mono">
                    GP
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-navy-950 rounded-full" />
                </div>
                <div>
                  <h4 className="font-black text-xs">Breeder Concierge</h4>
                  <span className="text-[9px] font-mono text-gold-400 font-bold uppercase tracking-wider">ACTIVE SUPPORT SIMULATOR</span>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Feed */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3.5 bg-stone-50/50">
              {chatHistory.map((msg, i) => {
                const isBreeder = msg.sender === 'breeder';
                return (
                  <div 
                    key={i} 
                    className={`flex items-start gap-2.5 max-w-[85%] ${isBreeder ? '' : 'ml-auto flex-row-reverse'}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-mono font-black ${
                      isBreeder ? 'bg-navy-950 text-gold-500' : 'bg-gold-500 text-navy-950'
                    }`}>
                      {isBreeder ? 'B' : 'U'}
                    </div>
                    <div className={`rounded-2xl p-3 text-xs leading-relaxed ${
                      isBreeder ? 'bg-white border border-stone-200 text-navy-950' : 'bg-navy-950 text-white'
                    }`}>
                      <p className="font-medium">{msg.text}</p>
                      <span className="block text-[8px] text-stone-400 mt-1 font-mono text-right">{msg.time}</span>
                    </div>
                  </div>
                );
              })}

              {chatTyping && (
                <div className="flex items-start gap-2.5 max-w-[80%]">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-mono font-black bg-navy-950 text-gold-500">
                    B
                  </div>
                  <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3 text-xs flex space-x-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-stone-100 flex gap-1.5 overflow-x-auto bg-stone-50 select-none">
              <button 
                onClick={() => setChatMessage("Are puppies available?")}
                className="whitespace-nowrap px-2.5 py-1 bg-white border border-stone-200 hover:border-gold-500 rounded-full text-[9px] font-mono font-bold text-stone-600 hover:text-navy-950 transition-all shrink-0"
              >
                Available Pups?
              </button>
              <button 
                onClick={() => setChatMessage("What is included in the $850 price?")}
                className="whitespace-nowrap px-2.5 py-1 bg-white border border-stone-200 hover:border-gold-500 rounded-full text-[9px] font-mono font-bold text-stone-600 hover:text-navy-950 transition-all shrink-0"
              >
                What is included?
              </button>
              <button 
                onClick={() => setChatMessage("Can I visit your ranch?")}
                className="whitespace-nowrap px-2.5 py-1 bg-white border border-stone-200 hover:border-gold-500 rounded-full text-[9px] font-mono font-bold text-stone-600 hover:text-navy-950 transition-all shrink-0"
              >
                Can I visit ranch?
              </button>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-stone-150 flex gap-2">
              <input
                type="text"
                placeholder="Ask about deposits, travel, lines..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-grow p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-navy-950 placeholder-stone-400 focus:outline-none focus:border-gold-500 focus:bg-white"
              />
              <button
                type="submit"
                className="p-3 bg-gold-500 text-navy-950 hover:bg-gold-400 rounded-xl transition-all shadow flex items-center justify-center shrink-0"
                aria-label="Send chat"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
