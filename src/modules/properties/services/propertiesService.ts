import apiClient from '@/services/apiClient';
import { mapBackendPropertyToCard } from '@/modules/landing/services/landingService';
import type { PropertySearchResponse } from '@/modules/landing/types/landing.types';
import type { PropertyFilterParams, PropertiesListingResponse } from '../types/properties.types';

export const propertiesService = {
  async getProperties(params: PropertyFilterParams = {}): Promise<PropertiesListingResponse> {
    const payload: Record<string, any> = {
      page: params.page || 1,
      limit: params.limit || 24,
      search_query: params.searchQuery || undefined,
      status: params.status || ['ACTIVE'],
    };

    if (params.verificationStatus && params.verificationStatus.length > 0) {
      payload.verification_status = params.verificationStatus;
    }

    const response = await apiClient.post<PropertySearchResponse>('/api/v1/properties/search', payload);
    const properties = (response.data || []).map(mapBackendPropertyToCard);

    return {
      properties,
      pagination: response.pagination,
      raw: response.data || [],
    };
  },
};

export default propertiesService;
