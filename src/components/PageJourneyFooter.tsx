import { 
  ArrowLeft, ArrowRight, Home, Heart, Award, ShieldCheck, 
  Compass, Star, ClipboardCheck, MessageSquare, BookOpen, Sparkles
} from 'lucide-react';
import { PAGE_MAP, ALL_PAGES } from '../navigationData';

interface PageJourneyFooterProps {
  currentTab: string;
  setTab: (tab: string) => void;
  canGoBack?: boolean;
  onGoBack?: () => void;
}

export default function PageJourneyFooter({
  currentTab,
  setTab,
  canGoBack,
  onGoBack,
}: PageJourneyFooterProps) {
  const currentPage = PAGE_MAP[currentTab] || ALL_PAGES[0];
  const prevPageId = currentPage.prevPage;
  const nextPageId = currentPage.nextPage;
  const prevPage = prevPageId ? PAGE_MAP[prevPageId] : null;
  const nextPage = nextPageId ? PAGE_MAP[nextPageId] : null;

  const handleNav = (tabId: string) => {
    setTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickPillLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About Experience', icon: Award },
    { id: 'parents', label: 'Breeder Parents', icon: ShieldCheck },
    { id: 'puppies', label: 'Available Puppies', icon: Heart },
    { id: 'process', label: 'Adoption Process', icon: Compass },
    { id: 'matcher', label: 'Puppy Matcher', icon: Sparkles },
    { id: 'resources', label: 'Care Guides', icon: BookOpen },
    { id: 'reviews', label: 'Customer Reviews', icon: Star },
    { id: 'contact', label: 'Contact Breeder', icon: MessageSquare },
    { id: 'apply', label: 'Reserve a Puppy', icon: ClipboardCheck },
  ];

  return (
    <section id="page-journey-navigation-footer" className="bg-[#f5f1eb] border-t-2 border-stone-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-stone-300">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-black text-gold-700 uppercase tracking-widest bg-gold-400/20 px-3 py-1 rounded-full mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Explore The Golden Journey</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-navy-950">
              Where would you like to go next?
            </h3>
            <p className="text-sm text-stone-600 mt-1">
              You are currently viewing: <strong className="text-navy-950 font-black">{currentPage.label}</strong>
            </p>
          </div>

          {/* PRIMARY SEQUENTIAL ACTIONS (BACK / HOME / NEXT) */}
          <div className="flex flex-wrap items-center gap-3">
            {prevPage && (
              <button
                id="journey-footer-btn-prev"
                onClick={() => handleNav(prevPage.id)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-stone-100 text-navy-950 border border-stone-300 shadow-sm font-bold text-xs transition-all active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-gold-600" />
                <span>Previous: {prevPage.shortLabel || prevPage.label}</span>
              </button>
            )}

            <button
              id="journey-footer-btn-home"
              onClick={() => handleNav('home')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-sm ${
                currentTab === 'home'
                  ? 'bg-stone-300 text-stone-700 cursor-default'
                  : 'bg-white hover:bg-gold-500 hover:text-navy-950 text-navy-950 border border-stone-300'
              }`}
            >
              <Home className="w-4 h-4 text-gold-500" />
              <span>Click Here to Go Home</span>
            </button>

            {nextPage && (
              <button
                id="journey-footer-btn-next"
                onClick={() => handleNav(nextPage.id)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs shadow-md transition-all active:scale-95 uppercase tracking-wider"
              >
                <span>Next: {nextPage.shortLabel || nextPage.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* POPULAR QUICK LINKS DIRECTORY */}
        <div className="pt-8">
          <h4 className="text-xs font-mono font-black text-stone-500 uppercase tracking-widest mb-4">
            Quick Navigation Links (Click to Redirect Instantly)
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {quickPillLinks.map((item) => {
              const Icon = item.icon;
              const isCurrent = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`journey-quick-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl text-left font-bold text-xs transition-all border ${
                    isCurrent
                      ? 'bg-navy-950 text-gold-400 border-navy-950 shadow-md ring-2 ring-gold-400'
                      : 'bg-white hover:bg-gold-50 text-stone-800 border-stone-200 hover:border-gold-300 shadow-sm'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${isCurrent ? 'bg-gold-500 text-navy-950' : 'bg-stone-100 text-stone-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
