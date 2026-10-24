import { useQuery } from '@tanstack/react-query';
import { landingService, mapBackendPropertyToCard } from '../services/landingService';
import type { PropertySearchFilters, LandingPropertyCard } from '../types/landing.types';

export function useLandingProperties(filters: PropertySearchFilters = {}) {
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
    staleTime: 1000 * 60 * 5, // 5 minutes cache
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
