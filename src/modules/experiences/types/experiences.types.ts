import type { BackendExperienceItem } from '@/modules/landing/types/landing.types';

export interface ExperienceFilterState {
  searchQuery?: string;
  category?: string;
  sortBy?: string;
}

export interface NormalizedExperience {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: number;
  isPriceByGuest: boolean;
  image: string;
  description: string;
  groupSize: number;
  languages: string[];
  included: string[];
  rating: number;
  reviews: number;
}
