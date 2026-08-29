import { 
  Home, Heart, Award, ShieldCheck, Sparkles, BookOpen, 
  HelpCircle, Star, Image, Users, MessageSquare, ClipboardCheck, 
  Activity, Newspaper, Compass, Shield
} from 'lucide-react';

export interface PageInfo {
  id: string;
  label: string;
  shortLabel?: string;
  category: 'core' | 'program' | 'discovery' | 'action';
  categoryLabel: string;
  description: string;
  icon: any;
  prevPage?: string;
  nextPage?: string;
}

export const ALL_PAGES: PageInfo[] = [
  {
    id: 'home',
    label: 'Home',
    shortLabel: 'Home',
    category: 'core',
    categoryLabel: 'Main',
    description: 'Welcome to Golden Paws Home, champion lineages & health standards.',
    icon: Home,
    nextPage: 'about',
  },
  {
    id: 'about',
    label: 'Our Experience & Philosophy',
    shortLabel: 'Experience',
    category: 'program',
    categoryLabel: 'Breeder Program',
    description: '25+ years of dedicated breeding, BioSens ENS socialization, and ranch ethics.',
    icon: Award,
    prevPage: 'home',
    nextPage: 'parents',
  },
  {
    id: 'parents',
    label: 'Breeder Lines & Lineages',
    shortLabel: 'Parents',
    category: 'program',
    categoryLabel: 'Breeder Program',
    description: 'Meet our OFA Good/Excellent certified Sires & Dams with verifiable 5-gen pedigrees.',
    icon: ShieldCheck,
    prevPage: 'about',
    nextPage: 'puppies',
  },
  {
    id: 'puppies',
    label: 'Available Puppies',
    shortLabel: 'Puppies',
    category: 'core',
    categoryLabel: 'Main',
    description: 'Browse our current litter candidates with personality scores, photos, and health clearances.',
    icon: Heart,
    prevPage: 'parents',
    nextPage: 'process',
  },
  {
    id: 'process',
    label: 'Adoption Process & Protocol',
    shortLabel: 'Process',
    category: 'program',
    categoryLabel: 'Breeder Program',
    description: 'Step-by-step guidance from initial application and interview to gotcha day.',
    icon: Compass,
    prevPage: 'puppies',
    nextPage: 'matcher',
  },
  {
    id: 'matcher',
    label: 'Puppy Matcher Quiz',
    shortLabel: 'Match Quiz',
    category: 'discovery',
    categoryLabel: 'Tools & Discovery',
    description: 'Interactive lifestyle matching algorithm to find your ideal temperament pairing.',
    icon: Sparkles,
    prevPage: 'process',
    nextPage: 'health',
  },
  {
    id: 'health',
    label: 'Health & Genetics Audit',
    shortLabel: 'Health Audit',
    category: 'program',
    categoryLabel: 'Breeder Program',
    description: 'Comprehensive transparency of hips, elbows, eyes, heart, and genetic clearances.',
    icon: Activity,
    prevPage: 'matcher',
    nextPage: 'resources',
  },
  {
    id: 'resources',
    label: 'Care Guides & Resources',
    shortLabel: 'Resources',
    category: 'discovery',
    categoryLabel: 'Tools & Discovery',
    description: 'Vet-approved nutrition protocols, grooming schedules, and puppy proofing guides.',
    icon: BookOpen,
    prevPage: 'health',
    nextPage: 'journal',
  },
  {
    id: 'journal',
    label: 'Ranch Journal & Updates',
    shortLabel: 'Journal',
    category: 'discovery',
    categoryLabel: 'Tools & Discovery',
    description: 'Weekly ranch dispatches, milestones, developmental photos, and breeder notes.',
    icon: Newspaper,
    prevPage: 'resources',
    nextPage: 'gallery',
  },
  {
    id: 'gallery',
    label: 'Photo & Video Gallery',
    shortLabel: 'Gallery',
    category: 'discovery',
    categoryLabel: 'Tools & Discovery',
    description: 'High-resolution photo albums of ranch life, nursery milestones, and happy adopters.',
    icon: Image,
    prevPage: 'journal',
    nextPage: 'reviews',
  },
  {
    id: 'reviews',
    label: 'Adopter Reviews & Testimonials',
    shortLabel: 'Reviews',
    category: 'discovery',
    categoryLabel: 'Tools & Discovery',
    description: 'Read heartfelt stories and verified 5-star testimonials from our golden families.',
    icon: Star,
    prevPage: 'gallery',
    nextPage: 'faqs',
  },
  {
    id: 'faqs',
    label: 'Frequently Asked Questions',
    shortLabel: 'FAQs',
    category: 'discovery',
    categoryLabel: 'Tools & Discovery',
    description: 'Answers to all questions about health guarantees, deposits, visits, and shipping.',
    icon: HelpCircle,
    prevPage: 'reviews',
    nextPage: 'waitlist',
  },
  {
    id: 'waitlist',
    label: 'Master Waitlist Status',
    shortLabel: 'Waitlist',
    category: 'action',
    categoryLabel: 'Take Action',
    description: 'Real-time transparent waitlist tracking and position lookup.',
    icon: Users,
    prevPage: 'faqs',
    nextPage: 'contact',
  },
  {
    id: 'contact',
    label: 'Contact Katrina & Breeder Team',
    shortLabel: 'Contact',
    category: 'action',
    categoryLabel: 'Take Action',
    description: 'Reach out for inquiries, ranch visit requests, and direct communication.',
    icon: MessageSquare,
    prevPage: 'waitlist',
    nextPage: 'apply',
  },
  {
    id: 'apply',
    label: 'Adoption Application & Reservation',
    shortLabel: 'Apply Now',
    category: 'action',
    categoryLabel: 'Take Action',
    description: 'Start your official adoption profile to reserve your puppy or join our waitlist.',
    icon: ClipboardCheck,
    prevPage: 'contact',
    nextPage: 'home',
  },
  {
    id: 'breeder-portal',
    label: 'Breeder Management Console',
    shortLabel: 'Console',
    category: 'action',
    categoryLabel: 'Take Action',
    description: 'Internal administrative dashboard for litter management, applications, and settings.',
    icon: Shield,
    prevPage: 'home',
    nextPage: 'home',
  }
];

export const PAGE_MAP: Record<string, PageInfo> = ALL_PAGES.reduce((acc, page) => {
  acc[page.id] = page;
  return acc;
}, {} as Record<string, PageInfo>);
