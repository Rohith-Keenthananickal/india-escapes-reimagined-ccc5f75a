import apiClient from '@/services/apiClient';
import type { ExperienceListResponse } from '@/modules/landing/types/landing.types';
import type { ExperienceSource, NormalizedExperience } from '../types/experiences.types';
import { resolveCategorySlug } from '../data/experienceContent';

const isGenuine = (value?: string | null): value is string =>
  !!value && value !== 'string' && !value.includes('example.com');

const formatDuration = (value?: number | null, unit?: string | null): string => {
  if (!value) return 'Flexible';
  const u = (unit || 'HOUR').toLowerCase();
  if (u === 'minute' && value >= 60 && value % 30 === 0) {
    const hours = value / 60;
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }
  return `${value} ${u}${value === 1 ? '' : 's'}`;
};

const cleanList = (list?: string[] | null): string[] => (list || []).filter(isGenuine);

/** Map a backend experience row (or mock row of the same shape) to the UI model. */
export function normalizeExperience(item: ExperienceSource, isMock = false): NormalizedExperience {
  const photos = cleanList(item.photos);
  const description =
    item.description && item.description !== 'No description provided.' && item.description !== 'string'
      ? item.description
      : '';

  return {
    id: item.id,
    title: item.title,
    category: item.category || 'General',
    categorySlug: resolveCategorySlug(item.category),
    subcategory: isGenuine(item.subcategory) ? item.subcategory : '',
    duration: formatDuration(item.duration, item.duration_unit),
    price: item.price || 0,
    isPriceByGuest: item.is_price_by_guest ?? true,
    image: photos[0] || '',
    photos,
    videoUrl: isGenuine(item.video_url) ? item.video_url : '',
    description,
    groupSize: item.group_size || 0,
    languages: cleanList(item.languages),
    included: cleanList(item.included),
    includedInPrice: cleanList(item.included_in_price),
    safetyItems: cleanList(item.safety_items),
    legalDeclarations: cleanList(item.legal_declarations),
    location: item.location || '',
    rating: item.rating || 0,
    reviews: item.reviews || 0,
    isMock,
  };
}

export const experiencesService = {
  async getExperiences(limit = 50): Promise<NormalizedExperience[]> {
    const response = await apiClient.get<ExperienceListResponse>('/api/v1/experiences', {
      params: {
        skip: 0,
        limit,
        status_filter: 'ACTIVE',
        approval_status_filter: 'APPROVED',
      },
    });

    const items = response.data || [];

    return items
      .filter((item) => item.title && item.title !== 'string')
      .map((item) => normalizeExperience(item));
  },
};

export default experiencesService;
