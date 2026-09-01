import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, PhoneCall, Gift, CheckCircle, HelpCircle, 
  MapPin, ShieldCheck, Mail, FileText, ChevronRight, PenTool, Printer, Sparkles, MoveRight, Check, FileCheck, Info, Sparkle
} from 'lucide-react';
import { DOCUMENTS } from '../data';
import { EditableImage } from './ImageEditContext';

interface ProcessViewProps {
  setTab?: (tab: string) => void;
}

export default function ProcessView({ setTab }: ProcessViewProps) {
  const [activeDocId, setActiveDocId] = useState('doc1');
  const [signedDocIds, setSignedDocIds] = useState<string[]>([]);
  const [signerName, setSignerName] = useState('');
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [showApplicationSimulator, setShowApplicationSimulator] = useState(false);
  const [simulatorStatus, setSimulatorStatus] = useState<'idle' | 'submitting' | 'approved'>('idle');

  // Application simulator state
  const [appForm, setAppForm] = useState({
    fullName: '',
    experience: 'first-time',
    hasYard: 'yes',
    lifestyle: 'active',
    additionalNotes: ''
  });

  const activeDoc = DOCUMENTS.find(d => d.id === activeDocId) || DOCUMENTS[0];

  const handleSignSimulate = (e: FormEvent) => {
    e.preventDefault();
    if (!signerName.trim()) return;
    if (!signedDocIds.includes(activeDocId)) {
      setSignedDocIds(prev => [...prev, activeDocId]);
    }
  };

  const handleResetSignatures = () => {
    setSignedDocIds([]);
    setSignerName('');
  };

  const handleSimulateSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSimulatorStatus('submitting');
    setTimeout(() => {
      setSimulatorStatus('approved');
    }, 1500);
  };

  const steps = [
    {
      step: "01",
      icon: ClipboardCheck,
      title: "Adoption \nApplication",
      desc: "Architect your household profile. We evaluate matching logic and family dynamics to ensure a symbiotic placement.",
      detailedInstructions: "In this phase, you submit our comprehensive family questionnaire. We look at household activity levels, pet experience, yard security, and schedule compatibility to match the right temperament.",
      checklist: ["Submit detailed lifestyle questionnaire", "Review of answers by Ciara within 48 hours", "Initial compatibility rating assigned"],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp0DkPmtCv3OcVr8ca0K_vri73uK77dWNm1nozs4buJA&s"
    },
    {
      step: "02",
      icon: PhoneCall,
      title: "Selection \nSynthesis",
      desc: "A focused consultation to discuss genomic goals, planned litters, and early environment coordination.",
      detailedInstructions: "A 20-minute phone dialogue to discuss your aesthetic, size, and temperament preferences. We walk through upcoming sire/dam matching matrices to align with your seasonal timeline.",
      checklist: ["Schedule focused 1-on-1 dialogue", "Confirm coat color & gender preference", "Coordinate puppy delivery options"],
      image: "https://static.wixstatic.com/media/ca3310_50f4b673562249f4914835d407c157b9~mv2.jpeg/v1/fill/w_980,h_653,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ca3310_50f4b673562249f4914835d407c157b9~mv2.jpeg"
    },
    {
      step: "03",
      icon: HelpCircle,
      title: "Waitlist \nReservation",
      desc: "An approved reservation secures your standing in our master archives, prioritizing you for upcoming seasonal litters.",
      detailedInstructions: "Approved families lock in their waitlist rank order. Our dashboard displays real-time waitlist status, upcoming litter milestones, and exact gestation countdowns.",
      checklist: ["Submit waitlist reservation fee", "Log account on digital parent tracker", "Establish communication alert triggers"],
      image: "https://static.wixstatic.com/media/ca3310_cf6fcb58629645da9a07d8a6054724dc~mv2.jpeg/v1/fill/w_980,h_1307,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/ca3310_cf6fcb58629645da9a07d8a6054724dc~mv2.jpeg"
    },
    {
      step: "04",
      icon: Gift,
      title: "Puppy \nSelections",
      desc: "At 6 weeks, selections open in order of standing. Experience real-time behavioral streams and ranch visits.",
      detailedInstructions: "The magic moment! At 6 weeks of age, selections open sequentially based on waitlist position. We provide individual HD videos, behavioral test cards, and clinical health reports.",
      checklist: ["View 6-week behavioral profiling stream", "Attend virtual or in-person selection meet", "Confirm permanent selection matching"],
      image: "https://tse4.mm.bing.net/th/id/OIP.BMLAKVZ7KXr02XZOf1da5QHaE7?r=0&pid=ImgDet&w=474&h=315&rs=1&o=7&rm=3"
    },
    {
      step: "05",
      icon: CheckCircle,
      title: "The Final \nTransition",
      desc: "At 8 weeks, puppies graduate from ranch life. We provide a comprehensive medical dossier and transition kit.",
      detailedInstructions: "Your graduate departs at 8-10 weeks with a signature transition pack. This includes a certified OFA veterinary dossier, microchip papers, starter food bag, and scent blanket.",
      checklist: ["Clinical 25-step physical check-off", "Sign official purchase contracts", "Receive custom Golden Paws starter kit"],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ9BV7p6-9bhHOCUB6aVsOMgQ2tsQFHhQxDeAVa-wlDA&s=10"
    }
  ];

  return (
    <div className="bg-[#fcfaf7] min-h-screen pt-32 pb-32 text-navy-950">
      
      {/* HEADER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <span className="text-[10px] font-mono font-black text-gold-600 tracking-[0.4em] uppercase block">
            The Golden Path
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none italic">
            Seamless <span className="text-gold-500">Adoption</span>
          </h1>
          <p className="text-sm md:text-xl text-gray-400 max-w-2xl mx-auto font-serif leading-relaxed italic">
            A structured, transparent lifecycle designed to transition our ranch graduates into your lifelong companions.
          </p>
        </motion.div>
      </section>

      {/* INTERACTIVE STEPS TIMELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Timeline Cards (Left 5 columns) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest block mb-2">
              Select Adoption Milestone
            </span>
            <div className="space-y-4">
              {steps.map((s, idx) => {
                const isActive = activeStepIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStepIdx(idx)}
                    className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden flex items-start space-x-5 cursor-pointer group ${
                      isActive 
                        ? 'bg-white border-gold-500/80 shadow-xl shadow-gold-500/5 scale-[1.01]' 
                        : 'bg-white/40 border-stone-200/50 hover:bg-white hover:border-gold-300'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gold-500" />
                    )}
                    <div className="flex justify-between items-start w-full gap-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3.5 rounded-xl border transition-all ${
                          isActive 
                            ? 'bg-gold-500 border-gold-400 text-navy-950 shadow-md shadow-gold-500/10' 
                            : 'bg-stone-100 border-stone-200 text-navy-950'
                        }`}>
                          <s.icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-xs sm:text-sm tracking-tight text-navy-950 uppercase tracking-wider">{s.title.replace('\n', ' ')}</h4>
                          <p className="text-[11px] text-gray-400 leading-relaxed font-serif line-clamp-2">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                      <span className={`text-2xl font-serif italic font-semibold ${isActive ? 'text-gold-500' : 'text-stone-300'}`}>{s.step}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Content Board (Right 7 columns) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStepIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-stone-200/60 rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-gold-500/5 min-h-[480px] flex flex-col justify-between text-left"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                    <div className="flex items-center space-x-2.5">
                      <span className="p-2 bg-gold-500/10 text-gold-600 rounded-lg">
                        <Sparkle className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="text-gold-600 text-[9px] font-mono font-black uppercase tracking-[0.2em] block">
                          MILESTONE PROTOCOL {steps[activeStepIdx].step}
                        </span>
                        <h3 className="text-2xl font-black text-navy-950 mt-0.5">
                          {steps[activeStepIdx].title.replace('\n', ' ')}
                        </h3>
                      </div>
                    </div>
                    <span className="text-sm font-mono font-black text-gray-300">STAGE {steps[activeStepIdx].step}/05</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-gold-50/20 p-5 rounded-2xl border border-gold-100/50">
                    <div className="md:col-span-4 rounded-xl overflow-hidden shadow-sm aspect-video sm:aspect-square">
                      <EditableImage 
                        imageId={`step-preview-${steps[activeStepIdx].step}`}
                        src={steps[activeStepIdx].image} 
                        alt={steps[activeStepIdx].title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:col-span-8 space-y-3">
                      <h5 className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest">
                        Procedure Description &amp; Requirements:
                      </h5>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-serif italic">
                        {steps[activeStepIdx].detailedInstructions}
                      </p>
                    </div>
                  </div>

                  {/* Checklist of this milestone */}
                  <div className="space-y-3.5 pt-4">
                    <h5 className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest">
                      Milestone Checklist &amp; Deliverables:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
                      {steps[activeStepIdx].checklist.map((item, ci) => (
                        <div key={ci} className="flex items-center space-x-3 text-xs text-navy-950 font-medium">
                          <CheckCircle className="w-4.5 h-4.5 text-gold-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub-action panel inside details board */}
                <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[9px] font-mono font-black text-gold-600 uppercase tracking-widest">Next Step Trigger</p>
                    <p className="text-xs text-gray-400">Advance securely to the next adoption phase</p>
                  </div>
                  {activeStepIdx === 0 ? (
                    <button 
                      onClick={() => setShowApplicationSimulator(true)}
                      className="px-6 py-3.5 bg-navy-950 hover:bg-gold-500 hover:text-navy-950 text-white font-black text-[10px] font-mono uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Simulate Questionnaire
                    </button>
                  ) : (
                    <button 
                      onClick={() => setActiveStepIdx(prev => (prev + 1) % steps.length)}
                      className="px-6 py-3.5 bg-gold-500 hover:bg-[#0a1833] hover:text-white text-navy-950 font-black text-[10px] font-mono uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Next Phase</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* INTEGRATED QUESTIONNAIRE SIMULATOR MODAL */}
      <AnimatePresence>
        {showApplicationSimulator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplicationSimulator(false)}
              className="absolute inset-0 bg-navy-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] border border-stone-200 w-full max-w-xl p-8 sm:p-10 shadow-2xl relative z-10 text-left"
            >
              <div className="flex justify-between items-start border-b border-stone-100 pb-5 mb-6">
                <div>
                  <span className="text-[8px] font-mono font-black text-gold-600 uppercase tracking-[0.2em] block">
                    STAGE 01 QUESTIONNAIRE
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-navy-950 mt-1">Adoption Application</h3>
                </div>
                <button 
                  onClick={() => setShowApplicationSimulator(false)}
                  className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-lg transition-all"
                >
                  <Check className="w-4 h-4 rotate-45" />
                </button>
              </div>

              {simulatorStatus === 'idle' && (
                <form onSubmit={handleSimulateSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-black text-stone-400 uppercase">Applicant Full Name</label>
                    <input
                      type="text"
                      required
                      value={appForm.fullName}
                      onChange={(e) => setAppForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Jane or John Doe..."
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-black text-stone-400 uppercase">Retriever Experience</label>
                      <select
                        value={appForm.experience}
                        onChange={(e) => setAppForm(prev => ({ ...prev, experience: e.target.value }))}
                        className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-gold-500 cursor-pointer"
                      >
                        <option value="first-time">First-time Owner</option>
                        <option value="experienced">Had Dogs Before</option>
                        <option value="expert">Retriever Advocate</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-black text-stone-400 uppercase">Fenced Secured Yard</label>
                      <select
                        value={appForm.hasYard}
                        onChange={(e) => setAppForm(prev => ({ ...prev, hasYard: e.target.value }))}
                        className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-gold-500 cursor-pointer"
                      >
                        <option value="yes">Yes, Fully Fenced</option>
                        <option value="no">No, Open Acreage</option>
                        <option value="apartment">Apartment / Park walks</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-black text-stone-400 uppercase">Household Lifestyle</label>
                    <select
                      value={appForm.lifestyle}
                      onChange={(e) => setAppForm(prev => ({ ...prev, lifestyle: e.target.value }))}
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-gold-500 cursor-pointer"
                    >
                      <option value="active">Very Active (Hiking/Running)</option>
                      <option value="moderate">Moderate (Daily walks)</option>
                      <option value="relaxed">Relaxed / Cozy Home</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-black text-stone-400 uppercase font-bold">Why do you want a Golden Paws puppy?</label>
                    <textarea
                      value={appForm.additionalNotes}
                      onChange={(e) => setAppForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                      rows={3}
                      placeholder="Please share details about your lifestyle, family compatibility, or questions..."
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-gold-500 resize-none font-serif"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gold-500 hover:bg-navy-950 hover:text-white text-navy-950 font-black text-[10px] font-mono uppercase tracking-widest rounded-xl transition-all shadow-lg text-center"
                  >
                    Submit Questionnaire
                  </button>
                </form>
              )}

              {simulatorStatus === 'submitting' && (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-4 border-gold-200 border-t-gold-500 animate-spin" />
                  <p className="text-xs font-mono font-black text-stone-400 uppercase">Analyzing Household Compatibility...</p>
                </div>
              )}

              {simulatorStatus === 'approved' && (
                <div className="py-6 space-y-6 text-center">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                    <Check className="w-8 h-8" strokeWidth={3} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-navy-950">Application Synthesized!</h4>
                    <p className="text-xs text-stone-500 leading-relaxed font-serif max-w-sm mx-auto italic">
                      "Congratulations, {appForm.fullName}! Our automated compatibility screening matrix suggests an exceptional match with our upcoming seasonal litters."
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-[10px] font-mono text-left space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-400">APPLICANT:</span>
                      <strong className="text-navy-950">{appForm.fullName.toUpperCase()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">COMPATIBILITY SCORE:</span>
                      <strong className="text-green-600">98% OPTIMAL</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">RECOMMENDED PATTERN:</span>
                      <strong className="text-gold-600">CREAM FEMALE / HONEY MALE</strong>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSimulatorStatus('idle');
                        setAppForm({ fullName: '', experience: 'first-time', hasYard: 'yes', lifestyle: 'active', additionalNotes: '' });
                      }}
                      className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-mono font-bold text-[9px] uppercase tracking-widest rounded-xl transition-all"
                    >
                      Reset Questionnaire
                    </button>
                    <button
                      onClick={() => {
                        setShowApplicationSimulator(false);
                        setSimulatorStatus('idle');
                        setActiveStepIdx(1); // Advance to Selection Synthesis
                      }}
                      className="flex-1 py-3 bg-gold-500 hover:bg-navy-950 hover:text-white text-navy-950 font-mono font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-md"
                    >
                      Proceed to Stage 02
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INTERACTIVE DOCUMENT CENTER */}
      <section className="bg-[#0c1830] text-white py-32 rounded-[4rem] mx-4 lg:mx-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-40 bg-gold-500/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left side selectors */}
            <div className="lg:col-span-5 space-y-10 text-left">
              <div className="space-y-4">
                <span className="text-gold-400 text-[10px] font-mono font-black uppercase tracking-[0.3em] block">
                  Breeder Compliance &amp; Contracts
                </span>
                <h2 className="text-4xl md:text-6xl font-black leading-none">
                  Legal &amp; Care <span className="text-gold-500">Repository</span>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed font-serif italic">
                  We stand against ambiguity. Pre-audit our official adoption agreements, medical warranties, and clinical transition protocols. You can formally execute these documents below.
                </p>
              </div>

              <div className="space-y-3">
                {DOCUMENTS.map((doc) => {
                  const isActive = activeDocId === doc.id;
                  const isSigned = signedDocIds.includes(doc.id);
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setActiveDocId(doc.id)}
                      className={`w-full p-6 text-left rounded-[2rem] border transition-all duration-300 relative group cursor-pointer ${
                        isActive 
                          ? 'bg-gold-500 border-gold-500 text-navy-950 scale-[1.02] shadow-2xl shadow-gold-500/10' 
                          : 'bg-white/5 border-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[8px] font-mono font-black uppercase tracking-widest ${isActive ? 'text-navy-950/60' : 'text-gold-400'}`}>
                          {doc.category}
                        </span>
                        {isSigned && (
                          <span className={`px-2 py-0.5 rounded text-[7px] font-mono font-black uppercase tracking-wider flex items-center ${
                            isActive ? 'bg-navy-950 text-gold-400' : 'bg-gold-500/20 text-gold-400'
                          }`}>
                            <Check className="w-2.5 h-2.5 mr-1" strokeWidth={3} />
                            <span>SIGNED</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-black text-xs sm:text-sm tracking-tight leading-snug">{doc.title}</h4>
                    </button>
                  );
                })}
              </div>

              {signedDocIds.length > 0 && (
                <button
                  onClick={handleResetSignatures}
                  className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-[9px] font-mono font-black uppercase tracking-wider transition-all"
                >
                  Clear All Signatures
                </button>
              )}
            </div>

            {/* Right side Document Viewer Sheet */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div 
                key={activeDocId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-stone-50 text-navy-950 rounded-[3rem] p-8 md:p-14 h-[550px] overflow-y-auto relative shadow-2xl font-serif text-sm sm:text-base leading-relaxed text-left border border-stone-200"
              >
                {/* Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-500/5 rotate-12 select-none pointer-events-none text-center w-full">
                  <span className="font-black text-8xl sm:text-9xl uppercase tracking-tighter opacity-15">
                    {signedDocIds.includes(activeDocId) ? 'APPROVED' : 'VALID'}
                  </span>
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="border-b border-stone-200 pb-6 flex justify-between items-start">
                    <div>
                      <span className="text-gold-600 text-[9px] font-mono font-black uppercase tracking-widest block mb-1">
                        {activeDoc.category} DOSSIER
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight leading-tight">
                        {activeDoc.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-stone-600 whitespace-pre-wrap leading-relaxed">
                    {activeDoc.content}
                  </div>

                  {signedDocIds.includes(activeDocId) && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-8 p-6 bg-gold-500/10 border border-gold-500/30 rounded-2xl flex justify-between items-center"
                    >
                      <div className="text-left">
                        <p className="text-[8px] font-mono font-black text-gold-700 uppercase tracking-widest mb-1">
                          E-Signature Authenticated
                        </p>
                        <p className="text-xl sm:text-2xl font-serif italic text-navy-950 font-bold">
                          {signerName || 'Interactive Signer'}
                        </p>
                        <p className="text-[8px] font-mono text-gray-400 uppercase mt-1">
                          TIMESTAMPED LOGGED SECURE • CRYPTO VERIFIED
                        </p>
                      </div>
                      <PenTool className="w-8 h-8 text-gold-500" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Digital E-signature Action box */}
              <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left shrink-0">
                  <p className="text-[9px] font-mono font-black text-gold-400 uppercase tracking-widest">Simulation Engine</p>
                  <p className="text-xs text-gray-400">Simulate secure e-signature on active dossier</p>
                </div>
                <form onSubmit={handleSignSimulate} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <input 
                    type="text" 
                    placeholder="Signature Full Name..." 
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    disabled={signedDocIds.includes(activeDocId)}
                    className="flex-grow md:w-56 bg-white/10 border border-white/15 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-gray-500 font-mono disabled:opacity-40"
                  />
                  <button 
                    disabled={!signerName.trim() || signedDocIds.includes(activeDocId)}
                    className="px-6 py-3.5 bg-gold-500 text-navy-950 rounded-xl font-black text-[10px] font-mono uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 cursor-pointer text-center whitespace-nowrap"
                  >
                    {signedDocIds.includes(activeDocId) ? 'Dossier Signed' : 'Sign Contract'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-gold-600 text-[10px] font-mono font-black uppercase tracking-widest">Financial Transparency</span>
          <h2 className="text-4xl md:text-5xl font-black text-navy-950 italic">Adoption <span className="text-gold-500 font-sans not-italic">Investment</span></h2>
          <p className="text-gray-500 text-sm md:text-lg font-serif">Comprehensive inclusions designed for lifelong sovereignty and orthopedic health.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING.map((p, i) => (
            <div 
              key={i} 
              className={`p-8 sm:p-10 rounded-[3rem] border flex flex-col justify-between transition-all duration-500 hover:shadow-2xl text-left ${
                p.featured 
                  ? 'bg-navy-950 text-white border-navy-950 scale-105 shadow-gold-500/5' 
                  : 'bg-white border-gold-100 hover:border-gold-300'
              }`}
            >
              <div className="space-y-6">
                <span className={`text-[8px] font-mono font-black uppercase tracking-[0.3em] ${p.featured ? 'text-gold-400' : 'text-gray-400'}`}>
                  {p.tag}
                </span>
                <h3 className="text-2xl font-black leading-tight tracking-tight whitespace-pre-line">{p.title}</h3>
                
                <div className="flex items-baseline space-x-2">
                  <span className={`text-4xl font-black ${p.featured ? 'text-gold-400' : 'text-navy-950'}`}>{p.price}</span>
                  <span className="text-[9px] font-mono text-gray-400 font-black uppercase tracking-widest">All Inclusive</span>
                </div>
                
                <p className={`text-xs leading-relaxed font-serif ${p.featured ? 'text-gray-300' : 'text-gray-500'}`}>
                  {p.desc}
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-stone-100/10 space-y-4">
                <span className="text-[8px] font-mono font-black text-gray-400 uppercase tracking-widest block">
                  Included Health &amp; Care Deliverables:
                </span>
                {p.features.map((f, fi) => (
                  <div key={fi} className="flex items-center space-x-3 text-[9px] font-mono font-black uppercase tracking-widest">
                    <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${p.featured ? 'text-gold-400' : 'text-green-500'}`} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PROCEED TO NEXT STEPS NAVIGATION BANNER */}
        {setTab && (
          <div className="mt-16 bg-navy-950 text-white rounded-3xl p-8 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-mono font-black text-gold-400 uppercase tracking-widest bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
                Ready to Apply?
              </span>
              <h3 className="text-xl font-black mt-2">Take the Next Step Toward Your Golden Retriever</h3>
              <p className="text-stone-300 text-xs mt-1">Submit your household application or browse our current candidates.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => { setTab('puppies'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-2"
              >
                <span>← Available Puppies</span>
              </button>
              <button
                onClick={() => { setTab('matcher'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-gold-500 hover:text-navy-950 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Puppy Match Quiz →</span>
              </button>
              <button
                onClick={() => { setTab('apply'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-6 py-3 rounded-2xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Start Application Form →</span>
              </button>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}

const PRICING = [
  {
    tag: "Traditional Legacy",
    title: "The Golden \nHeritage",
    price: "$850",
    desc: "Our quintessential honey-colored lineage. Perfectly balanced hippocampal development for high social logic and park performance.",
    features: ["AKC Registered", "OFA Skeletal Certified", "Microchip Recovery", "2 Year Health Guarantee"],
    featured: false
  },
  {
    tag: "Elite Therapy",
    title: "English Cream \nSovereign",
    price: "$850",
    desc: "Selectively bred therapy-tier English Creams. Unmatched cortisol regulation and gentle-mind genomic matching.",
    features: ["BioSens Conditioning", "Gastro-Integrity Shield", "Behavioral Synthesis", "Elite Lineage Audit"],
    featured: true
  },
  {
    tag: "Field Performance",
    title: "Mahogany \nRustic Red",
    price: "$850",
    desc: "Deep mahogany athletic lines. Architected for trail endurance, tracking intelligence, and structural bone density.",
    features: ["Tracker Lineage", "Endurance Optimized", "Field Ready Registry", "High Protein Start"],
    featured: false
  }
];
