import { useQuery } from '@tanstack/react-query';
import { landingService } from '../services/landingService';

export function useLandingExperiences(limit = 6) {
  return useQuery({
    queryKey: ['landing-experiences', limit],
    queryFn: () => landingService.getExperiences(limit),
    staleTime: 1000 * 60 * 5,
  });
}
