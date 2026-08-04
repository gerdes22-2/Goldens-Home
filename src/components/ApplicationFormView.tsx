import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  ClipboardCheck, ChevronRight, ChevronLeft, ArrowRight, CheckCircle, 
  HelpCircle, User, MapPin, Mail, Phone, Heart, Dog, Sparkles, Send, X as LucideX,
  Home, ShieldAlert, DollarSign, ListChecks, HeartHandshake, Edit3, Clock
} from 'lucide-react';
import { AdoptionApplication } from '../types';

interface ApplicationFormViewProps {
  matchedPuppyName: string;
  setMatchedPuppyName: (name: string) => void;
  onAddApplication: (app: AdoptionApplication) => void;
  setTab: (tab: string) => void;
  setSearchWaitlistQuery: (query: string) => void;
}

export default function ApplicationFormView({ 
  matchedPuppyName, 
  setMatchedPuppyName,
  onAddApplication,
  setTab,
  setSearchWaitlistQuery
}: ApplicationFormViewProps) {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailAlertStatus, setEmailAlertStatus] = useState<boolean | null>(null);

  // Form State containing both legacy and expanded fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '', // Will be pre-filled with City, State from address
    experienceLevel: 'Have owned before' as 'First-time Owner' | 'Have owned before' | 'Experienced Breeder',
    hasOtherPets: false,
    petDetails: '',
    hasYard: true,
    yardFenced: true,
    workSetup: 'Work from home' as 'Work from home' | 'Full-time out of home' | 'Part-time',
    genderPreference: 'No Preference' as 'Male' | 'Female' | 'No Preference',
    colorPreference: [] as string[],
    notes: '',

    // Extended Questions
    residentialAddress: '',
    contactMethod: 'Email' as 'Phone Call' | 'Text' | 'Email',
    housingType: 'Single-Family Home' as 'Single-Family Home' | 'Townhouse' | 'Apartment' | 'Condo' | 'Farm/Acreage',
    ownOrRent: 'Own' as 'Own' | 'Rent',
    landlordInfo: '',
    fenceDetails: '',
    noYardPlan: '',
    householdMembers: '',
    hasAllergies: false,
    allAgree: true,
    preparedAdoptionFee: true,
    agreeReservationFee: true,
    preparedOngoingExpenses: true,
    priorBreeds: '',
    hoursAlone: '1-2 hours',
    dayLocation: 'Free roam inside' as 'Free roam inside' | 'Crate-trained' | 'Designated room/playpen' | 'Secure outdoor area',
    nightLocation: 'In a crate' as 'In a crate' | 'In a dog bed in our bedroom' | 'Free roam in the house' | 'Other',
    trainingPlan: '',
    unableToKeepCircumstances: '',
    returnPolicyAgreed: false,
    signature: '',
    signatureDate: new Date().toISOString().split('T')[0]
  });

  const coatColors = ['Light Golden', 'Cream', 'Honey Golden', 'Red Golden'];

  // Sync Location when Address changes
  const handleAddressChange = (addressVal: string) => {
    setFormData(prev => {
      // Basic extraction of City, State from address (e.g., "123 Main St, Austin, TX, 12345" -> "Austin, TX")
      const parts = addressVal.split(',').map(p => p.trim());
      let extractedLoc = prev.location;
      if (parts.length >= 3) {
        // e.g. City is parts[1], State is parts[2]
        extractedLoc = `${parts[1]}, ${parts[2].split(' ')[0]}`;
      } else if (parts.length === 2) {
        extractedLoc = parts[1];
      }
      return {
        ...prev,
        residentialAddress: addressVal,
        location: extractedLoc || prev.location
      };
    });
  };

  const handleCheckboxChange = (color: string) => {
    const isSelected = formData.colorPreference.includes(color);
    if (isSelected) {
      setFormData({
        ...formData,
        colorPreference: formData.colorPreference.filter(c => c !== color)
      });
    } else {
      setFormData({
        ...formData,
        colorPreference: [...formData.colorPreference, color]
      });
    }
  };

  // Validations per step
  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      return !!(formData.fullName && formData.email && formData.phone && formData.residentialAddress);
    }
    if (currentStep === 2) {
      if (formData.ownOrRent === 'Rent' && !formData.landlordInfo) return false;
      if (formData.hasYard && !formData.fenceDetails) return false;
      if (!formData.hasYard && !formData.noYardPlan) return false;
      if (!formData.householdMembers) return false;
      return true;
    }
    if (currentStep === 3) {
      return formData.preparedAdoptionFee && formData.agreeReservationFee && formData.preparedOngoingExpenses;
    }
    if (currentStep === 4) {
      if (formData.experienceLevel !== 'First-time Owner' && !formData.priorBreeds) return false;
      if (formData.hasOtherPets && !formData.petDetails) return false;
      if (!formData.hoursAlone) return false;
      if (!formData.trainingPlan) return false;
      return true;
    }
    if (currentStep === 5) {
      return !!(formData.unableToKeepCircumstances && formData.returnPolicyAgreed && formData.signature && formData.signatureDate);
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      // Highlight validation failure gently
      alert("Please complete all required fields on this page before moving forward.");
      return;
    }
    setStep(step + 1);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setStep(step - 1);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) {
      alert("Please review your final agreements, sign, and date the application before submission.");
      return;
    }

    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    const appId = `GPA-2026-${randomNum}`;

    // Compile fully compatible AdoptionApplication object including legacy mappings & advanced properties
    const newApp: AdoptionApplication = {
      id: appId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location || "USA",
      experienceLevel: formData.experienceLevel,
      hasOtherPets: formData.hasOtherPets,
      petDetails: formData.petDetails,
      hasYard: formData.hasYard,
      yardFenced: formData.yardFenced,
      workSetup: formData.workSetup,
      genderPreference: formData.genderPreference,
      colorPreference: formData.colorPreference,
      notes: formData.notes + (matchedPuppyName ? ` (Interested in matching puppy: ${matchedPuppyName})` : ''),
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Reviewing',

      // Extended Fields stored properly
      residentialAddress: formData.residentialAddress,
      contactMethod: formData.contactMethod,
      housingType: formData.housingType,
      ownOrRent: formData.ownOrRent,
      landlordInfo: formData.landlordInfo,
      fenceDetails: formData.fenceDetails,
      noYardPlan: formData.noYardPlan,
      householdMembers: formData.householdMembers,
      hasAllergies: formData.hasAllergies,
      allAgree: formData.allAgree,
      preparedAdoptionFee: formData.preparedAdoptionFee,
      agreeReservationFee: formData.agreeReservationFee,
      preparedOngoingExpenses: formData.preparedOngoingExpenses,
      priorBreeds: formData.priorBreeds,
      hoursAlone: formData.hoursAlone,
      dayLocation: formData.dayLocation,
      nightLocation: formData.nightLocation,
      trainingPlan: formData.trainingPlan,
      unableToKeepCircumstances: formData.unableToKeepCircumstances,
      signature: formData.signature,
      signatureDate: formData.signatureDate
    };

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApp),
      });
      if (res.ok) {
        const data = await res.json();
        setEmailAlertStatus(data.emailSent);
      } else {
        setEmailAlertStatus(false);
      }
    } catch (err) {
      console.error('Failed to submit application to backend server:', err);
      setEmailAlertStatus(false);
    } finally {
      setIsSubmitting(false);
    }

    onAddApplication(newApp);
    setGeneratedId(appId);
    setSearchWaitlistQuery(formData.fullName);
    setSuccess(true);
    
    // Trigger advanced celebratory confetti sequence
    confetti({
      particleCount: 180,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#D4AF37', '#0D2244', '#FFFFFF']
    });

    const end = Date.now() + 2500;
    const colors = ['#D4AF37', '#0D2244', '#FFFFFF'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      experienceLevel: 'Have owned before',
      hasOtherPets: false,
      petDetails: '',
      hasYard: true,
      yardFenced: true,
      workSetup: 'Work from home',
      genderPreference: 'No Preference',
      colorPreference: [],
      notes: '',
      residentialAddress: '',
      contactMethod: 'Email',
      housingType: 'Single-Family Home',
      ownOrRent: 'Own',
      landlordInfo: '',
      fenceDetails: '',
      noYardPlan: '',
      householdMembers: '',
      hasAllergies: false,
      allAgree: true,
      preparedAdoptionFee: true,
      agreeReservationFee: true,
      preparedOngoingExpenses: true,
      priorBreeds: '',
      hoursAlone: '1-2 hours',
      dayLocation: 'Free roam inside',
      nightLocation: 'In a crate',
      trainingPlan: '',
      unableToKeepCircumstances: '',
      returnPolicyAgreed: false,
      signature: '',
      signatureDate: new Date().toISOString().split('T')[0]
    });
    setMatchedPuppyName('');
    setStep(1);
    setSuccess(false);
  };

  const handleViewWaitlist = () => {
    setTab('waitlist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stepTitles = [
    "Contact Details",
    "Household & Living",
    "Adoption Policies",
    "Experience & Care",
    "Future Care & Signup"
  ];

  return (
    <div className="bg-[#fcfaf7] min-h-screen pt-32 pb-32 text-navy-950">
      
      {/* HEADER HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
        >
            <span className="text-[10px] font-mono font-black text-gold-600 tracking-[0.4em] uppercase block">
                Official Registry
            </span>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none italic uppercase">
                Adoption <span className="text-gold-500">Application</span>
            </h1>
            <p className="text-xs md:text-base text-gray-400 max-w-2xl mx-auto font-serif leading-relaxed italic">
                Initiate your integration into our family line. Our screening process ensures life-long synergy and safety for our precious retrievers.
            </p>

            <AnimatePresence>
                {matchedPuppyName && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex items-center space-x-4 bg-navy-950 border border-gold-500/20 px-6 py-2.5 rounded-2xl text-gold-500 mt-4"
                >
                    <Dog className="w-4 h-4" />
                    <span className="text-[9px] font-mono font-black uppercase tracking-widest">Selected Puppy Target: {matchedPuppyName}</span>
                    <button onClick={() => setMatchedPuppyName('')} className="bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                        <LucideX className="w-3 h-3" />
                    </button>
                </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
      </section>

      {/* FORM WIZARD */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-gold-100 shadow-2xl p-6 md:p-12"
        >
          {/* STEPPER PROGRESS */}
          {!success && (
            <div className="mb-12">
              <div className="flex flex-wrap items-center justify-between gap-4 md:gap-0 pb-6 border-b border-gray-100">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center mx-auto">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xs transition-all duration-500 ${step >= s ? 'bg-navy-950 text-gold-500 shadow-lg shadow-navy-950/10' : 'bg-gold-50 text-gold-200'}`}>{s}</div>
                      <span className={`text-[7px] font-mono font-black uppercase tracking-wider mt-2 whitespace-nowrap ${step === s ? 'text-navy-950' : 'text-gray-300'}`}>
                        {stepTitles[s-1]}
                      </span>
                    </div>
                    {s < 5 && (
                      <div className={`hidden md:block h-0.5 flex-1 mx-2 ${step > s ? 'bg-gold-500' : 'bg-gold-50'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-gold-600 bg-gold-500/10 px-3 py-1 rounded-full">
                  Step {step} of 5: {stepTitles[step-1]}
                </span>
              </div>
            </div>
          )}

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-10 text-left">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: PART 1 - CONTACT INFORMATION */}
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center space-x-3 text-navy-950 pb-2 border-b border-gray-100">
                            <User className="w-5 h-5 text-gold-500" />
                            <h2 className="text-base font-black uppercase tracking-widest">Part 1: Contact Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Full Legal Name *" value={formData.fullName} onChange={(v) => setFormData({...formData, fullName: v})} placeholder="e.g. Johnathan Doe" />
                            <InputGroup label="Email Identity *" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} placeholder="e.g. hello@domain.com" />
                            <InputGroup label="Primary Telephone *" type="tel" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} placeholder="(555) 000-0000" />
                            <div className="flex flex-col space-y-2">
                              <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1">Preferred Method of Contact *</label>
                              <div className="grid grid-cols-3 gap-2">
                                {['Phone Call', 'Text', 'Email'].map((method) => (
                                  <button
                                    key={method}
                                    type="button"
                                    onClick={() => setFormData({...formData, contactMethod: method as any})}
                                    className={`py-3.5 border rounded-xl font-bold text-[10px] uppercase tracking-wider text-center transition-all ${formData.contactMethod === method ? 'bg-navy-950 text-white border-navy-950 shadow-md shadow-navy-950/10' : 'bg-gold-50 border-gold-100 text-gold-600 hover:border-gold-300'}`}
                                  >
                                    {method}
                                  </button>
                                ))}
                              </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1">Residential Address (Street, City, State, Zip) *</label>
                          <input 
                            type="text" 
                            value={formData.residentialAddress} 
                            onChange={(e) => handleAddressChange(e.target.value)} 
                            placeholder="e.g. 123 Valley Ranch Road, Woodville, TX, 75979"
                            required
                            className="p-4 bg-gold-50 border border-gold-100 rounded-xl text-xs focus:outline-none focus:border-gold-500 transition-all font-medium font-serif" 
                          />
                          {formData.location && (
                            <span className="text-[9px] font-mono text-emerald-600 block pl-1">
                              ✓ Auto-detected Location: <strong>{formData.location}</strong>
                            </span>
                          )}
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: PART 2 - HOUSEHOLD & LIVING ENVIRONMENT */}
                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center space-x-3 text-navy-950 pb-2 border-b border-gray-100">
                            <Home className="w-5 h-5 text-gold-500" />
                            <h2 className="text-base font-black uppercase tracking-widest">Part 2: Household & Living Environment</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col space-y-2">
                              <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1 font-extrabold">What type of housing do you live in? *</label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {['Single-Family Home', 'Townhouse', 'Apartment', 'Condo', 'Farm/Acreage'].map((house) => (
                                  <button
                                    key={house}
                                    type="button"
                                    onClick={() => setFormData({...formData, housingType: house as any})}
                                    className={`py-3.5 px-1 border rounded-xl font-bold text-[9px] uppercase tracking-wider text-center transition-all ${formData.housingType === house ? 'bg-navy-950 text-white border-navy-950 shadow-md' : 'bg-gold-50 border-gold-100 text-gold-600 hover:border-gold-300'}`}
                                  >
                                    {house}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                              <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1 font-extrabold">Do you own or rent your home? *</label>
                              <div className="grid grid-cols-2 gap-2">
                                {['Own', 'Rent'].map((status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => setFormData({...formData, ownOrRent: status as any})}
                                    className={`py-3.5 border rounded-xl font-bold text-[10px] uppercase tracking-wider text-center transition-all ${formData.ownOrRent === status ? 'bg-navy-950 text-white border-navy-950 shadow-md' : 'bg-gold-50 border-gold-100 text-gold-600 hover:border-gold-300'}`}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </div>
                        </div>

                        {formData.ownOrRent === 'Rent' && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-xl space-y-3">
                            <span className="text-[9px] font-mono font-bold text-amber-700 uppercase flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5" /> Landlord Permission Required
                            </span>
                            <InputGroup 
                              label="Confirm landlord permits dogs & list landlord name / contact number *" 
                              value={formData.landlordInfo} 
                              onChange={(v) => setFormData({...formData, landlordInfo: v})} 
                              placeholder="e.g. Yes, landlord Jane Smith permits Golden Retrievers, Phone: 555-123-4567" 
                            />
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ToggleGroup 
                              label="Securely fenced yard or exercise area? *" 
                              checked={formData.hasYard} 
                              onChange={(v) => setFormData({...formData, hasYard: v, yardFenced: v})} 
                              desc="Enables direct outdoor exercise routines" 
                            />

                            {formData.hasYard ? (
                              <InputGroup 
                                label="Please describe the fence type and height *" 
                                value={formData.fenceDetails} 
                                onChange={(v) => setFormData({...formData, fenceDetails: v})} 
                                placeholder="e.g. 6ft solid cedar privacy fence with secure bottom lock" 
                              />
                            ) : (
                              <div className="flex flex-col space-y-2">
                                <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1 font-extrabold">Plan for daily exercise & safe potty breaks *</label>
                                <textarea
                                  rows={2}
                                  placeholder="e.g. We will do 3 structured leashed walks daily, and utilize the neighborhood enclosed puppy park..."
                                  value={formData.noYardPlan}
                                  onChange={(e) => setFormData({...formData, noYardPlan: e.target.value})}
                                  required
                                  className="p-4 bg-gold-50 border border-gold-100 rounded-xl text-xs focus:outline-none focus:border-gold-500 font-serif"
                                />
                              </div>
                            )}
                        </div>

                        <div className="flex flex-col space-y-2">
                          <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1 font-extrabold">Who currently lives in your household? (List all adults, children & their ages) *</label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Father John (38), Mother Sarah (35), Daughter Emily (8), Son Leo (4)..."
                            value={formData.householdMembers}
                            onChange={(e) => setFormData({...formData, householdMembers: e.target.value})}
                            required
                            className="p-4 bg-gold-50 border border-gold-100 rounded-xl text-xs focus:outline-none focus:border-gold-500 font-serif"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <ToggleGroup 
                            label="Known dog allergies in household?" 
                            checked={formData.hasAllergies} 
                            onChange={(v) => setFormData({...formData, hasAllergies: v})} 
                            desc="Critical health precaution checking" 
                          />
                          <ToggleGroup 
                            label="All members in full agreement about getting a Golden Retriever? *" 
                            checked={formData.allAgree} 
                            onChange={(v) => setFormData({...formData, allAgree: v})} 
                            desc="Ensures stable, loving community structure" 
                          />
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: PART 3 - FINANCIAL PREPAREDNESS & ADOPTION POLICIES */}
                {step === 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center space-x-3 text-navy-950 pb-2 border-b border-gray-100">
                            <DollarSign className="w-5 h-5 text-gold-500" />
                            <h2 className="text-base font-black uppercase tracking-widest">Part 3: Financial Preparedness & Policies</h2>
                        </div>

                        <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden border border-gold-500/20 shadow-xl">
                          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gold-500 text-navy-950 rounded-xl">
                              <ClipboardCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-[9px] font-mono font-black tracking-widest text-gold-500 block">FEE SCHEDULE & GUARANTEES</span>
                              <h3 className="font-extrabold text-sm uppercase">Financial Commitments Overview</h3>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono border-t border-b border-white/10 py-5">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                              <span className="text-[9px] text-gray-400 block uppercase">Final Adoption Price</span>
                              <span className="text-xl font-extrabold text-gold-500">$850.00</span>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                              <span className="text-[9px] text-gray-400 block uppercase">Immediately Approval Hold</span>
                              <span className="text-xl font-extrabold text-gold-500">$350.00</span>
                            </div>
                          </div>
                          
                          <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed font-serif italic">
                            "A required commitment reservation fee of $350 is due immediately after application approval to secure and reserve your spot on the waitlist or reserve a specific puppy. Our breeding program requires direct investment in high-quality medical tracking, socialization training, and OFA testing."
                          </p>
                        </div>

                        <div className="space-y-4">
                          <ToggleGroup 
                            label="Are you financially prepared for the $850 adoption fee? *" 
                            checked={formData.preparedAdoptionFee} 
                            onChange={(v) => setFormData({...formData, preparedAdoptionFee: v})} 
                            desc="Must be in agreement to proceed" 
                          />

                          <ToggleGroup 
                            label="Do you agree to the required immediate $350 approval reservation fee? *" 
                            checked={formData.agreeReservationFee} 
                            onChange={(v) => setFormData({...formData, agreeReservationFee: v})} 
                            desc="Guarantees chronological priority" 
                          />

                          <ToggleGroup 
                            label="Are you prepared to provide ongoing care, high-quality food, and veterinary care over the dog's lifetime? *" 
                            checked={formData.preparedOngoingExpenses} 
                            onChange={(v) => setFormData({...formData, preparedOngoingExpenses: v})} 
                            desc="Ensures long-term premium quality of life" 
                          />
                        </div>
                    </motion.div>
                )}

                {/* STEP 4: PART 4 - EXPERIENCE & LIFESTYLE */}
                {step === 4 && (
                    <motion.div 
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center space-x-3 text-navy-950 pb-2 border-b border-gray-100">
                            <ListChecks className="w-5 h-5 text-gold-500" />
                            <h2 className="text-base font-black uppercase tracking-widest">Part 4: Experience & Lifestyle</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-2">
                              <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1 font-bold">Have you owned a dog before? *</label>
                              <div className="grid grid-cols-2 gap-2">
                                {['Have owned before', 'First-time Owner'].map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setFormData({...formData, experienceLevel: opt as any})}
                                    className={`py-3.5 border rounded-xl font-bold text-[10px] uppercase tracking-wider text-center transition-all ${formData.experienceLevel === opt ? 'bg-navy-950 text-white border-navy-950 shadow-md' : 'bg-gold-50 border-gold-100 text-gold-600 hover:border-gold-300'}`}
                                  >
                                    {opt === 'First-time Owner' ? 'First-time' : 'Owned Before'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <ToggleGroup 
                              label="Do you currently own other pets? *" 
                              checked={formData.hasOtherPets} 
                              onChange={(v) => setFormData({...formData, hasOtherPets: v})} 
                              desc="Enables cross-compatibility checks" 
                            />
                        </div>

                        {formData.experienceLevel !== 'First-time Owner' && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                            <InputGroup 
                              label="Please list breeds owned before and what happened to them *" 
                              value={formData.priorBreeds} 
                              onChange={(v) => setFormData({...formData, priorBreeds: v})} 
                              placeholder="e.g. Golden Retriever (passed away at 14 of natural causes), Beagle (lived to 13)..." 
                            />
                          </motion.div>
                        )}

                        {formData.hasOtherPets && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                            <InputGroup 
                              label="Please list species, ages, and whether they are spayed/neutered *" 
                              value={formData.petDetails} 
                              onChange={(v) => setFormData({...formData, petDetails: v})} 
                              placeholder="e.g. Cat (Domestic Medium Hair, 4 years old, Neutered)..." 
                            />
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup 
                              label="How many hours will the puppy be left alone during a typical day? *" 
                              value={formData.hoursAlone} 
                              onChange={(v) => setFormData({...formData, hoursAlone: v})} 
                              placeholder="e.g. 2-3 hours during morning errands" 
                            />

                            <div className="flex flex-col space-y-2">
                              <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1 font-bold">Daily Presence setup *</label>
                              <div className="grid grid-cols-3 gap-2">
                                {['Work from home', 'Full-time out of home', 'Part-time'].map((work) => (
                                  <button
                                    key={work}
                                    type="button"
                                    onClick={() => setFormData({...formData, workSetup: work as any})}
                                    className={`py-3.5 px-1 border rounded-xl font-bold text-[9px] uppercase tracking-wider text-center transition-all ${formData.workSetup === work ? 'bg-navy-950 text-white border-navy-950' : 'bg-gold-50 border-gold-100 text-gold-600'}`}
                                  >
                                    {work === 'Full-time out of home' ? 'Full-Time Out' : work}
                                  </button>
                                ))}
                              </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                            <div className="flex flex-col space-y-2">
                              <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1 font-bold font-mono">Where will puppy spend day when not home? *</label>
                              <select 
                                value={formData.dayLocation} 
                                onChange={(e) => setFormData({...formData, dayLocation: e.target.value as any})}
                                className="p-4 bg-gold-50 border border-gold-100 rounded-xl text-xs focus:outline-none focus:border-gold-500 font-mono text-[#0d2244] font-bold"
                              >
                                <option value="Free roam inside">Free roam inside</option>
                                <option value="Crate-trained">Crate-trained</option>
                                <option value="Designated room/playpen">Designated room/playpen</option>
                                <option value="Secure outdoor area">Secure outdoor area</option>
                              </select>
                            </div>

                            <div className="flex flex-col space-y-2">
                              <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1 font-bold font-mono">Where will puppy sleep at night? *</label>
                              <select 
                                value={formData.nightLocation} 
                                onChange={(e) => setFormData({...formData, nightLocation: e.target.value as any})}
                                className="p-4 bg-gold-50 border border-gold-100 rounded-xl text-xs focus:outline-none focus:border-gold-500 font-mono text-[#0d2244] font-bold"
                              >
                                <option value="In a crate">In a crate</option>
                                <option value="In a dog bed in our bedroom">In a dog bed in our bedroom</option>
                                <option value="Free roam in the house">Free roam in the house</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1 font-bold">What is your plan for socializing, house-training, and obedience training? *</label>
                          <textarea
                            rows={3}
                            placeholder="e.g. We will start puppy socialization classes at 10 weeks, follow positive-reinforcement crate training, and do daily 15-min obedience drills at home..."
                            value={formData.trainingPlan}
                            onChange={(e) => setFormData({...formData, trainingPlan: e.target.value})}
                            required
                            className="p-4 bg-gold-50 border border-gold-100 rounded-xl text-xs focus:outline-none focus:border-gold-500 font-serif"
                          />
                        </div>
                    </motion.div>
                )}

                {/* STEP 5: PART 5 - FUTURE CARE, SELECTION & SIGNATURE */}
                {step === 5 && (
                    <motion.div 
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center space-x-3 text-navy-950 pb-2 border-b border-gray-100">
                            <HeartHandshake className="w-5 h-5 text-gold-500" />
                            <h2 className="text-base font-black uppercase tracking-widest">Part 5: Future Care & Commitment</h2>
                        </div>

                        <div className="bg-amber-500/5 border border-amber-500/15 p-5 rounded-2xl text-xs space-y-3 font-serif">
                          <span className="text-[9px] font-mono font-black text-amber-700 tracking-wider uppercase flex items-center gap-1">
                            <ShieldAlert className="w-4 h-4" /> Return Policy & Welfare Clause
                          </span>
                          <p className="text-gray-650 leading-relaxed italic text-[11px]">
                            "By submitting this application, you agree that if you are ever unable to keep this dog, they <strong>MUST</strong> be returned directly to Golden Paws Home. You agree <strong>NEVER</strong> to surrender this dog to an animal shelter, humane society, or rehome them independently. We provide lifetime sanctuary and support for all of our bloodlines."
                          </p>
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, returnPolicyAgreed: !formData.returnPolicyAgreed})}
                            className={`w-full py-3.5 px-4 rounded-xl font-bold font-mono text-[10px] uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 ${formData.returnPolicyAgreed ? 'bg-navy-950 text-gold-500' : 'bg-gold-50 text-gold-600 border border-dashed border-gold-300 hover:bg-gold-100/50'}`}
                          >
                            <CheckCircle className={`w-4 h-4 ${formData.returnPolicyAgreed ? 'text-gold-500' : 'text-gray-300'}`} />
                            {formData.returnPolicyAgreed ? 'I Agree to the Return Policy Agreement ✓' : 'Click to Agree to Return Policy *'}
                          </button>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1 font-bold">What circumstances or life changes would cause you to be unable to keep this dog? *</label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Extreme personal medical emergency only; we are committed to keeping this dog forever through house moves, jobs, and kids..."
                            value={formData.unableToKeepCircumstances}
                            onChange={(e) => setFormData({...formData, unableToKeepCircumstances: e.target.value})}
                            required
                            className="p-4 bg-gold-50 border border-gold-100 rounded-xl text-xs focus:outline-none focus:border-gold-500 font-serif"
                          />
                        </div>

                        {/* COAT & GENDER PREFERENCES (PRESERVED FROM ORIGINAL FORM) */}
                        <div className="bg-gold-500/5 border border-gold-500/10 p-5 rounded-2xl space-y-4">
                          <span className="text-[9px] font-mono font-black text-gold-600 tracking-wider uppercase block">
                            Canine Preferences & Additional Aspirations
                          </span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1">Gender Priority</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Male', 'Female', 'No Preference'].map((gen) => (
                                        <button
                                            key={gen}
                                            type="button"
                                            onClick={() => setFormData({...formData, genderPreference: gen as any})}
                                            className={`py-2.5 rounded-xl font-extrabold text-[9px] uppercase tracking-wider text-center transition-all ${formData.genderPreference === gen ? 'bg-navy-950 text-white' : 'bg-white border border-gray-200 text-gray-500'}`}
                                        >
                                            {gen === 'No Preference' ? 'Either' : gen}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1">Preferred Tones</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {coatColors.map((color) => {
                                        const isSelected = formData.colorPreference.includes(color);
                                        return (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => handleCheckboxChange(color)}
                                                className={`py-2.5 px-3 rounded-xl flex items-center justify-between text-[9px] font-extrabold uppercase tracking-wider border ${isSelected ? 'bg-navy-950 text-gold-500 border-navy-950' : 'bg-white border-gray-200 text-gray-500'}`}
                                            >
                                                <span>{color}</span>
                                                <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-gold-500' : 'bg-gray-200'}`} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                              <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1">Additional Household Aspirations or Vetting Notes</label>
                              <textarea
                                  rows={2}
                                  placeholder="Describe any other requests, therapy work goals, or desired temperament traits..."
                                  value={formData.notes}
                                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                  className="w-full p-4 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold-500 font-serif"
                              />
                          </div>
                        </div>

                        {/* SIGNATURE BLOCKS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <InputGroup 
                              label="Applicant Electronic Signature (Type Full Legal Name) *" 
                              value={formData.signature} 
                              onChange={(v) => setFormData({...formData, signature: v})} 
                              placeholder="Type Johnathan Doe to sign" 
                            />

                            <div className="flex flex-col space-y-3">
                              <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1">Signature Date *</label>
                              <input 
                                type="date" 
                                value={formData.signatureDate} 
                                onChange={(e) => setFormData({...formData, signatureDate: e.target.value})} 
                                required
                                className="p-5 bg-gold-50 border border-gold-100 rounded-2xl text-xs focus:outline-none focus:border-gold-500 font-mono text-[#0d2244] font-bold" 
                              />
                            </div>
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>

              {/* ACTION CTAS */}
              <div className="flex items-center justify-between pt-8 border-t border-gold-100">
                {step > 1 ? (
                  <button type="button" onClick={handlePrev} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-navy-950 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Step</span>
                  </button>
                ) : <div />}

                {step < 5 ? (
                  <button type="button" onClick={handleNext} className="group px-10 py-5 bg-navy-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center space-x-3 hover:bg-gold-500 hover:text-navy-950 transition-all">
                    <span>Next Section</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-12 py-6 bg-gold-500 text-navy-950 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-gold-500/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'TRANSMITTING...' : 'Submit Adoption Dossier'}</span>
                    <Send className={`w-5 h-5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                  </button>
                )}
              </div>
            </form>
          ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-12 py-12"
            >
              <div className="relative inline-flex items-center justify-center">
                {/* Ambient glowing outer pulse rings */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: [0.15, 0.35, 0.15], 
                    scale: [1, 1.35, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute w-48 h-48 rounded-full bg-gold-500/20 blur-xl"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: [0.2, 0.45, 0.2], 
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute w-36 h-36 rounded-full border border-gold-500/20"
                />

                {/* Scaling checkmark badge with dynamic entry bounce */}
                <motion.div 
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.1 }}
                  className="relative z-10 inline-flex p-8 bg-gradient-to-tr from-gold-600 to-gold-400 rounded-full text-navy-950 shadow-2xl shadow-gold-500/30"
                >
                  <CheckCircle className="w-16 h-16" />
                </motion.div>

                {/* Whimsical rotating sparkles popping out from behind */}
                <motion.div
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], x: -65, y: -55, rotate: 45 }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                  className="absolute text-gold-500 z-20 pointer-events-none"
                >
                  <Sparkles className="w-6 h-6 fill-gold-500" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4], x: 75, y: -35, rotate: -30 }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.8 }}
                  className="absolute text-gold-600 z-20 pointer-events-none"
                >
                  <Sparkles className="w-4 h-4 fill-gold-600" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.6, 1.3, 0.6], x: -55, y: 65, rotate: 15 }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 0.1 }}
                  className="absolute text-gold-500 z-20 pointer-events-none"
                >
                  <Sparkles className="w-5 h-5 fill-gold-500" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.15, 0.5], x: 65, y: 55, rotate: 75 }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1.0 }}
                  className="absolute text-gold-400 z-20 pointer-events-none"
                >
                  <Sparkles className="w-5 h-5 fill-gold-400" />
                </motion.div>
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-black italic">Transmission <span className="text-gold-500">Secure.</span></h2>
                <p className="text-gray-450 text-sm md:text-lg max-w-lg mx-auto font-serif">
                  Thank you, <strong>{formData.fullName}</strong>. Your adopter profile has been successfully integrated into our vetting archives. Katrina Mahra will initialize consultation within 48 business hours.
                </p>
              </div>

              <div className="max-w-md mx-auto bg-navy-950 text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl border border-gold-500/20 text-left font-mono">
                <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <span className="text-[10px] text-gold-500 font-extrabold tracking-widest uppercase">Breeder ID Card</span>
                <h4 className="text-lg font-black mt-2 mb-8 border-b border-white/10 pb-4">GPA REGISTRY</h4>
                
                <div className="space-y-4 text-[10px] font-black uppercase tracking-widest">
                  <div className="flex justify-between"><span className="text-gray-500">Reference:</span> <span>{generatedId}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Candidate:</span> <span className="text-gold-500">{formData.fullName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Status:</span> <span className="bg-gold-500 text-navy-950 px-3 py-1 rounded">Vetting_Active</span></div>
                  <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
                    <span className="text-gray-500">Email Notification:</span> 
                    <span className={emailAlertStatus ? "text-green-400 font-black text-[9px]" : "text-yellow-400 font-black text-[9px]"}>
                      {emailAlertStatus ? "✓ DISPATCHED TO ADMIN OUTBOX" : "✓ STORED ON BREEDER SERVER"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12">
                <button onClick={handleReset} className="w-full md:w-auto px-10 py-5 border border-gold-100 text-[10px] font-black uppercase tracking-widest hover:bg-gold-50 transition-all rounded-2xl">Create New Profile</button>
                <button onClick={handleViewWaitlist} className="w-full md:w-auto px-10 py-5 bg-navy-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-gold-500 hover:text-navy-950 transition-all">Audit Waitlist Queue</button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

    </div>
  );
}

function InputGroup({ label, value, onChange, placeholder, type = "text" }: { label: string, value: string, onChange: (v: string) => void, placeholder: string, type?: string }) {
  return (
    <div className="flex flex-col space-y-2">
        <label className="text-[10px] font-mono font-black uppercase tracking-widest text-gray-400 ml-1 font-bold">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder={placeholder}
            required
            className="p-4 bg-gold-50 border border-gold-100 rounded-xl text-xs focus:outline-none focus:border-gold-500 transition-all font-medium font-serif" 
        />
    </div>
  );
}

function ToggleGroup({ label, checked, onChange, desc }: { label: string, checked: boolean, onChange: (v: boolean) => void, desc: string }) {
    return (
        <button 
            type="button"
            onClick={() => onChange(!checked)}
            className={`p-4 border rounded-xl flex items-center justify-between group transition-all duration-300 ${checked ? 'bg-navy-950 border-navy-950 text-white shadow-md' : 'bg-gold-50 border-gold-100 text-navy-950 hover:border-gold-300'}`}
        >
            <div className="text-left pr-4">
                <span className="block text-[10px] font-black uppercase tracking-wider">{label}</span>
                <span className="text-[8px] font-mono tracking-tight font-medium text-gray-400 block mt-0.5">{desc}</span>
            </div>
            <div className={`w-10 h-5 rounded-full relative flex-shrink-0 transition-colors duration-300 ${checked ? 'bg-gold-500' : 'bg-gold-200'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${checked ? 'left-5' : 'left-0.5'}`} />
            </div>
        </button>
    );
}
