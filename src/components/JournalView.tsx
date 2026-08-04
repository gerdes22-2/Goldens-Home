import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Calendar, Tag, ChevronRight, Newspaper, Camera, 
  MapPin, Sparkles, MessageSquare, Send, Check, CloudSun, Compass, UserCheck, X, FileText
} from 'lucide-react';
import { BREEDER_JOURNAL } from '../data';

export default function JournalView() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedJournalId, setExpandedJournalId] = useState<string | null>(null);
  
  // Custom breeder-log comments simulator state
  const [comments, setComments] = useState<Record<string, Array<{ author: string, text: string, date: string, isBreeder: boolean }>>>({
    j1: [
      { author: 'Elena Rostova', text: 'Absolutely thrilled! I hope to get a honey female from Luna and Oliver.', date: 'June 16, 2024', isBreeder: false },
      { author: 'Ciara Wallen', text: 'Thank you Elena! Luna is resting comfortably, and we anticipate gorgeous coats.', date: 'June 16, 2024', isBreeder: true }
    ],
    j2: [
      { author: 'Marcus Vance', text: 'Loving these updates. Our Ellie loves the texture training from her early weeks!', date: 'June 11, 2024', isBreeder: false }
    ]
  });

  const [newCommentText, setNewCommentText] = useState<string>('');
  const [activeCommentLogId, setActiveCommentLogId] = useState<string | null>(null);

  // Email subscribe state
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const types = ['all', ...Array.from(new Set(BREEDER_JOURNAL.map(j => j.type)))];

  const filteredJournal = BREEDER_JOURNAL.filter(j => 
    selectedType === 'all' || j.type === selectedType
  );

  const handleAddComment = (logId: string, e: FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const userComment = {
      author: 'Prospective Parent',
      text: newCommentText,
      date: 'Just Now',
      isBreeder: false
    };

    setComments(prev => {
      const currentList = prev[logId] || [];
      return {
        ...prev,
        [logId]: [...currentList, userComment]
      };
    });

    setNewCommentText('');

    // Simulate automated quick response from Ciara the Breeder!
    setTimeout(() => {
      const breederResponse = {
        author: 'Ciara Wallen (Breeder Director)',
        text: "Thank you for sharing! We operate under absolute biological standards here at the ranch. Reach out to our waitlist portal for detailed litter files.",
        date: 'Just Now',
        isBreeder: true
      };

      setComments(prev => {
        const currentList = prev[logId] || [];
        return {
          ...prev,
          [logId]: [...currentList, breederResponse]
        };
      });
    }, 1500);
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail.trim()) return;
    setIsSubscribed(true);
    setSubscribeEmail('');
  };

  // Expanded detailed journal logs backstories
  const backstories: Record<string, { summary: string, metadata: { weather: string, atmosphere: string, litters: string } }> = {
    j1: {
      summary: "Our resident dam Luna has been confirmed pregnant via our 3D diagnostic ultrasound screening! The veterinarian confirms a robust litter of English Creams is on track. She is on a high-protein gestation nutrition plan. In coordination with her parent, sire GCH Rusty, we anticipate excellent hips and beautiful gentle cream coats. Early waitlist reserves are filled on a first-come, first-served basis.",
      metadata: { weather: "74°F Warm & Sunny", atmosphere: "Excited, Anticipatory", litters: "Expected E-Litter" }
    },
    j2: {
      summary: "This morning was dedicated to critical hippocampal proprioceptive stimulation. The 6-week-old graduates were introduced to five physical texture matrices: secure wooden logs, steel balance plates, dry pasture mulch, grass pastures, and low-profile steps. Their stress resilience scores were off the charts! All candidates showed incredible exploratory drive and quick tactile recovery with zero anxiety markers.",
      metadata: { weather: "68°F Morning Mist over valley", atmosphere: "Calm, Playful, Focused", litters: "Current F-Litter" }
    },
    j3: {
      summary: "Official physical certification logs arrived this morning from the Orthopedic Foundation for Animals (OFA). Sires and Dams in our active breeding lines are checked rigidly. Rusty passed his yearly cardiac auscultation screening with perfect laminar flow metrics, and received an 'Excellent' coxofemoral hip rating. This ensures his subsequent litter inherits stellar joint longevity genes.",
      metadata: { weather: "72°F Golden sunset", atmosphere: "Grateful, Celebrating Compliance", litters: "All active lines" }
    }
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
                The Archives
            </span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none italic">
                Ranch <span className="text-gold-500">Journal</span>
            </h1>
            <p className="text-sm md:text-xl text-gray-400 max-w-2xl mx-auto font-serif leading-relaxed italic">
                Daily dispatches, breeding milestones, and quiet moments from Golden Paws Home.
            </p>
        </motion.div>
      </section>

      {/* FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex flex-wrap justify-center gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-4 text-[9px] font-mono font-black uppercase tracking-widest rounded-2xl border transition-all cursor-pointer ${
                selectedType === type
                  ? 'bg-navy-950 text-white border-navy-950 shadow-xl shadow-navy-950/20'
                  : 'bg-gold-50 text-gold-600 border-gold-100 hover:border-gold-500'
              }`}
            >
              {type === 'all' ? 'Everything' : type}
            </button>
          ))}
        </div>
      </section>

      {/* JOURNAL FEED */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16 relative">
          
          {/* Vertical timeline divider line */}
          <div className="absolute left-6 md:left-12 top-2 bottom-2 w-0.5 bg-gold-100/80 pointer-events-none" />

          <AnimatePresence mode="popLayout">
            {filteredJournal.map((item, idx) => {
              const isExpanded = expandedJournalId === item.id;
              const hasComments = activeCommentLogId === item.id;
              const meta = backstories[item.id]?.metadata || { weather: '72°F Clear', atmosphere: 'Gentle', litters: 'All' };
              const currentComments = comments[item.id] || [];

              return (
                <motion.article 
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative pl-14 md:pl-24 text-left group"
                >
                  {/* Timeline circular pulse marker */}
                  <div className="absolute left-3.5 md:left-9.5 top-8 w-5 h-5 bg-gold-500 rounded-full border-4 border-[#fcfaf7] shadow-lg shadow-gold-500/20 group-hover:scale-125 transition-transform" />

                  <div className="bg-white rounded-[2.5rem] border border-gold-100 p-6 sm:p-10 shadow-2xl shadow-gold-500/5 hover:shadow-gold-500/10 transition-all duration-500">
                    
                    {/* Header: Date and Tags */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-stone-50 pb-5">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gold-50 text-gold-600 rounded-xl shrink-0">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest">{item.date}</p>
                          <div className="flex items-center space-x-2 mt-0.5">
                             <Tag className="w-3 h-3 text-gold-500" />
                             <span className="text-[8px] font-mono font-black text-gold-600 uppercase tracking-[0.2em]">{item.type}</span>
                          </div>
                        </div>
                      </div>

                      {/* Log environmental metadata metadata */}
                      <div className="flex items-center gap-3.5 text-[8px] font-mono text-gray-400">
                        <span className="flex items-center gap-1"><CloudSun className="w-3.5 h-3.5 text-gold-500" /> {meta.weather}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-gold-500" /> {meta.atmosphere}</span>
                      </div>
                    </div>

                    {/* Main content */}
                    <div className="space-y-6">
                      <h3 className="text-2xl sm:text-3xl font-black text-navy-950 leading-tight italic tracking-tight">
                        {item.title}
                      </h3>
                      
                      <p className="text-sm sm:text-base text-gray-500 font-serif leading-relaxed italic border-l-4 border-gold-100 pl-6">
                         "{item.content}"
                      </p>

                      {/* Backstory expander */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden border-t border-stone-100 pt-5 mt-5 space-y-4"
                          >
                            <span className="text-[9px] font-mono font-black text-gold-600 uppercase tracking-widest block flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" />
                              <span>Full Dispatch Backstory</span>
                            </span>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans font-medium bg-stone-50 p-5 rounded-2xl border border-stone-100 italic">
                              {backstories[item.id]?.summary || "No expanded data provided."}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Action buttons (Expand and Comment) */}
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gold-50">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setExpandedJournalId(isExpanded ? null : item.id)}
                          className="flex items-center space-x-1.5 text-[9px] font-black font-mono uppercase tracking-[0.2em] text-navy-950 hover:text-gold-500 transition-all cursor-pointer"
                        >
                          <span>{isExpanded ? 'Collapse Backstory' : 'View Full Dispatch'}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>

                        <button 
                          onClick={() => setActiveCommentLogId(hasComments ? null : item.id)}
                          className="flex items-center space-x-1.5 text-[9px] font-black font-mono uppercase tracking-[0.2em] text-stone-400 hover:text-gold-500 transition-all cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Comments ({currentComments.length})</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 text-gold-500 shrink-0">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[8px] font-mono font-black uppercase tracking-widest">Verified Ranch Log</span>
                      </div>
                    </div>

                    {/* Comments simulation tray */}
                    <AnimatePresence>
                      {hasComments && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden border-t border-stone-100 pt-6 mt-6 space-y-4 text-xs"
                        >
                          <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest block">
                            Dossier Dialogue Thread
                          </span>

                          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {currentComments.map((comment, ci) => (
                              <div 
                                key={ci} 
                                className={`p-4 rounded-2xl border text-left ${
                                  comment.isBreeder 
                                    ? 'bg-gold-500/10 border-gold-300/30 ml-6 text-navy-950' 
                                    : 'bg-stone-50 border-stone-100 mr-6 text-navy-950'
                                }`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <strong className="text-navy-950 font-black text-[10px] tracking-tight">{comment.author}</strong>
                                  <span className="text-[8px] font-mono text-gray-400 uppercase">{comment.date}</span>
                                </div>
                                <p className="text-xs text-gray-600 font-medium leading-relaxed font-serif">
                                  "{comment.text}"
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Write a comment form */}
                          <form onSubmit={(e) => handleAddComment(item.id, e)} className="flex gap-2">
                            <input
                              type="text"
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              placeholder="Type a comment or ask a question about this log..."
                              className="flex-grow bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-gold-500 font-serif placeholder:text-gray-400"
                            />
                            <button
                              type="submit"
                              disabled={!newCommentText.trim()}
                              className="p-3 bg-navy-950 hover:bg-gold-500 hover:text-navy-950 text-white rounded-xl transition-all disabled:opacity-40 cursor-pointer shrink-0"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="mt-32 max-w-4xl mx-auto px-4">
        <div className="bg-[#0a1833] rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute top-0 left-0 p-20 bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 space-y-8">
                <div className="p-4 bg-gold-500/10 border border-gold-500/20 text-gold-400 rounded-2xl inline-flex">
                  <Newspaper className="w-10 h-10" />
                </div>
                
                <h3 className="text-3xl sm:text-4xl font-black text-white italic">
                  Never Miss a <span className="text-gold-500 font-sans not-italic">Seasonal Announcement</span>
                </h3>
                
                <p className="text-gray-400 font-serif italic max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                  Subscribe to our ranch dispatches for real-time litter announcements, genetic report updates, and breeder advice.
                </p>

                <AnimatePresence mode="wait">
                  {!isSubscribed ? (
                    <motion.form 
                      onSubmit={handleSubscribe} 
                      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <input 
                        type="email" 
                        required
                        placeholder="Communication Email..." 
                        value={subscribeEmail}
                        onChange={(e) => setSubscribeEmail(e.target.value)}
                        className="flex-grow bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-gray-500 font-mono"
                      />
                      <button className="px-8 py-4 bg-gold-500 hover:bg-white text-navy-950 rounded-xl font-black text-[9px] font-mono uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-95 whitespace-nowrap">
                        Subscribe
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div 
                      className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl max-w-md mx-auto flex items-center justify-center space-x-3 text-green-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Check className="w-5 h-5 shrink-0" strokeWidth={3} />
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider text-left leading-normal">
                        SUBSCRIBED SECURELY! YOU WILL BE ALERED TO FUTURE Seasonal LITTERS.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
        </div>
      </section>

    </div>
  );
}
