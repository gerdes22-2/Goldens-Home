import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Weight, Ruler, Calendar, Info, Award, CheckCircle, ShieldCheck, ClipboardCheck, ArrowRight } from 'lucide-react';
import { Puppy } from '../types';
import { EditableImage } from './ImageEditContext';
import HealthCertificateModal from './HealthCertificateModal';

interface PuppyModalProps {
  selectedPuppy: Puppy | null;
  setSelectedPuppy: (puppy: Puppy | null) => void;
  setTab: (tab: string) => void;
  setMatchedPuppyName: (name: string) => void;
}

export default function PuppyModal({
  selectedPuppy,
  setSelectedPuppy,
  setTab,
  setMatchedPuppyName
}: PuppyModalProps) {
  const [viewingHealthCertificate, setViewingHealthCertificate] = useState<Puppy | null>(null);

  if (!selectedPuppy) return null;

  const handleApplyForPuppy = (pupName: string) => {
    setMatchedPuppyName(pupName);
    setSelectedPuppy(null);
    setTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
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
                <EditableImage 
                  imageId={`puppy-modal-${selectedPuppy.id}`}
                  src={selectedPuppy.image} 
                  alt={selectedPuppy.name} 
                  className="w-full h-full object-cover" 
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

      <AnimatePresence>
        {viewingHealthCertificate && (
          <HealthCertificateModal 
            puppy={viewingHealthCertificate} 
            onClose={() => setViewingHealthCertificate(null)} 
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
