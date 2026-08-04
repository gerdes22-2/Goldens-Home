import { useState } from 'react';
import { 
  Users, Search, Clock, ShieldCheck, Heart, AlertCircle, 
  HelpCircle, Sparkles, CheckCircle, HelpCircle as HelpIcon, ArrowRight 
} from 'lucide-react';
import { WaitlistEntry } from '../types';
import WaitlistGrowthChart from './WaitlistGrowthChart';
import WaitlistAlertsToggle from './WaitlistAlertsToggle';

interface WaitlistViewProps {
  waitlist: WaitlistEntry[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setTab: (tab: string) => void;
}

export default function WaitlistView({ waitlist, searchQuery, setSearchQuery, setTab }: WaitlistViewProps) {
  const [activeSearch, setActiveSearch] = useState(false);

  const matchedEntries = waitlist.filter((entry) => 
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalWait: waitlist.length,
    activeLitter: 'July 2026 (Summer Litter)',
    avgWaitTime: '4 - 6 Months',
    approvedReserve: waitlist.filter(e => e.status === 'Approved').length,
    pendingApps: waitlist.filter(e => e.status === 'Pending Review').length
  };

  const currentMatchedEntry = matchedEntries[0];

  return (
    <div className="bg-[#fcfaf7] min-h-screen pt-28 pb-20 text-[#0d2244]">
      
      {/* HEADER HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <span className="text-xs font-mono font-bold text-yellow-600 tracking-widest uppercase mb-3 block">
          Transparent Client Trackers
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">Master Waitlist Status Board</h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-3">
          Our priority list is completely transparent and operated on strict chronological confirmation. Query your individual rank position and matching litter profiles.
        </p>
      </section>

      {/* SEARCH AND PORTAL SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        
        {/* BIG SEARCH GRID CARD */}
        <div className="bg-white rounded-3xl border border-gray-150/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
          
          {/* SEARCH PORTAL LEFT */}
          <div className="lg:col-span-7 p-6 sm:p-10 text-left flex flex-col justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center space-x-1 bg-yellow-400/10 border border-yellow-500/20 px-3 py-1 rounded-full text-yellow-600 text-[10px] font-mono font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Adoptant Priority Search Engine</span>
              </span>
              <h2 className="text-2xl font-black">Adopter Status Portal</h2>
              <p className="text-xs text-gray-500 leading-normal">
                If you have submitted our Adoption Application and matching reservation, input your full name here to retrieve your live priority standing, approved litter preferences, and milestone developments.
              </p>

              {/* SEARCH BAR INPUT */}
              <div className="relative pt-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 mt-2" />
                <input
                  type="text"
                  placeholder="Enter Registered Full Name (e.g. Sarah Jenkins...)"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setActiveSearch(e.target.value.length > 0); }}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-yellow-500 rounded-xl text-xs text-[#0d2244] font-semibold placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-500 font-sans"
                />
              </div>
            </div>

            {/* LIVE DYNAMIC TRACKING FEEDBACK */}
            {activeSearch && (
              <div className="pt-6 border-t border-gray-100 mt-6 space-y-4 animate-in fade-in duration-200 text-left">
                {currentMatchedEntry ? (
                  <div className="space-y-4 leading-normal">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-green-700 font-extrabold uppercase bg-green-500/10 px-2 py-0.5 rounded">
                          RECORD MATCH FOUND
                        </span>
                        <h4 className="font-extrabold text-sm text-[#0d2244] mt-1">{currentMatchedEntry.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="block text-[9px] text-gray-400 font-bold uppercase">Priority Rank</span>
                        <strong className="text-xl font-black text-[#0d2244]">#{currentMatchedEntry.position}</strong>
                      </div>
                    </div>

                    {/* STATUS TIMELINE STEPS */}
                    <div className="space-y-3 pt-2">
                      <span className="block text-[8px] font-mono uppercase text-gray-400 font-bold tracking-wider">Adoption Milestone Status:</span>
                      
                      <div className="relative pl-5 border-l-2 border-[#0d2244]/10 space-y-4 text-xs font-sans">
                        
                        {/* Step 1: App Approved */}
                        <div className="relative">
                          <div className={`absolute -left-[26px] top-0 w-3 h-3 rounded-full border-2 ${currentMatchedEntry.status !== 'Pending Review' ? 'bg-[#0d2244] border-yellow-500' : 'bg-gray-200 border-white'}`}></div>
                          <p className={`font-bold text-[11px] ${currentMatchedEntry.status !== 'Pending Review' ? 'text-[#0d2244]' : 'text-gray-400'}`}>Application Validated</p>
                          <span className="text-[9px] text-gray-400 block -mt-0.5">Application successfully reviewed by programs counselor team.</span>
                        </div>

                        {/* Step 2: Deposit Secured */}
                        <div className="relative">
                          <div className={`absolute -left-[26px] top-0 w-3 h-3 rounded-full border-2 ${currentMatchedEntry.status !== 'Pending Review' ? 'bg-[#0d2244] border-yellow-500' : 'bg-gray-200 border-white'}`}></div>
                          <p className={`font-bold text-[11px] ${currentMatchedEntry.status !== 'Pending Review' ? 'text-[#0d2244]' : 'text-gray-400'}`}>Reservation Secured (Waitlist Rank Locked)</p>
                          <span className="text-[9px] text-gray-400 block -mt-0.5">Pre-deposits processed. Chronological position logged securely.</span>
                        </div>

                        {/* Step 3: Litter Match */}
                        <div className="relative">
                          <div className={`absolute -left-[26px] top-0 w-3 h-3 rounded-full border-2 ${currentMatchedEntry.status === 'Litter Assigned' || currentMatchedEntry.status === 'Completed' ? 'bg-[#0d2244] border-yellow-500' : 'bg-gray-200 border-white'}`}></div>
                          <p className={`font-bold text-[11px] ${currentMatchedEntry.status === 'Litter Assigned' || currentMatchedEntry.status === 'Completed' ? 'text-green-600' : 'text-gray-400'}`}>Litter Matched & Puppy Selected</p>
                          <span className="text-[9px] text-gray-400 block -mt-0.5">Matched target litters: <strong>{currentMatchedEntry.estimatedLitterDate}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-xl text-[10px] text-yellow-800">
                      <strong>Preference Locked:</strong> {currentMatchedEntry.puppyPreference}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-orange-500/5 border border-orange-500/15 rounded-xl text-xs text-orange-855 flex items-start space-x-2.5">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold uppercase text-[10px] block">No Verified Match Found</span>
                      <p className="text-[11px] text-gray-500 mt-1">We couldn't locate a priority waitlist profile matching "<strong>{searchQuery}</strong>". Be sure you have logged your application under our central Breeder forms registry.</p>
                      <button 
                        onClick={() => { setTab('apply'); }}
                        className="text-[10px] font-mono text-yellow-600 font-extrabold flex items-center mt-2 hover:text-yellow-700 transition"
                      >
                        <span>GO TO FORMS PAGE</span>
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* QUEUE STATUS STATS RIGHT */}
          <div className="lg:col-span-5 bg-[#0d2244] text-white p-6 sm:p-10 border-l border-white/5 text-left relative flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-yellow-500/5 blur-xl rounded-full translate-x-12 pointer-events-none"></div>
            
            <div className="space-y-5 relative z-10">
              <span className="text-[10px] font-mono text-yellow-400 font-extrabold uppercase tracking-widest pl-0.5">Breeder Standards Board</span>
              <h3 className="text-lg font-black leading-tight">Waitlist Live Metrics Chart</h3>
              
              <div className="space-y-3.5 font-sans pt-2">
                
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-300">Target Match Window:</span>
                  </div>
                  <strong className="text-xs text-white">{stats.activeLitter}</strong>
                </div>

                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-300">Average Waiting Cycle:</span>
                  </div>
                  <strong className="text-xs text-white">{stats.avgWaitTime}</strong>
                </div>

                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-300">Active Approved Spots:</span>
                  </div>
                  <strong className="text-xs text-white">{stats.approvedReserve} Families</strong>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <HelpIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-300">Pending Review Applications:</span>
                  </div>
                  <strong className="text-xs text-yellow-400">{stats.pendingApps} Pending</strong>
                </div>

              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl relative z-10 leading-normal mt-6">
              <span className="text-[9px] font-mono text-yellow-400 font-bold uppercase tracking-widest block">CLIENT SAFETY POLICY:</span>
              <p className="text-[10px] text-gray-300 mt-1">To ensure veterinary biosafety standards, waitlist rankings are locked chronological metrics. Priority cannot be modified via external bids.</p>
            </div>

          </div>

        </div>
      </section>

      {/* GRAPHIC TREND CHART FOR SOCIAL PROOF */}
      <WaitlistGrowthChart />

      {/* FULL GENERAL WAITLIST QUEUE LIST & TELEMETRY ALERTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: MASTER LIST */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-left">
              <h2 className="text-2xl font-black">Consolidated Master Waitlist Queue</h2>
              <p className="text-xs text-gray-500">Live order representation of currently confirmed registrations on hold for matched litters.</p>
            </div>

            <div className="bg-white border rounded-3xl overflow-hidden shadow-lg border-gray-150/80">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left font-sans border-collapse text-xs">
                  <thead className="bg-[#0d2244] text-white h-11 font-mono tracking-wider uppercase text-[9px] font-extrabold border-b border-yellow-500/10">
                    <tr>
                      <th className="px-6 py-3">Queue Rank</th>
                      <th className="px-6 py-3">Client Member</th>
                      <th className="px-6 py-3">Litter Goal Date</th>
                      <th className="px-6 py-3">Preference Lock</th>
                      <th className="px-6 py-3 text-right">Progress Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {waitlist.sort((a,b)=> a.position - b.position).map((entry, idx) => {
                      const isLitter = entry.status === 'Litter Assigned';
                      const isApp = entry.status === 'Approved';
                      const isReview = entry.status === 'Pending Review';
                      return (
                        <tr key={entry.id} className="hover:bg-gray-50 duration-150 text-[#0d2244]">
                          <td className="px-6 py-4.5 font-mono font-extrabold">#{entry.position}</td>
                          <td className="px-6 py-4.5 flex items-center space-x-2">
                            <span className="w-7 h-7 bg-[#0d2244]/5 text-yellow-600 rounded-full flex items-center justify-center font-bold text-[10px] font-mono uppercase">
                              {entry.name.slice(0, 2)}
                            </span>
                            <span className="font-extrabold">{entry.name}</span>
                          </td>
                          <td className="px-6 py-4.5 text-gray-500 font-mono">{entry.estimatedLitterDate}</td>
                          <td className="px-6 py-4.5 text-gray-500 select-none text-[11px]">{entry.puppyPreference}</td>
                          <td className="px-6 py-4.5 text-right">
                            {isLitter && <span className="inline-block bg-green-500/10 text-green-700 px-3 py-1 rounded-full font-bold text-[10px] uppercase">Litter Assigned</span>}
                            {isApp && <span className="inline-block bg-blue-500/10 text-blue-700 px-3 py-1 rounded-full font-bold text-[10px] uppercase">Queue Approved</span>}
                            {isReview && <span className="inline-block bg-yellow-500/10 text-yellow-700 px-3 py-1 rounded-full font-bold text-[10px] uppercase">Pending Review</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT: ALERTS CONTAINER STICKY ON DESKTOP */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <WaitlistAlertsToggle />
          </div>

        </div>
      </section>

    </div>
  );
}
