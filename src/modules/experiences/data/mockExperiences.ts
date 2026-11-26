/**
 * ──────────────────────────────────────────────────────────────────────────
 *  TEMPORARY MOCK DATA: delete this file once the backend has enough
 *  approved experiences. Then set USE_MOCK_EXPERIENCES to false (or remove
 *  the merge in hooks/useExperienceCatalog.ts).
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Every item uses the exact shape returned by GET /api/v1/experiences
 * (BackendExperienceItem, mirroring app/models/experience.py), so it goes
 * through the same normaliser as real data. `location`, `rating` and
 * `reviews` are UI-only extras the backend doesn't store yet.
 *
 * Mock IDs are negative so they can never collide with real rows, and the
 * UI disables booking for them.
 */
import type { ExperienceSource } from '../types/experiences.types';

export const USE_MOCK_EXPERIENCES = true;

const local = (name: string) => `/experiences/${name}.jpg`;
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=75&auto=format&fit=crop`;

const BASE = {
  user_id: 0,
  area_coordinator_id: null,
  video_url: null,
  status: 'ACTIVE',
  approval_status: 'APPROVED',
  created_at: '2026-11-01T00:00:00Z',
  updated_at: '2026-11-01T00:00:00Z',
  legal_declarations: [
    'Host holds the required local permissions for this activity.',
    'Guests must follow the host’s safety briefing at all times.',
  ],
} as const;

type MockInput = Omit<ExperienceSource, keyof typeof BASE | 'is_price_by_guest'> & {
  is_price_by_guest?: boolean;
};

const mock = (item: MockInput): ExperienceSource => ({
  ...BASE,
  legal_declarations: [...BASE.legal_declarations],
  is_price_by_guest: true,
  ...item,
});

export const MOCK_EXPERIENCES: ExperienceSource[] = [
  // ── Water Experiences ────────────────────────────────────────────────
  mock({
    id: -1001,
    title: 'Village Canoeing',
    category: 'Water Experiences',
    subcategory: 'Backwater canoe',
    duration: 2,
    duration_unit: 'HOUR',
    group_size: 4,
    languages: ['Malayalam', 'English'],
    description:
      'Glide through the lily-covered canals of Kumbalangi in a hand-rowed country boat. Your boatman grew up on these waters and will show you toddy tappers at work, Chinese fishing nets and kingfishers that most visitors never notice.',
    included: ['Country boat with boatman', 'Life jackets', 'Tender coconut'],
    included_in_price: ['Boat ride', 'Refreshments'],
    safety_items: ['Life jackets for all guests', 'Not recommended during heavy rain'],
    photos: [local('exp-village-canoeing'), unsplash('1602216056096-3b40cc0c9944'), local('cat-water')],
    price: 500,
    location: 'Kumbalangi',
    rating: 4.9,
    reviews: 214,
  }),
  mock({
    id: -1002,
    title: 'Traditional Fishing',
    category: 'Water Experiences',
    subcategory: 'Fishing',
    duration: 3,
    duration_unit: 'HOUR',
    group_size: 3,
    languages: ['Malayalam', 'English'],
    description:
      'Head out at sunrise with a fisherman from Alappuzha. Learn to throw a cast net, haul in the morning catch and, if you like, cook it with his family afterwards.',
    included: ['Fishing boat', 'Cast net session', 'Breakfast'],
    included_in_price: ['Boat', 'Equipment', 'Breakfast'],
    safety_items: ['Life jackets provided', 'Swimming ability preferred'],
    photos: [local('exp-traditional-fishing'), unsplash('1593693397690-362cb9666fc2')],
    price: 750,
    location: 'Alappuzha',
    rating: 4.8,
    reviews: 167,
  }),
  mock({
    id: -1003,
    title: 'Sunset Houseboat Cruise',
    category: 'Water Experiences',
    subcategory: 'Houseboat',
    duration: 4,
    duration_unit: 'HOUR',
    group_size: 8,
    languages: ['Malayalam', 'English', 'Hindi'],
    description:
      'A slow cruise across Vembanad Lake on a traditional kettuvallam, with Kerala snacks, chai and the best sunset view in the state.',
    included: ['Houseboat cruise', 'Evening snacks', 'Chai'],
    included_in_price: ['Cruise', 'Snacks'],
    safety_items: ['Life jackets on board', 'Children must be accompanied'],
    photos: [local('houseboat-couple'), unsplash('1506461883276-594a12b11cf3')],
    price: 6500,
    is_price_by_guest: false,
    location: 'Kumarakom',
    rating: 4.9,
    reviews: 388,
  }),

  // ── Farm & Village Life ──────────────────────────────────────────────
  mock({
    id: -1004,
    title: 'Coconut Farm Visit',
    category: 'Farm & Village Life',
    subcategory: 'Plantation',
    duration: 2,
    duration_unit: 'HOUR',
    group_size: 10,
    languages: ['Malayalam', 'English'],
    description:
      'Watch a climber scale a 60-foot palm, learn how every part of the coconut is used, and press fresh coconut oil the old way.',
    included: ['Farm walk', 'Coconut tasting', 'Oil pressing demo'],
    included_in_price: ['Guided walk', 'Tasting'],
    safety_items: ['Wear closed footwear'],
    photos: [local('exp-coconut-farm')],
    price: 350,
    location: 'Ernakulam',
    rating: 4.7,
    reviews: 96,
  }),
  mock({
    id: -1005,
    title: 'Paddy Field Experience',
    category: 'Farm & Village Life',
    subcategory: 'Paddy cultivation',
    duration: 2,
    duration_unit: 'HOUR',
    group_size: 12,
    languages: ['Malayalam', 'English'],
    description:
      'Roll up your trousers and plant rice saplings with the women of a Thrissur farming collective, then share a meal of the same rice.',
    included: ['Planting session', 'Farm lunch', 'Change of clothes area'],
    included_in_price: ['Activity', 'Lunch'],
    safety_items: ['Mud-safe clothing recommended'],
    photos: [local('exp-paddy-field'), local('cat-farm'), local('pkg-sunday-nature')],
    price: 400,
    location: 'Thrissur',
    rating: 4.8,
    reviews: 142,
  }),
  mock({
    id: -1006,
    title: 'Spice Garden Walk',
    category: 'Farm & Village Life',
    subcategory: 'Plantation',
    duration: 90,
    duration_unit: 'MINUTE',
    group_size: 10,
    languages: ['English', 'Hindi'],
    description:
      'Pepper vines, cardamom and nutmeg: walk a family spice garden in Idukki and take home a pouch of what you picked.',
    included: ['Guided walk', 'Spice pouch'],
    included_in_price: ['Walk', 'Souvenir'],
    safety_items: ['Leech socks provided in monsoon'],
    photos: [unsplash('1609920658906-8223bd289001')],
    price: 300,
    location: 'Idukki',
    rating: 4.6,
    reviews: 58,
  }),

  // ── Art, Culture & Traditions ───────────────────────────────────────
  mock({
    id: -1007,
    title: 'Kathakali Makeup',
    category: 'Art, Culture & Traditions',
    subcategory: 'Kathakali',
    duration: 90,
    duration_unit: 'MINUTE',
    group_size: 6,
    languages: ['Malayalam', 'English'],
    description:
      'Sit backstage while a Kathakali artist spends an hour and a half transforming into a character, then try the chutti paper-mask technique yourself.',
    included: ['Backstage access', 'Makeup demo', 'Front-row performance seat'],
    included_in_price: ['Demo', 'Performance ticket'],
    safety_items: ['Natural pigments, patch test offered'],
    photos: [local('kathakali-makeup-closeup'), local('cat-art'), local('hero-kathakali-stage')],
    price: 600,
    location: 'Kochi',
    rating: 4.9,
    reviews: 301,
  }),
  mock({
    id: -1008,
    title: 'Mural Painting',
    category: 'Art, Culture & Traditions',
    subcategory: 'Mural',
    duration: 2,
    duration_unit: 'HOUR',
    group_size: 8,
    languages: ['Malayalam', 'English'],
    description:
      'Learn the five-colour palette of Kerala temple murals from a Guruvayur-trained artist and paint your own panel to take home.',
    included: ['All materials', 'Your finished panel'],
    included_in_price: ['Workshop', 'Materials'],
    safety_items: ['Non-toxic paints'],
    photos: [local('exp-mural-painting')],
    price: 800,
    location: 'Thrissur',
    rating: 4.8,
    reviews: 77,
  }),
  mock({
    id: -1009,
    title: 'Theyyam at Dawn',
    category: 'Art, Culture & Traditions',
    subcategory: 'Theyyam',
    duration: 5,
    duration_unit: 'HOUR',
    group_size: 6,
    languages: ['Malayalam', 'English'],
    description:
      'Witness a village shrine come alive as Theyyam performers become deities through the night, with a local guide explaining every ritual.',
    included: ['Local guide', 'Pickup from Kannur town', 'Breakfast'],
    included_in_price: ['Guide', 'Transport', 'Breakfast'],
    safety_items: ['Maintain distance from fire rituals', 'Modest dress required'],
    photos: [local('hero-kathakali-stage'), local('pkg-rediscover')],
    price: 1500,
    location: 'Kannur',
    rating: 5,
    reviews: 129,
  }),

  // ── Food & Cooking ──────────────────────────────────────────────────
  mock({
    id: -1010,
    title: 'Syrian Christian Home Kitchen',
    category: 'Food & Cooking',
    subcategory: 'Home dining',
    duration: 3,
    duration_unit: 'HOUR',
    group_size: 6,
    languages: ['Malayalam', 'English'],
    description:
      'Cook appam, duck roast and meen curry with Annamma in her Kottayam home, using recipes passed down four generations.',
    included: ['Hands-on cooking', 'Full meal', 'Recipe cards'],
    included_in_price: ['Class', 'Meal'],
    safety_items: ['Tell the host about allergies in advance'],
    photos: [local('pkg-home-food'), local('cat-food'), unsplash('1585937421612-70a008356fbe')],
    price: 1200,
    location: 'Kottayam',
    rating: 4.9,
    reviews: 245,
  }),
  mock({
    id: -1011,
    title: 'Onam Sadya on a Banana Leaf',
    category: 'Food & Cooking',
    subcategory: 'Traditional feast',
    duration: 2,
    duration_unit: 'HOUR',
    group_size: 20,
    languages: ['Malayalam', 'English'],
    description:
      'Twenty-six dishes, one banana leaf and a family that insists you have seconds. Learn the order of the sadya and the etiquette behind it.',
    included: ['Full sadya', 'Payasam tasting'],
    included_in_price: ['Meal'],
    safety_items: ['Vegetarian only'],
    photos: [local('cat-events'), unsplash('1596797038530-2c107229654b')],
    price: 450,
    location: 'Palakkad',
    rating: 4.8,
    reviews: 189,
  }),

  // ── Spiritual & Heritage ────────────────────────────────────────────
  mock({
    id: -1012,
    title: 'Temple Lamp Lighting Ritual',
    category: 'Spiritual & Heritage',
    subcategory: 'Temple ritual',
    duration: 2,
    duration_unit: 'HOUR',
    group_size: 10,
    languages: ['Malayalam', 'English', 'Tamil'],
    description:
      'Join the evening deeparadhana as thousands of brass lamps are lit around an ancient temple, guided by a priest’s family.',
    included: ['Guided visit', 'Prasadam'],
    included_in_price: ['Guide'],
    safety_items: ['Traditional dress code applies', 'No photography inside sanctum'],
    photos: [local('cat-spiritual'), unsplash('1582510003544-4d00b7f74220')],
    price: 350,
    location: 'Guruvayur',
    rating: 4.9,
    reviews: 312,
  }),
  mock({
    id: -1013,
    title: 'Vedic Astrology Consultation',
    category: 'Spiritual & Heritage',
    subcategory: 'Vedic astrology',
    duration: 1,
    duration_unit: 'HOUR',
    group_size: 2,
    languages: ['Malayalam', 'English', 'Hindi'],
    description:
      'A one-on-one session with a traditional jyothisha practitioner in a heritage tharavad, explaining how charts are read the Kerala way.',
    included: ['Personal reading', 'Printed chart'],
    included_in_price: ['Consultation'],
    safety_items: [],
    photos: [unsplash('1582510003544-4d00b7f74220')],
    price: 1100,
    location: 'Thrissur',
    rating: 4.5,
    reviews: 41,
  }),

  // ── Adventure & Outdoor ─────────────────────────────────────────────
  mock({
    id: -1014,
    title: 'Chembra Peak Sunrise Trek',
    category: 'Adventure & Outdoor',
    subcategory: 'Trekking',
    duration: 6,
    duration_unit: 'HOUR',
    group_size: 12,
    languages: ['English', 'Malayalam'],
    description:
      'Start in the dark, reach the heart-shaped lake by first light and watch the Wayanad hills appear out of the mist.',
    included: ['Forest permit', 'Certified guide', 'Packed breakfast'],
    included_in_price: ['Permit', 'Guide', 'Breakfast'],
    safety_items: ['Moderate fitness required', 'Trek closes in heavy rain'],
    photos: [local('cat-adventure'), unsplash('1500964757637-c85e8a162699')],
    price: 1800,
    location: 'Wayanad',
    rating: 4.8,
    reviews: 156,
  }),
  mock({
    id: -1015,
    title: 'Plantation Cycling Trail',
    category: 'Adventure & Outdoor',
    subcategory: 'Cycling',
    duration: 3,
    duration_unit: 'HOUR',
    group_size: 8,
    languages: ['English'],
    description: 'Ride through tea estates and cardamom hills on a guided 18 km loop with a tea-tasting stop.',
    included: ['Bike and helmet', 'Guide', 'Tea tasting'],
    included_in_price: ['Equipment', 'Guide'],
    safety_items: ['Helmets mandatory', 'Minimum age 12'],
    photos: [unsplash('1609920658906-8223bd289001')],
    price: 1400,
    location: 'Munnar',
    rating: 4.7,
    reviews: 88,
  }),

  // ── Camping & Retreats ──────────────────────────────────────────────
  mock({
    id: -1016,
    title: 'Above-the-Clouds Camping',
    category: 'Camping & Retreats',
    subcategory: 'Tent camping',
    duration: 1,
    duration_unit: 'DAY',
    group_size: 10,
    languages: ['English', 'Malayalam'],
    description:
      'Pitch your tent on a ridge in Vagamon, cook over a campfire and wake up to a sea of cloud below you.',
    included: ['Tent and sleeping bag', 'Dinner and breakfast', 'Bonfire'],
    included_in_price: ['Stay', 'Meals'],
    safety_items: ['Night guard on site', 'Bring warm clothes'],
    photos: [local('cat-camping'), unsplash('1504280390367-361c6d9f38f4')],
    price: 2200,
    location: 'Vagamon',
    rating: 4.8,
    reviews: 132,
  }),

  // ── Wildlife & Nature ───────────────────────────────────────────────
  mock({
    id: -1017,
    title: 'Thattekad Birding Walk',
    category: 'Wildlife & Nature',
    subcategory: 'Birdwatching',
    duration: 4,
    duration_unit: 'HOUR',
    group_size: 6,
    languages: ['English', 'Malayalam'],
    description:
      'Look for the Sri Lanka frogmouth and Malabar trogon with a naturalist who has logged over 300 species in this sanctuary.',
    included: ['Naturalist guide', 'Binoculars', 'Field checklist'],
    included_in_price: ['Guide', 'Entry fee'],
    safety_items: ['Stay on marked trails', 'Wear muted colours'],
    photos: [local('cat-wildlife')],
    price: 950,
    location: 'Thattekad',
    rating: 4.9,
    reviews: 74,
  }),

  // ── Wellness & Rejuvenation ─────────────────────────────────────────
  mock({
    id: -1018,
    title: 'Ayurveda Morning Ritual',
    category: 'Wellness & Rejuvenation',
    subcategory: 'Ayurveda',
    duration: 3,
    duration_unit: 'HOUR',
    group_size: 4,
    languages: ['English', 'Malayalam', 'German'],
    description:
      'A riverside session of yoga, a short consultation with a vaidya and a traditional abhyanga oil massage.',
    included: ['Yoga session', 'Consultation', 'Abhyanga massage'],
    included_in_price: ['All treatments'],
    safety_items: ['Inform about medical conditions', 'Not advised in pregnancy'],
    photos: [local('cat-wellness'), unsplash('1544161515-4ab6ce6db874'), unsplash('1545389336-cf090694435e')],
    price: 2600,
    location: 'Kovalam',
    rating: 4.9,
    reviews: 203,
  }),

  // ── Events & Special Experiences ────────────────────────────────────
  mock({
    id: -1019,
    title: 'Thrissur Pooram with a Local Family',
    category: 'Events & Special Experiences',
    subcategory: 'Festival',
    duration: 1,
    duration_unit: 'DAY',
    group_size: 6,
    languages: ['Malayalam', 'English'],
    description:
      'Experience Kerala’s grandest temple festival from a family’s rooftop, with elephants, percussion ensembles and the midnight fireworks.',
    included: ['Rooftop access', 'Home lunch', 'Local host'],
    included_in_price: ['Hosting', 'Meals'],
    safety_items: ['Very large crowds', 'Keep to your host’s instructions'],
    photos: [unsplash('1505236858219-8359eb29e329'), local('cat-events')],
    price: 2500,
    location: 'Thrissur',
    rating: 5,
    reviews: 64,
  }),
];
