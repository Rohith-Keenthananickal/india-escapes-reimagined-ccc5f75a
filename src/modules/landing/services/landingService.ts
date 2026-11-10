import apiClient from '@/services/apiClient';
import type {
  BackendPropertyItem,
  PropertySearchResponse,
  PropertySearchFilters,
  ExperienceListResponse,
  DistrictsResponse,
  LandingPropertyCard,
  BackendExperienceItem,
  DistrictItem,
  LandingStats,
  LandingStatsResponse,
  LandingSegmentItem,
  LandingSegmentsResponse,
} from '../types/landing.types';

/**
 * Normalizes backend property data into UI card format using ONLY real backend values.
 * No synthetic prices, fake ratings, or stock placeholder images are injected.
 */
export function mapBackendPropertyToCard(prop: BackendPropertyItem): LandingPropertyCard {
  // Extract only genuine uploaded images from the backend
  const images: string[] = [];
  if (prop.cover_image && prop.cover_image.trim() !== '') {
    images.push(prop.cover_image);
  }
  if (Array.isArray(prop.photo_urls)) {
    images.push(...prop.photo_urls.filter((img) => Boolean(img && img.trim() !== '' && !images.includes(img))));
  }
  if (Array.isArray(prop.exterior_images)) {
    images.push(...prop.exterior_images.filter((img) => Boolean(img && img.trim() !== '' && !images.includes(img))));
  }
  if (Array.isArray(prop.bedroom_images)) {
    images.push(...prop.bedroom_images.filter((img) => Boolean(img && img.trim() !== '' && !images.includes(img))));
  }
  if (Array.isArray(prop.living_dining_images)) {
    images.push(...prop.living_dining_images.filter((img) => Boolean(img && img.trim() !== '' && !images.includes(img))));
  }

  // Calculate actual days since property was created
  let daysAgo = 1;
  if (prop.created_at) {
    const createdDate = new Date(prop.created_at);
    const diffTime = Math.abs(Date.now() - createdDate.getTime());
    daysAgo = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // Real location string from location_address, property details or property type
  const details = prop.property_details;
  let location = prop.location_address || 'Kerala, India';
  if (!prop.location_address) {
    if (details?.nearby_attractions && details.nearby_attractions.length > 0) {
      location = `${details.nearby_attractions[0]}, Kerala`;
    } else if (prop.property_type_name) {
      location = `${prop.property_type_name}, Kerala`;
    }
  }

  // Real amenities from backend
  const amenities: string[] = [];
  if (details?.comfort_services || (details?.comfort_services_list && details.comfort_services_list.length > 0)) {
    amenities.push('Wifi');
  }
  if (details?.airport_pickup || details?.comfort_services_list?.some(s => s.toLowerCase().includes('car') || s.toLowerCase().includes('parking'))) {
    amenities.push('Car');
  }
  if (details?.meals_available) {
    amenities.push('Meals');
  }

  const region = prop.segment_name
    ? prop.segment_name.toLowerCase().replace(/\s+/g, '-')
    : 'all';

  const hostDisplay = prop.host_name || details?.other_name || (details?.host_languages?.length ? `Host (${details.host_languages[0]})` : `Host #${prop.user_id}`);

  // Calculate effective price from backend pricing fields
  const effectivePrice = Number(
    prop.price_per_night ?? prop.price ?? (prop.total_price && prop.number_of_nights ? Math.round(prop.total_price / prop.number_of_nights) : (prop.total_price ?? 0))
  );

  return {
    id: prop.id,
    title: prop.property_name || `Property #${prop.id}`,
    location,
    // Real pricing calculated from backend rooms / dates / whole property
    price: effectivePrice,
    totalPrice: prop.total_price ? Number(prop.total_price) : undefined,
    numberOfNights: prop.number_of_nights ?? undefined,
    isAvailable: prop.is_available !== false,
    pricingType: prop.pricing_type || (effectivePrice > 0 ? 'STARTING_FROM' : 'ON_REQUEST'),
    rating: 0,
    reviews: 0,
    images,
    host: hostDisplay,
    isNew: daysAgo <= 14,
    isCertified: Boolean(prop.tourism_certificate_number || prop.is_verified),
    isEco: Boolean(details?.pets_allowed || (details?.nearby_activities && details.nearby_activities.includes('Birdwatching'))),
    region,
    amenities,
    classification: prop.classification,
    daysAgo,
    segmentId: prop.segment_id ?? null,
    segmentName: prop.segment_name ?? null,
  };
}

export const landingService = {
  /**
   * Search and filter homestay properties
   */
  async searchProperties(filters: PropertySearchFilters = {}): Promise<PropertySearchResponse> {
    return apiClient.post<PropertySearchResponse>('/api/v1/properties/search', {
      page: filters.page || 1,
      limit: filters.limit || 12,
      search_query: filters.search_query,
      location_query: filters.location_query,
      property_type_id: filters.property_type_id,
      status: filters.status || ['ACTIVE'],
      verification_status: filters.verification_status,
      seasonal_experiences: filters.seasonal_experiences,
      segment_id: filters.segment_id,
    });
  },

  /**
   * Fetch newly listed properties (backend orders by created_at desc)
   */
  async getNewlyListedProperties(limit = 4): Promise<LandingPropertyCard[]> {
    const res = await apiClient.post<PropertySearchResponse>('/api/v1/properties/search', {
      page: 1,
      limit,
      status: ['ACTIVE'],
      verification_status: ['APPROVED'],
    });

    return (res.data || []).map(mapBackendPropertyToCard);
  },

  /**
   * Fetch properties tagged for a seasonal experience
   */
  async getSeasonalProperties(season: string, limit = 3): Promise<LandingPropertyCard[]> {
    const res = await this.searchProperties({
      page: 1,
      limit,
      status: ['ACTIVE'],
      verification_status: ['APPROVED'],
      seasonal_experiences: [season],
    });
    return (res.data || []).map(mapBackendPropertyToCard);
  },

  /**
   * Fetch active experiences for the platform
   */
  async getExperiences(limit = 6): Promise<BackendExperienceItem[]> {
    try {
      const res = await apiClient.get<ExperienceListResponse>('/api/v1/experiences', {
        params: {
          skip: 0,
          limit,
          status_filter: 'ACTIVE',
          approval_status_filter: 'APPROVED',
        },
      });
      return res.data || [];
    } catch (err) {
      console.warn('Failed to fetch experiences, returning empty list:', err);
      return [];
    }
  },

  /**
   * Fetch Kerala districts with property counts for the landing page
   */
  async getDistricts(): Promise<DistrictItem[]> {
    try {
      const res = await apiClient.get<DistrictsResponse>('/api/v1/landing/districts');
      return res.data || [];
    } catch (err) {
      console.warn('Failed to fetch landing districts, falling back to /districts:', err);
      try {
        const fallback = await apiClient.get<DistrictsResponse>('/api/v1/districts/');
        return fallback.data || [];
      } catch (fallbackErr) {
        console.warn('Failed to fetch districts, returning empty list:', fallbackErr);
        return [];
      }
    }
  },

  /**
   * Fetch live platform stats for AnimatedStats
   */
  async getStats(): Promise<LandingStats> {
    const res = await apiClient.get<LandingStatsResponse>('/api/v1/landing/stats');
    return (
      res.data || {
        verified_homestays: 0,
        scenic_destinations: 0,
        delighted_travelers: 0,
        warm_local_hosts: 0,
        authentic_escapes: 0,
      }
    );
  },

  /**
   * Fetch active PROPERTY segments for filters / showcase panels
   */
  async getPropertySegments(): Promise<LandingSegmentItem[]> {
    try {
      const res = await apiClient.get<LandingSegmentsResponse>('/api/v1/landing/segments');
      return res.data || [];
    } catch (err) {
      console.warn('Failed to fetch landing segments, falling back to /segments:', err);
      try {
        const fallback = await apiClient.get<LandingSegmentsResponse>('/api/v1/segments', {
          params: { active_only: true, type: 'PROPERTY' },
        });
        return (fallback.data || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          property_count: 0,
          cover_image: null,
        }));
      } catch (fallbackErr) {
        console.warn('Failed to fetch segments, returning empty list:', fallbackErr);
        return [];
      }
    }
  },
};

export default landingService;
