import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Clock, ChevronRight, Search, PlayCircle, 
  Lightbulb, HeartPulse, GraduationCap, ArrowRight, Sparkles, Check, Bookmark, Calendar, X, Printer, Sparkle, ClipboardList
} from 'lucide-react';
import { CARE_RESOURCES } from '../data';
import { EditableImage } from './ImageEditContext';

export default function ResourcesView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingDossier, setReadingDossier] = useState<any | null>(null);
  const [completedDossiers, setCompletedDossiers] = useState<string[]>([]);
  
  // Tasks for preparing the home based on resources
  const [prepChecklists, setPrepChecklists] = useState<Record<string, Record<string, boolean>>>({
    res1: {
      'Purchase 36" or 42" Wire Crate with dividers': true,
      'Get pre-washed dark linen sheets for denning effect': false,
      'Acquire stainless steel weighted food bowls': false,
      'Pre-register with local veterinary clinic': false,
    },
    res2: {
      'Locate Royal Canin Medium/Large Puppy kibble': false,
      'Set up strict 3-meals-a-day clock scheduling': false,
      'Secure premium high-protein freeze-dried training treats': false,
      'Set up clean filtered water dispenser': true,
    },
    res3: {
      'Prepare Mommy-scented sensory blanket': false,
      'Configure crate partition size for puppy safety': false,
      'Prepare puzzle toy/KONG stuffing ingredients': false,
      'Register for early obedience classes': false,
    }
  });

  const categories = ['all', 'New Puppy Tips', 'Health & Wellness', 'Training', 'Nutrition'];

  const filteredResources = CARE_RESOURCES.filter(res => {
    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleChecklistItem = (dossierId: string, item: string) => {
    setPrepChecklists(prev => {
      const currentDossierList = prev[dossierId] || {};
      return {
        ...prev,
        [dossierId]: {
          ...currentDossierList,
          [item]: !currentDossierList[item]
        }
      };
    });
  };

  const handleToggleCompleted = (id: string) => {
    setCompletedDossiers(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Helper to get preparation completion rate
  const getPrepPercentage = (dossierId: string) => {
    const list = prepChecklists[dossierId] || {};
    const keys = Object.keys(list);
    if (keys.length === 0) return 0;
    const completed = keys.filter(k => list[k]).length;
    return Math.round((completed / keys.length) * 100);
  };

  return (
    <div className="bg-[#fcfaf7] min-h-screen pt-32 pb-32 text-navy-950">
      
      {/* HEADER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
        >
            <span className="text-[10px] font-mono font-black text-gold-600 tracking-[0.4em] uppercase block">
                The Library
            </span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none italic">
                Curation &amp; <span className="text-gold-500">Knowledge</span>
            </h1>
            <p className="text-sm md:text-xl text-gray-400 max-w-2xl mx-auto font-serif leading-relaxed italic">
                Advanced methodologies and foundational protocols for raising an elite Golden Paws graduate.
            </p>
        </motion.div>
      </section>

      {/* FILTERS AND SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white border border-gold-100 rounded-[3rem] shadow-2xl shadow-gold-500/5 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="flex-grow w-full relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-400" />
            <input 
              type="text" 
              placeholder="Search guides, protocols, tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-gold-50 border border-gold-100 rounded-[2rem] text-sm focus:outline-none focus:border-gold-500 transition-all font-serif italic placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-4 text-[9px] font-mono font-black uppercase tracking-widest rounded-2xl border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-navy-950 text-white border-navy-950 shadow-xl'
                    : 'bg-gold-50 text-gold-600 border-gold-100 hover:border-gold-500'
                }`}
              >
                {cat === 'all' ? 'Archive' : cat}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* RESOURCES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredResources.map((res) => {
              const isCompleted = completedDossiers.includes(res.id);
              const prepPct = getPrepPercentage(res.id);
              return (
                <motion.article 
                  key={res.id}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group flex flex-col bg-white rounded-[3rem] border border-gold-100 overflow-hidden hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-500 text-left"
                >
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <EditableImage 
                      imageId={res.image}
                      src={res.image} 
                      alt={res.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white text-[9px] font-mono font-black uppercase tracking-widest rounded-xl text-navy-950 border border-gold-100 shadow-xl">
                        {res.category}
                      </span>
                    </div>

                    {isCompleted && (
                      <div className="absolute top-6 right-6">
                        <span className="px-3 py-2 bg-green-500 text-[8px] font-mono font-black text-white uppercase tracking-widest rounded-xl shadow-xl flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          <span>PREPARED</span>
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-10 flex-grow flex flex-col justify-between items-start space-y-6">
                    <div className="space-y-4 w-full">
                      <div className="flex items-center justify-between text-[10px] font-black font-mono text-gold-600 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{res.readTime} Protocol</span>
                        </span>
                        
                        {/* Preparation Progress indicator bar */}
                        {prepPct > 0 && (
                          <span className="text-green-600 font-bold">{prepPct}% PREP DONE</span>
                        )}
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-black text-navy-950 leading-tight italic group-hover:text-gold-500 transition-colors">
                        {res.title}
                      </h3>
                      <p className="text-sm text-gray-400 font-serif leading-relaxed line-clamp-3 italic">
                        {res.description}
                      </p>

                      {/* Small inline prep progress ring/bar */}
                      {prepPct > 0 && (
                        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${prepPct}%` }} />
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => setReadingDossier(res)}
                      className="flex items-center space-x-3 text-[10px] font-black font-mono uppercase tracking-[0.3em] text-navy-950 group-hover:text-gold-500 transition-all cursor-pointer"
                    >
                      <span>Audit Full Dossier</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredResources.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="py-32 text-center space-y-8"
          >
            <div className="inline-flex p-10 bg-gold-50 rounded-[3rem] text-gold-300">
              <BookOpen className="w-16 h-16" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-navy-950">No dossiers found</h3>
              <p className="text-gray-400 font-serif italic">Refine your audit parameters to locate matching protocols.</p>
            </div>
          </motion.div>
        )}
      </section>

      {/* FULL SCREEN DOSSIER READER & PREP COURSE MODAL */}
      <AnimatePresence>
        {readingDossier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReadingDossier(null)}
              className="absolute inset-0 bg-navy-950/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-[#fdfcfb] rounded-[3rem] border border-stone-200/50 w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden text-navy-950 flex flex-col max-h-[85vh] text-left"
            >
              {/* Header Bar */}
              <div className="bg-navy-950 text-white px-8 py-6 flex justify-between items-center border-b border-white/10 shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-gold-500/10 border border-gold-500/20 text-gold-400 rounded-xl">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black text-gold-400 uppercase tracking-widest block">
                      LIBRARY PROTOCOL DOSSIER
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider line-clamp-1">
                      {readingDossier.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <button 
                    onClick={() => handleToggleCompleted(readingDossier.id)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-mono font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      completedDossiers.includes(readingDossier.id)
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/10'
                        : 'bg-white/10 border border-white/10 text-gold-400 hover:bg-white/20'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    <span>{completedDossiers.includes(readingDossier.id) ? 'Prepared' : 'Mark Prepared'}</span>
                  </button>
                  <button 
                    onClick={() => setReadingDossier(null)}
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body Content */}
              <div className="p-8 sm:p-12 overflow-y-auto flex-grow space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  
                  {/* Left Column: Extensive styled guide content */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-4">
                      <span className="text-[10px] font-mono font-black text-gold-600 tracking-wider uppercase block">
                        Scientific Breeder Advice
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-navy-950 italic tracking-tight">
                        {readingDossier.title}
                      </h2>
                      <div className="flex gap-4 text-[10px] font-mono text-gray-400">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold-500" /> {readingDossier.readTime} reading time</span>
                        <span>•</span>
                        <span className="text-gold-600 font-bold uppercase">{readingDossier.category} category</span>
                      </div>
                    </div>

                    <div className="text-sm sm:text-base text-gray-600 leading-relaxed font-serif italic border-l-4 border-gold-200 pl-6 bg-gold-50/20 py-4 pr-4 rounded-r-2xl">
                      "{readingDossier.description}"
                    </div>

                    <div className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap leading-relaxed space-y-4">
                      {/* Substantial additional realistic content tailored to categories */}
                      {readingDossier.id === 'res1' && (
                        <div className="space-y-4">
                          <h4 className="font-black text-navy-950 font-sans text-sm uppercase tracking-wider">Establishing Safe Boundaries</h4>
                          <p>
                            Upon entering your household, restrict the puppy's access to a single designated room. The kitchen or a family room with hard-surface flooring is ideal. Limit noise and avoid hosting massive welcoming groups the first evening—give them space to decompress.
                          </p>
                          <h4 className="font-black text-navy-950 font-sans text-sm uppercase tracking-wider">The First Night Blueprint</h4>
                          <p>
                            Set the crate right next to your bed so the puppy can hear your breathing and sense your proximity. If they start to whine, gently rest your fingers on the wire grate to soothe them without actually letting them out, unless they need to relieve themselves.
                          </p>
                        </div>
                      )}
                      {readingDossier.id === 'res2' && (
                        <div className="space-y-4">
                          <h4 className="font-black text-navy-950 font-sans text-sm uppercase tracking-wider">Calcium &amp; Phosphorus Stoichiometry</h4>
                          <p>
                            Large-breed puppies require precise mineral balances. Rapid, uncontrolled skeletal growth is the primary driver of hip dysplasia. Keep protein content around 26-28% and never supplement with calcium powders—our recommended diets have this perfectly calibrated.
                          </p>
                          <h4 className="font-black text-navy-950 font-sans text-sm uppercase tracking-wider">Water &amp; Gastro-Integrity</h4>
                          <p>
                            Always offer fresh, filtered water. Tap water in unfamiliar cities can contain mineral ratios or treatments that can upset sensitive puppy microbiomes. Triple-distilled or standard bottled spring water is recommended during the initial 72-hour transition.
                          </p>
                        </div>
                      )}
                      {readingDossier.id === 'res3' && (
                        <div className="space-y-4">
                          <h4 className="font-black text-navy-950 font-sans text-sm uppercase tracking-wider">Den Sanctuary Conditioning</h4>
                          <p>
                            We never use crate time as correction. The crate is an honorable, private sanctuary representing their wild den habit. Feed every single kibble and reward chew inside the open-door crate. Soon they will naturally retreat inside during times of fatigue.
                          </p>
                          <h4 className="font-black text-navy-950 font-sans text-sm uppercase tracking-wider">Night Potty Routine</h4>
                          <p>
                            Set a physical clock. A 10-week puppy can comfortably hold their bladder for 3 to 4 hours maximum during night sleep. Establish a quiet, dark transition directly to the designated grass pasture. Do not engage in play or talk—potty time is purely business!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Home Preparation interactive Checklist */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                      <div className="flex items-center space-x-2.5 border-b border-stone-100 pb-4">
                        <ClipboardList className="w-5 h-5 text-gold-500" />
                        <div>
                          <h4 className="font-black text-navy-950 text-xs sm:text-sm uppercase tracking-wider">Parent Prep Checklist</h4>
                          <p className="text-[10px] text-gray-400">Complete prior to picking up your puppy</p>
                        </div>
                      </div>

                      {/* Progress meter */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono font-black text-stone-400">
                          <span>PREPARATION METRIC:</span>
                          <span className="text-green-600">{getPrepPercentage(readingDossier.id)}% COMPLETED</span>
                        </div>
                        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${getPrepPercentage(readingDossier.id)}%` }} />
                        </div>
                      </div>

                      {/* Checklist Interactive Rows */}
                      <div className="space-y-3 pt-2">
                        {Object.keys(prepChecklists[readingDossier.id] || {}).map((item) => {
                          const isDone = prepChecklists[readingDossier.id][item];
                          return (
                            <button
                              key={item}
                              onClick={() => handleToggleChecklistItem(readingDossier.id, item)}
                              className="w-full text-left p-3.5 bg-stone-50 border border-stone-200 hover:border-gold-300 rounded-xl flex items-start space-x-3 transition-colors cursor-pointer text-xs"
                            >
                              <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                isDone ? 'bg-green-500 border-green-500 text-white' : 'border-stone-300 bg-white'
                              }`}>
                                {isDone && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                              </div>
                              <span className={`leading-snug ${isDone ? 'text-gray-400 line-through' : 'text-navy-950 font-medium'}`}>{item}</span>
                            </button>
                          );
                        })}
                      </div>

                      {getPrepPercentage(readingDossier.id) === 100 && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center space-x-3">
                          <Sparkles className="w-5 h-5 text-green-600 shrink-0" />
                          <p className="text-[10px] font-mono text-green-700 leading-normal uppercase font-black">
                            CONGRATULATIONS! ALL PREPARATION CRITERIA UNDER THIS PROTOCOL ARE COMPLETED.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="p-5 bg-gold-50 border border-gold-200/40 rounded-3xl text-[10px] font-mono text-stone-500 leading-normal italic">
                      * Need help matching gear or food brands? Contact Ciara directly using our support coordinate tools for professional veterinarian-vetted advice.
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom bar */}
              <div className="bg-[#f0ece6] px-8 py-4 border-t border-stone-200 flex items-center justify-between shrink-0">
                <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest">
                  GOLDEN VALLEY DIGITAL LIBRARY PROTOCOL • REPUTABLE STANDARDS
                </span>
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white border border-stone-300 hover:border-gold-500 text-navy-950 font-bold text-[9px] font-mono uppercase rounded-lg tracking-wider transition-all flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Guide</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK INSIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-[10px] font-mono font-black text-gold-600 uppercase tracking-widest">
            QUICK SCIENTIFIC TIDBITS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">Fast Ranch Insights</h2>
          <p className="text-xs text-gray-500">
            Quick behavioral and physiological tips curated by our resident veterinary advisors.
          </p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <InsightCard 
            icon={Lightbulb} 
            title="Dolphin Reflex" 
            desc="Cover crate sides with dark linen to trigger the natural denning sanctuary reflex." 
            color="text-gold-500"
          />
          <InsightCard 
            icon={HeartPulse} 
            title="Hydration Logic" 
            desc="Maintain electrolyte balance with cool, filtered water access 24/7." 
            color="text-blue-500"
          />
          <InsightCard 
            icon={GraduationCap} 
            title="Logic Incentives" 
            desc="Utilize freeze-dried liver for high-social-intelligence recall conditioning." 
            color="text-green-500"
          />
          <InsightCard 
            icon={PlayCircle} 
            title="Orthopedic Care" 
            desc="Limit vertical impact and stairs until 12 months for skeletal integrity." 
            color="text-purple-500"
          />
        </motion.div>
      </section>

    </div>
  );
}

function InsightCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className="p-8 bg-white border border-gold-100 rounded-[2.5rem] text-left hover:shadow-2xl hover:shadow-gold-500/10 transition-all group">
      <div className={`w-14 h-14 bg-gold-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <h4 className="font-black text-xs sm:text-sm uppercase tracking-widest text-navy-950 mb-3 leading-tight">{title}</h4>
      <p className="text-xs text-gray-400 font-serif italic leading-relaxed">{desc}</p>
    </div>
  );
}
