import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Mail, Phone, Clock, CheckCircle, ShieldCheck, 
  MessageSquare, Settings, Search, Eye, Sparkles, Award, Lock,
  DollarSign, Calendar, Heart, ShieldAlert, Check, Plus, AlertCircle, RefreshCw, Layers, Trash2, Sliders, ChevronRight
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AdoptionApplication } from '../types';
import { useAdminAuth } from './AdminAuthContext';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: string;
}

interface PuppyLitterMember {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  color: string;
  status: 'Available' | 'Reserved';
  assignedToAppId?: string;
  assignedToName?: string;
  healthChecks: {
    deworming2wk: boolean;
    deworming4wk: boolean;
    deworming6wk: boolean;
    deworming8wk: boolean;
    vaccine6wk: boolean; // Parvovirus
    vaccine8wk: boolean; // Distemper / DHPP
    vetClearance: boolean;
  };
}

interface Litter {
  id: string;
  name: string;
  dam: string;
  sire: string;
  dob: string;
  status: 'Planned' | 'Expecting' | 'Whelped' | 'Graduated';
  puppies: PuppyLitterMember[];
}

interface BreederDashboardViewProps {
  setTab: (tab: string) => void;
}

const SEED_APPLICATIONS: AdoptionApplication[] = [
  {
    id: "app-101",
    fullName: "Elena Rostova",
    email: "elena.rostova@example.com",
    phone: "415-555-2311",
    location: "Sausalito, CA",
    experienceLevel: "Have owned before",
    hasOtherPets: true,
    petDetails: "1 gentle senior cat named Cleo",
    hasYard: true,
    yardFenced: true,
    workSetup: "Work from home",
    genderPreference: "Male",
    colorPreference: ["Cream", "Light Golden"],
    notes: "We have been looking for an English Cream male companion to join our quiet home. We love your dedication to OFA cardiac and elbow clearances!",
    submittedAt: "2026-07-14",
    status: "Approved"
  },
  {
    id: "app-102",
    fullName: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "206-555-8910",
    location: "Seattle, WA",
    experienceLevel: "Experienced Breeder",
    hasOtherPets: false,
    hasYard: true,
    yardFenced: true,
    workSetup: "Part-time",
    genderPreference: "Female",
    colorPreference: ["Cream"],
    notes: "Experienced dog trainers. Planning to undergo obedience and agility training. Looking for a highly biddable female puppy.",
    submittedAt: "2026-07-20",
    status: "Approved"
  },
  {
    id: "app-103",
    fullName: "Jonathan Cross",
    email: "jonathan.cross@example.com",
    phone: "312-555-0144",
    location: "Chicago, IL",
    experienceLevel: "First-time Owner",
    hasOtherPets: true,
    petDetails: "1 Golden Retriever mix (10 years old)",
    hasYard: true,
    yardFenced: true,
    workSetup: "Work from home",
    genderPreference: "Male",
    colorPreference: ["Honey Golden", "Red Golden"],
    notes: "We have an active family with two kids (8 and 11) who are very eager to play with the puppy and help train them.",
    submittedAt: "2026-07-25",
    status: "Reviewing"
  },
  {
    id: "app-104",
    fullName: "Amara Lopez",
    email: "amara.lopez@example.com",
    phone: "512-555-7762",
    location: "Austin, TX",
    experienceLevel: "Have owned before",
    hasOtherPets: false,
    hasYard: false,
    yardFenced: false,
    workSetup: "Work from home",
    genderPreference: "No Preference",
    colorPreference: ["Red Golden"],
    notes: "Living near a massive greenbelt with plenty of walking trails. We go on daily runs and love outdoor activities.",
    submittedAt: "2026-08-01",
    status: "Reviewing"
  }
];

const INITIAL_LITTERS: Litter[] = [
  {
    id: "lit-01",
    name: "Luna & Sterling Summer Goldens",
    dam: "Lady Bella of Amber Acres",
    sire: "Sir Sterling of Sunny Hills",
    dob: "2026-06-15",
    status: "Whelped",
    puppies: [
      {
        id: "pup-01",
        name: "Winston",
        gender: "Male",
        color: "Honey Golden",
        status: "Reserved",
        assignedToAppId: "app-101",
        assignedToName: "Elena Rostova",
        healthChecks: {
          deworming2wk: true,
          deworming4wk: true,
          deworming6wk: true,
          deworming8wk: false,
          vaccine6wk: true,
          vaccine8wk: false,
          vetClearance: true
        }
      },
      {
        id: "pup-02",
        name: "Daisy",
        gender: "Female",
        color: "Cream",
        status: "Reserved",
        assignedToAppId: "app-102",
        assignedToName: "Sarah Jenkins",
        healthChecks: {
          deworming2wk: true,
          deworming4wk: true,
          deworming6wk: true,
          deworming8wk: false,
          vaccine6wk: true,
          vaccine8wk: false,
          vetClearance: false
        }
      },
      {
        id: "pup-03",
        name: "Rusty",
        gender: "Male",
        color: "Red Golden",
        status: "Available",
        healthChecks: {
          deworming2wk: true,
          deworming4wk: true,
          deworming6wk: false,
          deworming8wk: false,
          vaccine6wk: false,
          vaccine8wk: false,
          vetClearance: false
        }
      },
      {
        id: "pup-04",
        name: "Penny",
        gender: "Female",
        color: "Light Golden",
        status: "Available",
        healthChecks: {
          deworming2wk: true,
          deworming4wk: true,
          deworming6wk: false,
          deworming8wk: false,
          vaccine6wk: false,
          vaccine8wk: false,
          vetClearance: false
        }
      }
    ]
  },
  {
    id: "lit-02",
    name: "Bella & Rusty Autumn Angels",
    dam: "Lady Bella of Amber Acres",
    sire: "GCH Rusty of Golden Paws",
    dob: "2026-09-12",
    status: "Expecting",
    puppies: []
  }
];

export default function BreederDashboardView({ setTab }: BreederDashboardViewProps) {
  const { user, isAdmin, login, logout, authLoading } = useAdminAuth();
  
  const [errorMsg, setErrorMsg] = useState('');

  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'messages' | 'litters' | 'financials' | 'smtp' | 'notify_waitlist'>('applications');
  const [selectedApp, setSelectedApp] = useState<AdoptionApplication | null>(null);

  // SMTP Live Status and Diagnostics
  const [smtpStatus, setSmtpStatus] = useState<{
    configured: boolean;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    targetEmail: string;
  } | null>(null);
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [emailNotifsEnabled, setEmailNotifsEnabled] = useState(true);
  const [savingNotifs, setSavingNotifs] = useState(false);

  // Waitlist Broadcast variables
  const [broadcastSubject, setBroadcastSubject] = useState('🐾 Luna & Sterling Litters: Progress & Selection Lock!');
  const [broadcastMessage, setBroadcastMessage] = useState(
`Dear Golden Paws Family,

We have exciting news! Luna & Sterling's Summer 2026 litters are progressing beautifully. Our veterinary health pre-audits are 100% completed, validating premium cardiac, hips, and genetics markers.

We are opening the slot lock confirmations this week. As a valued candidate on our chronological priority waitlist, please coordinate with us to secure your chosen puppy preference.

Best regards,
Ciara Wallen
Golden Paws Director`
  );
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'Approved' | 'Reviewing' | 'Reserved'>('all');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<any>(null);

  // --- NEW MODULE STATE (Litters, Projections, Audits) ---
  const [litters, setLitters] = useState<Litter[]>(() => {
    const saved = localStorage.getItem('gph_litters');
    return saved ? JSON.parse(saved) : INITIAL_LITTERS;
  });

  const [selectedLitterId, setSelectedLitterId] = useState<string>(litters[0]?.id || "lit-01");
  const [basePrice, setBasePrice] = useState<number>(() => {
    const saved = localStorage.getItem('gph_base_price');
    return saved ? Number(saved) : 850;
  });

  const [depositStatus, setDepositStatus] = useState<Record<string, { status: 'Unpaid' | 'Deposit Paid' | 'Fully Paid', customAmount?: number }>>(() => {
    const saved = localStorage.getItem('gph_deposit_statuses');
    return saved ? JSON.parse(saved) : {
      'app-101': { status: 'Fully Paid', customAmount: 850 },
      'app-102': { status: 'Deposit Paid', customAmount: 250 },
      'app-103': { status: 'Unpaid' },
      'app-104': { status: 'Unpaid' }
    };
  });

  const [auditLogs, setAuditLogs] = useState<{ id: string; timestamp: string; type: string; text: string }[]>(() => {
    const saved = localStorage.getItem('gph_audit_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'l1', timestamp: '08:15:20 AM', type: 'SYSTEM', text: 'Secure breeder console initialized successfully.' },
      { id: 'l2', timestamp: '08:15:22 AM', type: 'DB', text: 'Fetched applications and contact database.' },
      { id: 'l3', timestamp: '08:15:23 AM', type: 'SMTP', text: 'Mail server handshake: listening in secure logs mode.' },
      { id: 'l4', timestamp: '08:16:01 AM', type: 'LITTER', text: 'Loaded 2 active breeding pairings.' }
    ];
  });

  // New Litter creation form state
  const [showAddLitter, setShowAddLitter] = useState(false);
  const [newLitterName, setNewLitterName] = useState('');
  const [newLitterDam, setNewLitterDam] = useState('');
  const [newLitterSire, setNewLitterSire] = useState('');
  const [newLitterDob, setNewLitterDob] = useState('');
  const [newLitterStatus, setNewLitterStatus] = useState<'Planned' | 'Expecting' | 'Whelped'>('Expecting');

  // New Puppy creation form state
  const [showAddPuppy, setShowAddPuppy] = useState(false);
  const [newPuppyName, setNewPuppyName] = useState('');
  const [newPuppyGender, setNewPuppyGender] = useState<'Male' | 'Female'>('Male');
  const [newPuppyColor, setNewPuppyColor] = useState('Cream');

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('gph_litters', JSON.stringify(litters));
  }, [litters]);

  useEffect(() => {
    localStorage.setItem('gph_base_price', basePrice.toString());
  }, [basePrice]);

  useEffect(() => {
    localStorage.setItem('gph_deposit_statuses', JSON.stringify(depositStatus));
  }, [depositStatus]);

  useEffect(() => {
    localStorage.setItem('gph_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Logging Helper
  const logEvent = (type: 'SYSTEM' | 'DB' | 'SMTP' | 'LITTER' | 'MEDICAL' | 'RESERVATION' | 'FINANCIAL', text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAuditLogs(prev => [{ id: `log-${Date.now()}-${Math.random()}`, timestamp, type, text }, ...prev]);
  };

  const handleBroadcast = async (e: FormEvent) => {
    e.preventDefault();
    setBroadcastSending(true);
    setBroadcastResult(null);

    try {
      const res = await fetch('/api/notify-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: broadcastSubject,
          message: broadcastMessage,
          statusFilter: broadcastTarget
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBroadcastResult(data);
        logEvent('SMTP', `Transmitted waitlist broadcast: "${broadcastSubject}" to ${data.count} recipients.`);
      } else {
        alert(data.error || 'Failed to dispatch waitlist notification.');
      }
    } catch (err: any) {
      console.error('Failed to notify waitlist:', err);
      alert(err.message || 'Network error occurred while broadcasting.');
    } finally {
      setBroadcastSending(false);
    }
  };

  const fetchSmtpStatus = async () => {
    try {
      const res = await fetch('/api/smtp-status');
      if (res.ok) {
        const data = await res.json();
        setSmtpStatus(data);
      }
    } catch (err) {
      console.error('Failed to load SMTP status:', err);
    }
  };

  const handleSendTestEmail = async () => {
    setSmtpTesting(true);
    setSmtpTestResult(null);
    try {
      const res = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSmtpTestResult({ success: true });
        logEvent('SMTP', 'Sent immediate diagnostics test verification email successfully.');
      } else {
        setSmtpTestResult({ success: false, error: data.error || 'SMTP authentication failed.' });
        logEvent('SMTP', 'Diagnostics test failed. Check settings credentials.');
      }
    } catch (err: any) {
      setSmtpTestResult({ success: false, error: err.message || 'Network request failed' });
      logEvent('SMTP', `Network error during mail handshake check: ${err.message}`);
    } finally {
      setSmtpTesting(false);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const appsSnap = await getDocs(collection(db, 'applications'));
      const msgsSnap = await getDocs(collection(db, 'messages'));
      const dbApps = appsSnap.docs.map(d => d.data() as AdoptionApplication);
      const dbMsgs = msgsSnap.docs.map(d => d.data() as ContactMessage);
      
      if (dbApps.length === 0) {
        setApplications(SEED_APPLICATIONS);
      } else {
        const merged = [...dbApps];
        SEED_APPLICATIONS.forEach(seed => {
          if (!merged.some(m => m.id === seed.id)) {
            merged.push(seed);
          }
        });
        setApplications(merged);
      }
      setMessages(dbMsgs);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'notifications'));
      if (docSnap.exists()) {
        setEmailNotifsEnabled(docSnap.data().enabled !== false);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions();
      fetchSmtpStatus();
      fetchSettings();
    }
  }, [isAdmin]);

  const toggleEmailNotifs = async () => {
    setSavingNotifs(true);
    const newVal = !emailNotifsEnabled;
    try {
      await setDoc(doc(db, 'settings', 'notifications'), { enabled: newVal }, { merge: true });
      setEmailNotifsEnabled(newVal);
      logEvent('SYSTEM', `Admin email notifications ${newVal ? 'ENABLED' : 'DISABLED'}.`);
    } catch (err) {
      console.error("Failed to update notification settings", err);
    } finally {
      setSavingNotifs(false);
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      const docRef = doc(db, 'applications', appId);
      await updateDoc(docRef, { status: newStatus });
      setApplications(prevApps => 
        prevApps.map(app => app.id === appId ? { ...app, status: newStatus as any } : app)
      );
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
      logEvent('DB', `Updated status of candidate portfolio (${appId}) to "${newStatus}".`);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Dynamic deposit status modifications
  const handleUpdateDeposit = (appId: string, status: 'Unpaid' | 'Deposit Paid' | 'Fully Paid', customAmount?: number) => {
    setDepositStatus(prev => ({
      ...prev,
      [appId]: { status, customAmount }
    }));
    logEvent('FINANCIAL', `Updated deposit status for ${appId} to "${status}" (${customAmount ? `$${customAmount}` : 'No override'}).`);
  };

  // Litter Modifications
  const handleCreateLitter = (e: FormEvent) => {
    e.preventDefault();
    if (!newLitterName || !newLitterDam || !newLitterSire || !newLitterDob) {
      alert("Please fill in all litter pairing coordinates.");
      return;
    }
    const newlyCreated: Litter = {
      id: `lit-${Date.now()}`,
      name: newLitterName,
      dam: newLitterDam,
      sire: newLitterSire,
      dob: newLitterDob,
      status: newLitterStatus as any,
      puppies: []
    };
    setLitters(prev => [...prev, newlyCreated]);
    setSelectedLitterId(newlyCreated.id);
    setShowAddLitter(false);
    setNewLitterName('');
    setNewLitterDob('');
    logEvent('LITTER', `Registered new breeding pairing: "${newLitterName}" (Sire: ${newLitterSire}, Dam: ${newLitterDam}).`);
  };

  const handleDeleteLitter = (litterId: string) => {
    if (confirm("Are you sure you want to permanently delete this litter from the registry?")) {
      const targetLitter = litters.find(l => l.id === litterId);
      setLitters(prev => prev.filter(l => l.id !== litterId));
      if (selectedLitterId === litterId) {
        const remaining = litters.filter(l => l.id !== litterId);
        if (remaining.length > 0) setSelectedLitterId(remaining[0].id);
      }
      logEvent('LITTER', `Permanently deleted litter pairing "${targetLitter?.name}" from register.`);
    }
  };

  // Puppy Actions inside Litter
  const handleCreatePuppy = (e: FormEvent) => {
    e.preventDefault();
    if (!newPuppyName) {
      alert("Provide a name for the puppy.");
      return;
    }
    const freshPuppy: PuppyLitterMember = {
      id: `pup-${Date.now()}`,
      name: newPuppyName,
      gender: newPuppyGender,
      color: newPuppyColor,
      status: 'Available',
      healthChecks: {
        deworming2wk: false,
        deworming4wk: false,
        deworming6wk: false,
        deworming8wk: false,
        vaccine6wk: false,
        vaccine8wk: false,
        vetClearance: false
      }
    };

    setLitters(prev => prev.map(lit => {
      if (lit.id === selectedLitterId) {
        return {
          ...lit,
          puppies: [...lit.puppies, freshPuppy]
        };
      }
      return lit;
    }));

    setShowAddPuppy(false);
    setNewPuppyName('');
    logEvent('LITTER', `Registered puppy "${newPuppyName}" into litter group.`);
  };

  const handleToggleMedical = (litterId: string, puppyId: string, field: keyof PuppyLitterMember['healthChecks']) => {
    setLitters(prev => prev.map(lit => {
      if (lit.id === litterId) {
        return {
          ...lit,
          puppies: lit.puppies.map(pup => {
            if (pup.id === puppyId) {
              const updatedVal = !pup.healthChecks[field];
              logEvent('MEDICAL', `Toggled "${field}" for ${pup.name} to ${updatedVal ? 'Completed' : 'Pending'}.`);
              return {
                ...pup,
                healthChecks: {
                  ...pup.healthChecks,
                  [field]: updatedVal
                }
              };
            }
            return pup;
          })
        };
      }
      return lit;
    }));
  };

  const handleAssignPuppy = (litterId: string, puppyId: string, appId: string) => {
    const targetApp = applications.find(a => a.id === appId);
    if (!targetApp) return;

    setLitters(prev => prev.map(lit => {
      if (lit.id === litterId) {
        return {
          ...lit,
          puppies: lit.puppies.map(pup => {
            if (pup.id === puppyId) {
              logEvent('RESERVATION', `Assigned ${pup.name} (${pup.color} ${pup.gender}) to Approved family: ${targetApp.fullName}.`);
              return {
                ...pup,
                status: 'Reserved',
                assignedToAppId: targetApp.id,
                assignedToName: targetApp.fullName
              };
            }
            return pup;
          })
        };
      }
      return lit;
    }));

    // Auto-mark waitlist status / app status to Reserved in local CRM state
    handleUpdateDeposit(appId, 'Deposit Paid', 250);
  };

  const handleReleasePuppy = (litterId: string, puppyId: string) => {
    setLitters(prev => prev.map(lit => {
      if (lit.id === litterId) {
        return {
          ...lit,
          puppies: lit.puppies.map(pup => {
            if (pup.id === puppyId) {
              logEvent('RESERVATION', `Released reservation on ${pup.name}. Puppy is now Available to all waitlist families.`);
              return {
                ...pup,
                status: 'Available',
                assignedToAppId: undefined,
                assignedToName: undefined
              };
            }
            return pup;
          })
        };
      }
      return lit;
    }));
  };

  const handleDeletePuppy = (litterId: string, puppyId: string) => {
    if (confirm("Permanently remove this puppy from this litter group?")) {
      setLitters(prev => prev.map(lit => {
        if (lit.id === litterId) {
          const targetPup = lit.puppies.find(p => p.id === puppyId);
          logEvent('LITTER', `Removed puppy "${targetPup?.name}" from litter dataset.`);
          return {
            ...lit,
            puppies: lit.puppies.filter(pup => pup.id !== puppyId)
          };
        }
        return lit;
      }));
    }
  };

  const filteredApps = applications.filter(app => 
    app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLitterObj = litters.find(l => l.id === selectedLitterId);

  // Financial Metrics computations
  const approvedOrReservedApps = applications.filter(a => a.status === 'Approved' || a.status === 'Waitlist' || Object.keys(depositStatus).some(k => k === a.id));
  
  const totalProjectedSales = approvedOrReservedApps.length * basePrice;
  
  const totalSecuredDeposits = approvedOrReservedApps.reduce((acc, app) => {
    const record = depositStatus[app.id];
    if (!record) return acc;
    if (record.status === 'Fully Paid') {
      return acc + (record.customAmount || basePrice);
    } else if (record.status === 'Deposit Paid') {
      return acc + (record.customAmount || 250);
    }
    return acc;
  }, 0);

  const pendingCollection = Math.max(0, totalProjectedSales - totalSecuredDeposits);

  if (authLoading) {
    return (
      <div className="bg-[#fcfaf7] min-h-screen pt-36 pb-20 text-[#0d2244] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-150/80 shadow-2xl p-8 sm:p-10 text-center space-y-6">
          <div className="text-sm font-bold font-mono text-gray-500 uppercase">Checking Authorization...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-[#fcfaf7] min-h-screen pt-36 pb-20 text-[#0d2244] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-150/80 shadow-2xl p-8 sm:p-10 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black">Breeder Workspace</h1>
            <p className="text-xs text-gray-500">
              Please sign in with your authorized Google account to view puppy reservations, contact messages, and configure site settings.
            </p>
          </div>

          <div className="space-y-4">
            {user && !isAdmin && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-medium">
                The account <strong>{user.email}</strong> is not authorized to access this dashboard.
              </div>
            )}
            
            {errorMsg && (
              <p className="text-red-500 text-[10px] font-mono font-bold uppercase">{errorMsg}</p>
            )}

            <button
              onClick={login}
              className="w-full py-3.5 bg-navy-950 text-white hover:bg-gold-500 hover:text-navy-950 rounded-xl font-mono text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              Sign In with Google
            </button>
            {user && (
              <button
                onClick={logout}
                className="text-xs text-gray-400 hover:text-gray-600 font-bold transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfaf7] min-h-screen pt-28 pb-20 text-[#0d2244]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-150 pb-6 mb-8 gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-yellow-600 tracking-widest uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" /> Secure Admin Control Panel
            </span>
            <h1 className="text-3xl font-black tracking-tight mt-1">Breeder Administration Console</h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-gray-500 transition-all"
          >
            Lock Dashboard
          </button>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-mono text-gray-400 font-bold uppercase">Applications</span>
              <strong className="text-xl font-black">{applications.length}</strong>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-mono text-gray-400 font-bold uppercase">Inquiries</span>
              <strong className="text-xl font-black">{messages.length}</strong>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-mono text-gray-400 font-bold uppercase">Active Litters</span>
              <strong className="text-xl font-black">{litters.length} Pairings</strong>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-mono text-gray-400 font-bold uppercase">Secured Deposits</span>
              <strong className="text-xl font-black">${totalSecuredDeposits}</strong>
            </div>
          </div>
        </div>

        {/* TAB TOGGLES */}
        <div className="flex border-b border-gray-200 mb-8 gap-6 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => { setActiveSubTab('applications'); setSelectedApp(null); }}
            className={`pb-4 text-xs font-black uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeSubTab === 'applications' ? 'border-amber-600 text-navy-950 font-black' : 'border-transparent text-gray-400 font-bold'
            }`}
          >
            Applications ({applications.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('messages'); setSelectedApp(null); }}
            className={`pb-4 text-xs font-black uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeSubTab === 'messages' ? 'border-amber-600 text-navy-950 font-black' : 'border-transparent text-gray-400 font-bold'
            }`}
          >
            Inquiries ({messages.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('litters'); setSelectedApp(null); }}
            className={`pb-4 text-xs font-black uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeSubTab === 'litters' ? 'border-amber-600 text-navy-950 font-black' : 'border-transparent text-gray-400 font-bold'
            }`}
          >
            🐾 Litters & Allocation
          </button>
          <button
            onClick={() => { setActiveSubTab('financials'); setSelectedApp(null); }}
            className={`pb-4 text-xs font-black uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeSubTab === 'financials' ? 'border-amber-600 text-navy-950 font-black' : 'border-transparent text-gray-400 font-bold'
            }`}
          >
            💰 CRM Financial Ledger
          </button>
          <button
            onClick={() => { setActiveSubTab('smtp'); setSelectedApp(null); }}
            className={`pb-4 text-xs font-black uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeSubTab === 'smtp' ? 'border-amber-600 text-navy-950 font-black' : 'border-transparent text-gray-400 font-bold'
            }`}
          >
            SMTP Config
          </button>
          <button
            onClick={() => { setActiveSubTab('notify_waitlist'); setSelectedApp(null); }}
            className={`pb-4 text-xs font-black uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
              activeSubTab === 'notify_waitlist' ? 'border-amber-600 text-navy-950 font-black' : 'border-transparent text-gray-400 font-bold'
            }`}
          >
            📢 Broadcast Alert
          </button>
        </div>

        {/* SUB-TABS INTERACTIVE LAYOUT */}
        
        {/* TAB 1: APPLICATIONS */}
        {activeSubTab === 'applications' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* APPS LIST LEFT */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applicants name, email, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-gold-500"
                />
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-400 text-xs font-mono">LOADING DATABASE SUBMISSIONS...</div>
              ) : filteredApps.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">No adoption applications found. Submit one to test!</div>
              ) : (
                filteredApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-5 bg-white rounded-2xl border transition-all cursor-pointer text-left relative ${
                      selectedApp?.id === app.id ? 'border-gold-500 shadow-md ring-1 ring-gold-500/20' : 'border-gray-150 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[9px] font-mono text-gray-400 block">{app.id}</span>
                        <h3 className="font-extrabold text-sm">{app.fullName}</h3>
                        <p className="text-[11px] text-gray-400">{app.email}</p>
                      </div>
                      <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                        app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' :
                        app.status === 'Reviewing' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-blue-500/10 text-blue-600'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mt-4 pt-3 border-t border-gray-50">
                      <span>Submitted: {app.submittedAt}</span>
                      <span className="text-gold-500 font-bold flex items-center gap-1">
                        Inspect Profile <Eye className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* SELECTION DETAIL VIEW RIGHT */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 text-left shadow-sm min-h-[400px]">
              {selectedApp ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
                    <div>
                      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Candidate Portfolio</span>
                      <h2 className="text-lg font-black">{selectedApp.fullName}</h2>
                      <p className="text-xs text-gold-600 font-mono">{selectedApp.id}</p>
                    </div>

                    {/* STATUS SELECTOR */}
                    <div className="flex items-center space-x-2">
                      <label className="text-[10px] font-mono uppercase text-gray-400 font-bold">Status:</label>
                      <select
                        value={selectedApp.status}
                        onChange={(e) => handleUpdateStatus(selectedApp.id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-xs px-2 py-1 rounded font-mono font-bold uppercase focus:outline-none focus:border-gold-500 cursor-pointer"
                      >
                        <option value="Reviewing">Reviewing</option>
                        <option value="Approved">Approved</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Waitlist">Waitlist</option>
                      </select>
                    </div>
                  </div>

                  {/* CONTACT DETAILS */}
                  <div className="grid grid-cols-2 gap-4 text-xs border-b border-gray-100 pb-4">
                    <div>
                      <strong className="block text-[9px] font-mono uppercase text-gray-400">Email Address:</strong>
                      <a href={`mailto:${selectedApp.email}`} className="text-[#0d2244] hover:underline font-bold font-mono text-[11px]">
                        {selectedApp.email}
                      </a>
                    </div>
                    <div>
                      <strong className="block text-[9px] font-mono uppercase text-gray-400">Phone Coordinate:</strong>
                      <span className="font-bold text-[#0d2244]">{selectedApp.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <strong className="block text-[9px] font-mono uppercase text-gray-400">Preferred Contact Method:</strong>
                      <span className="font-bold text-amber-600 font-mono text-[10px] uppercase">{selectedApp.contactMethod || 'Email'}</span>
                    </div>
                    <div>
                      <strong className="block text-[9px] font-mono uppercase text-gray-400">Client Location:</strong>
                      <span className="font-bold text-[#0d2244]">{selectedApp.location}</span>
                    </div>
                    {selectedApp.residentialAddress && (
                      <div className="col-span-2">
                        <strong className="block text-[9px] font-mono uppercase text-gray-400">Full Residential Address:</strong>
                        <span className="font-bold text-[#0d2244] font-serif italic text-[11px]">{selectedApp.residentialAddress}</span>
                      </div>
                    )}
                  </div>

                  {/* HOME ASSESSMENT */}
                  <div className="space-y-3 border-b border-gray-100 pb-4">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-black">Home Environment Assessment</h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold">
                      <div className="flex justify-between border-b border-gray-50 pb-1.5"><span className="text-gray-400">Housing Type:</span> <span>{selectedApp.housingType || 'Single-Family Home'}</span></div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5"><span className="text-gray-400">Own/Rent:</span> <span>{selectedApp.ownOrRent || 'Own'}</span></div>
                      {selectedApp.ownOrRent === 'Rent' && selectedApp.landlordInfo && (
                        <div className="flex justify-between border-b border-gray-50 pb-1.5 col-span-2 bg-amber-500/5 p-2 rounded"><span className="text-amber-800">Landlord Info:</span> <span className="font-normal font-mono text-[10px]">{selectedApp.landlordInfo}</span></div>
                      )}
                      <div className="flex justify-between border-b border-gray-50 pb-1.5"><span className="text-gray-400">Yard Setup:</span> <span>{selectedApp.hasYard ? 'Yes' : 'No Yard'}</span></div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5"><span className="text-gray-400">Fencing Grade:</span> <span>{selectedApp.yardFenced ? 'Fenced Safe' : 'Unfenced'}</span></div>
                      {selectedApp.fenceDetails && (
                        <div className="flex justify-between border-b border-gray-50 pb-1.5 col-span-2"><span className="text-gray-400">Fence Details:</span> <span className="font-medium italic">{selectedApp.fenceDetails}</span></div>
                      )}
                      {!selectedApp.hasYard && selectedApp.noYardPlan && (
                        <div className="flex justify-between border-b border-gray-50 pb-1.5 col-span-2 bg-blue-500/5 p-2 rounded text-left"><span className="text-blue-800 shrink-0 pr-4">No Yard Plan:</span> <span className="font-normal font-serif italic text-[11px]">{selectedApp.noYardPlan}</span></div>
                      )}
                      <div className="flex justify-between border-b border-gray-50 pb-1.5 col-span-2"><span className="text-gray-400">Household Members:</span> <span className="font-medium text-[11px] font-serif">{selectedApp.householdMembers || 'Not specified'}</span></div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5"><span className="text-gray-400">Known Allergies:</span> <span>{selectedApp.hasAllergies ? 'Yes (Dog)' : 'No'}</span></div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5"><span className="text-gray-400">All Agree:</span> <span>{selectedApp.allAgree !== false ? 'Yes ✓' : 'No'}</span></div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5 col-span-2"><span className="text-gray-400">Work Routine:</span> <span>{selectedApp.workSetup}</span></div>
                    </div>
                  </div>

                  {/* FINANCIAL PREPAREDNESS */}
                  <div className="space-y-3 border-b border-gray-100 pb-4">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-black">Financial Preparedness & Policies</h4>
                    <div className="grid grid-cols-1 gap-y-2 text-xs font-semibold">
                      <div className="flex justify-between border-b border-gray-50 pb-1.5">
                        <span className="text-gray-400">Prepared for $850 Adoption Fee?</span> 
                        <span className={selectedApp.preparedAdoptionFee !== false ? "text-emerald-600" : "text-rose-500"}>
                          {selectedApp.preparedAdoptionFee !== false ? "Prepared Yes ✓" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5">
                        <span className="text-gray-400">Agrees to Immediate $350 Hold?</span> 
                        <span className={selectedApp.agreeReservationFee !== false ? "text-emerald-600" : "text-rose-500"}>
                          {selectedApp.agreeReservationFee !== false ? "Agreed Yes ✓" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5">
                        <span className="text-gray-400">Lifetime Medical & Ongoing Prepared?</span> 
                        <span className={selectedApp.preparedOngoingExpenses !== false ? "text-emerald-600" : "text-rose-500"}>
                          {selectedApp.preparedOngoingExpenses !== false ? "Prepared Yes ✓" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CANINE EXPERIENCE & CARE */}
                  <div className="space-y-3 border-b border-gray-100 pb-4">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-black">Experience & Lifestyle Setup</h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold">
                      <div className="flex justify-between border-b border-gray-50 pb-1.5 col-span-2"><span className="text-gray-400">Dog Experience Level:</span> <span>{selectedApp.experienceLevel}</span></div>
                      {selectedApp.priorBreeds && (
                        <div className="flex flex-col border-b border-gray-50 pb-1.5 col-span-2 text-left">
                          <span className="text-gray-400">Prior Breeds Owned:</span> 
                          <span className="font-normal italic text-[11px] font-serif pt-1 bg-gray-50 p-2 rounded border border-gray-100 mt-1">{selectedApp.priorBreeds}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-b border-gray-50 pb-1.5 col-span-2"><span className="text-gray-400">Other Household Pets:</span> <span>{selectedApp.hasOtherPets ? selectedApp.petDetails : 'None'}</span></div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5"><span className="text-gray-400">Hours Left Alone:</span> <span>{selectedApp.hoursAlone || '1-2 hours'}</span></div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5"><span className="text-gray-400">Where During Day:</span> <span>{selectedApp.dayLocation || 'Inside Free'}</span></div>
                      <div className="flex justify-between border-b border-gray-50 pb-1.5 col-span-2"><span className="text-gray-400">Where Sleep Night:</span> <span>{selectedApp.nightLocation || 'In a crate'}</span></div>
                      {selectedApp.trainingPlan && (
                        <div className="flex flex-col border-b border-gray-50 pb-1.5 col-span-2 text-left">
                          <span className="text-gray-400">Socialization & Training Blueprint:</span> 
                          <span className="font-normal italic text-[11px] font-serif pt-1 bg-gray-50 p-2 rounded border border-gray-100 mt-1">{selectedApp.trainingPlan}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FUTURE CARE & SIGNATURES */}
                  <div className="space-y-3 border-b border-gray-100 pb-4">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-black">Future Welfare & Agreement</h4>
                    <div className="grid grid-cols-1 gap-y-3 text-xs font-semibold text-left">
                      {selectedApp.unableToKeepCircumstances && (
                        <div className="flex flex-col border-b border-gray-50 pb-1.5">
                          <span className="text-gray-400 font-bold">Unforeseen Life Change Contingency:</span> 
                          <span className="font-normal italic text-[11px] font-serif pt-1 bg-gray-50 p-2 rounded border border-gray-100 mt-1">{selectedApp.unableToKeepCircumstances}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-mono bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                        <span>✓ Return Policy Lifetime Welfare Contract Accepted</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 bg-navy-950 text-white p-4 rounded-xl border border-gold-500/20 font-mono text-[9px] uppercase tracking-widest">
                        <div>
                          <span className="text-gray-400 block pb-0.5">Signed Seal Name:</span>
                          <span className="text-gold-500 font-bold font-serif text-[11px] capitalize">{selectedApp.signature || selectedApp.fullName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block pb-0.5">Execution Date:</span>
                          <span className="text-gold-500 font-bold font-mono">{selectedApp.signatureDate || selectedApp.submittedAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PREFERENCES */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-black">Puppy Preferences</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <strong className="block text-[9px] font-mono uppercase text-gray-400">Gender Preference:</strong>
                        <span className="font-bold">{selectedApp.genderPreference}</span>
                      </div>
                      <div>
                        <strong className="block text-[9px] font-mono uppercase text-gray-400">Preferred Coat Colors:</strong>
                        <span className="font-bold">
                          {selectedApp.colorPreference && selectedApp.colorPreference.length > 0 
                            ? selectedApp.colorPreference.join(', ') 
                            : 'No Color Preference'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
                      <strong className="block text-[9px] font-mono uppercase text-gray-400 mb-2">Candidate Application Statement:</strong>
                      <p className="text-gray-600 italic leading-relaxed whitespace-pre-wrap">
                        {selectedApp.notes || "No extra personal notes provided."}
                      </p>
                    </div>

                    {/* QUICK ACTION DEPOSIT OVERRIDE FOR THIS CANDIDATE */}
                    <div className="bg-amber-500/5 border border-amber-500/15 p-4 rounded-xl text-xs space-y-3">
                      <h4 className="font-black text-amber-800 text-[10px] uppercase font-mono tracking-wider">Fast Deposit Status</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Current Setup:</span>
                        <span className="font-black text-navy-950">
                          {depositStatus[selectedApp.id]?.status || 'Unpaid'} 
                          {depositStatus[selectedApp.id]?.customAmount && ` ($${depositStatus[selectedApp.id].customAmount})`}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => handleUpdateDeposit(selectedApp.id, 'Unpaid')} 
                          className="px-2.5 py-1 bg-white hover:bg-gray-150 border border-gray-200 rounded text-[9px] font-black uppercase font-mono transition-all"
                        >
                          Mark Unpaid
                        </button>
                        <button 
                          onClick={() => handleUpdateDeposit(selectedApp.id, 'Deposit Paid', 250)} 
                          className="px-2.5 py-1 bg-amber-500 text-white hover:bg-amber-600 rounded text-[9px] font-black uppercase font-mono transition-all"
                        >
                          Mark Deposit Paid ($250)
                        </button>
                        <button 
                          onClick={() => handleUpdateDeposit(selectedApp.id, 'Fully Paid', basePrice)} 
                          className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded text-[9px] font-black uppercase font-mono transition-all"
                        >
                          Mark Fully Paid (${basePrice})
                        </button>
                      </div>
                    </div>

                    {/* REPLY ACTION CTA */}
                    <div className="pt-2 flex gap-4">
                      <a
                        href={`mailto:${selectedApp.email}?subject=Your Golden Paws Adoption Application (Ref: ${selectedApp.id})&body=Hi ${selectedApp.fullName},%0D%0A%0D%0AThis is Ciara from Golden Paws Home! I have reviewed your application and waitlist standing. Your reference is ${selectedApp.id}.%0D%0A%0D%0ALet's coordinate regarding upcoming pairings, reservations, and payment coordinates.`}
                        className="flex-1 py-3 bg-navy-950 text-white hover:bg-gold-500 hover:text-navy-950 rounded-xl font-mono text-[9px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Mail className="w-4 h-4" /> REPLY VIA EMAIL (SEND INVOICE INFO)
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 text-gray-400">
                  <Award className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-xs font-medium">Select an application from the left panel to review full client profiles, modify status, or email payment coordinates.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MESSAGES */}
        {activeSubTab === 'messages' && (
          <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm">
            <div className="relative mb-6 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search message senders or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400 text-xs font-mono">LOADING MESSAGE DATABASE...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">No direct contact inquiries received yet. Submit one on the contact page to test!</div>
            ) : (
              <div className="space-y-6">
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200/50 gap-2">
                      <div>
                        <h3 className="font-extrabold text-sm">{msg.name}</h3>
                        <div className="flex flex-wrap gap-x-4 text-xs text-gray-400 font-mono mt-0.5">
                          <a href={`mailto:${msg.email}`} className="hover:underline font-bold text-navy-950 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-amber-500" /> {msg.email}
                          </a>
                          {msg.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-amber-500" /> {msg.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-gray-400">{new Date(msg.submittedAt).toLocaleString()}</span>
                    </div>
                    
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap italic bg-white p-4 rounded-xl border border-gray-100">
                      "{msg.message}"
                    </p>

                    <div className="flex justify-end pt-1">
                      <a
                        href={`mailto:${msg.email}?subject=Re: Your inquiry on Golden Paws Home&body=Hi ${msg.name},%0D%0A%0D%0AThank you for contacting Golden Paws Home! I'm replying directly to your query:`}
                        className="px-4 py-2 bg-white hover:bg-gold-500 hover:text-navy-950 border border-gray-200 rounded-xl text-[9px] font-mono font-black uppercase tracking-widest transition-all flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" /> Reply to Sender
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LITTERS & PUPPY ALLOCATOR (NEW) */}
        {activeSubTab === 'litters' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LITTERS INDEX LIST */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-black text-navy-950 font-mono uppercase tracking-wider">Breeding Groups</h3>
                  <button 
                    onClick={() => setShowAddLitter(!showAddLitter)}
                    className="p-1.5 bg-amber-500 text-white hover:bg-amber-600 rounded-lg flex items-center text-[10px] font-bold font-mono uppercase transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> New Pairing
                  </button>
                </div>

                {/* ADD LITTER COMPONENT EXPANSION */}
                {showAddLitter && (
                  <motion.form 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleCreateLitter} 
                    className="p-5 bg-white border-2 border-amber-300 rounded-2xl text-left space-y-3"
                  >
                    <h4 className="font-extrabold text-xs uppercase text-amber-800 font-mono">Create Breed Group</h4>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Pairing / Litter Name</label>
                      <input 
                        type="text" 
                        required
                        value={newLitterName} 
                        onChange={e => setNewLitterName(e.target.value)}
                        placeholder="e.g. Luna & Sterling Summer"
                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-lg text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Dam (Mother)</label>
                        <select 
                          value={newLitterDam} 
                          onChange={e => setNewLitterDam(e.target.value)}
                          required
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                        >
                          <option value="">Select Dam</option>
                          <option value="Lady Bella of Amber Acres">Lady Bella</option>
                          <option value="Luna">Luna (Import Cream)</option>
                          <option value="Honey">Honey of Sunny Hills</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Sire (Father)</label>
                        <select 
                          value={newLitterSire} 
                          onChange={e => setNewLitterSire(e.target.value)}
                          required
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                        >
                          <option value="">Select Sire</option>
                          <option value="GCH Rusty of Golden Paws">Rusty</option>
                          <option value="Sir Sterling of Sunny Hills">Sterling</option>
                          <option value="Duke">Duke of Sunny Hills</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Due/Birth Date</label>
                        <input 
                          type="date" 
                          required
                          value={newLitterDob} 
                          onChange={e => setNewLitterDob(e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Status</label>
                        <select 
                          value={newLitterStatus} 
                          onChange={e => setNewLitterStatus(e.target.value as any)}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                        >
                          <option value="Planned">Planned</option>
                          <option value="Expecting">Expecting</option>
                          <option value="Whelped">Whelped (Born)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1.5">
                      <button 
                        type="button" 
                        onClick={() => setShowAddLitter(false)} 
                        className="flex-1 py-1.5 border border-gray-200 rounded-lg text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 py-1.5 bg-amber-500 text-white hover:bg-amber-600 rounded-lg text-xs font-bold font-mono uppercase tracking-wider"
                      >
                        Save Group
                      </button>
                    </div>
                  </motion.form>
                )}

                {litters.map((lit) => (
                  <div
                    key={lit.id}
                    onClick={() => { setSelectedLitterId(lit.id); setShowAddPuppy(false); }}
                    className={`p-4 bg-white rounded-2xl border text-left transition-all cursor-pointer relative ${
                      selectedLitterId === lit.id ? 'border-amber-500 shadow-md ring-1 ring-amber-500/20' : 'border-gray-150 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase ${
                        lit.status === 'Whelped' ? 'bg-emerald-100 text-emerald-800' :
                        lit.status === 'Expecting' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {lit.status}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteLitter(lit.id); }}
                        className="text-gray-300 hover:text-red-500 p-1 rounded transition-colors"
                        title="Delete Pairing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-extrabold text-sm text-[#0d2244] mt-2 leading-tight">{lit.name}</h4>
                    
                    <div className="mt-3 grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-gray-500 font-semibold border-t pt-2 border-gray-50">
                      <div>Dam: <span className="text-gray-700 font-bold">{lit.dam.split(' ')[0]}</span></div>
                      <div>Sire: <span className="text-gray-700 font-bold">{lit.sire.split(' ')[0]}</span></div>
                      <div className="col-span-2 flex items-center justify-between text-[9px] mt-1 text-amber-800 font-mono">
                        <span>📅 {lit.dob}</span>
                        <span className="font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                          {lit.puppies?.length || 0} puppies logged
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* LITTER DETAILS AND ACTIVE PUPPY DIRECTORY */}
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 text-left shadow-sm min-h-[400px]">
                {selectedLitterObj ? (
                  <div className="space-y-6">
                    
                    {/* LITTERS HEADER METADATA */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
                      <div>
                        <span className="text-[9px] font-mono text-amber-600 font-bold uppercase tracking-widest">Selected Breeding Pair Group</span>
                        <h2 className="text-lg font-black">{selectedLitterObj.name}</h2>
                        <p className="text-xs text-gray-400">Sire: {selectedLitterObj.sire} • Dam: {selectedLitterObj.dam}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 font-mono">Status:</span>
                        <select
                          value={selectedLitterObj.status}
                          onChange={(e) => {
                            setLitters(prev => prev.map(l => l.id === selectedLitterObj.id ? { ...l, status: e.target.value as any } : l));
                            logEvent('LITTER', `Modified litter pairing "${selectedLitterObj.name}" status to "${e.target.value}".`);
                          }}
                          className="bg-gray-50 border border-gray-200 text-xs px-2.5 py-1 rounded font-mono font-bold uppercase focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value="Planned">Planned</option>
                          <option value="Expecting">Expecting</option>
                          <option value="Whelped">Whelped</option>
                          <option value="Graduated">Graduated</option>
                        </select>
                      </div>
                    </div>

                    {/* INTERACTIVE ADD PUPPY TOGGLE */}
                    {selectedLitterObj.status === 'Whelped' && (
                      <div className="border-b border-gray-100 pb-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-black text-xs uppercase font-mono tracking-wider text-[#0d2244]">Puppy Directory</h3>
                          <button 
                            onClick={() => setShowAddPuppy(!showAddPuppy)}
                            className="px-2.5 py-1.5 bg-navy-950 text-white hover:bg-gold-500 hover:text-navy-950 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all"
                          >
                            {showAddPuppy ? "Hide Form" : "➕ Add Individual Puppy"}
                          </button>
                        </div>

                        {showAddPuppy && (
                          <motion.form 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            onSubmit={handleCreatePuppy}
                            className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                          >
                            <div className="sm:col-span-4 space-y-1">
                              <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Puppy Identifier/Name</label>
                              <input 
                                type="text"
                                required
                                value={newPuppyName}
                                onChange={e => setNewPuppyName(e.target.value)}
                                placeholder="e.g. Winston, Cooper, Bella"
                                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Gender</label>
                              <select 
                                value={newPuppyGender}
                                onChange={e => setNewPuppyGender(e.target.value as any)}
                                className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                            </div>

                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Color Variant</label>
                              <select 
                                value={newPuppyColor}
                                onChange={e => setNewPuppyColor(e.target.value)}
                                className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                              >
                                <option value="Cream">English Cream</option>
                                <option value="Light Golden">Light Golden</option>
                                <option value="Honey Golden">Honey Golden</option>
                                <option value="Red Golden">Red Golden</option>
                              </select>
                            </div>

                            <div className="sm:col-span-2">
                              <button 
                                type="submit"
                                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-mono font-black text-[9px] uppercase tracking-wider rounded-lg transition-all"
                              >
                                Save Pup
                              </button>
                            </div>
                          </motion.form>
                        )}
                      </div>
                    )}

                    {/* PUPPIES INDIVIDUAL LIST */}
                    {selectedLitterObj.status !== 'Whelped' ? (
                      <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-center">
                        <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                        <h4 className="font-extrabold text-sm uppercase text-[#0d2244]">Litter status is "{selectedLitterObj.status}"</h4>
                        <p className="text-xs text-gray-500 mt-1">Once puppies are whelped, transition the status selection above to "Whelped" to unlock medical schedule calendars and candidate slot allocations.</p>
                      </div>
                    ) : selectedLitterObj.puppies.length === 0 ? (
                      <p className="text-center py-12 text-gray-400 text-xs">No puppies registered yet in this litter pairing. Click "Add Individual Puppy" above to populate records.</p>
                    ) : (
                      <div className="space-y-6">
                        {selectedLitterObj.puppies.map((pup) => (
                          <div key={pup.id} className="p-5 border border-gray-150/80 rounded-2xl bg-gray-50/50 space-y-4">
                            
                            {/* PUPPY BASE COORDINATES */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-150 gap-2">
                              <div>
                                <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-navy-950">
                                  🐾 {pup.name} 
                                  <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
                                    pup.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                                  }`}>
                                    {pup.gender}
                                  </span>
                                </h4>
                                <p className="text-[10px] text-gray-400 font-mono font-bold mt-0.5">{pup.color} • Ref: {pup.id}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-mono font-black uppercase px-2 py-1 rounded ${
                                  pup.status === 'Reserved' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                                }`}>
                                  {pup.status}
                                </span>

                                <button 
                                  onClick={() => handleDeletePuppy(selectedLitterObj.id, pup.id)}
                                  className="p-1 text-gray-300 hover:text-red-500 hover:bg-white border rounded transition-all"
                                  title="Remove Puppy"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* MEDICAL CHECKBOX MATRIX */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                              <div className="sm:col-span-7 space-y-2">
                                <span className="block text-[9px] font-mono uppercase text-amber-700 font-black tracking-wider">Medical Schedule Tracker</span>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <label className="flex items-center space-x-2 bg-white p-2 border border-gray-150 rounded-lg cursor-pointer hover:border-amber-400 transition-all text-xs font-semibold select-none">
                                    <input 
                                      type="checkbox" 
                                      checked={pup.healthChecks.deworming2wk} 
                                      onChange={() => handleToggleMedical(selectedLitterObj.id, pup.id, 'deworming2wk')}
                                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                    />
                                    <span>2-Week Deworm</span>
                                  </label>

                                  <label className="flex items-center space-x-2 bg-white p-2 border border-gray-150 rounded-lg cursor-pointer hover:border-amber-400 transition-all text-xs font-semibold select-none">
                                    <input 
                                      type="checkbox" 
                                      checked={pup.healthChecks.deworming4wk} 
                                      onChange={() => handleToggleMedical(selectedLitterObj.id, pup.id, 'deworming4wk')}
                                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                    />
                                    <span>4-Week Deworm</span>
                                  </label>

                                  <label className="flex items-center space-x-2 bg-white p-2 border border-gray-150 rounded-lg cursor-pointer hover:border-amber-400 transition-all text-xs font-semibold select-none">
                                    <input 
                                      type="checkbox" 
                                      checked={pup.healthChecks.deworming6wk} 
                                      onChange={() => handleToggleMedical(selectedLitterObj.id, pup.id, 'deworming6wk')}
                                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                    />
                                    <span>6-Week Deworm</span>
                                  </label>

                                  <label className="flex items-center space-x-2 bg-white p-2 border border-gray-150 rounded-lg cursor-pointer hover:border-amber-400 transition-all text-xs font-semibold select-none">
                                    <input 
                                      type="checkbox" 
                                      checked={pup.healthChecks.deworming8wk} 
                                      onChange={() => handleToggleMedical(selectedLitterObj.id, pup.id, 'deworming8wk')}
                                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                    />
                                    <span>8-Week Deworm</span>
                                  </label>

                                  <label className="flex items-center space-x-2 bg-white p-2 border border-gray-150 rounded-lg cursor-pointer hover:border-amber-400 transition-all text-xs font-semibold select-none">
                                    <input 
                                      type="checkbox" 
                                      checked={pup.healthChecks.vaccine6wk} 
                                      onChange={() => handleToggleMedical(selectedLitterObj.id, pup.id, 'vaccine6wk')}
                                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                    />
                                    <span>6wk Parvo Vax</span>
                                  </label>

                                  <label className="flex items-center space-x-2 bg-white p-2 border border-gray-150 rounded-lg cursor-pointer hover:border-amber-400 transition-all text-xs font-semibold select-none">
                                    <input 
                                      type="checkbox" 
                                      checked={pup.healthChecks.vaccine8wk} 
                                      onChange={() => handleToggleMedical(selectedLitterObj.id, pup.id, 'vaccine8wk')}
                                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                    />
                                    <span>8wk DHPP Vax</span>
                                  </label>

                                  <label className="flex items-center space-x-2 bg-white p-2 border border-gray-150 rounded-lg cursor-pointer hover:border-amber-400 transition-all text-xs font-semibold select-none col-span-2">
                                    <input 
                                      type="checkbox" 
                                      checked={pup.healthChecks.vetClearance} 
                                      onChange={() => handleToggleMedical(selectedLitterObj.id, pup.id, 'vetClearance')}
                                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                    />
                                    <span className="font-bold text-amber-800">Veterinary Health Clearance Signed</span>
                                  </label>
                                </div>
                              </div>

                              {/* ADOPTIVE PARENT ALLOCATOR */}
                              <div className="sm:col-span-5 space-y-2 bg-white p-3.5 border border-gray-150 rounded-2xl text-xs">
                                <span className="block text-[9px] font-mono uppercase text-gray-400 font-bold">Slot Allocation</span>
                                
                                {pup.status === 'Reserved' ? (
                                  <div className="space-y-3">
                                    <div className="p-3 bg-amber-500/5 border border-amber-300/30 rounded-xl">
                                      <span className="block text-[8px] uppercase font-mono text-amber-700 font-black">Reserved For Candidate:</span>
                                      <strong className="text-sm text-navy-950 block mt-0.5">{pup.assignedToName}</strong>
                                      <span className="text-[9px] text-gray-400 block font-mono">{pup.assignedToAppId}</span>
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={() => handleReleasePuppy(selectedLitterObj.id, pup.id)}
                                      className="w-full py-1.5 bg-gray-100 hover:bg-red-500 hover:text-white rounded-lg text-[9px] font-mono font-bold uppercase transition-all"
                                    >
                                      Release Allocation
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="text-[10px] text-gray-500 font-medium">No candidate family assigned yet. Bind an approved adopter from your waitlist:</div>
                                    
                                    <select
                                      id={`assign-selector-${pup.id}`}
                                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold"
                                      defaultValue=""
                                    >
                                      <option value="" disabled>Choose Approved Adopter...</option>
                                      {applications.filter(a => a.status === 'Approved').map(app => (
                                        <option key={app.id} value={app.id}>{app.fullName} ({app.id})</option>
                                      ))}
                                    </select>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const selectEl = document.getElementById(`assign-selector-${pup.id}`) as HTMLSelectElement;
                                        if (selectEl && selectEl.value) {
                                          handleAssignPuppy(selectedLitterObj.id, pup.id, selectEl.value);
                                        } else {
                                          alert("Please select a candidate first.");
                                        }
                                      }}
                                      className="w-full py-2 bg-[#0d2244] text-white hover:bg-amber-500 hover:text-navy-950 font-mono font-black text-[9px] uppercase tracking-widest rounded-lg transition-all"
                                    >
                                      Lock Allocation
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 text-gray-400">
                    <Layers className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-xs">No active litters available. Use the "New Pairing" button to register one.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: CRM FINANCIAL LEDGER & DEPOSIT CALCULATOR (NEW) */}
        {activeSubTab === 'financials' && (
          <div className="space-y-8 text-left">
            
            {/* CONFIGURATION & STATS HERO */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm">
              <div className="lg:col-span-4 space-y-4">
                <span className="text-[9px] font-mono uppercase tracking-widest text-amber-600 font-bold">Ledger Variables Config</span>
                <h3 className="text-lg font-black text-navy-950">Set Standard Pricing</h3>
                <p className="text-xs text-gray-500">Modify the standard adoption base price per puppy to automatically recalibrate all waitlist revenue forecasting parameters instantly.</p>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-gray-400 uppercase">Base Adoption Price ($)</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="number" 
                      value={basePrice} 
                      onChange={e => {
                        const val = Math.max(0, Number(e.target.value));
                        setBasePrice(val);
                        logEvent('FINANCIAL', `Adjusted standard base puppy adoption price configuration to $${val}.`);
                      }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl text-xs font-black"
                    />
                    <span className="text-xs text-gray-400 font-mono font-bold uppercase">USD</span>
                  </div>
                </div>
              </div>

              {/* STATS BREAKDOWN GRID */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">Expected Revenue</span>
                  <div className="text-2xl font-black mt-1 text-[#0d2244]">${totalProjectedSales}</div>
                  <span className="text-[8px] text-gray-400 font-mono font-semibold block mt-1">
                    ({approvedOrReservedApps.length} Approved Families * ${basePrice})
                  </span>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">Secured Deposits</span>
                  <div className="text-2xl font-black mt-1 text-emerald-600">${totalSecuredDeposits}</div>
                  <span className="text-[8px] text-gray-400 font-mono font-semibold block mt-1">
                    Sum of logged payments
                  </span>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">Pending Collection</span>
                  <div className="text-2xl font-black mt-1 text-amber-600">${pendingCollection}</div>
                  <span className="text-[8px] text-gray-400 font-mono font-semibold block mt-1">
                    Outstanding balance forecast
                  </span>
                </div>
              </div>
            </div>

            {/* ADOPTERS PAYMENT LIST LEDGER */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-black text-navy-950 font-mono uppercase tracking-wider mb-4">Adopter Accounts & Payment Ledger</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-150 text-[9px] font-mono uppercase text-gray-400">
                      <th className="pb-3 font-bold">Candidate Info</th>
                      <th className="pb-3 font-bold">Location</th>
                      <th className="pb-3 font-bold">Litter Selection Preferred</th>
                      <th className="pb-3 font-bold">Adoption Status</th>
                      <th className="pb-3 font-bold">Payment Status</th>
                      <th className="pb-3 font-bold text-right">Sum Logged</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedOrReservedApps.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">No active approved or assigned adopters found in ledger records.</td>
                      </tr>
                    ) : (
                      approvedOrReservedApps.map(app => {
                        const record = depositStatus[app.id] || { status: 'Unpaid' };
                        return (
                          <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 pr-3">
                              <span className="font-extrabold text-[#0d2244] block">{app.fullName}</span>
                              <span className="text-[9px] text-gray-400 font-mono font-bold block">{app.id} • {app.email}</span>
                            </td>
                            <td className="py-4 text-gray-600 font-semibold">{app.location}</td>
                            <td className="py-4 text-gray-500 font-bold">{app.genderPreference} Preference</td>
                            <td className="py-4">
                              <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                                app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-4">
                              <select
                                value={record.status}
                                onChange={e => {
                                  const selectStatus = e.target.value as any;
                                  let amount = 0;
                                  if (selectStatus === 'Fully Paid') amount = basePrice;
                                  else if (selectStatus === 'Deposit Paid') amount = 250;
                                  handleUpdateDeposit(app.id, selectStatus, amount);
                                }}
                                className="bg-gray-50 border border-gray-200 text-xs px-2.5 py-1 rounded font-mono font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                              >
                                <option value="Unpaid">Unpaid</option>
                                <option value="Deposit Paid">Deposit Paid ($250)</option>
                                <option value="Fully Paid">Fully Paid (${basePrice})</option>
                              </select>
                            </td>
                            <td className="py-4 font-mono font-black text-right text-navy-950">
                              ${record.status === 'Fully Paid' ? (record.customAmount || basePrice) : 
                                record.status === 'Deposit Paid' ? (record.customAmount || 250) : 0}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: SMTP GUIDELINES SETUP */}
        {activeSubTab === 'smtp' && (
          <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-10 text-left space-y-8 shadow-sm">
            <div className="space-y-2 border-b border-gray-100 pb-4">
              <span className="text-xs font-mono font-black text-gold-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-500" /> Real-time Email Notifications Config
              </span>
              <h2 className="text-xl font-black">Enable Direct Email Notifications</h2>
              <p className="text-xs text-gray-500">
                When configured, submissions on your contact page and waitlist reservations are emailed instantly to your official business address: <strong className="font-bold text-navy-950">goldenpupshome22@gmail.com</strong>.
              </p>
            </div>

            {/* LIVE INTEGRATION DIALOG & CONTROLS */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-3">
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" /> Integration Controller Status
                </h3>
                
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  <div className="flex justify-between border-b border-gray-200/50 pb-1">
                    <span className="text-gray-400">SMTP Host:</span>
                    <span className="font-mono font-bold text-gray-700">{smtpStatus?.smtpHost || 'smtp.gmail.com'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/50 pb-1">
                    <span className="text-gray-400">SMTP Port:</span>
                    <span className="font-mono font-bold text-gray-700">{smtpStatus?.smtpPort || 587}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/50 pb-1">
                    <span className="text-gray-400">Target Inbox:</span>
                    <span className="font-mono font-bold text-[#0d2244]">{smtpStatus?.targetEmail || 'goldenpupshome22@gmail.com'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/50 pb-1">
                    <span className="text-gray-400">Auth Account:</span>
                    <span className="font-mono font-bold text-gray-700">{smtpStatus?.smtpUser || 'goldenpupshome22@gmail.com'}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-semibold">Connection Status:</span>
                  {smtpStatus?.configured ? (
                    <span className="bg-emerald-500/10 text-emerald-700 font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      Live & Active (.env loaded)
                    </span>
                  ) : (
                    <span className="bg-amber-500/10 text-amber-700 font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      Simulated Mode (No Credentials in .env)
                    </span>
                  )}
                </div>
              </div>

              {/* EMAIL NOTIFICATIONS TOGGLE */}
              <div className="md:col-span-12 mt-2 pt-4 border-t border-gray-200/50 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-navy-950">Receive Email Notifications</h4>
                  <p className="text-[10px] text-gray-500">Automatically forward all new adoption applications and contact inquiries to goldenpupshome22@gmail.com.</p>
                </div>
                <button
                  onClick={toggleEmailNotifs}
                  disabled={savingNotifs}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${emailNotifsEnabled ? 'bg-gold-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* INTERACTIVE DIAGNOSTIC TEST TRIGGER */}
              <div className="md:col-span-5 p-4 bg-white rounded-xl border border-gray-200/60 flex flex-col items-center text-center space-y-3">
                <div className="text-xs font-bold text-gray-700">Diagnostics Tester</div>
                <p className="text-[10px] text-gray-400">
                  Verify your SMTP alerts immediately by triggering a secure verification email to <strong className="font-bold text-navy-950">goldenpupshome22@gmail.com</strong>.
                </p>

                <button
                  onClick={handleSendTestEmail}
                  disabled={smtpTesting}
                  className={`w-full py-2.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    smtpTesting 
                      ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600 text-navy-950 shadow-md shadow-amber-500/10'
                  }`}
                >
                  {smtpTesting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                      DISPATCHING TEST...
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" /> TRIGGER TEST EMAIL ALERT
                    </>
                  )}
                </button>

                {smtpTestResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-2.5 rounded-lg text-[10px] text-left w-full border font-medium ${
                      smtpTestResult.success 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}
                  >
                    {smtpTestResult.success ? (
                      <div>
                        <strong>✨ Alert Sent Successfully!</strong><br />
                        Check your inbox at <span className="font-semibold underline">goldenpupshome22@gmail.com</span> (and spam folder) for the test message.
                      </div>
                    ) : (
                      <div>
                        <strong>❌ Alert Dispatch Failed:</strong><br />
                        <span className="font-mono text-[9px] break-all">{smtpTestResult.error}</span><br />
                        <span className="block mt-1 text-gray-500 font-sans text-[8px]">
                          Please confirm SMTP_USER and SMTP_PASS are correctly saved in your Workspace Settings Panel.
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* STEPS CARD */}
              <div className="space-y-6">
                <h3 className="font-extrabold text-sm border-b pb-2">Step-by-Step Gmail Activation Guide</h3>
                <ol className="list-decimal list-inside space-y-4 text-xs text-gray-600 leading-relaxed">
                  <li>
                    <strong>Get a Google App Password</strong>:<br />
                    Go to your Google Account (for <em>goldenpupshome22@gmail.com</em>) &rarr; Security &rarr; Enable 2-Step Verification &rarr; search for "App Passwords". Create one named <em className="font-serif">"Golden Paws Home"</em> and copy the generated 16-character code.
                  </li>
                  <li>
                    <strong>Define Variables in Settings</strong>:<br />
                    Open the <strong className="text-navy-950 font-bold">Settings Panel</strong> in the top-right corner of your AI Studio Workspace. Add the following parameters:
                    <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-gray-500 font-mono text-[10px]">
                      <li>SMTP_HOST = smtp.gmail.com</li>
                      <li>SMTP_PORT = 587</li>
                      <li>SMTP_USER = goldenpupshome22@gmail.com</li>
                      <li>SMTP_PASS = your_16_character_app_password</li>
                      <li>SMTP_SENDER = goldenpupshome22@gmail.com</li>
                      <li>NOTIFICATION_EMAIL = goldenpupshome22@gmail.com</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Save &amp; Auto-Recompile</strong>:<br />
                    Click save. The system automatically configures your email dispatch.
                  </li>
                </ol>
              </div>

              {/* WHY THIS IS EXCELLENT */}
              <div className="bg-gradient-to-br from-[#0d2244] to-[#081730] text-white p-6 sm:p-8 rounded-2xl space-y-4">
                <h3 className="text-sm font-black text-gold-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Award className="w-5 h-5 text-gold-400" /> Instant Customer Correspondence
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Once SMTP is connected, the moment an applicant submits their details or waitlist request, your mobile phone or computer receives an elegant alert with their phone number, previous experience, yard layout, color/gender preference, and statement.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  You can click "Reply" inside your mail app to instantly send them adoption approvals, breeding updates, or deposit/payment instructions!
                </p>
                <div className="pt-2 p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono">
                  <span className="text-gold-400 font-bold uppercase tracking-widest block mb-1">Backup Safe-catch</span>
                  All submitted applications and contact requests are permanently archived locally on this secure Breeder Server, ensuring no lead is ever lost even if email services are temporarily down.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: NOTIFY WAITLIST */}
        {activeSubTab === 'notify_waitlist' && (
          <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-10 text-left space-y-8 shadow-sm">
            <div className="space-y-2 border-b border-gray-100 pb-4">
              <span className="text-xs font-mono font-black text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Waitlist Broadcast Communicator
              </span>
              <h2 className="text-xl font-black">Broadcast Priority Announcements</h2>
              <p className="text-xs text-gray-500">
                Draft a beautiful, branded email notice to instantly transmit updates to your secured chronological waitlist families. The system automatically fetches registered candidates and can route emails live via SMTP if active, or log simulation reports.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* BROADCAST FORM LEFT */}
              <div className="lg:col-span-7 space-y-6">
                <form onSubmit={handleBroadcast} className="space-y-5">
                  
                  {/* TARGET FILTER */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold mb-2">
                      Target Audience Segments
                    </label>
                    <select
                      value={broadcastTarget}
                      onChange={(e) => setBroadcastTarget(e.target.value as any)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl font-medium focus:outline-none focus:border-gold-500 cursor-pointer"
                    >
                      <option value="all">All Registered + Simulated Families (Broad Broadcast)</option>
                      <option value="Approved">Approved Status Candidates Only</option>
                      <option value="Reviewing">Reviewing Status Candidates Only</option>
                    </select>
                  </div>

                  {/* SUBJECT */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold mb-2">
                      Email Subject line
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Luna & Sterling Litters Progress & Selection Unlock"
                      value={broadcastSubject}
                      onChange={(e) => setBroadcastSubject(e.target.value)}
                      required
                      className="w-full pl-4 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-gold-500 font-semibold"
                    />
                  </div>

                  {/* MESSAGE BODY */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-400 font-bold mb-2">
                      Broadcast Announcement Message
                    </label>
                    <textarea
                      rows={8}
                      placeholder="Write your email body..."
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      required
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-gold-500 font-sans leading-relaxed"
                    />
                    <span className="block text-[9px] text-gray-400 mt-1 font-medium italic">
                      💡 Tip: Standard paragraph line-breaks are preserved and formatted as beautiful document spacing inside the Golden Paws email template.
                    </span>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={broadcastSending}
                    className={`w-full py-3.5 rounded-xl font-mono text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2 ${
                      broadcastSending
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        : 'bg-navy-950 text-white hover:bg-gold-500 hover:text-navy-950 shadow-md'
                    }`}
                  >
                    {broadcastSending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                        TRANSMITTING BROADCAST TO MASTER WAITLIST...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" /> BROADCAST ANNOUNCEMENT TO WAITLIST
                      </>
                    )}
                  </button>
                </form>

                {/* RESULTS LOG REPORT */}
                {broadcastResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                      <div>
                        <h4 className="font-extrabold text-navy-950 text-sm">Transmission Report</h4>
                        <p className="text-[10px] text-gray-400">
                          Status segments filter: <strong className="uppercase font-bold text-gray-600">{broadcastTarget}</strong>
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                        broadcastResult.liveSmtpActive 
                          ? 'bg-emerald-500/10 text-emerald-700'
                          : 'bg-amber-500/10 text-amber-700'
                      }`}>
                        {broadcastResult.liveSmtpActive ? 'LIVE SMTP DISPATCH' : 'SIMULATED SUCCESS'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] bg-white p-3 rounded-xl border border-gray-100">
                      <span>Total Verified Targets Notified:</span>
                      <strong className="text-sm font-black text-navy-950">{broadcastResult.count} Families</strong>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {broadcastResult.results.map((res: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100/80 text-[10px] font-mono">
                          <div>
                            <span className="font-extrabold text-[#0d2244]">{res.name}</span>
                            <span className="text-gray-400 block text-[8px]">{res.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 uppercase">{res.status}</span>
                            {res.success ? (
                              <span className="text-green-600 font-bold flex items-center gap-0.5">
                                <CheckCircle className="w-3.5 h-3.5" /> SENT
                              </span>
                            ) : (
                              <span className="text-amber-600 font-bold flex items-center gap-0.5">
                                <Clock className="w-3.5 h-3.5" /> SIMULATED
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[9px] text-gray-400 leading-relaxed text-center">
                      {broadcastResult.liveSmtpActive 
                        ? '✨ Emails were dispatched successfully using your live server SMTP credentials!'
                        : 'ℹ️ Run in Simulation Mode. To enable real-world inbox dispatch, configure your Google App Passwords on the Setup tab.'
                      }
                    </p>
                  </motion.div>
                )}
              </div>

              {/* LIVE BRAND PREVIEW RIGHT */}
              <div className="lg:col-span-5 bg-gray-50 p-6 rounded-3xl border border-gray-150 text-left space-y-4">
                <h3 className="text-xs font-mono font-black uppercase text-amber-600 tracking-wider">
                  Live Dispatch Preview
                </h3>
                <p className="text-[10px] text-gray-400">
                  This preview renders your broadcast contents exactly as they appear inside the candidate&apos;s email client, framed by our premium gold-and-navy styling:
                </p>

                {/* EMAIL EMBED MOCK */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-inner overflow-hidden font-sans text-xs">
                  {/* Email header mock */}
                  <div className="bg-[#0d2244] p-4 border-b-2 border-gold-500 text-center text-white">
                    <span className="text-[18px] block">🐾</span>
                    <strong className="text-[12px] uppercase block tracking-wider font-bold">Golden Paws Home</strong>
                    <span className="text-[8px] text-gold-500 uppercase tracking-widest block font-bold font-mono">Valley Ranch family breeders</span>
                  </div>
                  
                  {/* Email body mock */}
                  <div className="p-4 space-y-3 leading-relaxed">
                    <div className="border-b pb-1">
                      <strong className="text-gray-400 block text-[8px]">Subject:</strong>
                      <span className="font-extrabold text-[#0d2244] text-[10px]">{broadcastSubject || "Important Announcement from Golden Paws Home"}</span>
                    </div>
                    
                    <p className="text-gray-700">Hello <strong>[Applicant Family Name]</strong>,</p>
                    
                    <div className="text-gray-600 space-y-2 whitespace-pre-wrap text-[10px] bg-gray-50/50 p-2.5 rounded border border-gray-100 leading-relaxed font-sans">
                      {broadcastMessage || "Your message body text goes here..."}
                    </div>

                    <div className="bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-lg text-center text-[9px] space-y-1.5">
                      <span className="text-yellow-700 font-bold block">VERIFY YOUR PRIORITY STANDING</span>
                      <span className="bg-[#0d2244] text-white py-1.5 px-3 rounded inline-block font-bold border border-gold-500 font-mono tracking-wider">
                        VIEW MASTER WAITLIST BOARD
                      </span>
                    </div>
                  </div>

                  {/* Email footer mock */}
                  <div className="bg-[#0d2244] text-gray-400 p-4 text-[7px] text-center space-y-1 border-t border-gold-500">
                    <strong className="text-white">Golden Paws Home</strong>
                    <p className="text-gold-400">Ciara Wallen | Valley Ranch family breeders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERSISTENT SYSTEM SECURITY AUDIT TRACE LOG */}
        <div className="mt-12 bg-gray-950 text-emerald-400 font-mono text-[11px] rounded-2xl border border-gray-800 p-5 shadow-2xl space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-black uppercase tracking-widest text-gray-200 text-xs">Live System Operations Audit Feed</span>
            </div>
            <button 
              onClick={() => {
                setAuditLogs([]);
                const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setAuditLogs([{ id: 'l-init', timestamp, type: 'SYSTEM', text: 'Breeder Audit Logs reset by administrator.' }]);
              }} 
              className="px-2.5 py-1 bg-gray-900 hover:bg-gray-850 text-gray-400 hover:text-white rounded text-[9px] font-bold uppercase tracking-wider transition-all"
            >
              Clear Feed
            </button>
          </div>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-2 no-scrollbar">
            {auditLogs.length === 0 ? (
              <p className="text-gray-500 italic">No terminal logs recorded yet. Perform dashboard activities to trace live events...</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-2 leading-relaxed">
                  <span className="text-gray-500">[{log.timestamp}]</span>
                  <span className={`font-black px-1.5 rounded text-[8px] tracking-wide inline-block ${
                    log.type === 'SYSTEM' ? 'bg-blue-950 text-blue-400 border border-blue-900/30' :
                    log.type === 'DB' ? 'bg-purple-950 text-purple-400 border border-purple-900/30' :
                    log.type === 'SMTP' ? 'bg-yellow-950 text-yellow-400 border border-yellow-900/30' :
                    log.type === 'LITTER' ? 'bg-amber-950 text-amber-400 border border-amber-900/30' :
                    log.type === 'MEDICAL' ? 'bg-teal-950 text-teal-400 border border-teal-900/30' :
                    log.type === 'RESERVATION' ? 'bg-rose-950 text-rose-400 border border-rose-900/30' :
                    'bg-emerald-950 text-emerald-400 border border-emerald-900/30'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-gray-300 font-sans">{log.text}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </section>
    </div>
  );
}
