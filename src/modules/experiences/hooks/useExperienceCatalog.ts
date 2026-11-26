import { useMemo } from 'react';
import { useExperiences } from './useExperiences';
import { normalizeExperience } from '../services/experiencesService';
import { MOCK_EXPERIENCES, USE_MOCK_EXPERIENCES } from '../data/mockExperiences';
import { EXPERIENCE_CATEGORIES } from '../data/experienceContent';
import type { NormalizedExperience } from '../types/experiences.types';

const MOCK_NORMALIZED: NormalizedExperience[] = USE_MOCK_EXPERIENCES
  ? MOCK_EXPERIENCES.map((item) => normalizeExperience(item, true))
  : [];

/**
 * Real experiences from the API first, padded with mock data while the
 * backend catalogue is thin. Removing the mock layer later means deleting
 * data/mockExperiences.ts and the two lines that reference it here.
 */
export function useExperienceCatalog(limit = 50) {
  const query = useExperiences(limit);

  const experiences = useMemo<NormalizedExperience[]>(() => {
    const live = query.data ?? [];
    const liveTitles = new Set(live.map((e) => e.title.trim().toLowerCase()));
    const padding = MOCK_NORMALIZED.filter((m) => !liveTitles.has(m.title.trim().toLowerCase()));
    return [...live, ...padding];
  }, [query.data]);

  return {
    ...query,
    experiences,
    liveCount: query.data?.length ?? 0,
  };
}

/**
 * Free-text search over title, description, location, etc. A term that is a
 * category keyword (e.g. "boating" → Water, "health" → Wellness) also pulls
 * in every experience from that category.
 */
export const searchExperiences = (list: NormalizedExperience[], term: string) => {
  const q = term.trim().toLowerCase();
  if (!q) return list;
  const keywordCategories = new Set(
    EXPERIENCE_CATEGORIES.filter((c) =>
      c.keywords.some((k) => k === q || (q.length > 3 && (k.startsWith(q) || q.startsWith(k))))
    ).map((c) => c.slug)
  );
  return list.filter(
    (e) =>
      keywordCategories.has(e.categorySlug) ||
      [e.title, e.description, e.category, e.subcategory, e.location, ...e.included]
        .join(' ')
        .toLowerCase()
        .includes(q)
  );
};
