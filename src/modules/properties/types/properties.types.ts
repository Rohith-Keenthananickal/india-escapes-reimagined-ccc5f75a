import type { BackendPropertyItem, LandingPropertyCard, PaginationInfo } from '@/modules/landing/types/landing.types';

export interface PropertyFilterParams {
  searchQuery?: string;
  /** Short place/district token for address + name match */
  locationQuery?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  sortBy?: string;
  priceRange?: [number, number];
  propertyType?: string;
  verificationStatus?: string[];
  status?: string[];
  page?: number;
  limit?: number;
  checkInDate?: string; // YYYY-MM-DD
  checkOutDate?: string; // YYYY-MM-DD
  guests?: number;
  /** When true (default with dates), exclude unavailable stays */
  availableOnly?: boolean;
}

export interface PropertiesListingResponse {
  properties: LandingPropertyCard[];
  cards: LandingPropertyCard[];
  pagination: PaginationInfo;
  raw: BackendPropertyItem[];
}
