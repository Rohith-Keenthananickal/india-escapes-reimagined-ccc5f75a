import { useQuery } from '@tanstack/react-query';
import experiencesService from '../services/experiencesService';

export function useExperiences(limit = 50) {
  return useQuery({
    queryKey: ['experiences-list', limit],
    queryFn: () => experiencesService.getExperiences(limit),
    staleTime: 1000 * 60 * 5,
  });
}
