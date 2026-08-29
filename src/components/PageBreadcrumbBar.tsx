import { useState } from 'react';
import { 
  Home, ChevronRight, ArrowLeft, ArrowRight, Compass, 
  ChevronDown, X, Search, Sparkles
} from 'lucide-react';
import { ALL_PAGES, PAGE_MAP } from '../navigationData';

interface PageBreadcrumbBarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  prevPageTitle?: string;
  nextPageTitle?: string;
}

export default function PageBreadcrumbBar({
  currentTab,
  setTab,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
}: PageBreadcrumbBarProps) {
  const [isJumpOpen, setIsJumpOpen] = useState(false);
  const [jumpSearch, setJumpSearch] = useState('');

  const currentPage = PAGE_MAP[currentTab] || ALL_PAGES[0];
  const prevPageId = currentPage.prevPage;
  const nextPageId = currentPage.nextPage;
  const prevPage = prevPageId ? PAGE_MAP[prevPageId] : null;
  const nextPage = nextPageId ? PAGE_MAP[nextPageId] : null;

  const categories = [
    { id: 'core', label: 'Primary Pages' },
    { id: 'program', label: 'Breeder Program' },
    { id: 'discovery', label: 'Resources & Community' },
    { id: 'action', label: 'Inquiries & Adoption' },
  ];

  const filteredPages = jumpSearch.trim() === '' 
    ? ALL_PAGES 
    : ALL_PAGES.filter(p => 
        p.label.toLowerCase().includes(jumpSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(jumpSearch.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(jumpSearch.toLowerCase())
      );

  const CurrentIcon = currentPage.icon;

  return (
    <div id="page-breadcrumb-navigation" className="w-full bg-navy-950/95 border-b border-gold-500/20 backdrop-blur-md sticky top-0 z-40 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* LEFT: BACK, FORWARD & BREADCRUMB TRAIL */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* History Back Button */}
          <button
            id="nav-btn-history-back"
            onClick={onGoBack}
            disabled={!canGoBack}
            title={canGoBack ? "Go Back to Previous Page" : "No previous page in history"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-gold-500 hover:text-navy-950 text-white font-bold transition-all disabled:opacity-40 disabled:hover:bg-white/10 disabled:hover:text-white active:scale-95 text-[11px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono uppercase tracking-wider text-[10px]">Back</span>
          </button>

          {/* History Forward Button */}
          <button
            id="nav-btn-history-forward"
            onClick={onGoForward}
            disabled={!canGoForward}
            title={canGoForward ? "Go Forward to Next Page" : "No forward page in history"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-gold-500 hover:text-navy-950 text-white font-bold transition-all disabled:opacity-40 disabled:hover:bg-white/10 disabled:hover:text-white active:scale-95 text-[11px]"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono uppercase tracking-wider text-[10px]">Front</span>
          </button>

          <span className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

          {/* Home Direct Button */}
          <button
            id="nav-btn-click-home"
            onClick={() => setTab('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all active:scale-95 ${
              currentTab === 'home'
                ? 'bg-gold-500 text-navy-950 shadow-sm'
                : 'bg-white/5 hover:bg-white/15 text-stone-200 hover:text-white'
            }`}
            title="Click here to go Home"
          >
            <Home className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-serif font-black tracking-wide">Home</span>
          </button>

          {/* Breadcrumb Separator & Current Page */}
          {currentTab !== 'home' && (
            <div className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-300 font-bold">
                <CurrentIcon className="w-3.5 h-3.5 text-gold-400" />
                <span className="truncate max-w-[150px] sm:max-w-[240px] md:max-w-none">{currentPage.label}</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: QUICK JUMP MENU & NEXT PAGE BUTTON */}
        <div className="flex items-center gap-2 ml-auto">
          
          {/* Quick Jump Dropdown Toggle */}
          <div className="relative">
            <button
              id="nav-btn-quick-jump-menu"
              onClick={() => setIsJumpOpen(!isJumpOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 border border-gold-500/30 font-bold text-xs transition-all active:scale-95"
            >
              <Compass className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" />
              <span className="font-mono uppercase tracking-wider text-[10px] hidden md:inline">Jump to Any Page</span>
              <span className="font-mono uppercase tracking-wider text-[10px] md:hidden">Pages</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isJumpOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Jump Menu Dropdown Panel */}
            {isJumpOpen && (
              <div className="absolute right-0 mt-2 w-[340px] sm:w-[460px] max-h-[80vh] overflow-y-auto bg-[#0a182e] border-2 border-gold-400/40 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <h4 className="text-white font-black text-xs uppercase tracking-widest">Select Destination Page</h4>
                  </div>
                  <button 
                    onClick={() => setIsJumpOpen(false)}
                    className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search in pages */}
                <div className="relative my-3">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={jumpSearch}
                    onChange={(e) => setJumpSearch(e.target.value)}
                    placeholder="Search all pages, resources, tools..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-gold-400"
                    autoFocus
                  />
                </div>

                {/* Categories & Pages Grid */}
                <div className="space-y-4">
                  {categories.map((cat) => {
                    const catPages = filteredPages.filter(p => p.category === cat.id);
                    if (catPages.length === 0) return null;
                    return (
                      <div key={cat.id} className="space-y-1.5">
                        <div className="text-[10px] font-mono font-black uppercase tracking-wider text-gold-400/80 px-1">
                          {cat.label}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {catPages.map((page) => {
                            const Icon = page.icon;
                            const isCurrent = currentTab === page.id;
                            return (
                              <button
                                key={page.id}
                                id={`quick-jump-link-${page.id}`}
                                onClick={() => {
                                  setTab(page.id);
                                  setIsJumpOpen(false);
                                  setJumpSearch('');
                                }}
                                className={`flex items-start gap-2.5 p-2 rounded-xl text-left transition-all ${
                                  isCurrent
                                    ? 'bg-gold-500 text-navy-950 font-bold shadow-md'
                                    : 'bg-white/5 hover:bg-white/10 text-stone-200 hover:text-white'
                                }`}
                              >
                                <div className={`p-1.5 rounded-lg shrink-0 ${isCurrent ? 'bg-navy-950/20 text-navy-950' : 'bg-white/10 text-gold-400'}`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold truncate leading-tight">{page.label}</div>
                                  <div className={`text-[10px] line-clamp-1 leading-normal ${isCurrent ? 'text-navy-900/80' : 'text-stone-400'}`}>
                                    {page.description}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                  <span>16 Active Pages & Tools</span>
                  <button 
                    onClick={() => { setTab('home'); setIsJumpOpen(false); }}
                    className="text-gold-400 hover:underline font-bold"
                  >
                    Go to Homepage →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sequential Next Page Button */}
          {nextPage && (
            <button
              id="nav-btn-next-step"
              onClick={() => setTab(nextPage.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs transition-all shadow-md active:scale-95"
              title={`Next Step: ${nextPage.label}`}
            >
              <span className="hidden sm:inline uppercase tracking-wider font-mono text-[10px]">Next: {nextPage.shortLabel || nextPage.label}</span>
              <span className="sm:hidden font-mono uppercase text-[10px]">Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
