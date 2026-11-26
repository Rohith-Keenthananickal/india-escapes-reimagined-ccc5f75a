import { useMemo, useRef, type MutableRefObject } from 'react';
import { AlertCircle, Loader2, RefreshCw, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { gsap, useGSAP, Flip, ScrollTrigger, MQ, scrollToSection } from '../lib/motion';
import { EXPERIENCE_CATEGORIES, getCategory } from '../data/experienceContent';
import type { NormalizedExperience } from '../types/experiences.types';
import { ExperienceTile } from './ExperienceTile';

export type SortKey = 'popularity' | 'rating' | 'price-low' | 'price-high';

interface ExperienceExplorerProps {
  experiences: NormalizedExperience[];
  counts: Record<string, number>;
  category: string;
  sortBy: SortKey;
  onCategoryChange: (slug: string) => void;
  onSortChange: (sort: SortKey) => void;
  /** Flip state captured by the parent right before a filter change. */
  flipState: MutableRefObject<Flip.FlipState | null>;
  likedIds: number[];
  onToggleLike: (id: number) => void;
  onOpen: (experience: NormalizedExperience) => void;
  isSyncing: boolean;
  isError: boolean;
  onRetry: () => void;
}

const sorters: Record<SortKey, (a: NormalizedExperience, b: NormalizedExperience) => number> = {
  popularity: (a, b) => b.reviews - a.reviews,
  rating: (a, b) => b.rating - a.rating,
  'price-low': (a, b) => (a.price || Infinity) - (b.price || Infinity),
  'price-high': (a, b) => b.price - a.price,
};

export const ExperienceExplorer = ({
  experiences,
  counts,
  category,
  sortBy,
  onCategoryChange,
  onSortChange,
  flipState,
  likedIds,
  onToggleLike,
  onOpen,
  isSyncing,
  isError,
  onRetry,
}: ExperienceExplorerProps) => {
  const root = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const introTween = useRef<gsap.core.Tween | null>(null);

  const visible = useMemo(() => {
    const list = category === 'all' ? experiences : experiences.filter((e) => e.categorySlug === category);
    // Live (non-mock) listings always lead, then the chosen sort.
    return [...list].sort((a, b) => Number(a.isMock) - Number(b.isMock) || sorters[sortBy](a, b));
  }, [experiences, category, sortBy]);

  const tabs = useMemo(
    () => [
      { slug: 'all', label: 'All', count: experiences.length },
      ...EXPERIENCE_CATEGORIES.map((c) => ({ slug: c.slug, label: c.short, count: counts[c.slug] ?? 0 })),
    ],
    [experiences.length, counts]
  );

  // Section intro (once).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOK, () => {
        gsap.from('.explore-head > *', {
          y: 40,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.explore-head', start: 'top 85%' },
        });
        introTween.current = gsap.from('.explore-grid > *', {
          y: 60,
          autoAlpha: 0,
          stagger: 0.06,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: { trigger: '.explore-grid', start: 'top 85%', once: true },
        });
      });
    },
    { scope: root }
  );

  // Flip the grid whenever the filter/sort changes.
  useGSAP(
    () => {
      const state = flipState.current;
      flipState.current = null;
      if (!state || window.matchMedia(MQ.reduce).matches) return;

      // A filter picked before the grid scrolled into view: finish the intro so it can't fight Flip.
      const intro = introTween.current;
      if (intro && intro.progress() < 1) {
        intro.scrollTrigger?.kill();
        intro.progress(1);
      }

      Flip.from(state, {
        targets: '.explore-grid .explore-tile',
        duration: 0.7,
        ease: 'power3.inOut',
        absolute: true,
        scale: true,
        stagger: 0.02,
        // Grid height changed, so re-measure triggers further down the page.
        onComplete: () => ScrollTrigger.refresh(),
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, scale: 0.85, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.04, delay: 0.15 }),
      });
    },
    { scope: root, dependencies: [category, sortBy] }
  );

  // Sliding tab indicator.
  useGSAP(
    () => {
      const row = tabsRef.current;
      const active = row?.querySelector<HTMLElement>(`[data-tab="${category}"]`);
      if (!row || !active) return;
      gsap.to('.tab-indicator', {
        x: active.offsetLeft,
        width: active.offsetWidth,
        backgroundColor: category === 'all' ? '#0D0F1E' : getCategory(category).accent,
        duration: 0.55,
        ease: 'expo.out',
      });
      const target = active.offsetLeft - row.clientWidth / 2 + active.offsetWidth / 2;
      gsap.to(row, { scrollLeft: target, duration: 0.6, ease: 'power3.out' });
    },
    { scope: root, dependencies: [category, tabs] }
  );

  return (
    <section id="explore" ref={root} className="relative overflow-hidden bg-exp-cream py-24 text-exp-ink md:py-32">
      <div className="pointer-events-none absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-exp-lagoon/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-exp-pink/10 blur-[120px]" />
      <div className="relative mx-auto w-[min(1320px,92%)]">
        <div className="explore-head mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-exp-coral">Regional zones · Location</p>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4.5rem)] font-light leading-none">
              Experiences <em className="bg-gradient-to-r from-exp-deep via-exp-lagoon to-exp-coral bg-clip-text pr-[0.06em] italic text-transparent">across Kerala</em>
            </h2>
            <p className="mt-4 max-w-xl text-exp-ink/60">
              Hand-picked, hyper-local and hosted by the people who know them best. Filter by category or sort to find yours.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isSyncing && (
              <span className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs text-exp-ink/70 shadow-sm">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Syncing live listings
              </span>
            )}
            <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortKey)}>
              <SelectTrigger className="h-11 w-48 rounded-full border-exp-ink/10 bg-white text-sm text-exp-ink shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most popular</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
                <SelectItem value="price-low">Price: low to high</SelectItem>
                <SelectItem value="price-high">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isError && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-exp-coral/30 bg-exp-coral/10 px-5 py-3 text-sm">
            <span className="flex items-center gap-2 text-[#B8382A]">
              <AlertCircle className="h-4 w-4" /> We couldn’t reach live listings. Showing curated previews for now.
            </span>
            <button onClick={onRetry} className="flex items-center gap-1.5 font-semibold text-exp-ink hover:underline">
              <RefreshCw className="h-3.5 w-3.5" /> Try again
            </button>
          </div>
        )}

        {/* Tabs */}
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Experience categories"
          className="relative mb-10 flex gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_10px_30px_-15px_rgba(13,15,30,.35)] ring-1 ring-exp-ink/5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <span className="tab-indicator pointer-events-none absolute left-0 top-1.5 h-[calc(100%-0.75rem)] w-0 rounded-full bg-exp-ink shadow-md" />
          {tabs.map((tab) => (
            <button
              key={tab.slug}
              role="tab"
              data-tab={tab.slug}
              aria-selected={category === tab.slug}
              onClick={() => onCategoryChange(tab.slug)}
              className={cn(
                'relative z-10 flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300',
                category === tab.slug ? 'text-white' : 'text-exp-ink/60 hover:text-exp-ink'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'rounded-full px-1.5 text-[10px] tabular-nums',
                  category === tab.slug ? 'bg-white/25' : 'bg-exp-ink/5'
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="explore-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((exp) => (
            <ExperienceTile
              key={exp.id}
              experience={exp}
              isLiked={likedIds.includes(exp.id)}
              onToggleLike={onToggleLike}
              onOpen={onOpen}
            />
          ))}

          {visible.length === 0 && (
            <div className="explore-tile col-span-full rounded-[1.6rem] border border-dashed border-exp-ink/20 p-12 text-center" data-flip-id="empty">
              <p className="font-display text-2xl">New hosts are joining this category</p>
              <p className="mt-2 text-exp-ink/60">Check back soon, or explore everything else Kerala has to offer.</p>
              <button
                onClick={() => onCategoryChange('all')}
                className="mt-6 rounded-full bg-exp-coral px-5 py-2.5 text-sm font-semibold text-white"
              >
                Show all experiences
              </button>
            </div>
          )}

          {/* "Many more experiences await discovery" (from the design) */}
          {visible.length > 0 && (
            <div
              data-flip-id="discover-more"
              className="explore-tile relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-exp-night via-exp-plum to-exp-coral p-7 text-white shadow-[0_30px_60px_-25px_rgba(58,23,71,.6)]"
            >
              <Sparkles className="h-7 w-7 text-exp-marigold" />
              <div>
                <p className="font-display text-3xl leading-tight">Many more experiences await discovery</p>
                <p className="mt-3 text-sm text-white/70">Explore all categories and discover something extraordinary.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => scrollToSection('search')}
                    className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-exp-ink hover:bg-exp-marigold"
                  >
                    <Search className="h-3.5 w-3.5" /> Search
                  </button>
                  <button
                    onClick={() => scrollToSection('categories')}
                    className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold hover:bg-white/10"
                  >
                    All categories
                  </button>
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full border border-white/10" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExperienceExplorer;
