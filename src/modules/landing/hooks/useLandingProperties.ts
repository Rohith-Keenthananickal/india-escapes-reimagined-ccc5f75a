import { useQuery } from '@tanstack/react-query';
import { landingService, mapBackendPropertyToCard } from '../services/landingService';
import type { PropertySearchFilters, LandingPropertyCard } from '../types/landing.types';

export const DEFAULT_LANDING_FILTERS: PropertySearchFilters = {
  page: 1,
  limit: 20,
  status: ['ACTIVE'],
  verification_status: ['APPROVED'],
};

export function useLandingProperties(filters: PropertySearchFilters = DEFAULT_LANDING_FILTERS) {
  const query = useQuery({
    queryKey: ['landing-properties', filters],
    queryFn: async () => {
      const response = await landingService.searchProperties(filters);
      const cards: LandingPropertyCard[] = (response.data || []).map(mapBackendPropertyToCard);
      return {
        cards,
        pagination: response.pagination,
        raw: response.data,
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  return query;
}

export function useNewlyListedProperties(limit = 4) {
  return useQuery({
    queryKey: ['landing-newly-listed', limit],
    queryFn: () => landingService.getNewlyListedProperties(limit),
    staleTime: 1000 * 60 * 5,
  });
}
