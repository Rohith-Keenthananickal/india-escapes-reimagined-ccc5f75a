import { useQuery } from '@tanstack/react-query';
import propertyDetailsService from '../services/propertyDetailsService';

export function usePropertyDetails(id: string | number | undefined) {
  return useQuery({
    queryKey: ['property-details', id],
    queryFn: () => {
      if (!id) throw new Error('Property ID is required');
      return propertyDetailsService.getPropertyById(id);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
