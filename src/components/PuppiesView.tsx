import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, Award, Ban, CheckCircle, Dog, AlertCircle, Sparkles, 
  ArrowRight, ShieldCheck, Heart, Info, Calendar, Weight, X, Ruler, ClipboardCheck
} from 'lucide-react';
import { Puppy } from '../types';
import PuppyImageCarousel from './PuppyImageCarousel';
import HealthCertificateModal from './HealthCertificateModal';

const PUPPY_GROWTH_PHOTOS: Record<string, { age: string, url: string }[]> = {
  'Waffles': [
    { age: 'Week 2', url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 5', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 8', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 10', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600' }
  ],
  'Daisy': [
    { age: 'Week 2', url: 'https://images.unsplash.com/photo-1591768793355-74d7c2d26056?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 5', url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 8', url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 10', url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600' }
  ],
  'Rusty': [
    { age: 'Week 2', url: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 5', url: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 8', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 10', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600' }
  ],
  'Luna': [
    { age: 'Week 2', url: 'https://images.unsplash.com/photo-1518020382113-a718b7f2f643?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 5', url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 8', url: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=600' }
  ],
  'Buster': [
    { age: 'Week 2', url: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 5', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 8', url: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&q=80&w=600' }
  ],
  'Biscuit': [
    { age: 'Week 2', url: 'https://images.unsplash.com/photo-1591768793355-74d7c2d26056?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 5', url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600' },
    { age: 'Week 8', url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=600' }
  ]
};

const getPuppyPhotos = (pup: Puppy) => {
  if (PUPPY_GROWTH_PHOTOS[pup.name]) {
    return PUPPY_GROWTH_PHOTOS[pup.name];
  }
  return [
    { age: 'Week 2', url: pup.image },
    { age: 'Week 6', url: pup.image },
    { age: 'Current', url: pup.image }
  ];
};

interface PuppiesViewProps {
  puppies: Puppy[];
  selectedPuppy: Puppy | null;
  setSelectedPuppy: (puppy: Puppy | null) => void;
  setTab: (tab: string) => void;
  setMatchedPuppyName: (name: string) => void;
}

export default function PuppiesView({ 
  puppies, 
  selectedPuppy, 
  setSelectedPuppy, 
  setTab,
  setMatchedPuppyName
}: PuppiesViewProps) {
  const [colorFilter, setColorFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewingHealthCertificate, setViewingHealthCertificate] = useState<Puppy | null>(null);
  const [selectedGrowthPhotoIndex, setSelectedGrowthPhotoIndex] = useState<Record<string, number>>({});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.97, y: 25 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 18,
        mass: 0.9
      } 
    }
  };

  const filteredPups = puppies.filter((pup) => {
    const matchesColor = colorFilter === 'all' || pup.color === colorFilter;
    const matchesGender = genderFilter === 'all' || pup.gender === genderFilter;
    const matchesStatus = statusFilter === 'all' || pup.status === statusFilter;
    return matchesColor && matchesGender && matchesStatus;
  });

  const handleApplyForPuppy = (pupName: string) => {
    setMatchedPuppyName(pupName);
    setSelectedPuppy(null);
    setTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const colors = ['Light Golden', 'Cream', 'Honey Golden', 'Red Golden'];

  // Helper to count results matching specific criteria
  const getFilterCount = (type: 'color' | 'gender' | 'status', value: string) => {
    return puppies.filter(p => {
      if (type === 'color') return p.color === value;
      if (type === 'gender') return p.gender === value;
      if (type === 'status') return p.status === value;
      return true;
    }).length;
  };

  return (
    <div className="bg-[#fdfcfb] min-h-screen pt-32 pb-32 text-[#0d2244] text-left">
      
      {/* HEADER HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <span className="text-[10px] font-mono font-black text-gold-600 tracking-[0.3em] uppercase block">
            GENOMICALY CERTIFIED NURSERY
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-navy-950">
            Find Your <span className="text-gold-500 italic font-serif font-medium">Litter</span> Candidate
          </h1>
          <p className="text-sm sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Every Golden Paws puppy is raised with our physical conditioning, proprietary BioSens development protocol, and dual-physician health clearing models.
          </p>
        </motion.div>
      </section>

      {/* LUXURY INTERACTIVE FILTER STATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white rounded-3xl border border-gold-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gold-50">
            <div className="flex items-center space-x-3 text-[#0d2244]">
              <Filter className="w-5 h-5 text-gold-500" />
              <div>
                <span className="text-xs font-mono font-black uppercase tracking-widest block">Cohort Filter</span>
                <span className="text-[10px] text-stone-400 font-medium">Refining registry of {puppies.length} active puppies</span>
              </div>
            </div>
            
            <button
              onClick={() => { setColorFilter('all'); setGenderFilter('all'); setStatusFilter('all'); }}
              className="text-[10px] font-mono font-black text-gold-600 hover:text-gold-700 uppercase tracking-widest flex items-center gap-1 self-start md:self-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Active Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Heritage Coat Line */}
            <div className="space-y-2.5">
              <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-wider block">HERITAGE COAT SHADE</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setColorFilter('all')}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                    colorFilter === 'all'
                      ? 'bg-navy-950 border-navy-950 text-white'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-gold-300'
                  }`}
                >
                  All Lines ({puppies.length})
                </button>
                {colors.map((c) => {
                  const count = getFilterCount('color', c);
                  return (
                    <button
                      key={c}
                      onClick={() => setColorFilter(c)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                        colorFilter === c
                          ? 'bg-[#0d2244] border-[#0d2244] text-white shadow-sm'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-gold-200'
                      }`}
                    >
                      {c} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender Filters */}
            <div className="space-y-2.5">
              <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-wider block">GENDER PROFILE</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setGenderFilter('all')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all text-center ${
                    genderFilter === 'all'
                      ? 'bg-navy-950 border-navy-950 text-white'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-gold-300'
                  }`}
                >
                  Both Genders
                </button>
                <button
                  onClick={() => setGenderFilter('Male')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all text-center ${
                    genderFilter === 'Male'
                      ? 'bg-[#0d2244] border-[#0d2244] text-white'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-gold-200'
                  }`}
                >
                  Sires (Male) ({getFilterCount('gender', 'Male')})
                </button>
                <button
                  onClick={() => setGenderFilter('Female')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all text-center ${
                    genderFilter === 'Female'
                      ? 'bg-[#0d2244] border-[#0d2244] text-white'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-gold-200'
                  }`}
                >
                  Dams (Female) ({getFilterCount('gender', 'Female')})
                </button>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2.5">
              <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-wider block">PLACEMENT STATUS</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all text-center ${
                    statusFilter === 'all'
                      ? 'bg-navy-950 border-navy-950 text-white'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-gold-300'
                  }`}
                >
                  Global ({puppies.length})
                </button>
                <button
                  onClick={() => setStatusFilter('Available')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all text-center ${
                    statusFilter === 'Available'
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-green-200'
                  }`}
                >
                  Available ({getFilterCount('status', 'Available')})
                </button>
                <button
                  onClick={() => setStatusFilter('Reserved')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all text-center ${
                    statusFilter === 'Reserved'
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-orange-200'
                  }`}
                >
                  Pending ({getFilterCount('status', 'Reserved')})
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {filteredPups.length > 0 ? (
            <motion.div 
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {filteredPups.map((pup) => {
                const avail = pup.status === 'Available';
                const rsvd = pup.status === 'Reserved';
                
                // Get growth milestones
                const growthPhotos = getPuppyPhotos(pup);
                const activePhotoIndex = selectedGrowthPhotoIndex[pup.id] ?? (growthPhotos.length - 1);
                const displayedPhotoUrl = growthPhotos[activePhotoIndex]?.url || pup.image;

                return (
                  <motion.div
                    key={pup.id}
                    variants={itemVariants}
                    layout
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3, ease: 'easeOut' }
                    }}
                    className="bg-white border border-gold-100 rounded-3xl overflow-hidden flex flex-col group relative hover:shadow-xl hover:border-gold-300/60 transition-all duration-300"
                  >
                    {/* Upper Visual Cover */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gold-50/10">
                      {/* We use standard image wrapper to easily display selected growth weekly picture */}
                      <img 
                        src={displayedPhotoUrl} 
                        alt={pup.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" 
                      />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                        <span className="px-2.5 py-1 bg-white/95 backdrop-blur border border-gold-100 rounded-lg text-[9px] font-mono font-black text-gold-600 uppercase tracking-wider">
                          {pup.color}
                        </span>
                        
                        {avail ? (
                          <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-green-600 text-white text-[8px] font-mono font-black uppercase rounded-lg shadow-sm">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            <span>READY FOR HOME</span>
                          </div>
                        ) : rsvd ? (
                          <div className="px-2.5 py-1 bg-amber-500 text-white text-[8px] font-mono font-black uppercase rounded-lg">
                            APPLICATION PENDING
                          </div>
                        ) : (
                          <div className="px-2.5 py-1 bg-stone-500 text-white text-[8px] font-mono font-black uppercase rounded-lg">
                            {pup.status}
                          </div>
                        )}
                      </div>

                      {/* Micro Growth Photo Interactive Bar */}
                      {growthPhotos.length > 1 && (
                        <div className="absolute bottom-3 left-3 right-3 bg-navy-950/80 backdrop-blur-md rounded-xl p-2 flex items-center justify-between z-10 border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[8px] font-mono font-extrabold text-gold-400 uppercase tracking-widest pl-1">
                            Milestone: {growthPhotos[activePhotoIndex]?.age}
                          </span>
                          <div className="flex space-x-1">
                            {growthPhotos.map((photo, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedGrowthPhotoIndex(prev => ({
                                    ...prev,
                                    [pup.id]: pIdx
                                  }));
                                }}
                                className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase transition-all ${
                                  activePhotoIndex === pIdx
                                    ? 'bg-gold-500 text-navy-950 font-bold'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                              >
                                {photo.age.replace('Week ', 'W')}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-5 text-left">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-black text-navy-950 group-hover:text-gold-600 transition-colors">
                              {pup.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-[9px] font-mono font-black text-stone-400 mt-1 uppercase tracking-wider">
                              <span>{pup.gender === 'Male' ? 'SIRE (MALE)' : 'DAM (FEMALE)'}</span>
                              <span className="w-1 h-1 bg-gold-400 rounded-full"></span>
                              <span>{pup.weight}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-[8px] text-stone-400 uppercase font-black tracking-widest">Adoption Cost</span>
                            <span className="text-lg font-mono font-black text-[#0d2244]">${pup.price}</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-stone-500 mt-3 leading-relaxed line-clamp-2">
                          {pup.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {pup.characteristics.slice(0, 3).map((c, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-gold-500/5 border border-gold-500/10 text-[9px] font-mono font-extrabold text-gold-700 uppercase rounded-md">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer compliance & Trigger buttons */}
                      <div className="space-y-3 pt-3 border-t border-gold-50/60">
                        <div className="flex justify-between items-center text-[9px] font-mono font-black">
                          <button
                            onClick={(e) => { e.stopPropagation(); setViewingHealthCertificate(pup); }}
                            className="text-gold-600 hover:text-gold-700 uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 text-gold-500" />
                            <span>Interactive Health Records</span>
                          </button>
                          
                          <span className="text-stone-400">AKC GENERATION 5</span>
                        </div>

                        <button
                          onClick={() => setSelectedPuppy(pup)}
                          className="w-full py-3.5 bg-navy-950 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-gold-500 hover:text-navy-950 transition-all shadow-sm active:scale-[0.98]"
                        >
                          EXAMINE PEDIGREE &amp; BLOODLINES
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 flex flex-col items-center justify-center text-center space-y-5"
            >
              <div className="p-6 bg-gold-50 text-gold-400 rounded-full">
                <Dog className="w-12 h-12 opacity-60 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-navy-900 uppercase tracking-tight">No Matching Profiles</h3>
                <p className="text-stone-400 text-xs max-w-sm font-medium">
                  We currently do not have active puppies that match your search filters. Try clearing coat shades or status indexes.
                </p>
              </div>
              <button
                onClick={() => { setColorFilter('all'); setGenderFilter('all'); setStatusFilter('all'); }}
                className="px-6 py-2.5 bg-gold-500 text-navy-950 font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-102 active:scale-98 transition-all"
              >
                Clear Search Parameters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* DETAILED PEDIGREE MODAL */}
      <AnimatePresence>
        {selectedPuppy && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPuppy(null)}
              className="absolute inset-0 bg-navy-950/80 backdrop-blur-xl transition-opacity" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[2rem] overflow-hidden max-w-4xl w-full shadow-2xl relative z-10 border border-white/20"
            >
              <button
                onClick={() => setSelectedPuppy(null)}
                className="absolute top-5 right-5 z-20 p-2.5 bg-white/80 hover:bg-white text-navy-950 rounded-full transition-colors border border-stone-200 cursor-pointer shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                
                {/* Left Side: Visual Showcase */}
                <div className="md:w-5/12 relative bg-gold-50/10 flex flex-col justify-between min-h-[300px] md:min-h-0">
                  <div className="absolute inset-0">
                    <img 
                      src={selectedPuppy.image} 
                      alt={selectedPuppy.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09152b] via-navy-950/30 to-transparent"></div>
                  </div>

                  {/* Top Badge Overlay */}
                  <div className="relative p-6 flex justify-between items-start">
                    <span className="px-2.5 py-1 bg-white/95 text-gold-700 text-[8px] font-mono font-black uppercase rounded-md">
                      {selectedPuppy.color}
                    </span>
                  </div>

                  {/* Name Overlay */}
                  <div className="relative p-8 space-y-1 text-left">
                    <span className="text-[10px] font-mono font-bold text-gold-400 uppercase tracking-widest block">GENOMIC COHORT DIRECTORY</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white leading-none tracking-tight">{selectedPuppy.name}</h2>
                    <p className="text-white/60 text-[10px] font-mono mt-2 uppercase">Certified Purebred Golden Retriever</p>
                  </div>
                </div>

                {/* Right Side: Specifications Panel */}
                <div className="md:w-7/12 p-6 sm:p-10 space-y-8 overflow-y-auto max-h-[80vh] text-left">
                  
                  {/* Performance / Metric Badges */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 bg-gold-50/30 border border-gold-100 rounded-xl text-center">
                      <Weight className="w-4.5 h-4.5 text-gold-600 mx-auto mb-1" />
                      <span className="text-[8px] font-mono text-stone-400 uppercase font-black block">PHYSICAL WEIGHT</span>
                      <strong className="text-xs text-navy-950 uppercase font-black block mt-0.5">{selectedPuppy.weight}</strong>
                    </div>
                    <div className="p-3.5 bg-gold-50/30 border border-gold-100 rounded-xl text-center">
                      <Ruler className="w-4.5 h-4.5 text-gold-600 mx-auto mb-1" />
                      <span className="text-[8px] font-mono text-stone-400 uppercase font-black block">COHORT GENERATION</span>
                      <strong className="text-xs text-navy-950 uppercase font-black block mt-0.5">5th Gen (AKC)</strong>
                    </div>
                    <div className="p-3.5 bg-gold-50/30 border border-gold-100 rounded-xl text-center">
                      <Calendar className="w-4.5 h-4.5 text-gold-600 mx-auto mb-1" />
                      <span className="text-[8px] font-mono text-stone-400 uppercase font-black block">CHRONO AGE</span>
                      <strong className="text-xs text-navy-950 uppercase font-black block mt-0.5">10 Weeks</strong>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-2 text-[#0d2244]">
                      <Info className="w-4 h-4 text-gold-500" />
                      <span className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-400">BREEDER DEVELOPMENT NOTES</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-medium">
                      {selectedPuppy.description}
                    </p>
                  </div>

                  {/* Pedigree Sires & Dams */}
                  <div className="p-5 bg-[#09152b] text-white rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gold-400">
                        <Award className="w-4.5 h-4.5" />
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest">OFA Pedigree Lineage</span>
                      </div>
                      <span className="text-[8px] font-mono font-black uppercase tracking-wider px-2 py-0.5 bg-gold-400/10 border border-gold-400/20 text-gold-400 rounded">
                        AKC Certified DNA
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                      <div>
                        <span className="text-[8px] uppercase font-mono font-black text-stone-400 block mb-0.5">PATERNAL SIRE (FATHER)</span>
                        <strong className="text-xs text-white block truncate">{selectedPuppy.parents.sire.split('(')[0]}</strong>
                        <span className="text-[8px] text-green-400 flex items-center mt-1 uppercase font-bold font-mono">
                          <CheckCircle className="w-3 h-3 mr-1" /> OFA SKELETAL CLEARED
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase font-mono font-black text-stone-400 block mb-0.5">MATERNAL DAM (MOTHER)</span>
                        <strong className="text-xs text-white block truncate">{selectedPuppy.parents.dam.split('(')[0]}</strong>
                        <span className="text-[8px] text-green-400 flex items-center mt-1 uppercase font-bold font-mono">
                          <CheckCircle className="w-3 h-3 mr-1" /> GENOMIC NORMAL PASS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Medical compliance certifications list */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-gold-600">
                      <ShieldCheck className="w-4 h-4 text-gold-500" />
                      <span className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-400">MEDICAL PORTFOLIO LOGS</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedPuppy.registrations.map((reg, i) => (
                        <div key={i} className="flex items-center space-x-2 text-[10px] font-bold text-stone-600 pb-2 border-b border-stone-100">
                          <div className="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
                          <span>{reg}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => setViewingHealthCertificate(selectedPuppy)}
                      className="w-full py-3 bg-gold-500/10 hover:bg-gold-500/15 border border-gold-500/20 text-gold-700 font-mono font-black text-[9px] uppercase tracking-widest rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-gold-500" />
                      <span>Review Clinical Veterinary PDF Documents</span>
                    </button>
                  </div>

                  {/* Core CTAs */}
                  <div className="pt-4 border-t border-stone-100">
                    {selectedPuppy.status === 'Available' ? (
                      <button
                        onClick={() => handleApplyForPuppy(selectedPuppy.name)}
                        className="w-full py-4.5 bg-gold-500 text-navy-950 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center space-x-2 hover:bg-gold-400 transition-all shadow-md cursor-pointer"
                      >
                        <ClipboardCheck className="w-4.5 h-4.5" />
                        <span>Initialize Placement Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="w-full py-4 bg-stone-100 text-stone-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl text-center border border-stone-200">
                        Placement Position Filled
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingHealthCertificate && (
          <HealthCertificateModal 
            puppy={viewingHealthCertificate} 
            onClose={() => setViewingHealthCertificate(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
