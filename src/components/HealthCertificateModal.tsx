import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Shield, Award, Calendar, CheckCircle, MapPin, 
  User, Download, Check, AlertCircle, Eye, Printer, ZoomIn, Info
} from 'lucide-react';
import { Puppy } from '../types';
import confetti from 'canvas-confetti';

interface HealthCertificateModalProps {
  puppy: Puppy;
  onClose: () => void;
}

type TabType = 'ofa' | 'dna' | 'vet';

export default function HealthCertificateModal({ puppy, onClose }: HealthCertificateModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('ofa');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [zoomScale, setZoomScale] = useState(1);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Generate some semi-consistent document variables based on puppy ID/name
  const registryCode = `GVR-${puppy.birthDate.replace(/-/g, '')}-${puppy.name.toUpperCase().substring(0, 3)}-${puppy.gender === 'Female' ? 'F' : 'M'}`;
  const verifyDate = new Date(new Date(puppy.birthDate).getTime() + 8 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }); // 8 weeks after birth
  const dvmName = "Dr. Elizabeth Thorne, DVM";
  const clinicName = "Mountain Crest Veterinary & Genetics Lab";

  const handleTriggerPrint = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#0D2244', '#FFFFFF']
    });
    // Trigger actual window print focusing on our printable portion
    window.print();
  };

  const handleVerifyOnBlockchain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      confetti({
        particleCount: 40,
        spread: 40,
        colors: ['#D4AF37']
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6 print:p-0 overflow-y-auto">
      {/* Visual Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-xl print:hidden" 
      />

      {/* Main Certificate Viewer Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="bg-stone-50 border border-stone-200/50 rounded-[2.5rem] w-full max-w-5xl shadow-2xl relative z-10 overflow-hidden text-navy-950 print:bg-white print:rounded-none print:shadow-none print:border-none print:w-full print:max-w-none print:static"
      >
        
        {/* TOP STATUS BAR & HEADER - OMIT ON PRINT */}
        <div className="bg-navy-950 border-b border-white/10 px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-gold-500/10 border border-gold-500/30 text-gold-400 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center space-x-2">
                <span>Official Health Portfolio</span>
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
              </h3>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-0.5">
                REGISTRY ID: <span className="text-gold-400 font-bold">{registryCode}</span>
              </p>
            </div>
          </div>

          {/* Scale Controller */}
          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
            <ZoomIn className="w-4 h-4 text-gold-500/80 ml-2" />
            <span className="text-[9px] font-mono font-bold text-gray-400 tracking-wider">PORTFOLIO ZOOM:</span>
            <input 
              type="range" 
              min="0.9" 
              max="1.15" 
              step="0.05"
              value={zoomScale}
              onChange={(e) => setZoomScale(parseFloat(e.target.value))}
              className="accent-gold-500 w-24 h-1 rounded-lg outline-none cursor-pointer"
            />
            <span className="text-[10px] font-mono text-white font-bold w-12 text-center">{Math.round(zoomScale * 100)}%</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleTriggerPrint}
              className="px-5 py-3 bg-gold-500 hover:bg-white text-navy-950 font-black text-[10px] font-mono uppercase tracking-widest rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-gold-500/10 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Audit</span>
            </button>
            <button
              onClick={onClose}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10"
              aria-label="Close Portfolio"
            >
              <Check className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* TAB CONTROLS - OMIT ON PRINT */}
        <div className="bg-[#f0ece6] px-8 py-3.5 flex flex-wrap gap-2 border-b border-stone-200 print:hidden">
          <button 
            onClick={() => setActiveTab('ofa')}
            className={`px-6 py-3.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all ${
              activeTab === 'ofa' 
                ? 'bg-white text-navy-950 shadow-md shadow-stone-800/5 border border-stone-300/40' 
                : 'text-stone-500 hover:text-navy-950 hover:bg-stone-100'
            }`}
          >
            Page 1: Pediatric Bone & Ortho
          </button>
          <button 
            onClick={() => setActiveTab('dna')}
            className={`px-6 py-3.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all ${
              activeTab === 'dna' 
                ? 'bg-white text-navy-950 shadow-md shadow-stone-800/5 border border-stone-300/40' 
                : 'text-stone-500 hover:text-navy-950 hover:bg-stone-100'
            }`}
          >
            Page 2: Genomic DNA Assay
          </button>
          <button 
            onClick={() => setActiveTab('vet')}
            className={`px-6 py-3.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all ${
              activeTab === 'vet' 
                ? 'bg-white text-navy-950 shadow-md shadow-stone-800/5 border border-stone-300/40' 
                : 'text-stone-500 hover:text-navy-950 hover:bg-stone-100'
            }`}
          >
            Page 3: Clinical Soundness Verify
          </button>
        </div>

        {/* PRINTABLE AREA CONTAINER */}
        <div 
          ref={printAreaRef}
          className="p-8 md:p-14 overflow-y-auto max-h-[75vh] print:max-h-none print:p-0"
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
        >
          <div className="bg-white border-8 border-double border-stone-300/80 p-8 md:p-12 rounded-[2.5rem] relative shadow-inner print:border-stone-400 print:shadow-none print:rounded-none">
            
            {/* INTRICATE CORNER DECORATORS */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-gold-500/60 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-gold-500/60 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-gold-500/60 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-gold-500/60 rounded-br-xl pointer-events-none" />

            {/* WATERMARK EMBLEM IN BACKGROUND */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none select-none">
              <Shield className="w-[30rem] h-[30rem]" />
            </div>

            {/* DOCUMENT HEADER */}
            <div className="border-b border-stone-200 pb-8 mb-8 text-center space-y-3">
              <span className="text-[10px] font-mono font-black text-gold-600 tracking-[0.4em] uppercase block">
                Certificate of Breeding Excellence
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight font-serif uppercase">
                HEALTH CLEARANCE PORTFOLIO
              </h1>
              <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-stone-500 text-xs font-mono">
                <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1.5 text-stone-400" /> Patient: <strong className="text-stone-800 ml-1">{puppy.name}</strong></span>
                <span className="text-stone-300">|</span>
                <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-stone-400" /> Registered Birth: <strong className="text-stone-800 ml-1">{new Date(puppy.birthDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</strong></span>
                <span className="text-stone-300">|</span>
                <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-stone-400" /> Origin: <strong className="text-stone-800 ml-1">Golden Paws Home</strong></span>
              </div>
            </div>

            {/* TAB-SPECIFIC CERTIFICATE PAGE */}
            <AnimatePresence mode="wait">
              {activeTab === 'ofa' && (
                <motion.div
                  key="ofa"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Diagnostic Summary Panel */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 border-l-4 border-gold-600 pl-4">
                        <h2 className="text-lg font-black uppercase text-stone-900 tracking-wider">OFA Structural Diagnostics</h2>
                      </div>
                      <p className="text-sm text-stone-500 font-serif leading-relaxed italic">
                        The pediatric orthopedic assessment evaluates skeletal bone development, joint alignment stability, and congenital structural competence prior to permanent family placement.
                      </p>

                      <div className="space-y-3.5">
                        <div className="p-4 bg-stone-50 border border-stone-200/60 rounded-xl flex items-center justify-between shadow-sm">
                          <div>
                            <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider">Coxofemoral (Hip) laxity</h4>
                            <p className="text-[10px] font-mono text-stone-400 uppercase mt-0.5">OFA PRELIMINARY PROTOCOL</p>
                          </div>
                          <span className="px-3.5 py-1 bg-green-50 text-green-700 text-[10px] font-mono font-black border border-green-200/50 rounded-lg uppercase">
                            EXCELLENT &amp; STABLE
                          </span>
                        </div>

                        <div className="p-4 bg-stone-50 border border-stone-200/60 rounded-xl flex items-center justify-between shadow-sm">
                          <div>
                            <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider">Elbow Dysplasia Screen</h4>
                            <p className="text-[10px] font-mono text-stone-400 uppercase mt-0.5">PRE-OSSIFICATION STAGE</p>
                          </div>
                          <span className="px-3.5 py-1 bg-green-50 text-green-700 text-[10px] font-mono font-black border border-green-200/50 rounded-lg uppercase">
                            NORMAL (UNILATERAL)
                          </span>
                        </div>

                        <div className="p-4 bg-stone-50 border border-stone-200/60 rounded-xl flex items-center justify-between shadow-sm">
                          <div>
                            <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider">Cardiac Sphygmomanometry</h4>
                            <p className="text-[10px] font-mono text-stone-400 uppercase mt-0.5">STEALTH AUSCULTATION REPORT</p>
                          </div>
                          <span className="px-3.5 py-1 bg-green-50 text-green-700 text-[10px] font-mono font-black border border-green-200/50 rounded-lg uppercase">
                            CLEAR NO MURMURS
                          </span>
                        </div>

                        <div className="p-4 bg-stone-50 border border-stone-200/60 rounded-xl flex items-center justify-between shadow-sm">
                          <div>
                            <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider">Patellar Luxation Audit</h4>
                            <p className="text-[10px] font-mono text-stone-400 uppercase mt-0.5">PEDIATRIC ROTATIONAL FORCE</p>
                          </div>
                          <span className="px-3.5 py-1 bg-green-50 text-green-700 text-[10px] font-mono font-black border border-green-200/50 rounded-lg uppercase">
                            GRADE 0: PERFECT
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Official Certificate Visual Details */}
                    <div className="bg-stone-50 border-2 border-stone-200 rounded-[2rem] p-6 lg:p-8 space-y-6">
                      <div className="text-center pb-4 border-b border-stone-200">
                        <FileText className="w-10 h-10 mx-auto text-gold-600 mb-2" />
                        <h3 className="text-xs font-black uppercase text-stone-800 tracking-widest">OFA Official Registry</h3>
                        <p className="text-[9px] font-mono text-stone-400 uppercase mt-1">Skeletal Orthopedic verification</p>
                      </div>

                      <div className="space-y-4 text-xs font-mono text-stone-700">
                        <div className="flex justify-between border-b border-stone-100 pb-2">
                          <span className="text-stone-400">PATIENT ID:</span>
                          <strong>{puppy.id.substring(0, 10).toUpperCase()}</strong>
                        </div>
                        <div className="flex justify-between border-b border-stone-100 pb-2">
                          <span className="text-stone-400">PHYSIOLOGY CHECK:</span>
                          <strong className="text-stone-900">Passed Pre-Screening</strong>
                        </div>
                        <div className="flex justify-between border-b border-stone-100 pb-2">
                          <span className="text-stone-400">CERTIFICATE EMISSION:</span>
                          <strong className="text-stone-900">{verifyDate}</strong>
                        </div>
                        <div className="flex justify-between border-b border-stone-100 pb-2">
                          <span className="text-stone-400">REGISTRATION:</span>
                          <span className="text-[10px] font-mono font-black text-blue-600 uppercase">AKC PRE-FILED</span>
                        </div>
                        <div className="flex justify-between items-center bg-green-500/5 border border-green-100 px-4 py-2.5 rounded-xl mt-4">
                          <span className="text-green-800 font-serif italic text-[11px] font-bold">Joint Health Certification Status</span>
                          <span className="px-2 py-0.5 bg-green-500 text-white font-mono font-black text-[9px] rounded uppercase tracking-wider">OFA STABLE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'dna' && (
                <motion.div
                  key="dna"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Genomic DNA Panel */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 border-l-4 border-gold-600 pl-4">
                        <h2 className="text-lg font-black uppercase text-stone-900 tracking-wider">Genomic DNA Sequencing</h2>
                      </div>
                      <p className="text-sm text-stone-500 font-serif leading-relaxed italic">
                        Comprehensive DNA genotyping analyzes critical hereditary risks to guarantee the biological lineage is free from key Golden Retriever health issues.
                      </p>

                      <div className="space-y-3">
                        <div className="p-4 bg-stone-50 border border-stone-200/60 rounded-xl flex items-center justify-between shadow-sm">
                          <div>
                            <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider">PRA-1 &amp; PRA-2 Mutation</h4>
                            <p className="text-[10px] font-mono text-stone-400 uppercase mt-0.5">PROGRESSIVE RETINAL ATROPHY</p>
                          </div>
                          <span className="px-3.5 py-1 bg-green-50 text-green-700 text-[10px] font-mono font-black border border-green-200/50 rounded-lg uppercase">
                            NORMAL / CLEAR (GEN-FREE)
                          </span>
                        </div>

                        <div className="p-4 bg-stone-50 border border-stone-200/60 rounded-xl flex items-center justify-between shadow-sm">
                          <div>
                            <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider">prcd-PRA Genotype</h4>
                            <p className="text-[10px] font-mono text-stone-400 uppercase mt-0.5">PROGRESSIVE ROD-CONE DEGENERATION</p>
                          </div>
                          <span className="px-3.5 py-1 bg-green-50 text-green-700 text-[10px] font-mono font-black border border-green-200/50 rounded-lg uppercase">
                            NON-CARRIER CLEAR
                          </span>
                        </div>

                        <div className="p-4 bg-stone-50 border border-stone-200/60 rounded-xl flex items-center justify-between shadow-sm">
                          <div>
                            <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider">Ichthyosis Type 1 (ICT-A)</h4>
                            <p className="text-[10px] font-mono text-stone-400 uppercase mt-0.5">EPIDERMAL SCALING ASSAY</p>
                          </div>
                          <span className="px-3.5 py-1 bg-green-50 text-green-700 text-[10px] font-mono font-black border border-green-200/50 rounded-lg uppercase">
                            NORMAL / CLEAR
                          </span>
                        </div>

                        <div className="p-4 bg-stone-50 border border-stone-200/60 rounded-xl flex items-center justify-between shadow-sm">
                          <div>
                            <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider">Degenerative Myelopathy (DM)</h4>
                            <p className="text-[10px] font-mono text-stone-400 uppercase mt-0.5">SPINAL AXON LOSS RISK</p>
                          </div>
                          <span className="px-3.5 py-1 bg-green-50 text-green-700 text-[10px] font-mono font-black border border-green-200/50 rounded-lg uppercase">
                            NORMAL / CLEAR
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Labs Certification Card */}
                    <div className="bg-stone-50 border-2 border-stone-200 rounded-[2rem] p-6 lg:p-8 space-y-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="text-center pb-4 border-b border-stone-200">
                          <Shield className="w-10 h-10 mx-auto text-gold-600 mb-2" />
                          <h3 className="text-xs font-black uppercase text-stone-800 tracking-widest">DNA Laboratory Validation</h3>
                          <p className="text-[9px] font-mono text-stone-400 uppercase mt-1">Certified genomic safety index</p>
                        </div>

                        <div className="space-y-4 text-xs font-mono text-stone-700">
                          <p className="text-stone-500 font-serif italic text-center p-3 border border-yellow-500/10 bg-yellow-500/5 rounded-xl">
                            "Subject is biologically clear of all tested genetic mutations associated with retriever ocular, cardiac, and musculoskeletal disease."
                          </p>
                          <div className="flex justify-between border-b border-stone-100 pb-2">
                            <span className="text-stone-400">LAB CLINIC:</span>
                            <strong className="text-stone-800 text-[10px]">{clinicName}</strong>
                          </div>
                          <div className="flex justify-between border-b border-stone-100 pb-2">
                            <span className="text-stone-400">RUN SEQ ID:</span>
                            <strong className="text-stone-800">SEQ-776495-2026</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400">GENOMIC VARIANT:</span>
                            <span className="text-green-600 font-bold uppercase">WILDTYPE NORMAL</span>
                          </div>
                        </div>
                      </div>

                      {/* Mock Interactive Barcode */}
                      <div className="pt-4 border-t border-stone-200 flex flex-col items-center space-y-2">
                        <div className="w-full h-12 bg-white border border-stone-300 rounded flex items-center justify-around overflow-hidden select-none px-2">
                          {Array.from({ length: 42 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="bg-navy-950 h-full" 
                              style={{ width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2)}px` }} 
                            />
                          ))}
                        </div>
                        <span className="text-[8px] font-mono text-stone-400 tracking-[0.3em] uppercase">GENOMIC BARCODE: {registryCode}</span>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'vet' && (
                <motion.div
                  key="vet"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Clinical panel */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 border-l-4 border-gold-600 pl-4">
                        <h2 className="text-lg font-black uppercase text-stone-900 tracking-wider">Clinical Soundness Register</h2>
                      </div>
                      <p className="text-sm text-stone-500 font-serif leading-relaxed italic">
                        Comprehensive pediatric hands-on clinical inspection evaluating pulmonary, circulatory, ophthalmic, and digestive health with real physical logs.
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-stone-50 border border-stone-200/50 rounded-xl space-y-1">
                          <span className="text-[8px] font-mono font-black text-stone-400 uppercase tracking-wider block">EYES AUDIT</span>
                          <strong className="text-stone-800 text-xs block">Normal / Healthy</strong>
                          <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-800 font-mono font-bold text-[8px] rounded uppercase">Clear Cleared</span>
                        </div>

                        <div className="p-4 bg-stone-50 border border-stone-200/50 rounded-xl space-y-1">
                          <span className="text-[8px] font-mono font-black text-stone-400 uppercase tracking-wider block">EARS &amp; AUDITORY</span>
                          <strong className="text-stone-800 text-xs block">Resonant Response</strong>
                          <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-800 font-mono font-bold text-[8px] rounded uppercase">Responsive</span>
                        </div>

                        <div className="p-4 bg-stone-50 border border-stone-200/50 rounded-xl space-y-1">
                          <span className="text-[8px] font-mono font-black text-stone-400 uppercase tracking-wider block">DENTITION &amp; BITE</span>
                          <strong className="text-stone-800 text-xs block">Standard Scissors Bite</strong>
                          <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-800 font-mono font-bold text-[8px] rounded uppercase">Correct</span>
                        </div>

                        <div className="p-4 bg-stone-50 border border-stone-200/50 rounded-xl space-y-1">
                          <span className="text-[8px] font-mono font-black text-stone-400 uppercase tracking-wider block">PULMONARY COUGHS</span>
                          <strong className="text-stone-800 text-xs block">Lungs Vesicular Res.</strong>
                          <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-800 font-mono font-bold text-[8px] rounded uppercase">Cleared</span>
                        </div>
                      </div>

                      <div className="p-4 bg-gold-50/50 border border-gold-200/40 rounded-2xl flex items-start space-x-3">
                        <Info className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                        <div className="text-left">
                          <h4 className="text-[10px] font-mono font-black text-gold-700 uppercase tracking-wider">VACCINATIONS &amp; DEWORMING</h4>
                          <p className="text-xs text-stone-600 font-medium mt-1">
                            Administered 1st Neopar and 5-way canine vaccinations. Triple dewormed on strict bi-weekly safety schedule. Full compliance logged.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sign-off Sheet */}
                    <div className="bg-stone-50 border-2 border-stone-200 rounded-[2rem] p-6 lg:p-8 space-y-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="text-center pb-4 border-b border-stone-200">
                          <CheckCircle className="w-10 h-10 mx-auto text-green-600 mb-2" />
                          <h3 className="text-xs font-black uppercase text-stone-800 tracking-widest">Medical Endorsement</h3>
                          <p className="text-[9px] font-mono text-stone-400 uppercase mt-1">Veterinary clearance validation</p>
                        </div>

                        <div className="space-y-4 text-xs font-mono text-stone-700">
                          <div className="flex justify-between border-b border-stone-100 pb-2">
                            <span className="text-stone-400">PRACTITIONER:</span>
                            <strong className="text-stone-800">{dvmName}</strong>
                          </div>
                          <div className="flex justify-between border-b border-stone-100 pb-2">
                            <span className="text-stone-400">CLINICAL STAMP:</span>
                            <span className="text-green-600 font-black">VALID CLEAR</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400">DATE LICENSED:</span>
                            <strong>{verifyDate}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Signature block */}
                      <div className="pt-6 border-t border-stone-200">
                        <span className="text-[8px] font-mono font-black text-stone-400 uppercase block tracking-wider mb-4">APPROVED BY RESIDENT CLINICIAN</span>
                        <div className="flex items-end justify-between">
                          <div className="space-y-1">
                            {/* Stylized custom font-like signature */}
                            <p className="font-serif italic text-lg text-gold-600 tracking-wide font-medium mr-4 select-none">
                              {dvmName.split(',')[0]}
                            </p>
                            <div className="w-40 h-px bg-stone-300" />
                            <span className="text-[9px] font-mono text-stone-400 block mt-1">Authorized DVM Signature</span>
                          </div>
                          
                          {/* Circle gold embossed vector style stamp */}
                          <div className="w-16 h-16 rounded-full border-4 border-dashed border-gold-500/80 flex flex-col items-center justify-center p-1 bg-gold-50 shadow-inner select-none -rotate-12 translate-y-2">
                            <span className="text-[6px] font-mono font-black text-gold-600 text-center uppercase tracking-tighter leading-none">
                              CERTIFIED<br/>HEALTH<br/>PASSED
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* BLOCKCHAIN / REGISTRY COMPLIANCE BOTTOM PANEL */}
            <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                {/* Embedded Metallic Gold Seal */}
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 border border-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-500/20 text-white font-mono uppercase font-black text-center text-[7px] leading-tight select-none transform rotate-12">
                  <div className="absolute inset-0.5 rounded-full border border-yellow-300/40 border-dashed" />
                  <span className="relative z-10 leading-none">
                    GOLDEN<br/>VALLEY<br/>★ SEAL ★
                  </span>
                </div>
                <div className="text-left space-y-1">
                  <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider">Official Registrar Compliance Seal</h4>
                  <p className="text-[10px] text-stone-400 max-w-md font-serif italic">
                    This document certifies that {puppy.name} is fully vetted, DNA cleared, and has stable pre-OFA scores for permanent breeder hand-off.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={handleVerifyOnBlockchain}
                  disabled={isVerifying}
                  className={`px-5 py-3 rounded-xl border text-[10px] font-mono font-black uppercase tracking-widest transition-all ${
                    isVerified 
                      ? 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200' 
                      : 'bg-gold-500 text-navy-950 border-gold-400 hover:bg-gold-400'
                  }`}
                >
                  {isVerifying ? 'Synchronizing Archive...' : 'Verify Registry Authenticity'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* PRINT ONCE WATERMARK IN PRINT MODE */}
        <div className="hidden print:block text-center mt-8 text-stone-400 text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
          PRINT VALIDATED VIA GOLDEN VALLEY GENOTYPE ARCHIVE REGISTRY • PORTFOLIO EXPLICIT LICENSE
        </div>

      </motion.div>
    </div>
  );
}
