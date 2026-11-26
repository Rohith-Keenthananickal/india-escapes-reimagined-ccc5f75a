import type { BackendExperienceItem } from '@/modules/landing/types/landing.types';

export interface ExperienceFilterState {
  searchQuery?: string;
  category?: string;
  sortBy?: string;
}

/**
 * UI-facing experience shape. Every field maps 1:1 to a column on the
 * backend `experiences` table (app/models/experience.py) except the ones
 * marked "UI-only" — the backend does not store those yet.
 */
export interface NormalizedExperience {
  id: number;
  title: string;
  /** Raw backend category string (free text in the DB). */
  category: string;
  /** Slug of the matching category from EXPERIENCE_CATEGORIES ('other' if no match). */
  categorySlug: string;
  subcategory: string;
  /** Human label, e.g. "2 hours". */
  duration: string;
  price: number;
  isPriceByGuest: boolean;
  /** First photo (kept for backwards compatibility with older components). */
  image: string;
  photos: string[];
  videoUrl: string;
  description: string;
  groupSize: number;
  languages: string[];
  included: string[];
  includedInPrice: string[];
  safetyItems: string[];
  legalDeclarations: string[];
  /** UI-only: the backend has no location column on experiences yet. */
  location: string;
  /** UI-only: no ratings model for experiences yet. */
  rating: number;
  reviews: number;
  /** True for placeholder data from data/mockExperiences.ts — booking is disabled. */
  isMock: boolean;
}

/** Backend item plus optional UI-only fields that mock data can fill in. */
export type ExperienceSource = BackendExperienceItem & {
  location?: string;
  rating?: number;
  reviews?: number;
};

export interface ExperienceCategory {
  slug: string;
  name: string;
  short: string;
  description: string;
  image: string;
  /** Signature accent colour used for chips, tabs and hovers. */
  accent: string;
  /** Lowercase keywords used to match free-text backend categories / search. */
  keywords: string[];
}

export interface SignatureJourney {
  id: string;
  title: string;
  audience: string;
  tagline: string;
  highlights: string[];
  priceFrom: number;
  priceTo: number;
  priceUnit: 'package' | 'person' | 'group';
  image: string;
  categorySlug: string;
  /** Dark ambient background the journeys section fades to while this panel is in view. */
  tint: string;
}
