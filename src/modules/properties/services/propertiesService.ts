import apiClient from '@/services/apiClient';
import { mapBackendPropertyToCard } from '@/modules/landing/services/landingService';
import type { PropertySearchResponse } from '@/modules/landing/types/landing.types';
import type { PropertyFilterParams, PropertiesListingResponse } from '../types/properties.types';

export const propertiesService = {
  async getProperties(params: PropertyFilterParams = {}): Promise<PropertiesListingResponse> {
    const hasDates = Boolean(params.checkInDate && params.checkOutDate);
    const payload: Record<string, unknown> = {
      page: params.page || 1,
      limit: params.limit || 24,
      status: params.status || ['ACTIVE'],
      verification_status: params.verificationStatus && params.verificationStatus.length > 0
        ? params.verificationStatus
        : ['APPROVED'],
      available_only: params.availableOnly ?? hasDates,
    };

    if (params.locationQuery) {
      payload.location_query = params.locationQuery;
    } else if (params.searchQuery) {
      // Free-text sidebar / legacy: treat as location/name token
      payload.location_query = params.searchQuery;
    }

    if (params.latitude != null && params.longitude != null) {
      payload.latitude = params.latitude;
      payload.longitude = params.longitude;
      payload.radius_km = params.radiusKm ?? 40;
    }

    if (params.checkInDate) {
      payload.check_in_date = params.checkInDate;
    }
    if (params.checkOutDate) {
      payload.check_out_date = params.checkOutDate;
    }
    if (params.guests && params.guests > 0) {
      payload.guests = params.guests;
    }
    if (params.priceRange) {
      if (params.priceRange[0] > 0) payload.min_price = params.priceRange[0];
      if (params.priceRange[1] < 20000) payload.max_price = params.priceRange[1];
    }

    const response = await apiClient.post<PropertySearchResponse>('/api/v1/properties/search', payload);
    const properties = (response.data || []).map(mapBackendPropertyToCard);

    return {
      properties,
      cards: properties,
      pagination: response.pagination,
      raw: response.data || [],
    };
  },
};

export default propertiesService;
