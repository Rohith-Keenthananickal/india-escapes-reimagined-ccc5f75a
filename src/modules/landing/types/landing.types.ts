/**
 * Types and interfaces for the Landing Page module.
 * Bridges backend OpenAPI schemas with frontend presentation requirements.
 */

export interface PropertyDetailsResponse {
  id?: number;
  property_id?: number;
  about_space?: string | null;
  host_languages?: string[] | null;
  other_name?: string | null;
  nearby_activities?: string[] | null;
  nearby_attractions?: string[] | null;
  seasonal_experiences?: string[] | null;
  comfort_services_list?: string[] | null;
  noise_level?: boolean | null;
  checkin_time?: string | null;
  checkout_time?: string | null;
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  alcohol_allowed?: boolean;
  visitor_policy?: string | null;
  quiet_hours?: string | null;
  comfort_services?: boolean;
  meals_available?: boolean;
  airport_pickup?: boolean;
  laundry_service?: boolean;
  housekeeping_frequency?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BackendPropertyItem {
  id: number;
  user_id: number;
  host_name?: string | null;
  location_address?: string | null;
  photo_urls?: string[] | null;
  property_name?: string | null;
  alternate_phone?: string | null;
  area_coordinator_id?: number | null;
  property_type_id?: number | null;
  property_type_name?: string | null;
  id_proof_type?: string | null;
  id_proof_url?: string | null;
  certificate_number?: string | null;
  tourism_certificate_number?: string | null;
  tourism_certificate_issued_by?: string | null;
  tourism_certificate_photos?: string[] | null;
  trade_license_number?: string | null;
  trade_license_images?: string[] | null;
  cover_image?: string | null;
  exterior_images?: string[] | null;
  bedroom_images?: string[] | null;
  bathroom_images?: string[] | null;
  living_dining_images?: string[] | null;
  classification: 'SILVER' | 'GOLD' | 'DIAMOND' | 'UNCLASSIFIED' | string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'DELETED' | string;
  verification_status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  progress_step: number;
  is_verified: boolean;
  property_details?: PropertyDetailsResponse | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PropertySearchResponse {
  status: string;
  data: BackendPropertyItem[];
  pagination: PaginationInfo;
}

export interface PropertySearchFilters {
  user_id?: number;
  area_coordinator_id?: number;
  property_type_id?: number[];
  property_type_name?: string[];
  status?: string[];
  verification_status?: string[];
  page?: number;
  limit?: number;
  search_query?: string;
}

/**
 * Backend Experience Schema
 */
export interface BackendExperienceItem {
  id: number;
  user_id: number;
  area_coordinator_id?: number | null;
  title: string;
  category?: string | null;
  subcategory?: string | null;
  duration?: number | null;
  duration_unit?: 'MINUTE' | 'HOUR' | 'DAY' | null;
  group_size?: number | null;
  languages?: string[] | null;
  description?: string | null;
  included?: string[] | null;
  photos?: string[] | null;
  video_url?: string | null;
  safety_items?: string[] | null;
  price?: number | null;
  is_price_by_guest: boolean;
  included_in_price?: string[] | null;
  legal_declarations?: string[] | null;
  status: 'ACTIVE' | 'BLOCKED' | 'DELETED' | string;
  approval_status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  created_at: string;
  updated_at: string;
}

export interface ExperienceListResponse {
  data: BackendExperienceItem[];
  pagination: PaginationInfo;
  message?: string;
}

/**
 * District Schema
 */
export interface DistrictItem {
  id: number;
  name: string;
  state: string;
  code?: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface DistrictsResponse {
  status: string;
  data: DistrictItem[];
}

/**
 * Normalized UI ViewModel for Property Cards on Landing Page
 */
export interface LandingPropertyCard {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  host: string;
  isNew: boolean;
  isCertified: boolean;
  isEco: boolean;
  region: string;
  amenities: string[];
  classification: string;
  district?: string;
  daysAgo?: number;
}

export interface FilterState {
  category: string;
  filters: string[];
  sortBy: string;
  searchQuery?: string;
}
