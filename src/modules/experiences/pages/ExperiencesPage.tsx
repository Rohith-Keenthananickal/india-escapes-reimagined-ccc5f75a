import { useCallback, useMemo, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import { gsap, useGSAP, Flip, useSmoothScroll, scrollToSection } from '../lib/motion';
import { useExperienceCatalog } from '../hooks/useExperienceCatalog';
import type { NormalizedExperience } from '../types/experiences.types';
import { ExperienceHero } from '../components/ExperienceHero';
import { DiscoverSection } from '../components/DiscoverSection';
import { CategorySection } from '../components/CategorySection';
import { SignatureJourneys } from '../components/SignatureJourneys';
import { HyperLocalCounter } from '../components/HyperLocalCounter';
import { ExperienceExplorer, type SortKey } from '../components/ExperienceExplorer';
import { SearchSection } from '../components/SearchSection';
import { ExperienceDetailSheet } from '../components/ExperienceDetailSheet';

/**
 * Experiences page, structured after Experience.page.pdf:
 *   Hero → Discover → Choose your category → Signature journeys
 *   → 3,00,000 hyper-local → Experiences by category → Search
 * (The design's category-master dropdown screen is intentionally omitted.)
 */
export const ExperiencesPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortKey>('popularity');
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [selected, setSelected] = useState<NormalizedExperience | null>(null);

  const { experiences, isLoading, isError, refetch } = useExperienceCatalog(50);

  useSmoothScroll();

  const counts = useMemo(
    () =>
      experiences.reduce<Record<string, number>>((acc, e) => {
        acc[e.categorySlug] = (acc[e.categorySlug] ?? 0) + 1;
        return acc;
      }, {}),
    [experiences]
  );

  /** Capture tile positions before React re-renders, so the grid can Flip. */
  const captureFlip = () => {
    flipState.current = Flip.getState('#explore .explore-tile');
  };

  const changeCategory = useCallback((slug: string) => {
    captureFlip();
    setCategory(slug);
  }, []);

  const changeSort = useCallback((sort: SortKey) => {
    captureFlip();
    setSortBy(sort);
  }, []);

  const exploreCategory = useCallback(
    (slug: string) => {
      changeCategory(slug);
      scrollToSection('explore');
    },
    [changeCategory]
  );

  const toggleLike = useCallback((id: number) => {
    setLikedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  // Page-wide scroll progress bar.
  useGSAP(
    () => {
      gsap.to('.page-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: pageRef.current, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      });
    },
    { scope: pageRef }
  );

  return (
    <div ref={pageRef} className="min-h-screen bg-exp-ink">
      <Navbar />
      <div className="page-progress fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-gradient-to-r from-exp-lagoon via-exp-marigold to-exp-pink" />

      <main>
        <ExperienceHero />
        <DiscoverSection />
        <CategorySection counts={counts} onSelect={exploreCategory} />
        <SignatureJourneys onExploreCategory={exploreCategory} />
        <HyperLocalCounter />
        <ExperienceExplorer
          experiences={experiences}
          counts={counts}
          category={category}
          sortBy={sortBy}
          onCategoryChange={changeCategory}
          onSortChange={changeSort}
          flipState={flipState}
          likedIds={likedIds}
          onToggleLike={toggleLike}
          onOpen={setSelected}
          isSyncing={isLoading}
          isError={isError}
          onRetry={() => refetch()}
        />
        <SearchSection experiences={experiences} likedIds={likedIds} onToggleLike={toggleLike} onOpen={setSelected} />
      </main>

      <ExperienceDetailSheet experience={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
};

export default ExperiencesPage;
