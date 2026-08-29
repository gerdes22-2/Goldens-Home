import { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Home, Compass, X, 
  ChevronUp, ChevronDown, Check, Sparkles
} from 'lucide-react';
import { ALL_PAGES, PAGE_MAP } from '../navigationData';

interface FloatingQuickNavProps {
  currentTab: string;
  setTab: (tab: string) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
}

export default function FloatingQuickNav({
  currentTab,
  setTab,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
}: FloatingQuickNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const currentPage = PAGE_MAP[currentTab] || ALL_PAGES[0];
  const nextPageId = currentPage.nextPage;
  const nextPage = nextPageId ? PAGE_MAP[nextPageId] : null;

  const handleNav = (tabId: string) => {
    setTab(tabId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="floating-quick-navigation" className="fixed bottom-6 left-6 z-50 pointer-events-auto">
      
      {/* QUICK JUMP MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#0b1b36] border-2 border-gold-400 rounded-[2rem] w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gold-500/20 text-gold-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider">Fast Page Switcher</h3>
                  <p className="text-[11px] text-stone-400">Tap any destination to navigate immediately</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Position Banner */}
            <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
              <span className="text-xs text-stone-400">Current View:</span>
              <span className="text-xs font-black text-gold-400">{currentPage.label}</span>
            </div>

            {/* Grid of all pages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
              {ALL_PAGES.map((page) => {
                const Icon = page.icon;
                const isCurrent = currentTab === page.id;
                return (
                  <button
                    key={page.id}
                    id={`floating-jump-${page.id}`}
                    onClick={() => handleNav(page.id)}
                    className={`flex items-start gap-3 p-3 rounded-2xl text-left transition-all border ${
                      isCurrent
                        ? 'bg-gold-500 text-navy-950 border-gold-400 font-black shadow-lg ring-2 ring-gold-400/50'
                        : 'bg-white/5 hover:bg-white/15 text-stone-200 border-white/5 hover:border-gold-400/40'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isCurrent ? 'bg-navy-950 text-gold-400' : 'bg-white/10 text-gold-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{page.label}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-navy-950" />}
                      </div>
                      <p className={`text-[10px] line-clamp-1 mt-0.5 ${isCurrent ? 'text-navy-900' : 'text-stone-400'}`}>
                        {page.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <button
                onClick={() => handleNav('home')}
                className="text-gold-400 hover:text-gold-300 font-bold flex items-center gap-1.5"
              >
                <Home className="w-4 h-4" />
                <span>Return to Homepage</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CONTROLS BAR */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="p-3 bg-navy-950/90 hover:bg-navy-900 border-2 border-gold-400 text-gold-400 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-md font-bold text-xs"
          title="Open Navigation Controls"
        >
          <Compass className="w-5 h-5" />
          <span className="font-mono text-[10px] uppercase pr-1">Nav</span>
        </button>
      ) : (
        <div className="flex items-center gap-1 bg-[#09172e]/95 border-2 border-gold-400/80 rounded-full p-1.5 shadow-2xl backdrop-blur-lg text-white">
          
          {/* Back Button */}
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className="p-2.5 rounded-full hover:bg-gold-500 hover:text-navy-950 text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white transition-all active:scale-95"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Front / Forward Button */}
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className="p-2.5 rounded-full hover:bg-gold-500 hover:text-navy-950 text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white transition-all active:scale-95"
            title="Go Forward (Front)"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <span className="h-4 w-px bg-white/20" />

          {/* Home Button */}
          <button
            onClick={() => handleNav('home')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black transition-all active:scale-95 ${
              currentTab === 'home'
                ? 'bg-gold-500 text-navy-950 shadow-sm'
                : 'hover:bg-white/15 text-stone-200'
            }`}
            title="Click to go Home"
          >
            <Home className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline text-[11px]">Home</span>
          </button>

          {/* Jump Menu Trigger */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-xs font-bold transition-all active:scale-95 border border-gold-400/30"
            title="All Pages Menu"
          >
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-[11px] font-mono uppercase tracking-wider">Pages</span>
          </button>

          {/* Next Button */}
          {nextPage && (
            <button
              onClick={() => handleNav(nextPage.id)}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-black transition-all active:scale-95 shadow-sm"
              title={`Next: ${nextPage.label}`}
            >
              <span className="text-[10px] font-mono uppercase">{nextPage.shortLabel || nextPage.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Minimize toggle */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10"
            title="Minimize bar"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

        </div>
      )}

    </div>
  );
}
