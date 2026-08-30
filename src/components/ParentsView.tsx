import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Award, Heart, Dna, FileText, CheckCircle, Sparkles, 
  ChevronRight, Play, Eye, Info, HelpCircle, X, ChevronDown, Download
} from 'lucide-react';
import { DEFAULT_PARENTS } from '../data';
import { EditableImage } from './ImageEditContext';

// Define typed Pedigree Node for the Lineage Chart
interface PedigreeNode {
  name: string;
  title?: string;
  ofa?: string;
  image?: string;
}

interface FamilyTree {
  self: string;
  sire: {
    self: string;
    ofa?: string;
    sire: { self: string; ofa?: string };
    dam: { self: string; ofa?: string };
  };
  dam: {
    self: string;
    ofa?: string;
    sire: { self: string; ofa?: string };
    dam: { self: string; ofa?: string };
  };
}

interface ParentsViewProps {
  setTab?: (tab: string) => void;
  isSubpage?: boolean;
}

export default function ParentsView({ setTab, isSubpage = false }: ParentsViewProps) {
  const [selectedParentId, setSelectedParentId] = useState<string>('s1');
  const [activeGenderFilter, setActiveGenderFilter] = useState<'all' | 'Sire' | 'Dam'>('all');
  const [inspectedClearance, setInspectedClearance] = useState<{ parentId: string; key: string; value: string } | null>(null);

  // Pedigree details dataset for Rusty, Bella, and Sterling
  const pedigreeData: Record<string, FamilyTree> = {
    s1: {
      self: "GCH Rusty of Golden Paws",
      sire: {
        self: "CH Maximus of Gold",
        ofa: "OFA Excellent",
        sire: { self: "GCH Golden Baron II", ofa: "OFA Excellent" },
        dam: { self: "Countess Sophie", ofa: "OFA Good" }
      },
      dam: {
        self: "Lady Honey of Ranch",
        ofa: "OFA Good",
        sire: { self: "Sir Prince Arthur", ofa: "OFA Excellent" },
        dam: { self: "Amber Lady of Valley", ofa: "OFA Good" }
      }
    },
    d1: {
      self: "Lady Bella of Amber Acres",
      sire: {
        self: "CH Duke of Amber Hills",
        ofa: "OFA Good",
        sire: { self: "Lord Oliver of Amber", ofa: "OFA Excellent" },
        dam: { self: "Duchess Clara", ofa: "OFA Good" }
      },
      dam: {
        self: "Princess Kate of Sunny Fields",
        ofa: "OFA Excellent",
        sire: { self: "Sir Barnaby of Kent", ofa: "OFA Excellent" },
        dam: { self: "Honey Rose VII", ofa: "OFA Good" }
      }
    },
    s2: {
      self: "Sir Sterling of Sunny Hills",
      sire: {
        self: "GCH Sterling King (UK Import)",
        ofa: "OFA Good",
        sire: { self: "Lord William of Windsor", ofa: "OFA Excellent" },
        dam: { self: "Lady Beatrice of Norfolk", ofa: "OFA Good" }
      },
      dam: {
        self: "Lady Isabella of Sussex",
        ofa: "OFA Excellent",
        sire: { self: "Sir Arthur of Kent", ofa: "OFA Excellent" },
        dam: { self: "Queen Victoria IV", ofa: "OFA Good" }
      }
    }
  };

  const clearanceDescriptions: Record<string, string> = {
    hips: "Evaluates orthopedic integrity. 'OFA Excellent' and 'OFA Good' signify flawless joint congruence, preventing hip dysplasia.",
    elbows: "Checks for elbow dysplasia or cartilage fragments. 'OFA Normal' ensures structurally perfect alignment and joint comfort.",
    eyes: "Ophthalmic review certified by board veterinarians. Guarantees no congenital cataracts or retinal anomalies.",
    heart: "Cardiology clearance ensuring robust heart valves, clean murmurs rating, and optimal cardiovascular stamina.",
    genetics: "Complete multi-disease DNA profile clear of Progressive Retinal Atrophy (PRA-1, PRA-2) and Ichthyosis."
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const filteredParents = activeGenderFilter === 'all' 
    ? DEFAULT_PARENTS 
    : DEFAULT_PARENTS.filter(p => p.role === activeGenderFilter);

  return (
    <div className={`bg-[#fdfcfb] text-[#0d2244] text-left ${isSubpage ? 'pt-16 pb-16 border-t border-gray-200' : 'min-h-screen pt-28 pb-32'}`}>
      
      {/* HEADER HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <span className="text-[10px] font-mono font-black text-gold-600 tracking-[0.3em] uppercase block">
            Elite Lineage &amp; Genomic Portfolio
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none">
            The <span className="text-gold-500 italic font-serif font-medium">Signature</span> Collection
          </h1>
          <p className="text-xs sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Every Golden Paws puppy inherits a 25-year legacy of health-forward genetics and champion-caliber temperaments. Explore the certified lineages of our master breeders.
          </p>
        </motion.div>
      </section>

      {/* FILTER BUTTONS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveGenderFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider border transition-all cursor-pointer ${
              activeGenderFilter === 'all' 
                ? 'bg-navy-950 text-white border-navy-950 shadow-sm' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-gold-500'
            }`}
          >
            All Parents ({DEFAULT_PARENTS.length})
          </button>
          <button
            onClick={() => setActiveGenderFilter('Sire')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider border transition-all cursor-pointer ${
              activeGenderFilter === 'Sire' 
                ? 'bg-navy-950 text-white border-navy-950 shadow-sm' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-gold-500'
            }`}
          >
            Sires / patriarchs ({DEFAULT_PARENTS.filter(p => p.role === 'Sire').length})
          </button>
          <button
            onClick={() => setActiveGenderFilter('Dam')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider border transition-all cursor-pointer ${
              activeGenderFilter === 'Dam' 
                ? 'bg-navy-950 text-white border-navy-950 shadow-sm' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-gold-500'
            }`}
          >
            Dams / matriarchs ({DEFAULT_PARENTS.filter(p => p.role === 'Dam').length})
          </button>
        </div>
      </section>

      {/* PARENTS LIST */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24"
      >
        {filteredParents.map((parent, idx) => {
          const isPedigreeActive = selectedParentId === parent.id;
          const familyTree = pedigreeData[parent.id];

          return (
            <motion.div 
              key={parent.id} 
              variants={itemVariants}
              className={`flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20 bg-white rounded-[2.5rem] border border-gray-150 p-6 sm:p-10 shadow-sm ${
                idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Side with Premium Frame */}
              <div className="w-full lg:w-1/2 relative group flex flex-col justify-between">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-sm flex-grow">
                  <EditableImage 
                    imageId={`parent-image-${parent.id}`}
                    src={parent.image} 
                    alt={parent.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent"></div>
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2 items-start">
                    <span className="px-3.5 py-1.5 bg-[#0d2244] text-gold-400 text-[9px] font-mono font-black uppercase rounded-lg tracking-wider border border-gold-500/20 shadow">
                      {parent.role} • {parent.breed}
                    </span>
                    <span className="px-3 py-1 bg-green-500 text-white text-[9px] font-sans font-bold uppercase rounded-lg tracking-wider shadow">
                      OFA Health Evaluated
                    </span>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <span className="text-[10px] font-mono text-gold-400 font-extrabold uppercase tracking-widest block mb-1">
                      {parent.weight} | {parent.color}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black tracking-tight">{parent.name}</h3>
                  </div>
                </div>

                {/* Micro Temperament Player Clip Simulation */}
                <div className="mt-4 p-4 bg-gold-50/20 border border-gold-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono font-black text-[#0d2244] uppercase tracking-wider">AUDIO TEMPERAMENT DIALOGUE</span>
                      <span className="block text-[9px] text-gray-400">Hear vocal friendliness &amp; obedience tone</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`Simulating temperament diagnostic for ${parent.name}: Extremely calm, low arousal bark frequency, high social intelligence score.`)}
                    className="px-3 py-1.5 bg-[#0d2244] hover:bg-gold-500 text-white hover:text-navy-950 text-[9px] font-mono font-black rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Diagnose
                  </button>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-gold-600">
                    <Dna className="w-5 h-5 text-gold-500" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-gray-400">Biological Assets &amp; Pedigree</span>
                  </div>
                  
                  <h2 className="text-3xl font-black text-navy-950 leading-none">
                    {parent.role === 'Sire' ? 'Foundation Patriarch' : 'Legacy Matriarch'}
                  </h2>
                  
                  <div className="relative pl-6 border-l-2 border-gold-300">
                    <p className="text-sm sm:text-base text-gray-600 font-serif italic leading-relaxed">
                      "{parent.personality}"
                    </p>
                  </div>
                </div>

                {/* Stats & Health Clearances */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Clearances Card */}
                  <div className="p-5 bg-white border border-gray-200 rounded-3xl shadow-inner relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-gold-600">
                        <Shield className="w-4 h-4 text-gold-500" />
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest">Medical Clearances</span>
                      </div>
                      <HelpCircle className="w-3.5 h-3.5 text-gray-300" title="Click a result to see clearance definition" />
                    </div>
                    
                    <div className="space-y-2.5">
                      {Object.entries(parent.healthClearances).map(([key, value]) => (
                        <div 
                          key={key} 
                          onClick={() => setInspectedClearance({ parentId: parent.id, key, value })}
                          className="flex items-center justify-between text-xs cursor-pointer group/item hover:bg-gold-50/50 p-1.5 rounded-lg transition-colors"
                          title="View clinical evaluation definition"
                        >
                          <span className="text-gray-400 capitalize font-bold flex items-center gap-1">
                            {key} 
                            <Info className="w-3 h-3 text-gray-300 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </span>
                          <span className="font-black text-navy-950 bg-gold-50/80 border border-gold-100 px-2.5 py-0.5 rounded-md text-[10px] font-mono">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements Card */}
                  <div className="p-5 bg-navy-950 text-white rounded-3xl shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-gold-400 mb-4">
                        <Award className="w-4 h-4 text-gold-500" />
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest">Global Titles</span>
                      </div>
                      <div className="space-y-2">
                        {parent.achievements.map((ach, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <CheckCircle className="w-3.5 h-3.5 text-gold-400 mt-0.5 flex-shrink-0" />
                            <span className="text-[11px] font-bold tracking-tight text-gray-200 leading-normal">{ach}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-3 mt-4 flex items-center justify-between text-[8px] font-mono text-gold-400 font-black tracking-wider">
                      <span>VERIFIED CHAMPION GENEPOOL</span>
                      <Award className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Pedigree Tree Toggle & Lineage Drawer */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-black uppercase tracking-widest text-gray-400">Lineage Pedigree Tree</h3>
                    <button
                      onClick={() => setSelectedParentId(isPedigreeActive ? '' : parent.id)}
                      className="text-[10px] font-mono font-black uppercase tracking-widest text-gold-600 hover:text-navy-950 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {isPedigreeActive ? 'Hide Pedigree Chart' : 'Show Pedigree Chart'}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isPedigreeActive ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isPedigreeActive && familyTree && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gold-50/20 border border-gold-200/50 rounded-2xl p-4 sm:p-6 overflow-x-auto text-[10px]"
                      >
                        <div className="min-w-[500px] flex items-center space-x-4">
                          
                          {/* Generation 1: Self */}
                          <div className="flex-1 bg-[#0d2244] text-white p-3 rounded-xl border border-gold-500/20 text-center">
                            <span className="text-[8px] font-mono uppercase text-gold-400 font-extrabold block mb-0.5">SUBJECT</span>
                            <strong className="block text-xs truncate">{familyTree.self}</strong>
                            <span className="text-[8px] font-mono bg-gold-400/20 px-1 py-0.5 rounded text-gold-200 block mt-1">OFA health passed</span>
                          </div>

                          <ChevronRight className="w-4 h-4 text-gold-500/45 flex-shrink-0" />

                          {/* Generation 2: Parents */}
                          <div className="flex-1 space-y-3">
                            {/* Sire */}
                            <div className="bg-white border border-gray-200 p-2.5 rounded-xl">
                              <span className="text-[7px] font-mono uppercase text-blue-600 font-bold block">SIRE (FATHER)</span>
                              <strong className="block text-[10px] truncate">{familyTree.sire.self}</strong>
                              <span className="text-[8px] font-mono text-gray-400">{familyTree.sire.ofa}</span>
                            </div>
                            {/* Dam */}
                            <div className="bg-white border border-gray-200 p-2.5 rounded-xl">
                              <span className="text-[7px] font-mono uppercase text-rose-500 font-bold block">DAM (MOTHER)</span>
                              <strong className="block text-[10px] truncate">{familyTree.dam.self}</strong>
                              <span className="text-[8px] font-mono text-gray-400">{familyTree.dam.ofa}</span>
                            </div>
                          </div>

                          <ChevronRight className="w-4 h-4 text-gold-500/45 flex-shrink-0" />

                          {/* Generation 3: Grandparents */}
                          <div className="flex-1 space-y-2">
                            {/* Sire's Parents */}
                            <div className="bg-[#fcfaf7] border border-gold-100 p-2 rounded-lg space-y-1">
                              <span className="text-[6px] font-mono text-gray-400 uppercase font-black">Sire Grandparents</span>
                              <div className="text-[9px] truncate border-b pb-0.5">👴 {familyTree.sire.sire.self} <span className="text-[7px] text-gold-600">({familyTree.sire.sire.ofa})</span></div>
                              <div className="text-[9px] truncate">👵 {familyTree.sire.dam.self} <span className="text-[7px] text-gold-600">({familyTree.sire.dam.ofa})</span></div>
                            </div>
                            {/* Dam's Parents */}
                            <div className="bg-[#fcfaf7] border border-gold-100 p-2 rounded-lg space-y-1">
                              <span className="text-[6px] font-mono text-gray-400 uppercase font-black">Dam Grandparents</span>
                              <div className="text-[9px] truncate border-b pb-0.5">👴 {familyTree.dam.sire.self} <span className="text-[7px] text-gold-600">({familyTree.dam.sire.ofa})</span></div>
                              <div className="text-[9px] truncate">👵 {familyTree.dam.dam.self} <span className="text-[7px] text-gold-600">({familyTree.dam.dam.ofa})</span></div>
                            </div>
                          </div>

                        </div>
                        <p className="text-[8px] text-gray-400 mt-3 text-center italic font-sans font-medium">
                          * Verification files available on-demand. Click "View Health Dossier" below to compile paperwork.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Documentation Dossier Hook */}
                <div 
                  onClick={() => alert(`Compiling ${parent.name}'s Health Folder. Including multi-generational pedigree certificates, orthopedic diagnostic scans, ophthalmological clearance cards, and DNA clear panels. Downloading verified PDF...`)}
                  className="group flex items-center p-4 bg-gold-50/30 border border-gold-100 rounded-2xl cursor-pointer hover:bg-gold-50 transition-all text-left"
                >
                  <div className="p-2.5 bg-white rounded-xl shadow-sm mr-4 group-hover:scale-105 transition-transform border border-gold-100">
                    <FileText className="w-5 h-5 text-gold-600" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-[10px] font-mono font-black text-navy-950 uppercase tracking-wider">Compile Health Dossier Dossier</h4>
                    <p className="text-[9px] text-gray-400 mt-0.5">OFA hip scans, cardiac records, and complete genomic charts.</p>
                  </div>
                  <Download className="w-4 h-4 text-gold-600 group-hover:translate-y-0.5 transition-transform mr-1" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* DETAILED CLEARANCE EXPLANATION MODAL */}
      <AnimatePresence>
        {inspectedClearance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 max-w-md w-full shadow-xl space-y-6 text-left"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-black text-gold-600 uppercase tracking-widest block">Clearance Index Definition</span>
                  <h3 className="text-xl font-black capitalize">{inspectedClearance.key} Evaluation</h3>
                </div>
                <button 
                  onClick={() => setInspectedClearance(null)}
                  className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-gold-50/30 rounded-xl border border-gold-100 space-y-2">
                <span className="text-[9px] font-mono text-gray-400 uppercase font-bold block">Current Inspected Rating</span>
                <strong className="text-sm text-[#0d2244] bg-white border border-gold-200 px-2.5 py-1 rounded inline-block font-mono tracking-wide">
                  {inspectedClearance.value}
                </strong>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                {clearanceDescriptions[inspectedClearance.key] || "Our breeding lines hold pristine clearances and pass stringent physical examinations run by orthopedic and cardiological specialists."}
              </p>

              <button
                onClick={() => setInspectedClearance(null)}
                className="w-full py-3 bg-navy-950 text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold-500 hover:text-navy-950 transition-all cursor-pointer"
              >
                Acknowledge Certification Clearances
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 mt-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-navy-950 p-10 md:p-16 rounded-[3rem] text-white text-center overflow-hidden shadow-sm"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div className="relative z-10 space-y-6">
            <Sparkles className="w-12 h-12 text-gold-500 mx-auto" />
            <h2 className="text-3xl md:text-5xl font-black leading-none">The Future of <br/><span className="text-gold-500">Goldens</span> is Here.</h2>
            <p className="text-gray-400 text-xs sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
              Join our exclusive waitlist for upcoming 2026 litters. We prioritize families committed to life-long development and responsible ownership.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              {setTab ? (
                <>
                  <button 
                    onClick={() => { setTab('apply'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-8 py-4 bg-gold-500 text-navy-950 font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all shadow-lg active:scale-95"
                  >
                    Apply for Master Waitlist →
                  </button>
                  <button 
                    onClick={() => { setTab('puppies'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95"
                  >
                    See Available Puppies →
                  </button>
                  <button 
                    onClick={() => { setTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-6 py-4 bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white font-bold text-xs rounded-xl transition-all active:scale-95"
                  >
                    ← Our Philosophy
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
