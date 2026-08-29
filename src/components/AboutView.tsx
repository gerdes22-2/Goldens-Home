import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Heart, Award, Star, History, Users, Search, 
  CheckCircle, HelpCircle, Activity, Sparkles, BookOpen, 
  ArrowRight, Compass, ShieldAlert, BadgeInfo, Calendar, Clock, Smile
} from 'lucide-react';
import HealthAuditView from './HealthAuditView';
import { EditableImage } from './ImageEditContext';

interface AboutViewProps {
  setTab?: (tab: string) => void;
}

export default function AboutView({ setTab }: AboutViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState<number>(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  // Chronological Puppy Development Stages (Experience Timeline)
  const DEVELOPMENT_STAGES = [
    {
      day: "Day 3 - 16",
      title: "BioSens / Early Neurological Stimulation (ENS)",
      desc: "Tactile, thermal, and motion drills applied daily to stimulate cardiac and immune performance.",
      details: "ENS stimulates early circulatory function and adrenal glands, creating an adult golden retriever that exhibits increased cardiac resilience, robust immune responses, and deep stress-tolerance thresholds under novel environments.",
      badge: "NEUROLOGICAL BASE"
    },
    {
      day: "Weeks 3 - 4",
      title: "Auditory Socialization & Transitional Weaning",
      desc: "Introduction to mild real-life household acoustics and high-nutrition organic formula.",
      details: "We play acoustic matrices (thunder, lawn mowers, kitchen sounds, vacuum cleaners) at specialized frequencies while puppies explore puppy boxes. This transforms startle-reflex indices into inquisitive, calm investigation behaviors.",
      badge: "SENSORY HORIZONS"
    },
    {
      day: "Weeks 5 - 6",
      title: "Hippocampal Exploration & Social Play",
      desc: "Spacious outdoor valley pasture runs. Daily physical coordination hurdles and group play.",
      details: "Puppies migrate to outdoor sensory zones. They navigate wooden log balance beams, low step stairs, and multiple gravel, pasture, and mulch terrains. This shapes proprioception, leg muscles, and natural pack logic.",
      badge: "COGNITIVE STRENGTH"
    },
    {
      day: "Weeks 7 - 8",
      title: "Leash Conditioning & Dual Clinic Clearances",
      desc: "Initial harness testing, mild crate habituation, and systematic veterinary clearance logs.",
      details: "Every candidate undergoes microchipping and a 25-step physical inspection. We assess bite occlusion, joint laxity, heart valve murmurs, and conduct initial leash-walking drills using a highly gentle pressure-release system.",
      badge: "CLINICAL STATUS"
    },
    {
      day: "Weeks 9 - 10",
      title: "Adoption Orientation & Lifestyle Matching",
      desc: "Transition to forever families, detailed health record handoffs, and customized training blueprints.",
      details: "Each puppy departs with an individual behavioral dossier. We train you on the exact commands, schedule, and feed matrices they recognize. The outcome is a seamless integration that avoids typical home adjustment anxieties.",
      badge: "FOREVER COMPANION"
    }
  ];

  // Parent metadata registry
  const PARENT_DOGS = [
    {
      id: "RUSTY-098",
      name: "Grand Champion Rusty of Golden Paws",
      role: "Stud / Sire (Father)",
      breed: "Purebred Golden Retriever (Honey Golden)",
      title: "AM CAN CH (American & Canadian Champion Lineage)",
      ofaHips: "OFA Excellent (GR-129482E24M-VPI)",
      ofaElbows: "OFA Normal (GR-EL5032M24-VPI)",
      ofaEyes: "CAER Clear (May 2026 - GR-EYE12932)",
      ofaHeart: "Advanced Cardiac Clear (GR-BCA2043/M)",
      genetics: {
        prcdPRA: "Clear / Normal (Non-Carrier)",
        prcdPRA1: "Clear / Normal",
        prcdPRA2: "Clear / Normal",
        ichthyosis: "Clear / Normal"
      },
      image: "/src/assets/images/patriotic_goldens_bandana_1782303395345.jpg"
    },
    {
      id: "BELLA-145",
      name: "Lady Bella of Amber Acres",
      role: "Dam (Mother)",
      breed: "Purebred Golden Retriever (Cream)",
      title: "AKC National Champion Grandsire Ancestry",
      ofaHips: "OFA Good (GR-133591G27F-VPI)",
      ofaElbows: "OFA Normal (GR-EL5542F27-VPI)",
      ofaEyes: "CAER Clear (April 2026 - GR-EYE15219)",
      ofaHeart: "Cardiac Normal (GR-CA4129/F-VPI)",
      genetics: {
        prcdPRA: "Clear / Normal (Non-Carrier)",
        prcdPRA1: "Clear / Normal",
        prcdPRA2: "Carrier / Unaffected (Safe Pairing)",
        ichthyosis: "Clear / Normal"
      },
      image: "/src/assets/images/breeder_two_fluffy_pups_1782303458269.jpg"
    }
  ];

  const filteredParents = PARENT_DOGS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#fdfcfb] min-h-screen pt-32 pb-32 text-[#0d2244] text-left">
      
      {/* HEADER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-4"
        >
          <span className="text-[10px] font-mono font-black text-gold-600 tracking-[0.4em] uppercase block">
            THE SIGNATURE RANCH EXPERIENCE
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none text-navy-950">
            Designing a <span className="text-gold-500 italic font-serif font-medium">Bespoke</span> Life
          </h1>
          <p className="text-sm sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            At Golden Paws Home, breeding is a multi-generational standard. Discover how we balance certified biology with continuous, heart-centered ranch socialization.
          </p>
        </motion.div>
      </section>

      {/* COMPREHENSIVE STORY & FOUNDER BLOCK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="flex items-center space-x-2.5 text-gold-600">
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400">Our Heritage Story</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-navy-950 leading-tight">
              Sustaining the Pure <span className="text-gold-500 italic font-serif font-medium">Integrity</span> of Golden Retrievers.
            </h2>
            
            <div className="space-y-6 text-sm text-stone-500 leading-relaxed font-medium">
              <p>
                Founded on our private tranquil valley pasture, Golden Paws emerged from a vital mission: to combat the dilution of the Golden Retriever's legendary gentle nature in mass-market commercialized breeding. We set out to establish a sanctuary of absolute biological and behavioral standards.
              </p>
              <p>
                We carefully limit our scope to just three planned litters per year. This exclusivity ensures that every single puppy lives in the center of our home, experiencing continuous hands-on interaction, BioSens early stimulation, and customized confidence building from their very first breath.
              </p>
              <p>
                By preserving multi-generational champion genetics from prestigious international bloodlines and enforcing rigid orthopedic clearances, we consistently deliver healthy, stress-resilient companions destined for a lifetime of devotion.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gold-100/60">
              <div>
                <h4 className="text-navy-950 font-black text-4xl mb-1">28+ Years</h4>
                <p className="text-[10px] uppercase font-mono font-black tracking-widest text-gold-600">Champion Registry</p>
              </div>
              <div>
                <h4 className="text-navy-950 font-black text-4xl mb-1">100% Passed</h4>
                <p className="text-[10px] uppercase font-mono font-black tracking-widest text-gold-600">OFA Cleared Sires &amp; Dams</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            {/* Elegant Founder Card Frame */}
            <div className="relative z-10 p-10 sm:p-12 bg-[#0d2244] text-white rounded-[2.5rem] shadow-xl border border-gold-500/15 overflow-hidden">
              {/* Background ambient light */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <Sparkles className="w-10 h-10 text-gold-400 mb-8" />
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gold-500 rounded-full blur-md opacity-35"></div>
                    <EditableImage 
                      src="/src/assets/images/ciara_breeder_portrait_1782303471681.jpg" 
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-gold-500 relative" 
                      alt="Ciara Wallen - Breeding Director" 
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">Ciara Wallen</h4>
                    <p className="text-gold-400 text-[10px] font-mono font-black uppercase tracking-widest">Breeding Director</p>
                  </div>
                </div>
                
                <p className="text-gray-200 font-serif italic text-base sm:text-lg leading-relaxed border-t border-white/5 pt-6">
                  "Genetic lineage is the foundation, but character is our masterwork. We believe a puppy's soul should reflect the quiet serenity of the valley sunset—gentle, fearless, and unconditionally loving."
                </p>
              </div>
            </div>
            
            {/* Visual glow element */}
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gold-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          </motion.div>

        </div>
      </section>

      {/* INTERACTIVE EXPERIENCE TIMELINE SECTION */}
      <section className="bg-gradient-to-b from-[#fdfcfb] to-[#fbf9f5] py-24 border-t border-gold-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center space-x-1.5 bg-gold-500/15 text-gold-700 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider mb-4">
              <Compass className="w-4.5 h-4.5 text-gold-600" />
              <span>THE DEVELOPMENT MILESTONES</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-navy-950 tracking-tight leading-none">
              Interactive <span className="text-gold-500 italic font-serif font-medium">Ranch Life</span> Journey
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-4 leading-relaxed font-medium">
              We subject our litters to an intensive behavioral blueprint from day 3 to 10 weeks. Click through the timeline to audit our structural development milestones.
            </p>
          </div>

          {/* Timeline Navigation Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto mb-10">
            {DEVELOPMENT_STAGES.map((stage, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStage(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  activeStage === idx
                    ? 'bg-[#0d2244] border-[#0d2244] text-white shadow-lg'
                    : 'bg-white border-stone-200 text-stone-500 hover:border-gold-300 hover:bg-gold-50/10'
                }`}
              >
                <div className={`text-[9px] font-mono font-black uppercase tracking-wider mb-1 ${activeStage === idx ? 'text-gold-400' : 'text-stone-400'}`}>
                  {stage.day}
                </div>
                <div className="text-[11px] font-black line-clamp-1">
                  {stage.title.split(' & ')[0].split(' / ')[0]}
                </div>
              </button>
            ))}
          </div>

          {/* Active Timeline Screen */}
          <div className="bg-white rounded-3xl border border-gold-100 p-8 md:p-12 max-w-5xl mx-auto shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-4 space-y-4 text-left">
                  <span className="px-3 py-1 bg-gold-500/10 border border-gold-500/20 rounded-md text-[9px] font-mono font-black text-gold-700 tracking-wider uppercase">
                    {DEVELOPMENT_STAGES[activeStage].badge}
                  </span>
                  <div className="text-3xl font-serif italic text-gold-500 font-bold">{DEVELOPMENT_STAGES[activeStage].day}</div>
                  <h3 className="text-xl font-black text-navy-950 leading-snug">{DEVELOPMENT_STAGES[activeStage].title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-medium">{DEVELOPMENT_STAGES[activeStage].desc}</p>
                </div>

                <div className="lg:col-span-8 bg-gold-50/20 border border-gold-100/60 rounded-2xl p-6 sm:p-8 space-y-6 text-left">
                  <div className="flex items-center space-x-2 text-gold-600 border-b border-gold-100 pb-4">
                    <ShieldCheck className="w-5 h-5 text-gold-500" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest">Clinical Breeding Specification</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-serif italic">
                    "{DEVELOPMENT_STAGES[activeStage].details}"
                  </p>
                  <div className="flex items-center space-x-4 pt-2 text-[10px] font-mono font-black text-stone-400">
                    <span className="flex items-center"><Smile className="w-3.5 h-3.5 text-gold-500 mr-1.5" /> High Social Adaptability</span>
                    <span className="flex items-center"><Activity className="w-3.5 h-3.5 text-gold-500 mr-1.5" /> Enhanced Cardiac Vigor</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* HEALTH AUDIT EMBEDDED BOARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HealthAuditView />
      </section>

      {/* THE GENOMIC ARCHIVES (DNA REGISTRY PORTAL) */}
      <section className="bg-[#09152b] text-white py-24 relative overflow-hidden border-t border-b border-gold-500/10">
        {/* Background visual graphics */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-gold-400 text-[10px] font-mono font-black uppercase tracking-[0.3em] block">
              THE GENOMIC PORTAL &amp; HERITAGE SEARCH
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-none">
              Biological <span className="text-gold-500">Transparency</span> Registry
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed">
              We provide direct, public access to our verified genetic parent directory. Audit physical registrations, DNA charts, and CAER ophthalmic certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left selector bar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search parent by name or ID (RUSTY / BELLA)..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-gold-500 transition-all font-mono placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-3">
                {filteredParents.map((p) => {
                  const isSelected = selectedParent === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedParent(isSelected ? null : p.id)}
                      className={`w-full p-5 text-left rounded-2xl border transition-all duration-300 flex items-center space-x-4 cursor-pointer group ${
                        isSelected 
                          ? 'bg-gold-500 border-gold-500 text-navy-950 scale-[1.01] shadow-xl shadow-gold-500/10' 
                          : 'bg-white/5 border-white/5 text-white hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <EditableImage 
                        imageId={`parent-thumbnail-${p.id}`}
                        src={p.image} 
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0" 
                        alt={p.name} 
                      />
                      <div className="flex-grow min-w-0">
                        <span className={`text-[8px] font-mono font-black uppercase tracking-widest block mb-0.5 ${isSelected ? 'text-navy-950/70' : 'text-gold-400'}`}>
                          {p.role}
                        </span>
                        <h4 className="font-black text-xs sm:text-sm tracking-tight truncate">{p.name}</h4>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right details read-out board */}
            <div className="lg:col-span-8 bg-[#0a1833] border border-white/5 rounded-3xl p-6 sm:p-10 relative shadow-2xl">
              <AnimatePresence mode="wait">
                {selectedParent ? (
                  <motion.div
                    key={selectedParent}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8 text-left"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5">
                      <div>
                        <span className="text-[9px] font-mono text-gold-400 font-extrabold uppercase tracking-widest">
                          ID: {PARENT_DOGS.find(idx => idx.id === selectedParent)?.id}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white mt-1">{PARENT_DOGS.find(idx => idx.id === selectedParent)?.name}</h3>
                        <p className="text-gold-500 text-[9px] font-mono font-bold uppercase tracking-wider mt-1">
                          {PARENT_DOGS.find(idx => idx.id === selectedParent)?.title}
                        </p>
                      </div>
                      <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-mono font-black uppercase rounded-lg">
                        Health Status: Superior
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Skeletal clearances */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-gray-400 border-b border-white/5 pb-2 flex items-center">
                          <Activity className="w-3.5 h-3.5 mr-2 text-gold-400" />
                          OFA SKELETAL CLEARANCES
                        </h4>
                        <div className="space-y-3">
                          <DataRow label="Hip Dysplasia Assessment" value={PARENT_DOGS.find(idx => idx.id === selectedParent)?.ofaHips.split(' (')[0] || ''} />
                          <DataRow label="Elbow Dysplasia Pass" value={PARENT_DOGS.find(idx => idx.id === selectedParent)?.ofaElbows.split(' (')[0] || ''} />
                          <DataRow label="Ophthalmic CAER Check" value={PARENT_DOGS.find(idx => idx.id === selectedParent)?.ofaEyes.split(' (')[0] || ''} />
                          <DataRow label="Advanced Cardiac Echo" value={PARENT_DOGS.find(idx => idx.id === selectedParent)?.ofaHeart.split(' (')[0] || ''} />
                        </div>
                      </div>

                      {/* DNA panel clearances */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-gray-400 border-b border-white/5 pb-2 flex items-center">
                          <Dna className="w-3.5 h-3.5 mr-2 text-gold-400" />
                          GENETIC DNA SEQUENCING
                        </h4>
                        <div className="space-y-3">
                          <DataRow label="PRCD-PRA 1 Variant" value={PARENT_DOGS.find(idx => idx.id === selectedParent)?.genetics.prcdPRA1 || ''} />
                          <DataRow label="PRCD-PRA 2 Variant" value={PARENT_DOGS.find(idx => idx.id === selectedParent)?.genetics.prcdPRA2 || ''} />
                          <DataRow label="Genomic PRA Variant" value={PARENT_DOGS.find(idx => idx.id === selectedParent)?.genetics.prcdPRA || ''} />
                          <DataRow label="Ichthyosis (ICH1) Status" value={PARENT_DOGS.find(idx => idx.id === selectedParent)?.genetics.ichthyosis || ''} />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-[10px] text-gray-400 leading-normal font-sans italic">
                      * Official physical copies of Orthopedic Foundation for Animals (OFA) and veterinary certifications are dispatched along with your official adoption contracts.
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-80 flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="p-6 bg-white/5 rounded-full border border-white/5 text-gold-400">
                      <Search className="w-8 h-8 opacity-40 animate-pulse" />
                    </div>
                    <p className="text-gray-400 text-[10px] font-mono font-black uppercase tracking-widest max-w-xs leading-normal">
                      Select a parent pedigree line on the left to initialize clinical readout charts
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* PILLARS OF EXCELLENCE GRID */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-[10px] font-mono font-black text-gold-600 uppercase tracking-widest">
            THE FIVE PILLARS OF DEVELOPMENT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">Our Five Commitments to Families</h2>
          <p className="text-xs text-gray-500">
            We structure our daily operations around five rigorous pillars, ensuring our golden retrievers enter your home fully prepared.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {PILLARS.map((p, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 bg-white border border-gold-100 rounded-2xl hover:shadow-lg transition-all text-left flex flex-col justify-between"
            >
              <div>
                <div className="text-gold-500 font-serif italic text-3xl font-bold mb-3">{p.num}</div>
                <h4 className="text-navy-950 font-black text-xs sm:text-sm uppercase tracking-widest mb-3 leading-tight whitespace-pre-line">{p.title}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-serif">{p.body}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gold-50/50 flex items-center text-[9px] font-mono text-gold-600 font-bold">
                <span>VERIFIED STANDARD</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* DIRECT PAGE ACTION LINKS */}
      {setTab && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-navy-950 to-navy-900 rounded-3xl p-8 border border-gold-500/30 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-mono font-black text-gold-400 uppercase tracking-widest bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
                Continue Your Journey
              </span>
              <h3 className="text-xl font-black mt-2">Ready to Meet Our Bloodlines & Puppies?</h3>
              <p className="text-stone-300 text-xs mt-1">Jump directly to any section of our ranch program below.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => { setTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-2"
              >
                <span>🏠 Home</span>
              </button>
              <button
                onClick={() => { setTab('parents'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-gold-500 hover:text-navy-950 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Breeder Parents →</span>
              </button>
              <button
                onClick={() => { setTab('puppies'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-6 py-3 rounded-2xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Available Puppies →</span>
              </button>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

function DataRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-2">
      <span className="text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="font-bold text-white bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[9px]">
        {value}
      </span>
    </div>
  );
}

const PILLARS = [
  { num: "01", title: "Elite\nNutrition", body: "Scientific, high-protein nutrition diets optimized for rapid skeletal development, cardiac strength, and high cognitive growth." },
  { num: "02", title: "Neurological\nConditioning", body: "Proprietary BioSens neurological thermal and tactile stimulation performed from Day 3 to Day 16 of life." },
  { num: "03", title: "Valley\nPasture", body: "150 acres of secure private sensory acreage to cultivate natural navigation logic and strong pack-social balance." },
  { num: "04", title: "Transitional\nHabituation", body: "Structured crate acclimation, household acoustic exposure drills, and early potty-training foundations before departure." },
  { num: "05", title: "Sovereign\nClinical Clears", body: "Rigid veterinary physical diagnostics, microchipping, strict deworming logs, and standard genetic wellness passes." }
];

function Dna({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0a7.5 7.5 0 10-15 0"></path>
    </svg>
  );
}
