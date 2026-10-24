import { useQuery } from '@tanstack/react-query';
import { landingService } from '../services/landingService';

export function useDistricts() {
  return useQuery({
    queryKey: ['districts-list'],
    queryFn: () => landingService.getDistricts(),
    staleTime: 1000 * 60 * 30, // 30 minutes cache for district metadata
  });
}
