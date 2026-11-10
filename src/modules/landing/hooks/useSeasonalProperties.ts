import { useQuery } from '@tanstack/react-query';
import { landingService } from '../services/landingService';

export function useSeasonalProperties(season: string, limit = 3) {
  return useQuery({
    queryKey: ['landing-seasonal-properties', season, limit],
    queryFn: () => landingService.getSeasonalProperties(season, limit),
    enabled: Boolean(season),
    staleTime: 1000 * 60 * 5,
  });
}
