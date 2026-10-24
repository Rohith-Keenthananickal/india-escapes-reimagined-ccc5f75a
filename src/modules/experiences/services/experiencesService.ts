import apiClient from '@/services/apiClient';
import type { ExperienceListResponse } from '@/modules/landing/types/landing.types';
import type { NormalizedExperience } from '../types/experiences.types';

export const experiencesService = {
  async getExperiences(limit = 50): Promise<NormalizedExperience[]> {
    const response = await apiClient.get<ExperienceListResponse>('/api/v1/experiences', {
      params: {
        skip: 0,
        limit,
        status_filter: 'ACTIVE',
      },
    });

    const items = response.data || [];

    return items
      .filter((item) => item.title && item.title !== 'string')
      .map((item) => {
        // Only use genuine photos uploaded to backend
        const genuinePhoto =
          item.photos &&
          item.photos.length > 0 &&
          item.photos[0] &&
          !item.photos[0].includes('example.com') &&
          !item.photos[0].includes('string')
            ? item.photos[0]
            : '';

        const duration = item.duration
          ? `${item.duration} ${item.duration_unit ? item.duration_unit.toLowerCase() + (item.duration > 1 ? 's' : '') : 'hours'}`
          : 'Not specified';

        return {
          id: item.id,
          title: item.title,
          category: item.category || 'General',
          duration,
          price: item.price || 0,
          isPriceByGuest: item.is_price_by_guest ?? true,
          image: genuinePhoto,
          description:
            item.description && item.description !== 'No description provided.'
              ? item.description
              : '',
          groupSize: item.group_size || 0,
          languages: item.languages || [],
          included: item.included || [],
          rating: 0, // Backend has no ratings model for experiences yet
          reviews: 0,
        };
      });
  },
};

export default experiencesService;
