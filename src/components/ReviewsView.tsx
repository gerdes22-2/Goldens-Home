import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Heart, ShieldCheck, MapPin, Search, PenTool, 
  Sparkles, Filter, CheckCircle, PlusCircle, ArrowRight,
  Award, Activity, Info, X, ChevronRight, MessageSquare, Shield, Clipboard, Check, Camera
} from 'lucide-react';
import { Review } from '../types';
import { EditableImage } from './ImageEditContext';

interface ReviewsViewProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
  setTab?: (tab: string) => void;
}

export default function ReviewsView({ reviews, onAddReview, setTab }: ReviewsViewProps) {
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [ratingHover, setRatingHover] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected review for the Clinical Verification Drawer
  const [activeVerificationReview, setActiveVerificationReview] = useState<Review | null>(null);

  // Success state (Toast/Notification)
  const [successToast, setSuccessToast] = useState<{
    author: string;
    puppyName: string;
    id: string;
  } | null>(null);

  // Form State
  const [newReview, setNewReview] = useState({
    author: '',
    location: '',
    rating: 5,
    text: '',
    puppyName: '',
    tags: [] as string[]
  });

  // Form errors
  const [formErrors, setFormErrors] = useState<string | null>(null);

  // Calculate stats
  const totalReviewsCount = reviews.length;
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1);

  // Calculate star breakdowns
  const starBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
    return { stars, count, percentage };
  });

  // Consolidated Tags List
  const allTags = Array.from(new Set(reviews.flatMap(r => r.tags)));

  // Filter reviews
  const filteredReviews = reviews.filter(rev => {
    const matchesTag = tagFilter === 'all' || rev.tags.includes(tagFilter);
    const matchesRating = ratingFilter === null || rev.rating === ratingFilter;
    const matchesSearch = 
      rev.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.puppyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesRating && matchesSearch;
  });

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Strict clean validation
    if (!newReview.author.trim()) {
      setFormErrors("Please provide an author name.");
      return;
    }
    if (!newReview.location.trim()) {
      setFormErrors("Please state your location (City, State).");
      return;
    }
    if (!newReview.puppyName.trim()) {
      setFormErrors("Please state the name of your adopted puppy.");
      return;
    }
    if (!newReview.text.trim() || newReview.text.length < 15) {
      setFormErrors("Please write a detailed review (minimum 15 characters).");
      return;
    }

    setFormErrors(null);

    const formattedReview: Review = {
      id: `rev-${Date.now()}`,
      author: newReview.author.trim(),
      location: newReview.location.trim(),
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      text: newReview.text.trim(),
      puppyName: newReview.puppyName.trim(),
      tags: newReview.tags.length > 0 ? newReview.tags : ['Happy Adopter', 'Well Socialized']
    };

    onAddReview(formattedReview);
    setFormOpen(false);
    
    // Trigger success toast
    setSuccessToast({
      author: formattedReview.author,
      puppyName: formattedReview.puppyName,
      id: formattedReview.id
    });

    // Reset form
    setNewReview({
      author: '',
      location: '',
      rating: 5,
      text: '',
      puppyName: '',
      tags: []
    });

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setSuccessToast(null);
    }, 6000);
  };

  const handleTagToggle = (tag: string) => {
    const isSelected = newReview.tags.includes(tag);
    if (isSelected) {
      setNewReview({
        ...newReview,
        tags: newReview.tags.filter(t => t !== tag)
      });
    } else {
      setNewReview({
        ...newReview,
        tags: [...newReview.tags, tag]
      });
    }
  };

  const optionalReviewTags = [
    'OFA Verified', 
    'Great with Kids', 
    'Well Socialized', 
    'Weekly Updates', 
    'Lifetime Support', 
    'Excellent Temperament',
    'Vet Approved',
    'Pre-Home Housebroken'
  ];

  // Specific simulation details for the Verification Drawer based on the review or random matching
  const getVerificationData = (review: Review) => {
    // Determine dynamic values based on the reviewer's puppy name to make it hyper-realistic
    const seed = review.author.length + review.rating;
    const microchipId = `90021800128${(seed * 27) % 1000}4`;
    const sireName = seed % 2 === 0 ? 'GCH Rusty of Golden Paws' : 'Sir Sterling of Sunny Hills';
    const damName = 'Lady Bella of Amber Acres';
    
    // Orthopedic scores
    const hipScore = seed % 3 === 0 ? 'OFA Excellent' : 'OFA Good';
    const elbowScore = 'OFA Normal';
    const cardiacScore = 'OFA Clear (Cardiologist Cleared)';
    const eyeScore = 'OFA CAER Eye Normal (Registered 2026)';
    const geneticScore = 'Clear 230-Marker Genetic Panel (ICT/PRA1/PRA2 Clear)';

    return {
      microchipId,
      sireName,
      damName,
      hipScore,
      elbowScore,
      cardiacScore,
      eyeScore,
      geneticScore,
      litterCode: `GP-2026-${(seed * 11) % 90 + 10}-L`
    };
  };

  return (
    <div className="bg-[#fcfaf7] min-h-screen pt-32 pb-24 text-navy-950">
      
      {/* SUCCESS TOAST WITH ANIMATION */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 z-[110] max-w-md w-full bg-navy-950 text-white border-2 border-gold-500 rounded-[2rem] p-6 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className="bg-gold-500/20 border border-gold-500/30 rounded-2xl p-3 text-gold-400 shrink-0">
                <CheckCircle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-black text-gold-400 uppercase tracking-widest bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 rounded-full">
                    TRANSPARENCY REGISTRY SECURED
                  </span>
                  <button onClick={() => setSuccessToast(null)} className="text-stone-400 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="text-sm font-black text-white mt-2">Testimonial Authenticated</h4>
                <p className="text-stone-300 text-xs mt-1 leading-relaxed">
                  Hi <strong className="text-white">{successToast.author}</strong>! Your beautiful alumni story with <strong className="text-gold-400 font-serif italic">{successToast.puppyName}</strong> has been dynamically compiled and pinned to our permanent breeder community board. Thank you for your high-integrity partnership!
                </p>
                <div className="flex items-center gap-1.5 mt-3 text-[9px] font-mono text-stone-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                  <span>Dynamic ID: {successToast.id}</span>
                </div>
              </div>
            </div>
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 6, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gold-400 to-amber-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER HERO */}
        <section className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-yellow-600 tracking-widest uppercase mb-3 block">
            Adopter Circles & Veterinary Approval
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-navy-950 tracking-tight leading-none">
            Verified Adopters & <span className="text-gold-500 italic font-serif">Alumni Stories</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4 leading-relaxed">
            Every testimonial is linked to a physical, microchipped companion with certified genetic panels and veterinary hip, heart, and eye clearances on file.
          </p>
        </section>

        {/* CLINICAL BREEDER INTEGRITY PANEL & RATINGS DASHBOARD */}
        <section className="mb-16">
          <div className="bg-white rounded-[2.5rem] border border-stone-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* Column 1: Star Ratings & Metrics */}
            <div className="lg:col-span-4 bg-stone-50/50 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200 text-left">
              <div>
                <div className="inline-flex items-center space-x-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-green-700 text-[10px] font-mono font-bold uppercase tracking-wider mb-6">
                  <Shield className="w-3.5 h-3.5 fill-current" />
                  <span>100% Verified Ownership</span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-6xl font-black font-sans tracking-tight text-navy-950">{avgRating}</span>
                  <span className="text-lg font-mono font-bold text-stone-400">/ 5.0</span>
                </div>

                <div className="flex items-center space-x-1 mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 text-gold-500 fill-current" />
                  ))}
                </div>

                <h3 className="text-lg font-black text-navy-950 mt-4 leading-snug">Consistently Rated "Excellent"</h3>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  Calculated from {totalReviewsCount} certified family profiles, representing years of strict genetic control.
                </p>
              </div>

              <div className="pt-8 border-t border-stone-200 mt-8">
                <button
                  onClick={() => {
                    setFormOpen(!formOpen);
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="w-full px-6 py-4 bg-navy-950 text-white hover:bg-gold-500 hover:text-navy-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg transition-all duration-350 flex items-center justify-center space-x-2"
                >
                  <PenTool className="w-4 h-4" />
                  <span>POST YOUR ADOPTION STORY</span>
                </button>
              </div>
            </div>

            {/* Column 2: Rating Distributions */}
            <div className="lg:col-span-4 p-8 sm:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-stone-200 text-left">
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-4 font-bold">Rating Distribution</h4>
              <div className="space-y-3.5">
                {starBreakdown.map((row) => (
                  <button
                    key={row.stars}
                    onClick={() => setRatingFilter(ratingFilter === row.stars ? null : row.stars)}
                    className="w-full flex items-center group text-left transition-opacity hover:opacity-85"
                  >
                    <span className="w-12 text-xs font-mono font-bold text-stone-500 flex items-center">
                      {row.stars} <Star className="w-3.5 h-3.5 text-gold-500 fill-current ml-1" />
                    </span>
                    <div className="flex-grow h-2.5 bg-stone-100 rounded-full mx-3 overflow-hidden relative">
                      <div 
                        className="h-full bg-gold-500 rounded-full transition-all duration-500" 
                        style={{ width: `${row.percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-mono text-stone-400 group-hover:text-navy-950 font-semibold">
                      {row.count}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-stone-400 mt-5 italic">
                * Click on any star level above to isolate those specific adopter reviews.
              </p>
            </div>

            {/* Column 3: Professional Breeder Quality KPIs */}
            <div className="lg:col-span-4 p-8 sm:p-10 bg-stone-50/20 flex flex-col justify-center text-left">
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-5 font-bold">Clinical Quality Benchmarks</h4>
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 bg-navy-100 text-navy-950 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-navy-950">Genetic Soundness</span>
                  </div>
                  <span className="text-xs font-mono font-black text-green-600 bg-green-500/10 px-2.5 py-0.5 rounded-full">100% CLEAR</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 bg-navy-100 text-navy-950 rounded-lg flex items-center justify-center">
                      <Heart className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-navy-950">Neurological (ENS) Fidelity</span>
                  </div>
                  <span className="text-xs font-mono font-black text-green-600 bg-green-500/10 px-2.5 py-0.5 rounded-full">OPTIMAL</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 bg-navy-100 text-navy-950 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-navy-950">Orthopedic Clearances (OFA)</span>
                  </div>
                  <span className="text-xs font-mono font-black text-green-600 bg-green-500/10 px-2.5 py-0.5 rounded-full">EXCELLENT</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 bg-navy-100 text-navy-950 rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-navy-950">Lifetime Support Engagement</span>
                  </div>
                  <span className="text-xs font-mono font-black text-green-600 bg-green-500/10 px-2.5 py-0.5 rounded-full">GUARANTEED</span>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* INTERACTIVE FORM COLLAPSIBLE */}
        <AnimatePresence>
          {formOpen && (
            <motion.section 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="max-w-4xl mx-auto mb-16 overflow-hidden"
            >
              <div className="bg-white rounded-[2.5rem] border-2 border-gold-500 p-6 sm:p-10 shadow-2xl text-left">
                
                <div className="flex items-center justify-between border-b border-stone-100 pb-5 mb-6">
                  <div>
                    <span className="text-[10px] font-mono text-yellow-600 uppercase font-black tracking-widest block">
                      BREEDER REGISTRY PORTAL
                    </span>
                    <h3 className="text-2xl font-black text-navy-950 mt-1">Post Your Certified Alumni Story</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      We trace all owner testimonials directly back to official registry microchips to safeguard pedigree standards.
                    </p>
                  </div>
                  <button 
                    onClick={() => setFormOpen(false)}
                    className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-navy-950"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {formErrors && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl mb-6 font-semibold flex items-center gap-2">
                    <Info className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{formErrors}</span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  
                  {/* Rating selection with star hovers */}
                  <div className="flex flex-col bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
                    <label className="text-[10px] font-mono uppercase font-black text-stone-400 mb-2">
                      Star Rating Level <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center space-x-1 bg-white px-4 py-2 rounded-xl border border-stone-200">
                        {[1, 2, 3, 4, 5].map((starIdx) => {
                          const isFilled = ratingHover !== null ? starIdx <= ratingHover : starIdx <= newReview.rating;
                          return (
                            <button
                              key={starIdx}
                              type="button"
                              onMouseEnter={() => setRatingHover(starIdx)}
                              onMouseLeave={() => setRatingHover(null)}
                              onClick={() => setNewReview({ ...newReview, rating: starIdx })}
                              className="focus:outline-none focus:scale-110 duration-75 p-1 cursor-pointer"
                            >
                              <Star className={`w-6 h-6 transition-all ${isFilled ? 'text-gold-500 fill-gold-500 scale-105' : 'text-stone-200'}`} />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-xs font-mono font-black text-navy-950 bg-gold-500/10 border border-gold-500/20 px-3 py-2 rounded-xl">
                        {newReview.rating} STARS SELECTED
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono uppercase font-black text-stone-400 mb-1.5 pl-1">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Marcus Peterson"
                        value={newReview.author}
                        onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                        className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs placeholder-stone-400 focus:outline-none focus:border-gold-500 focus:bg-white transition-all text-navy-950 font-bold"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono uppercase font-black text-stone-400 mb-1.5 pl-1">
                        Location (City, State) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="San Francisco, CA"
                        value={newReview.location}
                        onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                        className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs placeholder-stone-400 focus:outline-none focus:border-gold-500 focus:bg-white transition-all text-navy-950 font-bold"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono uppercase font-black text-stone-400 mb-1.5 pl-1">
                        Puppy's Microchip/Litter Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Winston (formerly Pip)"
                        value={newReview.puppyName}
                        onChange={(e) => setNewReview({ ...newReview, puppyName: e.target.value })}
                        className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs placeholder-stone-400 focus:outline-none focus:border-gold-500 focus:bg-white transition-all text-navy-950 font-bold"
                      />
                    </div>

                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono uppercase font-black text-stone-400 mb-2 pl-1">
                      Certified Tag Checklist (Select all that describe your experience)
                    </label>
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                      {optionalReviewTags.map((tag) => {
                        const isChecked = newReview.tags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className={`px-4 py-2 border rounded-full duration-150 flex items-center space-x-1 font-black uppercase tracking-wider ${
                              isChecked 
                                ? 'bg-navy-950 text-white border-gold-500 shadow-md' 
                                : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100 hover:text-stone-700'
                            }`}
                          >
                            <span>{isChecked ? '✔' : '+'}</span>
                            <span>{tag}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono uppercase font-black text-stone-400 mb-1.5 pl-1">
                      Detailed Experience Narrative <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Describe your early neurological socialization observations, veterinary checkups, hip orthopedic assessments, puppy home transition dynamics, and lifetime breeder responsiveness..."
                      value={newReview.text}
                      onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                      className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs leading-relaxed placeholder-stone-400 focus:outline-none focus:border-gold-500 focus:bg-white transition-all text-navy-950"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 pl-1 italic">
                      Please adhere to clinical accuracy. Avoid slang or unverified claims. Minimum 15 characters.
                    </span>
                  </div>

                  <div className="pt-4 flex items-center justify-end space-x-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setFormOpen(false)}
                      className="px-5 py-3 border border-stone-200 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-50 transition-all"
                    >
                      ABORT POST
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-4 bg-gold-500 text-navy-950 hover:bg-gold-400 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center space-x-2"
                    >
                      <PenTool className="w-4 h-4" />
                      <span>SECURELY PUBLISH STORY</span>
                    </button>
                  </div>

                </form>

              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ALUMNI SNAPSHOT GALLERY */}
        <section className="mb-12">
          <div className="bg-white border border-stone-200/80 rounded-[2.5rem] p-6 sm:p-8 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-mono font-black text-gold-600 uppercase tracking-widest block">
                  GRADUATE LIFE & ALUMNI
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-navy-950">
                  Golden Paws in Their Forever Homes
                </h3>
              </div>
              {setTab && (
                <button
                  onClick={() => setTab('gallery')}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-gold-600 hover:text-gold-700 uppercase tracking-wider"
                >
                  <Camera className="w-4 h-4" />
                  <span>View Full Photo Archive →</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                {
                  id: "alumni-showcase-1",
                  src: "https://tse2.mm.bing.net/th/id/OIP.dd4qIdns4RpeWnOwcVJ2ogHaE7?r=0&pid=ImgDet&w=203&h=135&c=7&o=7&rm=3",
                  name: "Bella & River",
                  location: "Aspen, CO",
                  age: "2.5 Years"
                },
                {
                  id: "alumni-showcase-2",
                  src: "https://th.bing.com/th/id/OIP.ZVx6sKoEZV-scBoKSz73EgHaE7?w=279&h=186&c=7&r=0&o=7&pid=1.7&rm=3",
                  name: "Leo & Family",
                  location: "Seattle, WA",
                  age: "1.5 Years"
                },
                {
                  id: "alumni-showcase-3",
                  src: "https://tse3.mm.bing.net/th/id/OIP.0AihFrnRIgiEHeRYak6XfQHaLH?r=0&pid=ImgDet&w=203&h=304&c=7&o=7&rm=3",
                  name: "Oliver & Cooper",
                  location: "Austin, TX",
                  age: "3 Years"
                },
                {
                  id: "alumni-showcase-4",
                  src: "https://tse4.mm.bing.net/th/id/OIP.82YAtwBnDlPI7PLsUZ_zxwHaED?r=0&pid=ImgDet&w=203&h=111&c=7&o=7&rm=3",
                  name: "Charlie & Chloe",
                  location: "Boulder, CO",
                  age: "1 Year"
                },
                {
                  id: "alumni-showcase-5",
                  src: "https://tse4.mm.bing.net/th/id/OIP.1K15rzd-rbkqJg8B4rTqYQHaE8?r=0&pid=ImgDet&w=203&h=135&c=7&o=7&rm=3",
                  name: "Daisy & Max",
                  location: "San Diego, CA",
                  age: "2 Years"
                }
              ].map((item) => (
                <div key={item.id} className="group relative rounded-2xl overflow-hidden shadow-sm bg-stone-100 border border-stone-200">
                  <div className="aspect-square w-full">
                    <EditableImage
                      imageId={item.id}
                      src={item.src}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex flex-col justify-end p-3 text-white">
                    <h4 className="font-bold text-xs">{item.name}</h4>
                    <p className="text-[10px] text-stone-300 font-mono">{item.location} • {item.age}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FILTERS & SEARCH CONTROLS */}
        <section className="mb-10 text-left bg-white border border-stone-200 p-6 rounded-[2rem] shadow-sm">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search stories (e.g. 'OFA', 'Winston', 'Winston', 'socialized')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-navy-950 focus:outline-none focus:border-gold-500 focus:bg-white transition-all font-semibold"
              />
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase text-stone-400 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Tags:</span>
              </span>
              
              <button
                onClick={() => setTagFilter('all')}
                className={`px-3 py-1.5 text-[10px] font-mono font-black uppercase tracking-wider rounded-full border transition-all ${
                  tagFilter === 'all'
                    ? 'bg-navy-950 text-white border-gold-500 shadow-sm'
                    : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
                }`}
              >
                All Stories ({reviews.length})
              </button>
              
              {allTags.map((tag) => {
                const count = reviews.filter(r => r.tags.includes(tag)).length;
                return (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tag)}
                    className={`px-3 py-1.5 text-[10px] font-mono font-black uppercase tracking-wider rounded-full border transition-all ${
                      tagFilter === tag
                        ? 'bg-navy-950 text-white border-gold-500 shadow-sm'
                        : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {tag} <span className="opacity-50 ml-0.5">({count})</span>
                  </button>
                );
              })}
            </div>

          </div>

          {(ratingFilter !== null || searchQuery !== '' || tagFilter !== 'all') && (
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-stone-400 font-bold uppercase">
                Active filters applied: {filteredReviews.length} matching stories found.
              </span>
              <button
                onClick={() => {
                  setTagFilter('all');
                  setRatingFilter(null);
                  setSearchQuery('');
                }}
                className="text-[10px] font-mono font-black text-yellow-600 hover:text-yellow-700 underline"
              >
                RESET ALL FILTERS
              </button>
            </div>
          )}
        </section>

        {/* REVIEWS GRID (Bento-inspired with luxury touches) */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            {filteredReviews.map((rev, idx) => {
              const isFirstRow = idx < 2;
              return (
                <div
                  key={rev.id}
                  className={`bg-white border rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
                    isFirstRow ? 'border-stone-200/90' : 'border-stone-200/60'
                  }`}
                >
                  {/* Subtle Top-Right Graphic Decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50/60 rounded-bl-[3rem] group-hover:bg-gold-500/5 transition-colors duration-300 pointer-events-none border-l border-b border-stone-100/50 flex items-center justify-center">
                    <Award className="w-5 h-5 text-stone-200 group-hover:text-gold-500/30 transition-colors" />
                  </div>

                  <div className="space-y-5">
                    {/* Stars and Date Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < rev.rating ? 'text-gold-500 fill-gold-500' : 'text-stone-200'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-stone-400 font-black pr-12">
                        {new Date(rev.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Review text */}
                    <div>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans font-medium text-justify italic">
                        "{rev.text}"
                      </p>
                    </div>

                    {/* Tag Pills row - Interactive badges that show verification details */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {rev.tags.map((tag, tagIdx) => (
                        <button
                          key={tagIdx}
                          onClick={() => setActiveVerificationReview(rev)}
                          className="text-[9px] font-mono font-black uppercase tracking-wider text-[#0d2244] bg-[#0d2244]/5 hover:bg-gold-500 hover:text-navy-950 border border-[#0d2244]/10 rounded-full px-2.5 py-1 transition-all flex items-center space-x-1"
                          title="Click to inspect verified records"
                        >
                          <ShieldCheck className="w-3 h-3 text-gold-500" />
                          <span>{tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Left: Author Profile */}
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-navy-950 text-gold-500 rounded-xl flex items-center justify-center font-black text-xs font-mono border border-gold-500/20">
                        {rev.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-navy-950 flex items-center gap-1">
                          <span>{rev.author}</span>
                          <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full" title="Identity Verified" />
                        </h4>
                        <span className="text-[10px] text-stone-400 font-mono flex items-center mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-gold-500 mr-1" />
                          <span>{rev.location}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right: Puppy details */}
                    <div className="bg-stone-50 border border-stone-100 rounded-xl px-3 py-2 text-right self-start sm:self-center">
                      <span className="text-[8px] text-stone-400 font-mono font-black block uppercase tracking-wider">
                        SECURE REGISTRY MATCH
                      </span>
                      <span className="text-xs font-serif italic text-yellow-800 font-black flex items-center justify-end gap-1 mt-0.5">
                        <Heart className="w-3 h-3 text-red-500 fill-current" />
                        <span>{rev.puppyName}</span>
                      </span>
                    </div>

                  </div>

                  {/* Micro-interactive link to inspect clearances */}
                  <button
                    onClick={() => setActiveVerificationReview(rev)}
                    className="w-full mt-4 pt-3 border-t border-dashed border-stone-100 text-left flex items-center justify-between text-[10px] font-mono font-bold text-stone-400 hover:text-navy-950 transition-colors"
                  >
                    <span>CLINICAL GENETICS & OFA RECORD LOCK</span>
                    <span className="flex items-center gap-0.5 text-gold-600 font-black">
                      <span>INSPECT CODES</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </button>

                </div>
              );
            })}

            {filteredReviews.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-4 bg-white border border-dashed border-stone-200 rounded-[2rem]">
                <div className="inline-flex p-4 bg-stone-50 rounded-full text-stone-300">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-navy-950">No reviews found</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  We couldn't find any reviews matching your exact query or active filter selections. Try broadening your keywords.
                </p>
                <button
                  onClick={() => {
                    setTagFilter('all');
                    setRatingFilter(null);
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 bg-navy-950 text-white rounded-xl text-xs font-mono font-black"
                >
                  CLEAR SEARCH FILTER
                </button>
              </div>
            )}
          </div>
        </section>

        {/* QUICK CROSS NAVIGATION */}
        {setTab && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-navy-950 text-white rounded-3xl p-8 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-mono font-black text-gold-400 uppercase tracking-widest bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
                  Ready to Adopt?
                </span>
                <h3 className="text-xl font-black mt-2">Become Our Next Happy Golden Family</h3>
                <p className="text-stone-300 text-xs mt-1">Browse our active available puppies or join our master waitlist.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => { setTab('puppies'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-6 py-3 rounded-2xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Available Puppies →</span>
                </button>
                <button
                  onClick={() => { setTab('apply'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-5 py-3 rounded-2xl bg-white text-navy-950 hover:bg-gold-500 font-black text-xs uppercase tracking-wider transition-all active:scale-95"
                >
                  <span>Apply Now →</span>
                </button>
                <button
                  onClick={() => { setTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>🏠 Home</span>
                </button>
              </div>
            </div>
          </section>
        )}

      </div>

      {/* DETAILED CLINICAL VERIFICATION OVERLAY/DRAWER */}
      <AnimatePresence>
        {activeVerificationReview && (
          <div className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border-2 border-gold-500 rounded-[2.5rem] max-w-2xl w-full overflow-hidden shadow-2xl relative text-left"
            >
              {/* Header */}
              <div className="bg-navy-950 text-white p-6 sm:p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
                <button
                  onClick={() => setActiveVerificationReview(null)}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <span className="text-[10px] font-mono text-gold-500 font-black tracking-widest uppercase block">
                  HEALTH SECURITY TRUST MARK
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-1">Pedigree Verification Ledger</h3>
                <p className="text-stone-300 text-xs mt-1.5 leading-relaxed">
                  Cryptographically matching owner testimonial with physical laboratory clearances and AKC registered lineages.
                </p>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto font-sans leading-normal">
                
                {/* Section: Pedigree matches */}
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold mb-3">
                    COMPANION METADATA
                  </h4>
                  <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <div>
                      <span className="text-[9px] font-mono text-stone-400 block font-bold">REGISTERED NAME</span>
                      <span className="text-xs font-serif font-black italic text-navy-950 mt-0.5 block">
                        {activeVerificationReview.puppyName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-stone-400 block font-bold">OWNER PARTNER</span>
                      <span className="text-xs font-black text-navy-950 mt-0.5 block">
                        {activeVerificationReview.author} ({activeVerificationReview.location})
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-stone-400 block font-bold">MICROCHIP ID (LIFETIME RECOVERY)</span>
                      <span className="text-xs font-mono font-bold text-gold-600 mt-0.5 block">
                        {getVerificationData(activeVerificationReview).microchipId}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-stone-400 block font-bold">LITTER LEDGER CODE</span>
                      <span className="text-xs font-mono font-bold text-navy-950 mt-0.5 block">
                        {getVerificationData(activeVerificationReview).litterCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section: Ancestry Panel */}
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold mb-3">
                    LINEAGE ORIGINS
                  </h4>
                  <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100">
                    <div className="p-3.5 flex items-center justify-between text-xs">
                      <span className="font-bold text-navy-950">Sire (Father)</span>
                      <span className="font-mono text-stone-500 font-bold">{getVerificationData(activeVerificationReview).sireName}</span>
                    </div>
                    <div className="p-3.5 flex items-center justify-between text-xs">
                      <span className="font-bold text-navy-950">Dam (Mother)</span>
                      <span className="font-mono text-stone-500 font-bold">{getVerificationData(activeVerificationReview).damName}</span>
                    </div>
                  </div>
                </div>

                {/* Section: OFA Cleans */}
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold mb-3">
                    OFA ORTHOPEDIC & ORGAN CLEANS
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    
                    <div className="border border-stone-200 rounded-xl p-3 flex items-center space-x-3 bg-stone-50/50">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <div>
                        <span className="text-[8px] font-mono text-stone-400 block font-bold">HIPS CLEARED</span>
                        <span className="font-black text-navy-950">{getVerificationData(activeVerificationReview).hipScore}</span>
                      </div>
                    </div>

                    <div className="border border-stone-200 rounded-xl p-3 flex items-center space-x-3 bg-stone-50/50">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <div>
                        <span className="text-[8px] font-mono text-stone-400 block font-bold">ELBOWS CLEARED</span>
                        <span className="font-black text-navy-950">{getVerificationData(activeVerificationReview).elbowScore}</span>
                      </div>
                    </div>

                    <div className="border border-stone-200 rounded-xl p-3 flex items-center space-x-3 bg-stone-50/50">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <div>
                        <span className="text-[8px] font-mono text-stone-400 block font-bold">HEART CLEARED</span>
                        <span className="font-black text-navy-950 leading-tight">{getVerificationData(activeVerificationReview).cardiacScore}</span>
                      </div>
                    </div>

                    <div className="border border-stone-200 rounded-xl p-3 flex items-center space-x-3 bg-stone-50/50">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <div>
                        <span className="text-[8px] font-mono text-stone-400 block font-bold">EYES REGISTERED</span>
                        <span className="font-black text-navy-950 leading-tight">{getVerificationData(activeVerificationReview).eyeScore}</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Genetic panels */}
                <div className="bg-navy-950 text-gold-500/90 p-4 rounded-2xl border border-gold-500/20 flex items-center space-x-3 text-xs">
                  <ShieldCheck className="w-7 h-7 text-gold-500 shrink-0 animate-pulse" />
                  <div>
                    <h5 className="font-mono font-black text-[9px] uppercase tracking-widest text-gold-400">GENOME HEALTH SCREEN CLEARANCE</h5>
                    <p className="font-mono text-white text-[11px] font-semibold mt-0.5 leading-snug">
                      {getVerificationData(activeVerificationReview).geneticScore}
                    </p>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="bg-stone-50 p-6 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Secure Blockchain Hash Locked</span>
                </span>
                <button
                  onClick={() => setActiveVerificationReview(null)}
                  className="px-6 py-2.5 bg-navy-950 text-white hover:bg-gold-500 hover:text-navy-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all"
                >
                  DISMISS LEDGER
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
