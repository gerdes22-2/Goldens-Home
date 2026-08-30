import { Puppy, Review, WaitlistEntry, FAQ, BreederDoc, ParentDog, ResourceItem, GalleryImage } from './types';

export const DEFAULT_PARENTS: ParentDog[] = [
  {
    id: 's1',
    name: 'GCH Rusty of Golden Paws',
    role: 'Sire',
    breed: 'Golden Retriever',
    weight: '75 lbs',
    color: 'Red Golden',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWgaPeVYeT9FB11SnKgeFCOHEiHqZjTARPNLo4GSnEWw&s=10',
    personality: 'Highly athletic and extremely affectionate. Rusty is a field champion with a heart of gold. He loves dock diving and curling up with his family in the evening.',
    healthClearances: {
      hips: 'OFA Excellent',
      elbows: 'OFA Normal',
      eyes: 'Normal (yearly)',
      heart: 'Clearance (DVM)',
      genetics: 'Panel Clear (ICT/PRA)'
    },
    achievements: ['AKC Grand Champion', 'Field Trial Winner', 'Best of Breed 2024']
  },
  {
    id: 'd1',
    name: 'Lady Bella of Amber Acres',
    role: 'Dam',
    breed: 'Golden Retriever',
    weight: '62 lbs',
    color: 'Honey Golden',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdK7ddClHyzsLsb8nBUBTa7gitdyV7un8UveZIF6K65Q&s=10',
    personality: 'The perfect mother. Bella has a maternal instinct that is second to none. She is incredibly gentle, patient, and possesses an "off-switch" that makes her the perfect house companion.',
    healthClearances: {
      hips: 'OFA Good',
      elbows: 'OFA Normal',
      eyes: 'Normal (yearly)',
      heart: 'Clearance (DVM)',
      genetics: 'Panel Clear (ICT/PRA)'
    },
    achievements: ['Therapy Dog Certified', 'CGC Title Holder', 'Excellent Maternal Instinct']
  },
  {
    id: 's2',
    name: 'Sir Sterling of Sunny Hills',
    role: 'Sire',
    breed: 'English Cream Golden Retriever',
    weight: '72 lbs',
    color: 'Cream',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhYqIPh_lv__rFkV1mJlIXK_KTtqCHMAPRH8Nn1L2LFw&s',
    personality: 'A true gentleman. Sterling is known for his stoic yet loving personality. He is very observant and incredibly easy to train, often learning new commands in just 2-3 repetitions.',
    healthClearances: {
      hips: 'OFA Good',
      elbows: 'OFA Normal',
      eyes: 'Normal (yearly)',
      heart: 'Clearance (DVM)',
      genetics: 'Panel Clear (ICT/PRA)'
    },
    achievements: ['Import Heritage Lineage', 'CGC Title Holder', 'Perfect Social Temperament']
  }
];

export const BREEDER_JOURNAL = [
  {
    id: 'j1',
    date: 'June 15, 2024',
    title: 'New Puppies Arriving Soon',
    content: 'We are excited to announce that Luna and Oliver are expecting a litter of English Creams in early July! Early waitlist applications are now open.',
    type: 'Update'
  },
  {
    id: 'j2',
    date: 'June 10, 2024',
    title: 'Sunday Socialization Hour',
    content: 'The current litter is officially 6 weeks old! We spent the morning introduces them to new textures and safe play equipment in the valley garden.',
    type: 'Ranch Life'
  },
  {
    id: 'j3',
    date: 'June 5, 2024',
    title: 'Health Clearance Success',
    content: 'Great news: Rusty has passed his OFA cardiac and elbow evaluations with "Excellent" marks! Breeding for health excellence continues.',
    type: 'Milestone'
  }
];

export const CARE_RESOURCES: ResourceItem[] = [
  {
    id: 'res1',
    title: 'The First 48 Hours: Puppy Homecoming',
    description: 'A step-by-step guide to helping your new Golden Retriever adjust to their new environment with minimal stress.',
    category: 'New Puppy Tips',
    readTime: '5 min',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs8rHhS0_e7yxIJFkUf-k7683q54zjPhXhpgzI7RF5-g&s=10',
    content: 'The first 48 hours are crucial for establishing trust and routine...'
  },
  {
    id: 'res2',
    title: 'Nutritional Needs of Growing Goldens',
    description: 'Why large-breed puppy food matters and how to avoid the "growth spurts" that can impact joint health.',
    category: 'Nutrition',
    readTime: '8 min',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUSLgf8pK_Pecv5eDy4AP3w_jkp7fLGi52McuUmQZ-ww&s=10',
    content: 'Feeding a Golden Retriever puppy requires a balance of calcium and phosphorus...'
  },
  {
    id: 'res3',
    title: 'Crate Training Without the Tears',
    description: 'Expert techniques to make the crate a happy sanctuary rather than a confinement tool.',
    category: 'Training',
    readTime: '6 min',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBtlSDqNbCfRArbnRLpybDcIH68MrxEOBWWTJwYmwP-g&s=10',
    content: 'Consistency is key when it comes to crate training...'
  }
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { 
    id: 'g-sire1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWgaPeVYeT9FB11SnKgeFCOHEiHqZjTARPNLo4GSnEWw&s=10', 
    caption: 'GCH Rusty of Golden Paws — AKC Grand Champion Sire & Certified OFA Field Lineage.', 
    category: 'Parents & Heritage', 
    aspectRatio: 'tall' 
  },
  { 
    id: 'g-dam1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdK7ddClHyzsLsb8nBUBTa7gitdyV7un8UveZIF6K65Q&s=10', 
    caption: 'Lady Bella of Amber Acres — Foundation Dam known for gentle maternal nature and obedience.', 
    category: 'Parents & Heritage', 
    aspectRatio: 'square' 
  },
  { 
    id: 'g-sire2', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhYqIPh_lv__rFkV1mJlIXK_KTtqCHMAPRH8Nn1L2LFw&s', 
    caption: 'Sir Sterling of Sunny Hills — English Cream Sire with calm temperaments and champion bloodlines.', 
    category: 'Parents & Heritage', 
    aspectRatio: 'tall' 
  },
  { 
    id: 'g-play1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTxgYv_xAXM-OX64GhGacyr1qnEekffPlIQbaUjsFueQ&s', 
    caption: 'Pasture Exploration — Daily energetic play and social discovery across our private ranch fields.', 
    category: 'Ranch Life', 
    aspectRatio: 'square' 
  },
  { 
    id: 'g-portrait1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs8rHhS0_e7yxIJFkUf-k7683q54zjPhXhpgzI7RF5-g&s=10', 
    caption: 'Gentle Soul — A quiet moment demonstrating our hallmark calm eye contact and gentle disposition.', 
    category: 'Training & Care', 
    aspectRatio: 'tall' 
  },
  { 
    id: 'g-sit1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBtlSDqNbCfRArbnRLpybDcIH68MrxEOBWWTJwYmwP-g&s=10', 
    caption: 'Obedience & Focus — Early grass recall and sit-stay milestones in the ranch garden.', 
    category: 'Training & Care', 
    aspectRatio: 'square' 
  },
  { 
    id: 'g-field1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHcZ9N3bTXycZ_SoDn8od_fPWAktFVGVfPeBrsCrfXgw&s=10', 
    caption: 'Autumn Field Run — Athletic conformation, rich golden coat, and boundless spirit.', 
    category: 'Ranch Life', 
    aspectRatio: 'video' 
  },
  { 
    id: 'g-happy1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUSLgf8pK_Pecv5eDy4AP3w_jkp7fLGi52McuUmQZ-ww&s=10', 
    caption: 'Pure Joy — Sunny afternoon retrieval exercises strengthening natural instincts.', 
    category: 'Ranch Life', 
    aspectRatio: 'square' 
  },
  { 
    id: 'g-profile1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6q0APseNz6pgqBofEdx--iROWFLaavcGapWpMQG6knA&s=10', 
    caption: 'Genomic Purity — Classic broad skull, warm brown eyes, and perfect breed standard head study.', 
    category: 'Parents & Heritage', 
    aspectRatio: 'square' 
  },
  { 
    id: 'g-run1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP8BVGkmJcXofy_kqhSdf_N4A0u6dFN7tTXiwb5Ch5cg&s=10', 
    caption: 'Valley Run — Full stride across our fenced green pastures during morning exercise.', 
    category: 'Ranch Life', 
    aspectRatio: 'video' 
  },
  { 
    id: 'g-stand1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9HmdGl_VCy9MpdHhRu6CGZZjrARbk0YRn4yw0OES8Gg&s=10', 
    caption: 'Ranch Watch — Confident and alert, embodying the steadfast loyalty of the Golden Retriever.', 
    category: 'Ranch Life', 
    aspectRatio: 'tall' 
  },
  { 
    id: 'g-alumni1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbtX00h5shPCA5pr_nyVy-EZCMcMMN4GiG60NNq2KLQA&s=10', 
    caption: 'Alumni Graduate — Thriving in his forever home with loving adopters in Seattle.', 
    category: 'Alumni', 
    aspectRatio: 'square' 
  },
  { 
    id: 'g-noble1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN5u5Ai_ZmnIcjCl1CNd79Qr3wsbylZDvWC_9KWyBYjQ&s', 
    caption: 'Champion Stance — Perfect skeletal symmetry and balanced bone density.', 
    category: 'Parents & Heritage', 
    aspectRatio: 'tall' 
  },
  { 
    id: 'g-studio1', 
    url: 'https://img77.uenicdn.com/image/upload/v1751916218/business/6e344da1-8157-413b-8f65-3ab350ddf993.jpg', 
    caption: 'Sanctuary Portrait — Signature Golden Paws coat feathering and warm expression.', 
    category: 'Parents & Heritage', 
    aspectRatio: 'square' 
  },
  { 
    id: 'g-pup1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqrI5bUaiXQtIoMFeGaA-bHIfIqYuPAha8vecZKzV7cA&s=10', 
    caption: 'Early Socialization — Confident sensory introduction during the foundational BioSens weeks.', 
    category: 'Training & Care', 
    aspectRatio: 'square' 
  },
  { 
    id: 'g-head1', 
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGgGZOrRolcDwZ58AOfcfsMw2aUjsH0pBT-QgJQfJ86g&s=10', 
    caption: 'Devoted Expression — Intelligent, gentle, and deeply tuned to human emotion.', 
    category: 'Parents & Heritage', 
    aspectRatio: 'square' 
  }
];

export const DEFAULT_PUPPIES: Puppy[] = [
  {
    id: 'p1',
    name: 'Pink Girl',
    birthDate: '2026-05-13',
    gender: 'Female',
    color: 'Honey Golden',
    price: 850,
    weight: '12.4 lbs',
    image: '/images/breeder_two_fluffy_pups_1782303458269.jpg',
    status: 'Available',
    description: 'Pink Girl is the absolute sweet-heart of the litter. She is incredibly calm, observant, and loves to cuddle with our kids during our evening ranch walks.',
    characteristics: ['Gentle', 'Cuddle-Bug', 'Extremely Human-Focused', 'Great with Kids'],
    parents: {
      sire: 'GCH Rusty of Golden Paws (OFA Excellent, Eyes Normal)',
      dam: 'Lady Bella of Amber Acres (OFA Good, Cardiological Normal)'
    },
    registrations: ['AKC Registered', 'OFA Heart & Hips Certified', '1-Year Health Guarantee', 'Microchipped']
  },
  {
    id: 'p2',
    name: 'Blue Boy',
    birthDate: '2026-05-13',
    gender: 'Male',
    color: 'Cream',
    price: 850,
    weight: '13.1 lbs',
    image: '/images/puppy_chewing_bone_1782303411084.jpg',
    status: 'Available',
    description: 'Blue Boy is a bold, energetic explorer! He loves to retrieve tennis balls and is the first to greet us at the puppy gate every morning.',
    characteristics: ['Adventurous', 'High Intelligence', 'Bold', 'Quick Learner'],
    parents: {
      sire: 'GCH Rusty of Golden Paws (OFA Excellent, Eyes Normal)',
      dam: 'Lady Bella of Amber Acres (OFA Good, Cardiological Normal)'
    },
    registrations: ['AKC Registered', 'OFA Elbows & Hips Certified', '1-Year Health Guarantee', 'Microchipped']
  },
  {
    id: 'p3',
    name: 'Yellow Girl',
    birthDate: '2026-05-13',
    gender: 'Female',
    color: 'Honey Golden',
    price: 850,
    weight: '12.8 lbs',
    image: '/images/breeder_three_puppies_1782303426621.jpg',
    status: 'Available',
    description: 'Yellow Girl is a confident, happy pup with a lovely, soft-spoken personality. She is gentle in play and very eager to please.',
    characteristics: ['Eager to Please', 'Attentive', 'Affectionate', 'Soft-spoken'],
    parents: {
      sire: 'GCH Rusty of Golden Paws (OFA Excellent, Eyes Normal)',
      dam: 'Lady Bella of Amber Acres (OFA Good, Cardiological Normal)'
    },
    registrations: ['AKC Registered', 'OFA Heart & Hips Certified', '1-Year Health Guarantee', 'Microchipped']
  },
  {
    id: 'p4',
    name: 'Green Boy',
    birthDate: '2026-05-13',
    gender: 'Male',
    color: 'Cream',
    price: 850,
    weight: '13.3 lbs',
    image: '/images/puppies_witch_hats_1782303440786.jpg',
    status: 'Available',
    description: 'Green Boy is a stocky, playful little gentleman. He is very observant, calm, and is already showing excellent focus in basic training sessions.',
    characteristics: ['Social Butterfly', 'Gentle Mouth', 'Calm Temperament', 'Great with Cats'],
    parents: {
      sire: 'GCH Rusty of Golden Paws (OFA Excellent, Eyes Normal)',
      dam: 'Lady Bella of Amber Acres (OFA Good, Cardiological Normal)'
    },
    registrations: ['AKC Registered', 'OFA Heart & Hips Certified', '1-Year Health Guarantee', 'Microchipped']
  },
  {
    id: 'p5',
    name: 'Red Girl',
    birthDate: '2026-05-13',
    gender: 'Female',
    color: 'Red Golden',
    price: 850,
    weight: '12.5 lbs',
    image: '/images/puppy_red_harness_1782218136476.jpg',
    status: 'Available',
    description: 'Red Girl is a spunky little firecracker! With her beautiful red coat and high energy, she is perfect for an active family looking for a hiking companion.',
    characteristics: ['High Stamina', 'Playful', 'Very Smart', 'Extremely Affectionate'],
    parents: {
      sire: 'GCH Rusty of Golden Paws (OFA Excellent, Eyes Normal)',
      dam: 'Lady Bella of Amber Acres (OFA Good, Cardiological Normal)'
    },
    registrations: ['AKC Registered', 'OFA Heart & Hips Certified', '1-Year Health Guarantee', 'Microchipped']
  },
  {
    id: 'p6',
    name: 'White Boy',
    birthDate: '2026-05-13',
    gender: 'Male',
    color: 'Cream',
    price: 850,
    weight: '13.0 lbs',
    image: '/images/three_puppies_table_1782218102698.jpg',
    status: 'Available',
    description: 'White Boy is incredibly laid-back and enjoys his nap times. He has a wonderful, gentle play style and gets along well with all his siblings.',
    characteristics: ['Very Sweet', 'Laid-Back', 'Gentle Playstyle', 'Human-Focused'],
    parents: {
      sire: 'GCH Rusty of Golden Paws (OFA Excellent, Eyes Normal)',
      dam: 'Lady Bella of Amber Acres (OFA Good, Cardiological Normal)'
    },
    registrations: ['AKC Registered', 'OFA Heart & Hips Certified', '1-Year Health Guarantee', 'Microchipped']
  },
  {
    id: 'p7',
    name: 'Black Boy',
    birthDate: '2026-05-13',
    gender: 'Male',
    color: 'Honey Golden',
    price: 850,
    weight: '12.9 lbs',
    image: '/images/breeder_dozen_puppies_grass_1782302919140.jpg',
    status: 'Available',
    description: 'Black Boy is a curious, high-energy pup who loves to explore every inch of the ranch. He is already learning to follow basic commands.',
    characteristics: ['Inquisitive', 'Active', 'Smart', 'Great with Kids'],
    parents: {
      sire: 'GCH Rusty of Golden Paws (OFA Excellent, Eyes Normal)',
      dam: 'Lady Bella of Amber Acres (OFA Good, Cardiological Normal)'
    },
    registrations: ['AKC Registered', 'OFA Heart & Hips Certified', '1-Year Health Guarantee', 'Microchipped']
  }
];

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Sarah Edwards',
    location: 'Denver, CO',
    rating: 5,
    date: '2026-05-10',
    text: 'We got our beautiful cream retriever "Archie" from Golden Paws Home last winter. The breeder experience was incredible from start to finish. We were updated weekly with pictures, vet reports, and social developments. Archie is incredibly healthy, smart, and was practically housebroken when he arrived. Truly exceptional breeders!',
    puppyName: 'Archie (Formerly Sunny)',
    tags: ['Health Clearances', 'Breeder Support', 'Excellent Temperament']
  },
  {
    id: 'r2',
    author: 'Marcus & Julianne Vance',
    location: 'Portland, OR',
    rating: 5,
    date: '2026-04-20',
    text: 'Reputable, clean, professional, and deeply passionate. We visited their lovely acreage to pick up our girl Ellie. Golden Paws is not a kennel; their dogs are treated like royalty, living in clean environments with pristine health standards. Undergoing genetic checkups and orthopedic evaluation guarantees peace of mind. Highly recommended!',
    puppyName: 'Ellie',
    tags: ['Beautiful Facility', 'Health Clearances', 'Well Socialized']
  },
  {
    id: 'r3',
    author: 'The Peterson Family',
    location: 'San Francisco, CA',
    rating: 5,
    date: '2026-05-28',
    text: 'Winston is an absolute star. Our pediatrician remarked how perfectly socialized Winston is with our toddlers. This speaks volumes about Golden Paws early neurological stimulation procedures. Thank you CIara and the team for being there at all times of day to guide us on early nutrition!',
    puppyName: 'Winston (Formerly Pip)',
    tags: ['Great with Kids', 'Weekly Updates', 'Lifetime Support']
  },
  {
    id: 'r4',
    author: 'Emily Thorne',
    location: 'Austin, TX',
    rating: 5,
    date: '2026-06-02',
    text: 'Extremely professional contracts and clear heath standards. As a veterinary technician, I am highly skeptical of breeders, but Golden Paws excels. They provided AKC registry, certified OFA hip clearances for parents, and extensive panels. The pup is healthy, flawless, and possesses a gorgeous honey golden coat!',
    puppyName: 'Milo',
    tags: ['OFA Verified', 'Highly Professional', 'Vet Approved']
  },
  {
    id: 'r5',
    author: 'The Hendersons',
    location: 'Seattle, WA',
    rating: 5,
    date: '2026-07-15',
    text: 'We could not be happier with our pup, Cooper. The breeder team at Golden Paws was incredibly communicative throughout the entire process, even after Cooper was home. Their dedication to health and temperament is evident every day.',
    puppyName: 'Cooper',
    tags: ['Responsive', 'Healthy', 'Well Adjusted']
  },
  {
    id: 'r6',
    author: 'Michael & Jennifer B.',
    location: 'Chicago, IL',
    rating: 5,
    date: '2026-08-01',
    text: 'Amazing experience from start to finish. Our puppy, Luna, is so sweet and smart. The health package and information provided by Ciara and her team made our transition so easy. We feel so lucky to have found them!',
    puppyName: 'Luna',
    tags: ['Great Service', 'Supportive', 'Healthy']
  },
  {
    id: 'r7',
    author: 'James R.',
    location: 'Miami, FL',
    rating: 5,
    date: '2026-08-20',
    text: 'If you are looking for a high-quality Golden Retriever, look no further. The commitment to health and temperament is second to none. We are so in love with our new family member.',
    puppyName: 'Sunny',
    tags: ['OFA Verified', 'Excellence', 'Professional']
  },
  {
    id: 'r8',
    author: 'Laura K.',
    location: 'Boston, MA',
    rating: 5,
    date: '2026-08-25',
    text: 'Finding a breeder this transparent is rare. We received weekly videos of our puppy "Daisy" growing. Her health, temperament, and social skills are just perfect!',
    puppyName: 'Daisy',
    tags: ['Well Socialized', 'Weekly Updates', 'Healthy']
  },
  {
    id: 'r9',
    author: 'The Wilsons',
    location: 'San Diego, CA',
    rating: 5,
    date: '2026-08-28',
    text: 'Golden Paws is the gold standard! Our puppy "Max" has been a joy. The support and health protocols they provide are simply unmatched.',
    puppyName: 'Max',
    tags: ['Lifetime Support', 'Vet Approved', 'Excellence']
  }
];

export const DEFAULT_WAITLIST: WaitlistEntry[] = [
  {
    id: 'w1',
    name: 'Sarah Jenkins',
    dateJoined: '2026-02-15',
    position: 1,
    status: 'Litter Assigned',
    puppyPreference: 'Cream Female',
    estimatedLitterDate: 'Summer Litters (July 2026)'
  },
  {
    id: 'w2',
    name: 'David Miller',
    dateJoined: '2026-03-01',
    position: 2,
    status: 'Litter Assigned',
    puppyPreference: 'Light Golden Male/Female',
    estimatedLitterDate: 'Summer Litters (July 2026)'
  },
  {
    id: 'w3',
    name: 'Elena Rostova',
    dateJoined: '2026-03-24',
    position: 3,
    status: 'Approved',
    puppyPreference: 'Honey Golden Female',
    estimatedLitterDate: 'Summer Litters (July 2026)'
  },
  {
    id: 'w4',
    name: 'Jonathan Cross',
    dateJoined: '2026-04-05',
    position: 4,
    status: 'Approved',
    puppyPreference: 'Red Golden Male',
    estimatedLitterDate: 'Autumn Litters (Oct 2026)'
  },
  {
    id: 'w5',
    name: 'Amara Lopez',
    dateJoined: '2026-04-20',
    position: 5,
    status: 'Approved',
    puppyPreference: 'No Preference',
    estimatedLitterDate: 'Autumn Litters (Oct 2026)'
  },
  {
    id: 'w6',
    name: 'Robert & Clara Chen',
    dateJoined: '2026-05-15',
    position: 6,
    status: 'Pending Review',
    puppyPreference: 'Cream Male',
    estimatedLitterDate: 'Autumn Litters (Oct 2026)'
  },
  {
    id: 'w7',
    name: 'Jackson Miller',
    dateJoined: '2026-06-01',
    position: 7,
    status: 'Approved',
    puppyPreference: 'Cream Female',
    estimatedLitterDate: 'Autumn Litters (Oct 2026)'
  },
  {
    id: 'w8',
    name: 'Emily Rose',
    dateJoined: '2026-06-15',
    position: 8,
    status: 'Pending Review',
    puppyPreference: 'Golden Male',
    estimatedLitterDate: 'Winter Litters (Jan 2027)'
  },
  {
    id: 'w9',
    name: 'Thomas & Linda Green',
    dateJoined: '2026-07-01',
    position: 9,
    status: 'Pending Review',
    puppyPreference: 'Honey Golden Female',
    estimatedLitterDate: 'Winter Litters (Jan 2027)'
  }
];

export const FAQS: FAQ[] = [
  {
    category: 'Adoption',
    question: 'How does your adoption application and waitlist system work?',
    answer: 'Adopting a Golden Paws puppy involves a simple three-step process: First, complete our online Adoption Application form. We review responses within 48 hours to ensure our puppies go to healthy, supporting homes. Once approved, you are invited to join our Master Waitlist via custom reservation. When a matched litter is born, selections open in waitlist order.'
  },
  {
    category: 'Health',
    question: 'What health guarantees and registries do your Golden Retrievers carry?',
    answer: 'Every sire and dam in our breeding program undergoes strict health screenings including Orthopedic Foundation for Animals (OFA) evaluations for hips/elbows, yearly CAER structural eye exams, and advanced clearance for congenital heart disease. Puppies are certified by local vets, microchipped with lifetime pre-recovery, and covered by an official 1-year health guarantee contract.'
  },
  {
    category: 'Pricing',
    question: 'What is the pricing for a Golden Paws puppy, and what is included?',
    answer: 'Our puppies are priced at a flat rate of $850. Your adoption pricing is fully transparent and includes: AKC Registry certification papers, veterinary check-sheets, age-appropriate vaccinations, deworming, microchipping, genetic clear reports, 1-year contract guarantee, a starter kit (premium food, mommy scent blanket, basic chew-bone), and lifetime counselor support.'
  },
  {
    category: 'Puppy Care',
    question: 'Do you offer delivery or flight nannies for out-of-state families?',
    answer: 'Yes! While we always encourage parents to physically pick up their puppy at our private ranch, we also specialize in safe out-of-state transport. We have vetted flight nannies who personally keep your puppy in the cabin under-seat at all times, catering to them during travel, and delivering them safely to your airport terminal. Real-time GPS/video updates are provided!'
  },
  {
    category: 'Health',
    question: 'At what age can our puppy come home?',
    answer: 'Puppies go home strictly between 8 to 10 weeks of age. This ensures they have completed crucial early developmental phases with mothers, sibling socializations, early neurological stimulation protocols, and are fully independent with standard kibbles.'
  }
];

export const DOCUMENTS: BreederDoc[] = [
  {
    id: 'doc1',
    title: 'Golden Paws Official Adoption Agreement & Pet Contract',
    category: 'Contract',
    description: 'A legally binding agreement outlining health promises, spay/neuter guidelines, and owner guarantees to maintain high quality care.',
    content: `GOLDEN PAWS HOME - PUPPY PURCHASE CONTRACT & AGREEMENT

This agreement is entered into by and between Golden Paws Home ("Seller") and the purchasing party ("Buyer").

1. PUPPY DESCRIPTION
- Breed: Purebred Golden Retriever
- Sex: _________  | Date of Birth: ________________
- Sire Name: _________________________ | Dam Name: _________________________

2. PURCHASING CONDITIONS & DEPOSIT
- The purchase price is $___________ (USD).
- An application deposit of $500 holds the buyer's rank position. Deposits are non-refundable but transferable to subsequent litters for up to 2 years.

3. REPUTABLE HEALTH WARRANTY
- Seller certifies that the puppy is in healthy condition at transfer. Buyer has 72 hours from pick-up to have the puppy inspected by a licensed veterinarian.
- A 1-Year Genetic Health Guarantee covers crippling congenital hip dysplasia or irreversible systemic disease. If confirmed by certified experts, Seller will provide a replacement puppy or cover vet services up to the purchase price.

4. HEALTH CARE AGREEMENT & LIABILITIES
- Buyer agrees to feed premium nutritional diet, complete scheduled core vaccinations at 12 & 16 weeks, and maintain monthly deworming/heartworm controls.
- Buyer commits that this puppy will never be chained, raised in unsafe environments, or surrendered to regular shelters. If the Buyer can no longer keep this dog at any phase of life, it MUST be returned to the Seller (owner protection initiative).

5. REGISTRY LIMITATION / SPAY & NEUTER
- Unless explicitly sold with limited Breeding Authorization, this puppy is sold under AKC LIMITED REGISTRATION. Breeding is strictly prohibited.
- Buyer agrees to have the dog spayed or neutered between 12 and 18 months of age, providing official veterinary completion proof to Seller.

IN WITNESS WHEREOF, both parties agree to terms:

Seller Signature: _______________________ Date: ___________
Buyer Signature:  _______________________ Date: ___________`
  },
  {
    id: 'doc2',
    title: '1-Year Genetic & Orthopedic Health Guarantee Certificate',
    category: 'Health Guarantee',
    description: 'Comprehensive warranty detailing specific congenital anomalies checked, hip/elbow guidelines, and veterinary verification workflows.',
    content: `GOLDEN PAWS 1-YEAR HEALTH STANDARDS WARRANTY

Golden Paws Home stands firmly behind our lineage. This warranty certifies that our selective parent screening minimizes genetic defects to the highest current standards.

COVERED ANOMALIES & CONDITIONS:
- Severe Congenital Heart Anomalies (grades 4-6 diagnosed by a Board-Certified Canine Cardiologist).
- Inherited eye conditions verified prior to 1 year of age by certified canine ophthalmologists.
- Crippling hip/elbow skeletal dysplasia diagnosed by OFA experts before the dog turns one year of age.

TERMS & LIMITATIONS:
1. Under no circumstances will Golden Paws Home cover conditions caused by nutritional negligence, sudden structural injury, high-impact jump training under 1 year, or systemic environmental conditions.
2. The dog must have been kept on veterinarian-prescribed heartworm controls and fed high-grade foods suitable for Golden Retriever large-breed structural growth.
3. If a clear genetic defect is identified and certified by two independent medical specialists, Buyer may choose:
  - Option A: To receive a replacement puppy of equal value from the next available equivalent litter. Buyer may keep the original dog (we do not separate loved pets).
  - Option B: To keep the dog and be reimbursed for verified surgical/veterinary costs directly related to the congenital anomaly, up to the full initial purchase price.

We treat our pet families like our own. Golden Paws guarantees safe, lifetime, compassionate support.

Authorized Breeder Seal:
CIara Wallen, Chief Breeder Director - Golden Paws Home`
  },
  {
    id: 'doc3',
    title: 'Premium Golden Retriever Care & Transition Guide',
    category: 'Care Guide',
    description: 'Expert nutrition, feeding schedules, crate setups, bite inhibition tips, and social preparation guidelines for your first 30 days.',
    content: `BRINGING HOME YOUR GOLDEN PAWS PUPPY - THE ULTIMATE GUIDE

Congratulations on taking home your golden retriever! Here is the cheat-sheet of advice from Golden Paws Home to ensure a seamless homecoming.

FIRST WEEK ESSENTIALS (WHAT TO BUY):
- Crate (36" or 42" size with vertical dividers so it grows with your pup)
- Food Bowl and Water Bowl (preferably elevated or weighted stainless steel)
- Grooming tools: Golden Retrievers have double coats. Get a high-quality metal comb, pin brush, and undercoat slip comb.
- Toys: KONG chew toys, soft squeakers, interactive puzzle plates. No raw-hides or small rope segments that can be digested!

NUTRITION & SCHEDULES:
- Puppies need 3 meals per day until 6 months of age, after which you can switch to 2.
- Feed exactly what they were on (we supply a 3lb bag of Royal Canin Medium Puppy/Large Puppy or equivalent premium food to avoid stomach distress).
- Feeding schedule: 
  * Breakfast: 7:30 AM (Followed immediately by yard trip)
  * Lunch: 12:30 PM (Followed by yard trip)
  * Dinner: 6:00 PM (Lighter, with water trimmed down by 8:00 PM to help night training)

CRATE TRAINING SUCCESS:
1. Cover the crate sides with a dark, breathable sheet. This triggers their den instinct.
2. Place the Mommy-scented blanket (supplied in our starter kit) inside the crate.
3. Never use the crate as punishment. Feed them inside the crate with the door open to build high-value positive association.
4. Expect some whining the first 3 nights. Do not open the door when they are actively crying, wait for a 10-second pause, then let them out to go potty!

BITE INHIBITION:
Puppies teeth like sharks. If they nip, make a sharp "Yip!" sound, pull your hand away, and freeze for 10 seconds. Immediately substitute your hand with an authorized chew toy. Consistent conditioning works in days!

LIFETIME COUNSELING:
Don't worry, we are just a quick phone call away! Call us anytime for nutrition advice, behavior queries, or sharing cute photos!`
  }
];
