export type PuppyStatus = 'Available' | 'Reserved' | 'Adopted';

export interface Puppy {
  id: string;
  name: string;
  birthDate: string;
  gender: 'Male' | 'Female';
  color: 'Light Golden' | 'Cream' | 'Honey Golden' | 'Red Golden';
  price: number;
  weight: string;
  image: string;
  status: PuppyStatus;
  description: string;
  characteristics: string[];
  parents: {
    sire: string; // Father
    dam: string;  // Mother
  };
  registrations: string[]; // e.g. "AKC", "OFA Cleared", "Microchipped"
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number; // 1 to 5
  date: string;
  text: string;
  puppyName: string;
  tags: string[];
}

export interface WaitlistEntry {
  id: string;
  name: string;
  dateJoined: string;
  position: number;
  status: 'Pending Review' | 'Approved' | 'Litter Assigned' | 'Completed';
  puppyPreference: string;
  estimatedLitterDate: string;
}

export interface AdoptionApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experienceLevel: 'First-time Owner' | 'Have owned before' | 'Experienced Breeder';
  hasOtherPets: boolean;
  petDetails?: string;
  hasYard: boolean;
  yardFenced: boolean;
  workSetup: 'Work from home' | 'Full-time out of home' | 'Part-time';
  genderPreference: 'Male' | 'Female' | 'No Preference';
  colorPreference: string[];
  notes?: string;
  submittedAt: string;
  status: 'Reviewing' | 'Contacted' | 'Approved' | 'Waitlist';
  
  // Extended Fields for the upgraded application
  residentialAddress?: string;
  contactMethod?: string;
  housingType?: string;
  ownOrRent?: string;
  landlordInfo?: string;
  fenceDetails?: string;
  noYardPlan?: string;
  householdMembers?: string;
  hasAllergies?: boolean;
  allAgree?: boolean;
  preparedAdoptionFee?: boolean;
  agreeReservationFee?: boolean;
  preparedOngoingExpenses?: boolean;
  priorBreeds?: string;
  hoursAlone?: string;
  dayLocation?: string;
  nightLocation?: string;
  trainingPlan?: string;
  unableToKeepCircumstances?: string;
  signature?: string;
  signatureDate?: string;
}

export interface BreederDoc {
  id: string;
  title: string;
  category: 'Contract' | 'Health Guarantee' | 'Care Guide' | 'Breeding Registry';
  description: string;
  content: string; // Plain text or markdown of sample content
}

export interface FAQ {
  question: string;
  answer: string;
  category: 'Health' | 'Adoption' | 'Pricing' | 'Puppy Care';
}

export interface ParentDog {
  id: string;
  name: string;
  role: 'Sire' | 'Dam';
  breed: string;
  weight: string;
  color: string;
  image: string;
  personality: string;
  healthClearances: {
    hips: string;
    elbows: string;
    eyes: string;
    heart: string;
    genetics: string;
  };
  achievements: string[];
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: 'New Puppy Tips' | 'Health & Wellness' | 'Training' | 'Nutrition';
  readTime: string;
  content: string;
  image: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: 'Litter' | 'Alumni' | 'Ranch Life';
  aspectRatio: 'square' | 'video' | 'tall';
}
