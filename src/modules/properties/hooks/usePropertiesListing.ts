import { useQuery } from '@tanstack/react-query';
import propertiesService from '../services/propertiesService';
import type { PropertyFilterParams } from '../types/properties.types';

export function usePropertiesListing(params: PropertyFilterParams = {}) {
  return useQuery({
    queryKey: ['properties-listing', params],
    queryFn: () => propertiesService.getProperties(params),
    staleTime: 1000 * 60 * 3, // 3 minutes cache
  });
}
