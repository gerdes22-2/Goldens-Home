import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BellOff, Sparkles, Check, AlertCircle, Send, ShieldAlert, BadgeCheck } from 'lucide-react';

export default function WaitlistAlertsToggle() {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('waitlist_alerts_secured') === 'true';
  });
  const [alertType, setAlertType] = useState<'critical' | 'all'>('critical');
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [iframeRestriction, setIframeRestriction] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(false);

  useEffect(() => {
    // Check real browser Notification api capability
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    } else {
      setPermissionStatus('denied');
    }

    // Detect if we are inside a restrictive iframe sandbox
    try {
      if (window.self !== window.top) {
        // Within an iframe, let's prepare to leverage both
        setIframeRestriction(true);
      }
    } catch (e) {
      setIframeRestriction(true);
    }
  }, []);

  const triggerLocalWebToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleToggle = async () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);
    localStorage.setItem('waitlist_alerts_secured', String(nextState));

    if (nextState) {
      if ('Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          setPermissionStatus(permission);
          
          if (permission === 'granted') {
            triggerLocalWebToast('Notification permission verified! You will receive live litter feeds.');
            // Send real browser indicator notification
            new Notification('Golden Paws Home Alerts Enabled', {
              body: 'You are now officially linked to the master puppy pipeline!',
              icon: '/icons/favicon-32x32.png' // Fallback icon path
            });
          } else {
            triggerLocalWebToast('System notifications blocked. Sound/Web sandbox mode activated.');
          }
        } catch (error) {
          console.warn('Notification.requestPermission failed (likely iframe restriction):', error);
          setIframeRestriction(true);
          triggerLocalWebToast('Toggled ON: Sandbox safe alerts enabled (In-app notifications enabled)');
        }
      } else {
        triggerLocalWebToast('Secure alerts synced: Stored in browser storage.');
      }
    } else {
      triggerLocalWebToast('Alerts disabled. Stored subscription deleted.');
    }
  };

  const handleEmailSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
      triggerLocalWebToast(`Linked registry endpoint: ${emailInput}`);
    }
  };

  // Triggers immediate notification for premium social feedback
  const sendTestNotification = () => {
    const title = alertType === 'critical' ? '🚨 CRITICAL LITTER STAGE: M-LITTER' : '✨ GOLDEN VALVE MILESTONE FEED';
    const body = alertType === 'critical' 
      ? 'Adoption slots are now locked. Luna & Sterling physical diagnostics are complete.'
      : 'Day 38 Puppy Development Tracker: Weight metrics average 32oz per pup across pre-checks.';

    if (isEnabled && permissionStatus === 'granted' && !iframeRestriction) {
      try {
        new Notification(title, { body });
      } catch (e) {
        // Fallback to in-app toast if browser prevents new Notification
        triggerLocalWebToast(`[TEST ALERT] ${title}: ${body}`);
      }
    } else {
      // Elegant in-app custom toast simulation
      triggerLocalWebToast(`[SIMULATED PUSH NOTIFICATION] ${title} - ${body}`);
    }
  };

  return (
    <div className="bg-white border border-gold-150/80 rounded-[2.5rem] p-6 sm:p-8 shadow-xl text-left text-navy-950 font-sans relative overflow-hidden">
      
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-full blur-xl pointer-events-none" />

      <div className="space-y-6">
        
        {/* Header Title with animated state bell */}
        <div className="flex items-start justify-between gap-4 border-b border-gold-100/50 pb-5">
          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1.5 bg-gold-500/10 border border-gold-500/20 px-3 py-1 rounded-full text-gold-700 text-[10px] font-mono font-black uppercase tracking-wider">
              <Bell className="w-3 h-3 text-gold-600 animate-bounce" />
              <span>Security Broadcast Node</span>
            </span>
            <h3 className="text-xl font-black text-navy-950 tracking-tight flex items-center gap-1.5">
              <span>Waitlist Telemetry Alerts</span>
            </h3>
            <p className="text-[11px] text-stone-500 font-serif italic max-w-sm">
              Subscribe to secure real-time push announcements on new litters, diagnostic results, and delivery milestones.
            </p>
          </div>

          {/* iOS Stylized Toggle Widget */}
          <button
            onClick={handleToggle}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative focus:outline-none shrink-0 ${
              isEnabled ? 'bg-gold-500' : 'bg-stone-200'
            }`}
            aria-label="Toggle notifications"
          >
            <motion.div
              layout
              className={`w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center ${
                isEnabled ? 'text-gold-600' : 'text-stone-400'
              }`}
            >
              {isEnabled ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : (
                <BellOff className="w-4.5 h-4.5" />
              )}
            </motion.div>
          </button>
        </div>

        {/* Dynamic Warning Notification Permit Details */}
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* If Restricted or blocked */}
            {iframeRestriction ? (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2 text-[10px] text-blue-700 leading-normal">
                <ShieldAlert className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Sandbox Guard:</strong> Your current preview handles strict iframe policies. You will receive in-app dynamic banners and cached local feeds securely.
                </p>
              </div>
            ) : permissionStatus === 'denied' ? (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-[10px] text-red-700 leading-normal">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Browser Permissions Blocked:</strong> To receive native operating system notifications, please click the lock/settings icon in your browser URL bar and change "Notifications" to "Allow".
                </p>
              </div>
            ) : (
              <div className="p-3 bg-green-50/50 border border-green-100 rounded-xl flex items-start gap-2 text-[10px] text-green-700 leading-normal">
                <BadgeCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Push Handshake Complete:</strong> Connected to official breeding dispatch queues. Device ready for target broadcasts.
                </p>
              </div>
            )}

            {/* Config options */}
            <div className="bg-stone-50/80 border border-stone-200/50 rounded-2xl p-4 space-y-3">
              <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest block">Broadcast Priority Channels</span>
              <div className="grid grid-cols-2 gap-3.5">
                <label className="flex items-start text-xs font-semibold cursor-pointer select-none">
                  <input
                    type="radio"
                    name="alert_channel"
                    checked={alertType === 'critical'}
                    onChange={() => setAlertType('critical')}
                    className="accent-gold-500 mt-0.5 mr-2 w-3.5 h-3.5"
                  />
                  <div>
                    <span className="text-stone-800 text-[11px] block">Critical Announcements</span>
                    <span className="text-[9px] text-stone-400 font-normal">Litter confirm &amp; slots open only</span>
                  </div>
                </label>

                <label className="flex items-start text-xs font-semibold cursor-pointer select-none">
                  <input
                    type="radio"
                    name="alert_channel"
                    checked={alertType === 'all'}
                    onChange={() => setAlertType('all')}
                    className="accent-gold-500 mt-0.5 mr-2 w-3.5 h-3.5"
                  />
                  <div>
                    <span className="text-stone-800 text-[11px] block">Everything Feeds</span>
                    <span className="text-[9px] text-stone-400 font-normal">Weekly development weights &amp; logs</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Test alert trigger for instant user delight & review proof */}
            <div className="pt-2">
              <button
                type="button"
                onClick={sendTestNotification}
                className="w-full py-3 bg-navy-950 text-white hover:bg-gold-500 hover:text-navy-950 font-mono font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Simulated Test Alert</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* BACKUP COMPLIANT FORM: EMAIL NOTIFICATIONS CHANNELS */}
        <form onSubmit={handleEmailSubscribe} className="space-y-3 border-t border-gold-100/50 pt-5 text-left">
          <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest block">Backup SMS &amp; Email Registry</span>
          
          {emailSubscribed ? (
            <div className="bg-green-500/10 border border-green-500/20 text-green-700 px-4 py-3 rounded-xl text-[11px] font-medium flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>We've registered your endpoint. Live reports are now pre-filed.</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Secure email (e.g. name@domain.com)"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none flex-grow"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-mono font-black text-[9px] uppercase tracking-widest rounded-xl transition-colors shrink-0"
              >
                Link
              </button>
            </div>
          )}
        </form>

      </div>

      {/* FLOATING RICH MOTION-REACT Toast system */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[200] max-w-sm bg-navy-950 text-white border border-gold-500 rounded-2xl p-4 shadow-2xl flex items-start gap-3"
          >
            <div className="p-1.5 bg-gold-500/10 text-gold-500 rounded-lg">
              <Sparkles className="w-5 h-5 flex-shrink-0" />
            </div>
            <div className="text-left font-sans text-xs">
              <strong className="block font-black text-gold-400 uppercase text-[9px] tracking-wider mb-0.5">Device Dispatcher Feed</strong>
              <p className="text-gray-200 leading-normal">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
