import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ShieldCheck, Heart, Sparkles, Award, Star, 
  Smile, CheckCircle, Compass, ClipboardCheck, Newspaper, Clock,
  ChevronLeft, ChevronRight, ShieldAlert, BadgeInfo, Info, Volume2, Video, Calendar, Bell, Eye, Download, Play, Pause
} from 'lucide-react';
import { Puppy } from '../types';
import { BREEDER_JOURNAL } from '../data';
import PuppyMatcherQuiz from './PuppyMatcherQuiz';
import LitterCountdown from './LitterCountdown';
import { EditableImage } from './ImageEditContext';

interface HomeViewProps {
  puppies: Puppy[];
  setTab: (tab: string) => void;
  setSelectedPuppy: (puppy: Puppy) => void;
  setMatchedPuppyName: (name: string) => void;
}

export default function HomeView({ puppies, setTab, setSelectedPuppy, setMatchedPuppyName }: HomeViewProps) {
  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);

  // Gallery category filter
  const [activeGalleryFilter, setActiveGalleryFilter] = useState<'all' | 'social' | 'vet' | 'training'>('all');

  // Breeders Quiz State
  const [activeBadge, setActiveBadge] = useState<number | null>(null);

  const featuredPups = puppies.filter(p => p.status === 'Available').slice(0, 3);

  const slides = [
    {
      image: "https://img77.uenicdn.com/image/upload/v1751916218/business/6e344da1-8157-413b-8f65-3ab350ddf993.jpg",
      eyebrow: "Sovereign Health Standards Since 1998",
      title: "Breeding Excellence",
      titleItalic: "With Devotion",
      description: "Verifiable champion lineages, rigorous health clearances, and continuous socialization on our spacious private valley ranch.",
      primaryCta: "Adopt a Legacy Puppy",
      secondaryCta: "Ranch Heritage"
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWgaPeVYeT9FB11SnKgeFCOHEiHqZjTARPNLo4GSnEWw&s=10",
      eyebrow: "OFA Good & Excellent Rated Parents",
      title: "Championship Genetics",
      titleItalic: "Pure Bloodlines",
      description: "Our signature English Cream and Red Honey Sires and Dams represent top international heritages with multi-generational field awards.",
      primaryCta: "Meet the Breeders",
      secondaryCta: "View Certifications"
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP8BVGkmJcXofy_kqhSdf_N4A0u6dFN7tTXiwb5Ch5cg&s=10",
      eyebrow: "Early Neurological Socialization",
      title: "Molded For Character",
      titleItalic: "Gentle Spirits",
      description: "Every puppy undergoes intensive BioSens sensory programs to foster stress-resilience, elite learning agility, and exceptional family temperaments.",
      primaryCta: "Take Matchmaker Quiz",
      secondaryCta: "About BioSens"
    }
  ];

  // Auto slide effect
  useEffect(() => {
    if (!isCarouselPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isCarouselPlaying]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const badges = [
    {
      icon: Award,
      title: "AKC Registry",
      desc: "Registered with American Kennel Club. Direct breeder transparency certification compliance.",
      details: "Our sires and dams are AKC registered with verifiable certified lineages extending up to 5 generations, including outstanding historical field and show Champions."
    },
    {
      icon: ShieldCheck,
      title: "OFA Certified",
      desc: "Hips, Elbows, Hearts, and Eyes evaluated by Orthopedic Foundation specialists.",
      details: "We only breed parent dogs with Hip evaluations of 'Good' or 'Excellent'. Certified veterinary cardiologists and ophthalmologists run yearly clearances."
    },
    {
      icon: Heart,
      title: "1-Yr Warranty",
      desc: "Every puppy is secured under our official contract against genetic anomalies.",
      details: "Included in writing on our signed Adoption Contract. We offer full refund or replacement coverage for congenital conditions, maintaining the safest adopter rights."
    },
    {
      icon: Smile,
      title: "BioSens Protocols",
      desc: "Early neurological stimulation (ENS) performed from days 3 to 16 for stress resilience.",
      details: "BioSens protocols stimulate early immune responses, cardiac strengths, and stress-tolerance metrics. It molds resilient, highly adaptable future adult dogs."
    }
  ];

  const handleBadgeClick = (idx: number) => {
    setActiveBadge(activeBadge === idx ? null : idx);
  };

  // Gallery images with filtering metadata
  const galleryItems = [
    {
      id: 1,
      category: 'social',
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTxgYv_xAXM-OX64GhGacyr1qnEekffPlIQbaUjsFueQ&s",
      tag: "Hand-Raised",
      title: "Physical Socialization",
      description: "Daily open pasture play and sensory yard activities fostering balanced, joyful dispositions.",
      badge: "RANCH DIRECT",
      badgeColor: "bg-gold-50 text-gold-700 border-gold-100"
    },
    {
      id: 2,
      category: 'vet',
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN5u5Ai_ZmnIcjCl1CNd79Qr3wsbylZDvWC_9KWyBYjQ&s",
      tag: "Vet Clinic Pass",
      title: "Structured Diagnostics",
      description: "Rigorous veterinarian physical evaluations, cardiac checks, and certified OFA standards.",
      badge: "OFA ALIGNED",
      badgeColor: "bg-green-50 text-green-700 border-green-100"
    },
    {
      id: 3,
      category: 'social',
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdK7ddClHyzsLsb8nBUBTa7gitdyV7un8UveZIF6K65Q&s=10",
      tag: "Certified Blood",
      title: "Heritage Lineage",
      description: "Our foundation parents embody generations of gentle temperament and award-winning conformation.",
      badge: "AKC CHAMPION",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-100"
    },
    {
      id: 4,
      category: 'training',
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBtlSDqNbCfRArbnRLpybDcIH68MrxEOBWWTJwYmwP-g&s=10",
      tag: "ENS Trained",
      title: "Active Outdoor Drills",
      description: "Early recall foundation, obstacle confidence, and structured learning in our ranch gardens.",
      badge: "MICROCHIPPED",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-100"
    }
  ];

  const filteredGallery = activeGalleryFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeGalleryFilter);

  return (
    <div className="bg-[#fdfcfb] overflow-x-hidden pt-16 text-[#0d2244]">
      
      {/* SECTION 1: HERO CONTAINER (PREMIUM CAROUSEL SLIDER) */}
      <section className="relative h-[92vh] min-h-[650px] md:h-screen w-full flex items-center justify-center overflow-hidden bg-black select-none">
        {/* Carousel Slides */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            {slides.map((slide, idx) => {
              if (idx !== currentSlide) return null;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Image with subtle Ken Burns zoom */}
                  <motion.div
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 6, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    <EditableImage 
                      src={slide.image}
                      className="w-full h-full object-cover object-center"
                      alt={slide.title}
                    />
                  </motion.div>
                  {/* Sophisticated dual layer gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/45 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#fdfcfb] via-transparent to-navy-950/20"></div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Carousel Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left flex flex-col justify-center h-full">
          <div className="max-w-2xl lg:max-w-3xl space-y-6">
            
            {/* Animated Eyebrow Badge */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={`eyebrow-${currentSlide}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center space-x-2 bg-gold-400/20 backdrop-blur-md border border-gold-400/30 px-3.5 py-1.5 rounded-full text-gold-200 text-[10px] font-mono font-black uppercase tracking-[0.25em]"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-300 animate-pulse" />
                <span>{slides[currentSlide].eyebrow}</span>
              </motion.div>
            </AnimatePresence>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.h1 
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight"
              >
                {slides[currentSlide].title} <br/>
                <span className="text-gold-400 italic font-serif font-medium">{slides[currentSlide].titleItalic}</span>
              </motion.h1>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p 
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-sm sm:text-base md:text-lg text-gray-200 max-w-xl sm:max-w-2xl font-medium leading-relaxed"
              >
                {slides[currentSlide].description}
              </motion.p>
            </AnimatePresence>

            {/* Actions */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={`actions-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 pt-4"
              >
                <button 
                  onClick={() => {
                    if (currentSlide === 2) {
                      const quizEl = document.getElementById('matchmaker-quiz-section');
                      quizEl?.scrollIntoView({ behavior: 'smooth' });
                    } else if (currentSlide === 1) {
                      setTab('parents');
                    } else {
                      setTab('puppies');
                    }
                  }}
                  className="group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-gold-500 text-navy-950 font-black text-2xs uppercase tracking-widest rounded-xl shadow-xl hover:bg-gold-400 transition-all active:scale-95 overflow-hidden cursor-pointer"
                >
                  <span className="relative z-10 flex items-center">
                    {slides[currentSlide].primaryCta}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button 
                  onClick={() => {
                    setTab('about');
                  }}
                  className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-2xs uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                >
                  {slides[currentSlide].secondaryCta}
                </button>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* Carousel UI Controls */}
        <div className="absolute bottom-10 left-4 right-4 sm:left-8 sm:right-8 z-20 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
          {/* Progress Indicators */}
          <div className="flex items-center space-x-2.5 pointer-events-auto">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  setIsCarouselPlaying(false);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-gold-500' : 'w-2.5 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Manual Triggers & Play/Pause */}
          <div className="flex items-center space-x-3 pointer-events-auto">
            <button
              onClick={() => setIsCarouselPlaying(!isCarouselPlaying)}
              className="p-2.5 rounded-xl bg-navy-950/60 hover:bg-navy-900 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
              title={isCarouselPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isCarouselPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handlePrevSlide}
              className="p-2.5 rounded-xl bg-navy-950/60 hover:bg-navy-900 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextSlide}
              className="p-2.5 rounded-xl bg-navy-950/60 hover:bg-navy-900 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center text-white/35 pointer-events-none"
        >
          <span className="text-[8px] font-mono font-bold uppercase tracking-widest mb-1.5">Scroll Down</span>
          <div className="w-0.5 h-10 bg-gradient-to-b from-gold-500 to-transparent"></div>
        </motion.div>
      </section>

      {/* LITTER COUNTDOWN */}
      <LitterCountdown setTab={setTab} />

      {/* RANCH SUMMARY BAR: HIGHLIGHT NUMBERS */}
      <section className="bg-gradient-to-r from-[#0d2244] to-[#081730] text-white py-12 border-y border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            
            <div className="space-y-1 md:border-r border-white/10 pr-4">
              <span className="block text-3xl md:text-4xl font-black text-gold-400">150+ Acres</span>
              <span className="block text-[10px] font-mono font-black uppercase text-gray-400 tracking-wider">Private Valley Ranch</span>
            </div>

            <div className="space-y-1 md:border-r border-white/10 pr-4">
              <span className="block text-3xl md:text-4xl font-black text-gold-400">100% OFA</span>
              <span className="block text-[10px] font-mono font-black uppercase text-gray-400 tracking-wider">Orthopedic & Cardiac Pass</span>
            </div>

            <div className="space-y-1 md:border-r border-white/10 pr-4">
              <span className="block text-3xl md:text-4xl font-black text-[#00e676]">Zero Cases</span>
              <span className="block text-[10px] font-mono font-black uppercase text-gray-400 tracking-wider">Congenital Defects</span>
            </div>

            <div className="space-y-1">
              <span className="block text-3xl md:text-4xl font-black text-gold-400">28+ Years</span>
              <span className="block text-[10px] font-mono font-black uppercase text-gray-400 tracking-wider">Champion Heritage Lineage</span>
            </div>

          </div>
        </div>
      </section>

      {/* BREEDER'S JOURNAL FEED */}
      <section className="bg-white py-20 overflow-hidden border-t border-gold-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl text-left">
              <div className="flex items-center space-x-2 text-gold-600 mb-4">
                <Newspaper className="w-5 h-5" />
                <span className="text-xs font-mono font-black uppercase tracking-widest">Breeder's Daily Feed</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-navy-900 tracking-tight leading-none mb-4">
                Live from <span className="text-gold-500 italic font-serif font-medium">Golden Paws</span> Home
              </h2>
            </div>
            <button 
              onClick={() => setTab('journal')}
              className="text-[10px] font-mono font-bold uppercase tracking-widest text-navy-900 border-b-2 border-gold-500 pb-1 hover:text-gold-600 hover:border-navy-900 transition-all cursor-pointer"
            >
              View All Log Entries
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BREEDER_JOURNAL.map((entry, idx) => (
              <motion.div 
                key={entry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 bg-gold-50/20 rounded-3xl border border-gold-100/50 hover:border-gold-300 hover:shadow-lg transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-white rounded-lg text-[9px] font-mono font-black text-gold-600 border border-gold-100/50 uppercase">
                      {entry.type}
                    </span>
                    <div className="flex items-center text-[10px] font-mono text-gray-400 font-bold">
                      <Clock className="w-3 h-3 mr-1.5 text-gold-500" />
                      {entry.date}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-navy-900 mb-3 group-hover:text-gold-600 transition-colors">
                    {entry.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 font-medium">
                    {entry.content}
                  </p>
                </div>
                <button 
                  onClick={() => setTab('journal')}
                  className="mt-6 flex items-center text-[10px] font-mono font-black uppercase tracking-wider text-navy-900 group-hover:translate-x-2 transition-transform text-left cursor-pointer"
                >
                  Read Log <ArrowRight className="ml-1.5 w-3 h-3 text-gold-500" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE CREDENTIAL BADGES */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] font-mono font-black text-gold-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gold-500" /> Professional Clearances Panel
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">Click To Inspect Breeder Qualifications</h2>
            <p className="text-xs text-gray-500">
              We subject our parent lines to orthopedic, genomic, and ophthalmic specialists. Verify our verified registrations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((b, idx) => {
              const IconComp = b.icon;
              const isSelected = activeBadge === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleBadgeClick(idx)}
                  className={`group relative flex flex-col items-center text-center p-6 rounded-2xl cursor-pointer border transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#0d2244] to-[#081730] border-gold-500 shadow-md text-white'
                      : 'bg-gold-50/10 border-gold-500/10 hover:border-gold-500/30 hover:bg-white hover:shadow-sm text-[#0d2244]'
                  }`}
                >
                  <div className={`p-3.5 rounded-full mb-4 ${isSelected ? 'bg-gold-500 text-navy-950' : 'bg-[#0d2244]/5 text-gold-600 group-hover:bg-gold-500 group-hover:text-navy-950'} transition-colors duration-200`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className={`font-black text-sm tracking-wide ${isSelected ? 'text-gold-400' : 'text-[#0d2244]'}`}>{b.title}</h3>
                  <p className={`text-xs mt-2 leading-relaxed ${isSelected ? 'text-gray-300' : 'text-gray-500 font-medium'}`}>{b.desc}</p>
                  
                  {/* EXPANDABLE VERIFICATION */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gold-500/20 text-[11px] text-gold-200 leading-relaxed text-left"
                      >
                        <strong>Breeder Verification Audit:</strong> {b.details}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isSelected && (
                    <span className="text-[10px] text-gold-600 group-hover:text-gold-500 font-bold mt-4 font-mono flex items-center space-x-1">
                      <span>INSPECT DETAILS</span>
                      <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform text-gold-500" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED AVAILABLE PUPPIES */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-gold-600 tracking-widest uppercase">Select From Our Current Litters</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d2244] mt-1">Featured Available Puppies</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-xl font-medium">Every puppy undergoes comprehensive social drills, early sensory programs, orthopedic checks, and is microchipped before coming home.</p>
          </div>
          <button 
            onClick={() => { setTab('puppies'); window.scrollTo({ top: 0 }); }}
            className="flex items-center space-x-1.5 text-xs font-bold text-[#0d2244] hover:text-gold-600 transition-colors group cursor-pointer font-mono uppercase tracking-widest"
          >
            <span>Browse All Puppies</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-gold-500" />
          </button>
        </div>

        {/* PUPPY CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPups.map((pup) => (
            <div 
              key={pup.id}
              className="bg-white rounded-3xl border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group text-left"
            >
              {/* Clickable Image Section */}
              <div 
                onClick={() => {
                  setSelectedPuppy(pup);
                  setTab('puppies');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="relative overflow-hidden h-64 md:h-56 bg-gray-100 cursor-pointer"
              >
                <EditableImage 
                  imageId={`puppy-image-${pup.id}-current`}
                  src={pup.image} 
                  alt={pup.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#0d2244] text-gold-400 border border-gold-500/20 text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full uppercase shadow">
                  {pup.color}
                </div>
                <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-sans font-bold tracking-wide px-3 py-1 rounded-full uppercase shadow">
                  Available
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div 
                  onClick={() => {
                    setSelectedPuppy(pup);
                    setTab('puppies');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xl font-black text-[#0d2244] group-hover:text-gold-600 transition-colors">{pup.name}</h3>
                    <span className="text-xs font-mono text-[#0d2244] font-black bg-gold-50/80 px-2.5 py-1 rounded-md">
                      {pup.gender}
                    </span>
                  </div>
                  
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                    Birth: {new Date(pup.birthDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} | {pup.weight}
                  </span>

                  <p className="text-xs text-gray-500 line-clamp-2 mt-3 leading-relaxed font-medium">
                    {pup.description}
                  </p>

                  {/* Characteristics tag pills */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {pup.characteristics.slice(0, 3).map((c, i) => (
                      <span key={i} className="text-[9px] font-mono text-stone-500 bg-[#fbf9f6] border border-gray-200/60 px-2.5 py-0.5 rounded-md font-bold uppercase">
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* LINEAGE */}
                  <div className="border-t border-gray-100 pt-3 mt-5 text-[10px] text-gray-400 space-y-0.5">
                    <span className="block font-black text-[#0d2244]/75 uppercase tracking-wider text-[9px] font-mono">Certified Heritage:</span>
                    <span className="block truncate">🐾 Sire: {pup.parents.sire.split('(')[0]}</span>
                    <span className="block truncate">🐾 Dam: {pup.parents.dam.split('(')[0]}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-5 flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Adoption Cost</span>
                    <span className="block text-xl font-black text-[#0d2244]">${pup.price}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPuppy(pup);
                      setTab('puppies');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 bg-[#0d2244] hover:bg-gold-500 text-white hover:text-[#0d2244] font-black font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all transform duration-200 cursor-pointer"
                  >
                    MEET {pup.name.toUpperCase()}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW SECTION: VERIFIED RANCH LIFE & AUTHENTIC MOMENTS SHOWCASE */}
      <section className="bg-gradient-to-b from-white to-[#fcfaf7] py-20 border-t border-gold-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center space-x-1.5 bg-gold-500/10 border border-gold-500/25 px-3 py-1 rounded-full text-gold-700 text-[10px] font-mono font-black uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
              <span>Anti-Scam &amp; Absolute Trust Initiative</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-navy-950 tracking-tight">
              Verified <span className="text-gold-500 italic font-serif font-medium">Real-Life</span> Ranch Moments
            </h2>
            <p className="text-sm text-stone-500 mt-4 leading-relaxed font-serif italic max-w-2xl mx-auto">
              "We believe a reputable breeder maintains absolute visual transparency. Every puppy, health inspection, and parent dog is photographed live parent-side at our private valley acreage. No stock imagery, no generic placeholders — just honest, certified goldens."
            </p>
          </div>

          {/* Interactive filter tab headers */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveGalleryFilter('all')}
              className={`px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider border transition-all cursor-pointer ${
                activeGalleryFilter === 'all' 
                  ? 'bg-navy-950 text-white border-navy-950' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gold-500'
              }`}
            >
              All Moments
            </button>
            <button
              onClick={() => setActiveGalleryFilter('social')}
              className={`px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider border transition-all cursor-pointer ${
                activeGalleryFilter === 'social' 
                  ? 'bg-navy-950 text-white border-navy-950' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gold-500'
              }`}
            >
              Socialization
            </button>
            <button
              onClick={() => setActiveGalleryFilter('vet')}
              className={`px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider border transition-all cursor-pointer ${
                activeGalleryFilter === 'vet' 
                  ? 'bg-navy-950 text-white border-navy-950' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gold-500'
              }`}
            >
              Vet Inspections
            </button>
            <button
              onClick={() => setActiveGalleryFilter('training')}
              className={`px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider border transition-all cursor-pointer ${
                activeGalleryFilter === 'training' 
                  ? 'bg-navy-950 text-white border-navy-950' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gold-500'
              }`}
            >
              Training &amp; ENS
            </button>
          </div>

          {/* PICTURE EXHIBITION GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item) => (
                <motion.div 
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -8 }}
                  className="bg-white border border-gold-150/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group text-left"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gold-50">
                    <EditableImage 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 left-3 bg-navy-950/80 backdrop-blur-sm text-gold-400 text-[9px] font-mono font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-white/5">
                      {item.tag}
                    </span>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-black text-navy-950 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                    <div className="border-t border-gold-100/50 pt-3 mt-4 flex items-center justify-between text-[9px] font-mono font-bold text-stone-400">
                      <span>RANCH ALIGNED</span>
                      <span className={`px-2 py-0.5 rounded font-black border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-stone-400 font-sans font-medium">
              * Families are welcome to schedule visual video checkins or direct pickups at our gated valley facilities.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4: THE MATCHMAKER BREEDERS QUIZ */}
      <section id="matchmaker-quiz-section" className="bg-gradient-to-br from-[#0d2244] via-[#06152a] to-[#0d2244] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0d2244]/45 mix-blend-multiply"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          
          <div className="inline-flex items-center space-x-1.5 bg-yellow-400/10 border border-yellow-500/25 px-3 py-1 rounded-full text-yellow-400 text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-4">
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            <span>Interactive Matchmaker Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">Find Your Ideal Golden Retriever</h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto mt-2 mb-12">Take our high-precision personality matchmaker. We correlate parent temperaments and household context to find your perfect puppy.</p>

          <div className="max-w-2xl mx-auto text-left">
            <PuppyMatcherQuiz 
              puppies={puppies} 
              onMatch={(name) => setMatchedPuppyName(name)} 
              setTab={setTab} 
            />
          </div>

        </div>
      </section>

      {/* SECTION 5: BREEDER PHILOSOPHY */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center text-left">
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gold-500/10 rounded-3xl -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
            <EditableImage 
              imageId="breeder-philosophy-parents"
              src="/images/sire_dam_parents_1782218119495.jpg" 
              alt="Golden Retriever parents standing proudly together" 
              className="relative w-full h-[400px] object-cover rounded-3xl shadow-sm border border-gray-150"
            />
          </div>

          <div className="flex flex-col space-y-5">
            <span className="text-xs font-mono font-bold text-gold-600 tracking-widest uppercase">Reputed Breeder Guidelines</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d2244] leading-tight">Why Golden Paws Home Stands Apart</h2>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              We operate under strict ethical breeding protocols. We do not support high-yield commercial volumes. Instead, we match limited pairings yearly, focusing heavily on health metrics, bone structure alignment, and social adaptability.
            </p>

            <div className="space-y-4 mt-2">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gold-500/10 rounded-xl text-gold-600 mt-0.5 flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0d2244]">Early Neurological Stimulation</h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium leading-relaxed">Daily biosensory manipulation from Day 3 prompts vascular tone and immune defense heights, resulting in excellent puppy adaptivity.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gold-500/10 rounded-xl text-gold-600 mt-0.5 flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0d2244]">Rigid Pediatric Checkups</h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium leading-relaxed">Each baby undergoes dual clinical evaluations, systematic microchipping, strict deworming schedules, and receives detailed vet health report logs.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gold-500/10 rounded-xl text-gold-600 mt-0.5 flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0d2244]">Lifetime Breeder Return Network</h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium leading-relaxed">Under no circumstance should our dogs end up on public rescue directories. We offer direct buybacks and lifelong consultation support.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
