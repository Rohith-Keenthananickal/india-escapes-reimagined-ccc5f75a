import type { ExperienceCategory, SignatureJourney } from '../types/experiences.types';

/**
 * Static editorial content for the Experiences page (from Experience.page.pdf).
 *
 * Categories are "centrally managed" per the design. The backend has no
 * category master table yet, so they live here. When one exists, load it
 * through the service and keep `slug` + `keywords` for matching.
 */

const img = (name: string) => `/experiences/${name}.jpg`;

export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  {
    slug: 'water',
    accent: '#2BB0BB',
    name: 'Water Experiences',
    short: 'Water',
    description:
      'Backwater canoeing, houseboat cruises, traditional fishing, kayaking, lake sunsets and life along Kerala’s rivers and coast.',
    image: img('cat-water'),
    keywords: ['water', 'boat', 'boating', 'canoe', 'kayak', 'backwater', 'fishing', 'houseboat', 'river', 'lake', 'beach'],
  },
  {
    slug: 'farm',
    accent: '#5DBB46',
    name: 'Farm & Village Life',
    short: 'Farm & Village',
    description:
      'Organic farming, paddy cultivation, plantation visits, coconut harvesting, cattle farming, village walks and rural lifestyle experiences.',
    image: img('cat-farm'),
    keywords: ['farm', 'village', 'paddy', 'plantation', 'coconut', 'rural', 'agri', 'cattle', 'tea', 'spice'],
  },
  {
    slug: 'adventure',
    accent: '#FF8A3D',
    name: 'Adventure & Outdoor',
    short: 'Adventure',
    description:
      'Trekking, cycling, rock climbing, ziplining, off-road experiences, mountain activities and guided outdoor exploration.',
    image: img('cat-adventure'),
    keywords: ['adventure', 'outdoor', 'trek', 'trekking', 'cycling', 'climb', 'zipline', 'offroad', 'off-road', 'hike', 'mountain'],
  },
  {
    slug: 'spiritual',
    accent: '#FFB627',
    name: 'Spiritual & Heritage',
    short: 'Spiritual',
    description:
      'Temple visits, pilgrimage experiences, traditional rituals, heritage walks, sacred architecture and local spiritual traditions.',
    image: img('cat-spiritual'),
    keywords: ['spiritual', 'heritage', 'temple', 'pilgrim', 'ritual', 'church', 'mosque', 'vedic', 'astrology', 'vasthu', 'vastu'],
  },
  {
    slug: 'food',
    accent: '#FF6B57',
    name: 'Food & Cooking',
    short: 'Food',
    description:
      'Traditional cooking classes, local cuisine, seafood preparation, food trails, farm-to-table dining and home dining experiences.',
    image: img('cat-food'),
    keywords: ['food', 'cooking', 'culinary', 'cuisine', 'kitchen', 'dining', 'sadya', 'seafood', 'recipe'],
  },
  {
    slug: 'art',
    accent: '#E2456B',
    name: 'Art, Culture & Traditions',
    short: 'Art & Culture',
    description:
      'Kathakali, Kalaripayattu, Theyyam, Chenda, handicrafts, mural painting, traditional music and cultural workshops.',
    image: img('cat-art'),
    keywords: ['art', 'culture', 'tradition', 'kathakali', 'kalari', 'theyyam', 'chenda', 'craft', 'crafts', 'mural', 'music', 'dance', 'pottery'],
  },
  {
    slug: 'camping',
    accent: '#8B7CF6',
    name: 'Camping & Retreats',
    short: 'Camping',
    description:
      'Tent camping, riverside camping, nature retreats, stargazing, outdoor cooking and overnight wilderness experiences.',
    image: img('cat-camping'),
    keywords: ['camp', 'camping', 'retreat', 'tent', 'stargazing', 'overnight', 'bonfire'],
  },
  {
    slug: 'wildlife',
    accent: '#22A06B',
    name: 'Wildlife & Nature',
    short: 'Wildlife',
    description:
      'Birdwatching, biodiversity walks, butterfly observation, nature trails, forest interpretation and responsible wildlife experiences.',
    image: img('cat-wildlife'),
    keywords: ['wildlife', 'nature', 'bird', 'birdwatching', 'forest', 'butterfly', 'safari', 'biodiversity'],
  },
  {
    slug: 'wellness',
    accent: '#4FC3B0',
    name: 'Wellness & Rejuvenation',
    short: 'Wellness',
    description:
      'Yoga, meditation, Ayurveda experiences, wellness retreats and traditional wellness workshops.',
    image: img('cat-wellness'),
    keywords: ['wellness', 'yoga', 'meditation', 'ayurveda', 'health', 'spa', 'rejuvenation', 'massage'],
  },
  {
    slug: 'events',
    accent: '#F2559A',
    name: 'Events & Special Experiences',
    short: 'Events',
    description:
      'Festivals, local celebrations, seasonal activities, community events, private celebrations and special cultural programmes.',
    image: img('cat-events'),
    keywords: ['event', 'events', 'festival', 'celebration', 'wedding', 'family', 'function', 'onam', 'community'],
  },
];

export const OTHER_CATEGORY: ExperienceCategory = {
  slug: 'other',
  accent: '#9AA0B8',
  name: 'Other / Unique Experiences',
  short: 'Unique',
  description: 'One-of-a-kind experiences that don’t fit a box.',
  image: img('kathakali-makeup-closeup'),
  keywords: [],
};

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Map a free-text backend category (e.g. "WATER_EXPERIENCES", "Yoga") to a category slug. */
export function resolveCategorySlug(raw?: string | null): string {
  if (!raw) return OTHER_CATEGORY.slug;
  const value = normalise(raw);
  const exact = EXPERIENCE_CATEGORIES.find(
    (c) => normalise(c.name) === value || c.slug === value || normalise(c.short) === value
  );
  if (exact) return exact.slug;
  const words = value.split(' ');
  const byKeyword = EXPERIENCE_CATEGORIES.find((c) =>
    c.keywords.some((k) => words.includes(k) || value.includes(k))
  );
  return byKeyword?.slug ?? OTHER_CATEGORY.slug;
}

export function getCategory(slug: string): ExperienceCategory {
  return EXPERIENCE_CATEGORIES.find((c) => c.slug === slug) ?? OTHER_CATEGORY;
}

export const SIGNATURE_JOURNEYS: SignatureJourney[] = [
  {
    id: 'sunday-with-nature',
    tint: '#0E2A1F',
    title: 'Sunday with Nature',
    audience: 'For a family of four',
    tagline: 'A half-day village experience, ankle-deep in green paddy.',
    highlights: ['Farm visit', 'Traditional breakfast or lunch', 'Interaction with local farmers', 'Small agricultural activity'],
    priceFrom: 2499,
    priceTo: 3499,
    priceUnit: 'package',
    image: img('pkg-sunday-nature'),
    categorySlug: 'farm',
  },
  {
    id: 'date-with-kerala',
    tint: '#2A1438',
    title: 'Date with Kerala',
    audience: 'For couples',
    tagline: 'A romantic evening at a scenic waterside spot.',
    highlights: ['Scenic location', 'Private dinner', 'Traditional Kerala cuisine', 'Photography opportunity'],
    priceFrom: 2999,
    priceTo: 5999,
    priceUnit: 'package',
    image: img('pkg-date-kerala'),
    categorySlug: 'food',
  },
  {
    id: 'rediscover-kerala',
    tint: '#2E1015',
    title: 'Rediscover Kerala',
    audience: 'For residents & visiting NRIs',
    tagline: 'A cultural homecoming: the art, the food and the people behind them.',
    highlights: ['Heritage walk', 'Traditional art demonstration', 'Local cuisine', 'Interaction with local artists'],
    priceFrom: 999,
    priceTo: 1999,
    priceUnit: 'person',
    image: img('pkg-rediscover'),
    categorySlug: 'art',
  },
  {
    id: 'family-day-out',
    tint: '#0C2A36',
    title: 'Family Day Out',
    audience: 'For families',
    tagline: 'A private day at a farmhouse or family home.',
    highlights: ['Farmhouse or family home', 'Swimming or outdoor activities where available', 'Lunch', 'Games and relaxation'],
    priceFrom: 3999,
    priceTo: 7999,
    priceUnit: 'group',
    image: img('pkg-family-day'),
    categorySlug: 'events',
  },
  {
    id: 'sabarimala-pilgrimage',
    tint: '#2E1C08',
    title: 'Sabarimala Pilgrimage',
    audience: 'For devotees',
    tagline: 'The traditional pilgrimage, guided by a Guru Swami.',
    highlights: [
      'Follows traditional rituals',
      'Under the guidance of a Guru Swami',
      'Includes the ritual of ‘kettu-nira’ (preparing the offering kettu)',
      'Facilitates ‘darshan’ and the return journey',
    ],
    priceFrom: 1999,
    priceTo: 19999,
    priceUnit: 'person',
    image: img('pkg-sabarimala'),
    categorySlug: 'spiritual',
  },
  {
    id: 'kerala-wedding',
    tint: '#33102A',
    title: 'Kerala Wedding',
    audience: 'Attend like a family member',
    tagline: 'Be a guest at a real Kerala wedding, rituals and all.',
    highlights: ['Attend like a family member', 'Follows traditional rituals', 'Dress code and protocol', 'Local food feast', 'With or without stays'],
    priceFrom: 999,
    priceTo: 19999,
    priceUnit: 'person',
    image: img('pkg-wedding'),
    categorySlug: 'events',
  },
  {
    id: 'kerala-family-serves-food',
    tint: '#2C190E',
    title: 'Kerala Family Serves Food',
    audience: 'For food lovers',
    tagline: 'Home-cooked meals, served at a family table.',
    highlights: [
      'Cooked right at home',
      'Traditional, local, authentic',
      'Secret recipes of old traditions',
      'Christian, Muslim, Hindu family food',
      'Jain, Gujarati, Punjabi family food',
    ],
    priceFrom: 99,
    priceTo: 999,
    priceUnit: 'person',
    image: img('pkg-home-food'),
    categorySlug: 'food',
  },
];

/** Hero ticker phrases ("Real family events, Temple rituals, …" from the design). */
export const HERO_PHRASES = [
  'real family events',
  'temple rituals',
  'disappearing crafts',
  'cooking in family kitchens',
  'fishing with a fisherman',
  'Theyyam at dawn',
];

/** Quick tags for the "Search your favourite Experience" section. */
export const SEARCH_TAGS = [
  'Ayurveda',
  'Boating',
  'Crafts',
  'Dance',
  'Adventure',
  'Health',
  'Culinary',
  'Music',
  'Family',
  'Vedic Astrology',
  'Vasthu',
  'Kathakali',
  'Theyyam',
  'Yoga',
  'Fishing',
  'Trekking',
  'Birdwatching',
  'Temple',
  'Paddy',
  'Camping',
];

/** Marketing figure from the design. Replace with a backend count when available. */
export const HYPER_LOCAL_TARGET = 300000;
