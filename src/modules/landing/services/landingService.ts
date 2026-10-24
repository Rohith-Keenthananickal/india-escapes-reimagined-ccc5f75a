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

  // Categorization
  let region = 'all';
  const textCorpus = `${prop.property_name || ''} ${details?.about_space || ''} ${location}`.toLowerCase();
  if (textCorpus.includes('hill') || textCorpus.includes('mountain') || textCorpus.includes('estate') || textCorpus.includes('munnar')) {
    region = 'hills';
  } else if (textCorpus.includes('beach') || textCorpus.includes('coast') || textCorpus.includes('sea') || textCorpus.includes('varkala') || textCorpus.includes('kovalam')) {
    region = 'beaches';
  } else if (textCorpus.includes('heritage') || textCorpus.includes('culture') || textCorpus.includes('traditional')) {
    region = 'cultural';
  } else if (textCorpus.includes('backwater') || textCorpus.includes('alleppey') || textCorpus.includes('kumarakom') || textCorpus.includes('canal')) {
    region = 'backwater';
  }

  const hostDisplay = prop.host_name || details?.other_name || (details?.host_languages?.length ? `Host (${details.host_languages[0]})` : `Host #${prop.user_id}`);

  return {
    id: prop.id,
    title: prop.property_name || `Property #${prop.id}`,
    location,
    // Real values: 0 represents that pricing or reviews are not yet provided by the API
    price: 0,
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
      property_type_id: filters.property_type_id,
      status: filters.status || ['ACTIVE'],
      verification_status: filters.verification_status,
    });
  },

  /**
   * Fetch newly listed properties
   */
  async getNewlyListedProperties(limit = 4): Promise<LandingPropertyCard[]> {
    const res = await apiClient.post<PropertySearchResponse>('/api/v1/properties/search', {
      page: 1,
      limit,
      status: ['ACTIVE'],
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
        },
      });
      return res.data || [];
    } catch (err) {
      console.warn('Failed to fetch experiences, returning empty list:', err);
      return [];
    }
  },

  /**
   * Fetch all Kerala districts
   */
  async getDistricts(): Promise<DistrictItem[]> {
    try {
      const res = await apiClient.get<DistrictsResponse>('/api/v1/districts/');
      return res.data || [];
    } catch (err) {
      console.warn('Failed to fetch districts, returning empty list:', err);
      return [];
    }
  },
};

export default landingService;
