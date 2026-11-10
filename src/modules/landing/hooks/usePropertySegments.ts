import { useQuery } from '@tanstack/react-query';
import { landingService } from '../services/landingService';

export function usePropertySegments() {
  return useQuery({
    queryKey: ['landing-property-segments'],
    queryFn: () => landingService.getPropertySegments(),
    staleTime: 1000 * 60 * 10,
  });
}
