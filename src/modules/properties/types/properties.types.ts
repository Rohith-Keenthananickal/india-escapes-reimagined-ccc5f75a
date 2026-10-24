import type { BackendPropertyItem, LandingPropertyCard, PaginationInfo } from '@/modules/landing/types/landing.types';

export interface PropertyFilterParams {
  searchQuery?: string;
  sortBy?: string;
  priceRange?: [number, number];
  propertyType?: string;
  verificationStatus?: string[];
  status?: string[];
  page?: number;
  limit?: number;
}

export interface PropertiesListingResponse {
  properties: LandingPropertyCard[];
  pagination: PaginationInfo;
  raw: BackendPropertyItem[];
}
