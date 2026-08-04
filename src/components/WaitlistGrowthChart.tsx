import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { TrendingUp, Users, Award, ShieldCheck, Sparkles, Flame, CheckCircle } from 'lucide-react';

const HISTORICAL_DATA_12M = [
  { month: 'Jul 25', waitlistSize: 42, inquiries: 110, placements: 8 },
  { month: 'Aug 25', waitlistSize: 48, inquiries: 135, placements: 6 },
  { month: 'Sep 25', waitlistSize: 55, inquiries: 120, placements: 7 },
  { month: 'Oct 25', waitlistSize: 63, inquiries: 155, placements: 9 },
  { month: 'Nov 25', waitlistSize: 68, inquiries: 140, placements: 5 },
  { month: 'Dec 25', waitlistSize: 72, inquiries: 165, placements: 10 },
  { month: 'Jan 26', waitlistSize: 84, inquiries: 195, placements: 8 },
  { month: 'Feb 26', waitlistSize: 96, inquiries: 210, placements: 6 },
  { month: 'Mar 26', waitlistSize: 110, inquiries: 240, placements: 12 },
  { month: 'Apr 26', waitlistSize: 122, inquiries: 220, placements: 10 },
  { month: 'May 26', waitlistSize: 134, inquiries: 265, placements: 14 },
  { month: 'Jun 26', waitlistSize: 148, inquiries: 290, placements: 11 }
];

const HISTORICAL_DATA_6M = HISTORICAL_DATA_12M.slice(6);

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d2244] border-2 border-gold-500/30 p-4 rounded-2xl shadow-xl font-sans text-left space-y-2">
        <p className="text-xs font-mono font-black text-gold-400 uppercase tracking-widest">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs text-white font-medium flex items-center justify-between gap-6">
              <span className="flex items-center space-x-1.5 text-gray-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <strong className="text-white font-black">{entry.value} Families</strong>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function WaitlistGrowthChart() {
  const [timeframe, setTimeframe] = useState<'6M' | '12M'>('12M');
  const chartData = timeframe === '12M' ? HISTORICAL_DATA_12M : HISTORICAL_DATA_6M;

  return (
    <section className="py-20 bg-white border-t border-b border-gold-100/50 overflow-hidden text-left text-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Grid */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-16">
          <div className="max-w-2xl space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-gold-500/10 border border-gold-500/20 px-4 py-2 rounded-full text-gold-700 text-[10px] font-mono font-black uppercase tracking-[0.25em]"
            >
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span>Verified High Demand Index</span>
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tight leading-none text-navy-950">
              Approved Family Network <span className="text-gold-500">Growth Trends</span>
            </h2>
            <p className="text-stone-500 font-serif italic text-base leading-relaxed">
              Every applicant goes through a meticulous pediatric audit. Over the last year, our premium English Cream breeding program has seen healthy, structured waitlist growth. This steady trend demonstrates the long-standing community validation and trust in Golden Paws Home's veterinary excellence.
            </p>
          </div>

          {/* Inline Social Proof Metrics */}
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0 font-sans">
            <div className="bg-gold-50/50 border border-gold-100 rounded-3xl p-6 text-center space-y-1 relative overflow-hidden">
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gold-500/5 flex items-center justify-center">
                <Flame className="w-4 h-4 text-gold-600" />
              </div>
              <span className="block text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest">Active Members</span>
              <strong className="text-3xl font-black text-navy-950 tracking-tight">148</strong>
              <p className="text-[10px] text-green-700 font-mono font-bold uppercase mt-1 flex items-center justify-center space-x-1">
                <span>+25% Q-o-Q Growth</span>
              </p>
            </div>

            <div className="bg-gold-50/50 border border-gold-100 rounded-3xl p-6 text-center space-y-1 relative overflow-hidden">
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gold-500/5 flex items-center justify-center">
                <Users className="w-4 h-4 text-gold-600" />
              </div>
              <span className="block text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest">Placements YTD</span>
              <strong className="text-3xl font-black text-navy-950 tracking-tight">112</strong>
              <p className="text-[10px] text-gold-600 font-mono font-bold uppercase mt-1">
                <span>100% Client Audited</span>
              </p>
            </div>
          </div>
        </div>

        {/* Chart Window Panel */}
        <div className="bg-[#0d2244] text-white rounded-[3rem] p-6 sm:p-10 border border-white/5 shadow-2.5xl relative overflow-hidden">
          <div className="absolute inset-0 bg-yellow-500/[0.02] blur-2xl pointer-events-none" />

          {/* Header Controls for Chart */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4 relative z-10">
            <div>
              <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold-400" />
                <span>Waitlist Density &amp; Inquiry Volume Archive</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-mono uppercase tracking-widest mt-1">
                CHRONOLOGICAL REGISTRATION HISTORICAL TIMEFRAME
              </p>
            </div>

            {/* Timeframe selector buttons */}
            <div className="flex items-center space-x-1 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
              <button
                onClick={() => setTimeframe('6M')}
                className={`px-4 py-2 text-[9px] font-mono font-black uppercase rounded-xl tracking-wider transition-all ${
                  timeframe === '6M' 
                    ? 'bg-gold-500 text-navy-950 shadow-md' 
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                6 Months
              </button>
              <button
                onClick={() => setTimeframe('12M')}
                className={`px-4 py-2 text-[9px] font-mono font-black uppercase rounded-xl tracking-wider transition-all ${
                  timeframe === '12M' 
                    ? 'bg-gold-500 text-navy-950 shadow-md' 
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                12 Months
              </button>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="w-full h-[320px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorWaitlist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DFAD4E" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#DFAD4E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                
                <XAxis 
                  dataKey="month" 
                  stroke="rgba(255,255,255,0.4)" 
                  fontSize={9}
                  tickLine={false}
                  fontFamily="monospace"
                  dy={10}
                />
                
                <YAxis 
                  stroke="rgba(255,255,255,0.4)" 
                  fontSize={9}
                  tickLine={false}
                  fontFamily="monospace"
                  dx={-5}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em' }}
                />

                <Area 
                  type="monotone" 
                  name="Verified Waitlist Size" 
                  dataKey="waitlistSize" 
                  stroke="#DFAD4E" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorWaitlist)" 
                />

                <Area 
                  type="monotone" 
                  name="Applications Received" 
                  dataKey="inquiries" 
                  stroke="rgba(255,255,255,0.6)" 
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1} 
                  fill="url(#colorInquiries)" 
                />

              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Social Proof Highlighting Legend Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 mt-8 border-t border-white/10 relative z-10">
            <div className="flex items-start space-x-3 text-left">
              <CheckCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Sustained Adoption Appeal</h4>
                <p className="text-[10px] text-gray-400 mt-1">Our application pool continues to expand monthly, yielding a highly dedicated member backing.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-left">
              <Award className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Meticulous Selective Matches</h4>
                <p className="text-[10px] text-gray-400 mt-1">Only suitable genetic pairings are completed to respect our 100% biosafety criteria.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-left">
              <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Guaranteed Lineage Hold</h4>
                <p className="text-[10px] text-gray-400 mt-1">All members enjoy fully deterministic timeline updates verified on our official board registry.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
