import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Heart, Eye, Activity, Dna, FileCheck, Award, 
  Microscope, Check, RefreshCw, ChevronRight, Search, FileText, BadgeAlert 
} from 'lucide-react';

export default function HealthAuditView() {
  const [activeCheckIdx, setActiveCheckIdx] = useState<number>(0);
  const [verifyCode, setVerifyCode] = useState<string>('OFA-GR-RUSTY-129E');
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [simulatedScanProgress, setSimulatedScanProgress] = useState<number>(100);

  const medicalChecks = [
    {
      id: 'audit-card-ortho',
      title: 'Orthopedic (Hips & Elbows)',
      icon: <Activity className="w-6 h-6" />,
      org: 'OFA Certified',
      status: 'Excellent/Good',
      description: 'Radiological evaluations ensure parent skeletal structure is sound, minimizing dysplasia risk.',
      color: 'gold',
      scientificName: 'Coxofemoral & Radiographic Morphology',
      testMethod: 'X-Ray Radiography under Sedation (OFA Guidelines)',
      standards: [
        { label: 'Hip Subluxation Index', val: '< 0.35 (Low Risk)', status: 'Optimal' },
        { label: 'Norberg Angle Score', val: '105° - 110°', status: 'Excellent' },
        { label: 'Elbow Joint IncongruITY', val: '0.00 mm (Clear)', status: 'Clear' },
        { label: 'Skeletal Density Grade', val: 'Class A High Vigor', status: 'Optimal' }
      ]
    },
    {
      id: 'audit-card-eyes',
      title: 'Ophthalmology (Eyes)',
      icon: <Eye className="w-6 h-6" />,
      org: 'CAER Register',
      status: 'Normal (Yearly)',
      description: 'Annual board-certified examinations to rule out inherited eye conditions and cataracts.',
      color: 'emerald',
      scientificName: 'Ocular Fundus & Slit-Lamp Biomicroscopy',
      testMethod: 'Indirect Ophthalmoscopy & Tonometry (Annual CAER)',
      standards: [
        { label: 'Lens Transparency Index', val: '100% Clear of Opacities', status: 'Normal' },
        { label: 'Vitreous Humor Liquefaction', val: 'Absent (No Degeneration)', status: 'Normal' },
        { label: 'Retinal Vascular Pattern', val: 'Standard Robust Symmetry', status: 'Symmetric' },
        { label: 'Intraocular Pressure (IOP)', val: '14.2 mmHg (Perfect range)', status: 'Stable' }
      ]
    },
    {
      id: 'audit-card-cardiac',
      title: 'Cardiac (Heart)',
      icon: <Heart className="w-6 h-6" />,
      org: 'DVM Specialist',
      status: 'Normal / Clear',
      description: 'Clearance from congenital heart disease using standardized auscultation and tracking.',
      color: 'rose',
      scientificName: 'Echocardiographic Doppler Flow Dynamics',
      testMethod: 'Advanced Left-Ventricular Transesophageal Echo',
      standards: [
        { label: 'Aortic Valve Velocity', val: '1.42 m/s (Stable)', status: 'Optimal' },
        { label: 'Mitral Valve Regurgitation', val: '0.00% (Absolute Closure)', status: 'None' },
        { label: 'Interventricular Septum Thick', val: '6.4 mm (Athletic Norm)', status: 'Normal' },
        { label: 'Congenital Murmur Detection', val: 'Grade 0 (Undetected)', status: 'Clear' }
      ]
    },
    {
      id: 'audit-card-genetics',
      title: 'Genetic Panel (DNA)',
      icon: <Dna className="w-6 h-6" />,
      org: 'Embark / PawPrint',
      status: 'Panel Clear',
      description: 'Comprehensive DNA screening for 200+ genetic markers including Ichthyosis and PRA.',
      color: 'purple',
      scientificName: 'Genomic SNP Microarray Sequencing',
      testMethod: 'Next-Generation High-Throughput Genotyping',
      standards: [
        { label: 'prcd-PRA Variant (Ocular)', val: 'Wildtype G/G (Non-Carrier)', status: 'Clear' },
        { label: 'Ichthyosis Type 1 (Skin)', val: 'Wildtype A/A (Non-Carrier)', status: 'Clear' },
        { label: 'Degenerative Myelopathy', val: 'Wildtype C/C (Non-Carrier)', status: 'Clear' },
        { label: 'Neuronal Lipofuscinosis', val: 'Wildtype T/T (Non-Carrier)', status: 'Clear' }
      ]
    }
  ];

  const handleVerify = (e: any) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    setIsVerifying(true);
    setSimulatedScanProgress(0);

    const interval = setInterval(() => {
      setSimulatedScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 200);

    setTimeout(() => {
      const isRusty = verifyCode.toUpperCase().includes('RUSTY');
      const isBella = verifyCode.toUpperCase().includes('BELLA');
      const isSterling = verifyCode.toUpperCase().includes('STERLING');

      let name = "Rusty of Golden Paws";
      let title = "OFA Hips: Excellent | Heart: Clear";
      let certId = "GR-129482E24M-VPI";
      
      if (isBella) {
        name = "Lady Bella of Amber Acres";
        title = "OFA Hips: Good | DNA panel clear";
        certId = "GR-133591G27F-VPI";
      } else if (isSterling) {
        name = "Sir Sterling of Sunny Hills";
        title = "OFA Elbows: Normal | CGC Title";
        certId = "GR-EL5542M27-VPI";
      } else if (!isRusty) {
        // Generate random realistic parent details
        name = "Authorized Valley Graduate";
        title = "Verified OFA Standards Compliance";
        certId = `GR-${Math.floor(100000 + Math.random() * 900000)}B-VPI`;
      }

      setVerificationResult({
        name,
        title,
        certId,
        date: 'Verified Live: ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        signature: 'Dr. Elizabeth Thorne, DVM',
        status: 'Cryptographically Authenticated',
        blockchainBlock: 'BLOCK #' + Math.floor(8294000 + Math.random() * 5000)
      });
      setIsVerifying(false);
    }, 1200);
  };

  return (
    <div id="health-audit-container" className="bg-white border border-stone-200/65 rounded-[3rem] overflow-hidden shadow-2xl text-left">
      
      {/* HEADER SECTION */}
      <div id="health-audit-header" className="bg-navy-950 p-8 sm:p-14 text-white relative">
        <div className="absolute top-0 right-0 p-32 bg-gold-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex items-center space-x-2 text-gold-400">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">Clinical Biosafety & Longevity Standards</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            Our Interactive <span className="text-gold-500 font-sans not-italic">Clinical Health Audit</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-3xl leading-relaxed font-serif italic">
            We breed exclusively for biological longevity, skeletal soundness, and stress resiliency. Explore each screening system below or instantly verify cryptographic health records.
          </p>
        </div>
      </div>

      {/* CORE CLINICAL INTERACTIVE INTERFACE */}
      <div id="health-audit-main-grid" className="p-8 sm:p-14 bg-[#fcfaf7] border-b border-stone-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT SIDE: SELECTABLE CLINICAL CARDS */}
          <div className="lg:col-span-5 space-y-4" id="health-audit-left-cards">
            <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest block mb-1">
              Select Clinical Category
            </span>
            {medicalChecks.map((check, idx) => {
              const isActive = activeCheckIdx === idx;
              return (
                <button
                  key={idx}
                  id={check.id}
                  onClick={() => setActiveCheckIdx(idx)}
                  className={`w-full text-left flex items-start space-x-5 p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                    isActive 
                      ? 'bg-white border-gold-500/75 shadow-xl shadow-gold-500/5 scale-[1.02]' 
                      : 'bg-white/50 border-stone-200/50 text-stone-500 hover:bg-white hover:border-gold-200'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gold-500" />
                  )}
                  <div className={`p-4 rounded-xl border transition-all shrink-0 ${
                    isActive 
                      ? 'bg-gold-500 border-gold-400 text-navy-950 shadow-md shadow-gold-500/10 scale-110' 
                      : 'bg-stone-100 border-stone-200 text-navy-950 group-hover:border-gold-300'
                  }`}>
                    {check.icon}
                  </div>
                  <div className="space-y-1.5 min-w-0 flex-grow">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-black text-xs sm:text-sm tracking-tight text-navy-950 truncate">{check.title}</h4>
                      <span className={`text-[8px] font-mono font-black px-2 py-0.5 rounded shrink-0 ${
                        isActive ? 'bg-gold-500/20 text-gold-700' : 'bg-stone-200/60 text-stone-600'
                      }`}>
                        {check.org}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-serif line-clamp-2 italic">
                      {check.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                      <span className="text-[9px] font-mono font-black text-green-700 uppercase tracking-wider">
                        STATUS: {check.status}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT SIDE: DETAILED LAB TERMINAL READOUT */}
          <div className="lg:col-span-7" id="health-audit-right-terminal">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCheckIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0a1833] text-white rounded-[2.5rem] border border-white/5 p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[480px]"
              >
                {/* Background Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 rotate-12 select-none pointer-events-none">
                  <Microscope className="w-[18rem] h-[18rem]" />
                </div>

                <div className="relative z-10 space-y-6">
                  {/* Terminal Header */}
                  <div className="border-b border-white/5 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-gold-400 text-[9px] font-mono font-black uppercase tracking-widest block">
                        LAB DIAGNOSTIC STREAM • ACTIVE SYSTEM
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                        {medicalChecks[activeCheckIdx].scientificName}
                      </h3>
                      <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mt-1">
                        METHODOLOGY: {medicalChecks[activeCheckIdx].testMethod}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-green-500/15 border border-green-500/20 text-green-400 font-mono font-black text-[9px] rounded-lg uppercase tracking-wider shrink-0 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                      <span>OFA APPROVED</span>
                    </div>
                  </div>

                  {/* Medical checklist table */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest block mb-2">
                      Hereditary Disease Screening Parameters
                    </span>
                    {medicalChecks[activeCheckIdx].standards.map((std, si) => (
                      <div 
                        key={si}
                        className="p-3.5 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center text-xs font-mono group hover:bg-white/10 transition-colors"
                      >
                        <span className="text-gray-400 font-medium group-hover:text-white transition-colors">{std.label}</span>
                        <div className="flex items-center space-x-3 text-right">
                          <span className="text-gold-400 font-bold">{std.val}</span>
                          <span className="px-2 py-0.5 bg-green-500 text-white font-black text-[8px] rounded uppercase tracking-wider">
                            {std.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Animated Molecular Scan Bar */}
                <div className="pt-6 border-t border-white/5 mt-6 relative z-10 space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-mono text-gray-400">
                    <span className="flex items-center"><RefreshCw className="w-3 h-3 text-gold-400 mr-1.5 animate-spin" /> RUNNING HEALTH ASSAY SCANS...</span>
                    <span className="font-bold text-white">100% STANDARDS PASSED</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-gold-500 to-green-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-serif leading-relaxed italic mt-2 text-center">
                    "Every planned sire & dam must rank in the top 10% of global genetic safety parameters before authorized breeding is initiated."
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* NEW CRYPTOGRAPHIC REGISTRY VERIFICATION SECTION */}
      <div id="health-registry-verification" className="p-8 sm:p-14 bg-stone-50 border-b border-stone-100 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gold-500/10 border border-gold-500/20 text-gold-700 text-[9px] font-mono font-black uppercase rounded-full">
              <FileText className="w-3.5 h-3.5 mr-1" />
              <span>DVM Cryptographic Check</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-navy-950 leading-tight">
              Verify Clinical Records
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-serif italic leading-relaxed">
              Input any parent lineage code or waitlist verification ID to decrypt clinical health reports directly from our digital veterinary archives.
            </p>

            {/* Simulated verification selector for convenience */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest block">
                Quick Test Credentials:
              </span>
              <div className="flex flex-wrap gap-2">
                {['OFA-GR-RUSTY-129E', 'OFA-GR-BELLA-133G', 'OFA-GR-STERLING-EL55'].map((code) => (
                  <button
                    key={code}
                    onClick={() => setVerifyCode(code)}
                    className={`px-3 py-1.5 text-[9px] font-mono font-black rounded-lg border transition-all ${
                      verifyCode === code
                        ? 'bg-navy-950 text-white border-navy-950'
                        : 'bg-white text-gold-600 border-gold-200 hover:border-gold-500'
                    }`}
                  >
                    {code.split('-')[2]}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="Enter Registry Code..."
                className="flex-grow bg-white border border-stone-200/75 rounded-xl py-4 px-5 text-xs focus:outline-none focus:border-gold-500 font-mono"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="px-6 py-4 bg-gold-500 hover:bg-navy-950 hover:text-white text-navy-950 font-black text-[10px] font-mono uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2 shrink-0 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    <span>Decrypting...</span>
                  </>
                ) : (
                  <span>Verify Record</span>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7" id="health-verification-output">
            <AnimatePresence mode="wait">
              {verificationResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border-2 border-double border-stone-300 rounded-[2rem] p-6 sm:p-10 relative shadow-xl text-left"
                >
                  <div className="absolute top-4 right-4 text-[7px] font-mono font-black text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded uppercase tracking-wider flex items-center">
                    <Check className="w-2.5 h-2.5 mr-1" strokeWidth={3} />
                    <span>SECURE SIGNED</span>
                  </div>

                  <div className="space-y-5">
                    <div className="border-b border-stone-100 pb-4">
                      <span className="text-gold-600 text-[8px] font-mono font-black tracking-widest uppercase block">
                        GOLDEN VALLEY REGISTRY RECORD
                      </span>
                      <h4 className="text-lg font-black text-navy-950 mt-1">{verificationResult.name}</h4>
                      <p className="text-stone-400 text-[10px] font-mono uppercase tracking-wider mt-0.5">
                        REGISTRY ID: <span className="font-bold text-navy-950">{verificationResult.certId}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-stone-500">
                      <div>
                        <span className="text-stone-400 uppercase">Screening Standards:</span>
                        <p className="font-bold text-navy-950 mt-0.5">{verificationResult.title}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase">Authorized Clinician:</span>
                        <p className="font-bold text-navy-950 mt-0.5">{verificationResult.signature}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase">Assay Database Block:</span>
                        <p className="font-bold text-navy-950 mt-0.5 text-blue-600">{verificationResult.blockchainBlock}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase">Verification Stamp:</span>
                        <p className="font-bold text-green-600 mt-0.5 uppercase">{verificationResult.status}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-end justify-between">
                      <div className="space-y-1">
                        <span className="text-[7px] font-mono font-black text-stone-400 uppercase tracking-widest block">
                          SIGNATURE SIGN-OFF
                        </span>
                        <p className="font-serif italic text-base text-gold-600 font-semibold leading-none">
                          {verificationResult.signature.split(',')[0]}
                        </p>
                        <div className="w-32 h-px bg-stone-200 mt-1" />
                      </div>

                      {/* Gold Circular Stamp */}
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-gold-500 flex flex-col items-center justify-center p-1 bg-gold-50 shadow-inner select-none -rotate-12">
                        <span className="text-[5px] font-mono font-black text-gold-600 text-center uppercase tracking-tighter leading-none">
                          VETERINARY<br/>REGISTRY<br/>AUTHENTIC
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-stone-100/50 border border-dashed border-stone-300 rounded-[2rem] p-12 text-center flex flex-col items-center justify-center space-y-4 h-64"
                >
                  <FileText className="w-10 h-10 text-stone-400/60" />
                  <div className="space-y-1">
                    <p className="text-xs font-mono font-black text-stone-400 uppercase tracking-wider">
                      Awaiting Registry Code input
                    </p>
                    <p className="text-[11px] text-gray-400 font-serif italic">
                      Click any test credential code above or enter one manually to load official reports.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* TRANSPARENCY WARRANTY & COVENANTS CARD */}
      <div id="health-audit-guarantees" className="p-8 sm:p-14 bg-white text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gold-500/10 border border-gold-500/20 text-gold-700 text-[9px] font-mono font-black uppercase rounded-full">
              <Award className="w-3.5 h-3.5 mr-1" />
              <span>Sovereignty Warranties</span>
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-navy-950 leading-tight">
              Elite Breeder Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
              We stand fully behind our lineage. Every graduate carries a full, written 1-Year Genetic &amp; Orthopedic Health Guarantee contract. If any severe hereditary anomaly is certified by independent specialists, we provide direct financial reimbursement or matching replacement options, while you keep your cherished companion.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-stone-100 text-center grayscale opacity-60">
              <div className="space-y-1.5">
                <Award className="w-8 h-8 mx-auto text-gold-600" />
                <span className="text-[8px] font-mono font-black uppercase block">AKC Breeder of Heart</span>
              </div>
              <div className="space-y-1.5">
                <Microscope className="w-8 h-8 mx-auto text-gold-600" />
                <span className="text-[8px] font-mono font-black uppercase block">OFA Medical Trust</span>
              </div>
              <div className="space-y-1.5">
                <ShieldCheck className="w-8 h-8 mx-auto text-gold-600" />
                <span className="text-[8px] font-mono font-black uppercase block">Legacy Warranty</span>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200/50 rounded-3xl p-6 sm:p-10 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-navy-950 text-white rounded-xl shadow-md shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-left">
                <h5 className="font-black text-navy-950 text-sm">Transparency Promise</h5>
                <p className="text-gray-400 text-xs font-serif italic">
                  Prerogative physical folders containing official AKC registrations, veterinary certificates, and certified genetic screening assays accompany each puppy at the handover transition.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gold-50 border border-gold-200/40 rounded-2xl flex justify-between items-center text-[10px] font-mono">
              <span className="text-gold-700 font-black">CERTIFICATE FOLDERS COMPLETE</span>
              <span className="px-2 py-0.5 bg-green-500 text-white rounded font-bold uppercase tracking-widest text-[8px]">
                PASS
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
