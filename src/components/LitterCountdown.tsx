import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Bell } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export default function LitterCountdown({ setTab }: { setTab: (tab: string) => void }) {
  const targetDate = new Date('2026-12-15T09:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    const now = new Date().getTime();
    const difference = targetDate - now;
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // For circle progress calculation (assume 60 days cycle for the progress bar visual)
  const totalDuration = 60 * 24 * 60 * 60 * 1000; 
  const progress = Math.max(0, Math.min(100, (1 - timeLeft.total / totalDuration) * 100));
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <section className="py-20 bg-[#fcfaf7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-navy-950 rounded-[4rem] p-8 md:p-16 overflow-hidden border border-gold-500/20 shadow-2xl"
        >
          {/* Animated Background Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold-400/5 rounded-full blur-[100px] animate-pulse" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24">
            
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center space-x-2 bg-gold-500/10 border border-gold-500/20 px-4 py-2 rounded-full text-gold-400 text-[10px] font-mono font-black uppercase tracking-[0.3em]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Next Arrival Protocol</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight italic">
                The <span className="text-gold-500">M-Litter</span> Countdown
              </h2>
              
              <p className="text-gray-400 font-serif italic text-lg max-w-xl leading-relaxed">
                Luna & Sterling have been confirmed. Our prestigious M-Litter of English Cream Goldens is expected this mid-December.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                <div className="flex items-center space-x-2 text-gold-500/60 font-mono text-[10px] font-black uppercase tracking-widest">
                  <Calendar className="w-4 h-4" />
                  <span>Target: December 15, 2026</span>
                </div>
                <div className="flex items-center space-x-2 text-gold-500/60 font-mono text-[10px] font-black uppercase tracking-widest">
                  <Bell className="w-4 h-4" />
                  <span>Waitlist Selections Open</span>
                </div>
              </div>
            </div>

            {/* Circular Progress Timer */}
            <div className="relative group perspective-1000">
              <div className="relative w-[280px] h-[280px] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                
                {/* SVG Progress Circle */}
                <svg className="w-full h-full -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="140"
                    cy="140"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-white/5"
                  />
                  {/* Glowing Track Overlay */}
                  <circle
                    cx="140"
                    cy="140"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="text-gold-500/20 blur-sm"
                    strokeLinecap="round"
                  />
                  {/* Primary Gold Track */}
                  <circle
                    cx="140"
                    cy="140"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="text-gold-500"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Inner Stats Card */}
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                  <span className="text-5xl font-black text-white italic tracking-tighter">
                    {timeLeft.days}
                  </span>
                  <span className="text-[10px] font-mono font-black text-gold-500 uppercase tracking-[0.4em]">
                    Days Remote
                  </span>
                  <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gold-500/20">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-black text-gray-300">{timeLeft.hours}</span>
                      <span className="text-[8px] font-mono font-bold text-gray-500 uppercase">H</span>
                    </div>
                    <span className="text-gold-500/30 text-xs font-black">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-black text-gray-300">{timeLeft.minutes}</span>
                      <span className="text-[8px] font-mono font-bold text-gray-500 uppercase">M</span>
                    </div>
                    <span className="text-gold-500/30 text-xs font-black">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-black text-gray-300">{timeLeft.seconds}</span>
                      <span className="text-[8px] font-mono font-bold text-gray-500 uppercase">S</span>
                    </div>
                  </div>
                </div>

                {/* Decorative Orbiting Element */}
                <div className="absolute inset-0 animate-spin-slow pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="mt-16 pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
            <p className="text-sm text-gray-500 font-serif italic max-w-sm text-center sm:text-left">
                Securing a placement in the M-Litter requires an approved adoption audit.
            </p>
            <button 
                onClick={() => { setTab('waitlist'); window.scrollTo({ top: 0 }); }}
                className="px-10 py-5 bg-gold-500 hover:bg-white text-navy-950 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-gold-500/10"
            >
                Join Master Waitlist
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
