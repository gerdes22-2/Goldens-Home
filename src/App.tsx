import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Sparkles, X as LucideX, ShieldCheck } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import ParentsView from './components/ParentsView';
import ProcessView from './components/ProcessView';
import PuppiesView from './components/PuppiesView';
import GalleryView from './components/GalleryView';
import FAQsView from './components/FAQsView';
import ResourcesView from './components/ResourcesView';
import ApplicationFormView from './components/ApplicationFormView';
import WaitlistView from './components/WaitlistView';
import ContactView from './components/ContactView';
import ReviewsView from './components/ReviewsView';
import LiveConsole from './components/LiveConsole';
import PuppyMatcherQuiz from './components/PuppyMatcherQuiz';
import HealthAuditView from './components/HealthAuditView';
import JournalView from './components/JournalView';
import BreederDashboardView from './components/BreederDashboardView';

import { DEFAULT_PUPPIES, DEFAULT_REVIEWS, DEFAULT_WAITLIST } from './data';
import { Puppy, Review, WaitlistEntry, AdoptionApplication } from './types';

export default function App() {
  const [currentTab, setTab] = useState<string>('home');
  const [puppies, setPuppies] = useState<Puppy[]>(DEFAULT_PUPPIES);
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(DEFAULT_WAITLIST);
  const [selectedPuppy, setSelectedPuppy] = useState<Puppy | null>(null);
  
  // Shared state connecting Available Pups to Adoption Application Wizard matching
  const [matchedPuppyName, setMatchedPuppyName] = useState<string>('');

  // Shared state pre-filling Waitlist query search on successful Form submission
  const [searchWaitlistQuery, setSearchWaitlistQuery] = useState<string>('');

  // Floating email confirmation toast state
  const [emailToast, setEmailToast] = useState<{
    email: string;
    appId: string;
    userName: string;
  } | null>(null);

  // Callback to append user submitted application dynamically as a Waitlist Entry
  const handleAddApplication = (app: AdoptionApplication) => {
    // 1. Create a simulated waitlist entry on hold for them
    const newWaitEntry: WaitlistEntry = {
      id: `w-${Date.now()}`,
      name: app.fullName,
      dateJoined: new Date().toISOString().split('T')[0],
      position: waitlist.length + 1,
      status: 'Pending Review',
      puppyPreference: matchedPuppyName || (app.colorPreference.length > 0 ? `${app.colorPreference.join('/')} ${app.genderPreference}` : 'Classic Honey Male/Female'),
      estimatedLitterDate: 'Autumn Litters (Oct 2026)'
    };

    setWaitlist([...waitlist, newWaitEntry]);

    // 2. Mark the targeted puppy as Reserved dynamically in state if they matched!
    if (matchedPuppyName) {
      setPuppies(prevPups => 
        prevPups.map(p => p.name.toLowerCase() === matchedPuppyName.toLowerCase() ? { ...p, status: 'Reserved' } : p)
      );
    }

    // 3. Trigger simulated email confirmation dispatch to their email address
    setTimeout(() => {
      setEmailToast({
        email: app.email,
        appId: app.id,
        userName: app.fullName
      });
      
      // Auto-dismiss the toast and sync tracking after 6.5s
      setTimeout(() => {
        setEmailToast(null);
      }, 6500);
    }, 750);
  };

  // Callback to append user reviews dynamically in community state
  const handleAddReview = (newRev: Review) => {
    setReviews([newRev, ...reviews]);
  };

  return (
    <div id="app-root-container" className="min-h-screen flex flex-col justify-between bg-[#fcfaf7] font-sans">
      
      {/* HEADER NAVIGATION BAR */}
      <Header currentTab={currentTab} setTab={setTab} />

      {/* RENDER DYNAMIC PAGES VIA TAB SWITCH WITH FADE ANIMATIONS */}
      <main className="flex-grow">
        <LiveConsole setTab={setTab} />
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {currentTab === 'home' && (
            <HomeView 
              puppies={puppies} 
              setTab={setTab} 
              setSelectedPuppy={setSelectedPuppy} 
              setMatchedPuppyName={setMatchedPuppyName}
            />
          )}

          {currentTab === 'about' && (
            <AboutView />
          )}

          {currentTab === 'parents' && (
            <ParentsView />
          )}

          {currentTab === 'process' && (
            <ProcessView />
          )}

          {currentTab === 'resources' && (
            <ResourcesView />
          )}

          {currentTab === 'puppies' && (
            <PuppiesView 
              puppies={puppies}
              selectedPuppy={selectedPuppy}
              setSelectedPuppy={setSelectedPuppy}
              setTab={setTab}
              setMatchedPuppyName={setMatchedPuppyName}
            />
          )}

          {currentTab === 'gallery' && (
            <GalleryView />
          )}

          {currentTab === 'faqs' && (
            <FAQsView />
          )}

          {currentTab === 'apply' && (
            <ApplicationFormView 
              matchedPuppyName={matchedPuppyName}
              setMatchedPuppyName={setMatchedPuppyName}
              onAddApplication={handleAddApplication}
              setTab={setTab}
              setSearchWaitlistQuery={setSearchWaitlistQuery}
            />
          )}

          {currentTab === 'waitlist' && (
            <WaitlistView 
              waitlist={waitlist}
              searchQuery={searchWaitlistQuery}
              setSearchQuery={setSearchWaitlistQuery}
              setTab={setTab}
            />
          )}

          {currentTab === 'contact' && (
            <ContactView />
          )}

          {currentTab === 'reviews' && (
            <ReviewsView 
              reviews={reviews}
              onAddReview={handleAddReview}
            />
          )}
          
          {currentTab === 'matcher' && (
            <div className="pt-32 pb-20 max-w-2xl mx-auto px-4">
              <PuppyMatcherQuiz 
                puppies={puppies} 
                onMatch={setMatchedPuppyName} 
                setTab={setTab} 
              />
            </div>
          )}

          {currentTab === 'health' && (
            <div className="pt-32 pb-32 max-w-5xl mx-auto px-4">
              <HealthAuditView />
            </div>
          )}

          {currentTab === 'journal' && (
            <JournalView />
          )}

          {currentTab === 'breeder-portal' && (
            <BreederDashboardView setTab={setTab} />
          )}
        </motion.div>
      </main>

      {/* CUSTOM FOOTER INFO */}
      <Footer setTab={setTab} />

      {/* FLOATING EMAIL CONFIRMATION DISPATCH TOAST */}
      <AnimatePresence>
        {emailToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 md:right-8 z-[999] max-w-md w-full sm:w-[420px] bg-[#0d2244] text-white border-2 border-gold-400 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Gold Accent Backdrop Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4">
              {/* Mail Icon Wrapper with ripple ring animation */}
              <div className="relative shrink-0 mt-1">
                <span className="absolute inset-0 rounded-full bg-gold-400/20 animate-ping" />
                <div className="h-12 w-12 bg-gold-500/20 border border-gold-500/30 rounded-2xl flex items-center justify-center text-gold-400 relative">
                  <Mail className="w-5 h-5" />
                </div>
              </div>

              {/* Toast Body content */}
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center space-x-1 bg-gold-500/15 border border-gold-500/25 px-2.5 py-0.5 rounded-full text-gold-400 text-[9px] font-mono font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-gold-400 animate-spin" />
                    <span>Secure Dispatch Transmitted</span>
                  </span>
                  {/* Manual Dismiss Button */}
                  <button 
                    onClick={() => setEmailToast(null)} 
                    className="text-stone-300 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                    aria-label="Dismiss message"
                  >
                    <LucideX className="w-4 h-4" />
                  </button>
                </div>
                
                <h4 className="text-sm font-black text-white mt-2.5 flex items-center gap-1">
                  <span>Adoption Records Filed</span>
                </h4>
                
                <p className="text-stone-300 text-xs mt-1.5 leading-relaxed font-sans">
                  Hi <strong className="text-white font-extrabold">{emailToast.userName}</strong>, a cryptographically signed application copy and waitlist tracking summary <strong className="text-gold-400 font-mono text-[11px] bg-white/5 px-1.5 py-0.5 rounded">{emailToast.appId}</strong> has been transmitted successfully to your primary email address:
                </p>

                <p className="text-gold-300 font-mono text-[11px] font-bold mt-2 truncate bg-gold-500/5 border border-gold-500/10 py-1.5 px-2.5 rounded-lg">
                  {emailToast.email}
                </p>

                <div className="flex items-center gap-1.5 mt-4 text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                  <span>Verified Safe Registry Entry</span>
                </div>
              </div>
            </div>

            {/* Decaying timeline bar to show timeout visually */}
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 6.5, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gold-400 to-amber-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
