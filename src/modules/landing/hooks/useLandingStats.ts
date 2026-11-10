import { useQuery } from '@tanstack/react-query';
import { landingService } from '../services/landingService';

export function useLandingStats() {
  return useQuery({
    queryKey: ['landing-stats'],
    queryFn: () => landingService.getStats(),
    staleTime: 1000 * 60 * 5,
  });
}
