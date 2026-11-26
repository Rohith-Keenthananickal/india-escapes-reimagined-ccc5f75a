import { useMemo, useRef, useState, type CSSProperties } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap, useGSAP, SplitText, MQ } from '../lib/motion';
import { SEARCH_TAGS, getCategory, resolveCategorySlug } from '../data/experienceContent';
import { searchExperiences } from '../hooks/useExperienceCatalog';
import type { NormalizedExperience } from '../types/experiences.types';
import { ExperienceTile } from './ExperienceTile';

interface SearchSectionProps {
  experiences: NormalizedExperience[];
  likedIds: number[];
  onToggleLike: (id: number) => void;
  onOpen: (experience: NormalizedExperience) => void;
}

const MAX_RESULTS = 8;

export const SearchSection = ({ experiences, likedIds, onToggleLike, onOpen }: SearchSectionProps) => {
  const root = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const term = query.trim();

  const results = useMemo(() => (term ? searchExperiences(experiences, term) : []), [experiences, term]);

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motionOK, () => {
        SplitText.create('.search-word', {
          type: 'chars',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 120,
              autoAlpha: 0,
              rotate: () => gsap.utils.random(-25, 25),
              stagger: { each: 0.05, from: 'random' },
              duration: 1.1,
              ease: 'expo.out',
              scrollTrigger: { trigger: '.search-word', start: 'top 85%' },
            }),
        });

        gsap.from('.search-lead, .search-logo, .search-bar', {
          y: 40,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        });

        gsap.from('.search-tag', {
          scale: 0.6,
          autoAlpha: 0,
          duration: 0.6,
          ease: 'back.out(2)',
          stagger: { each: 0.025, grid: 'auto', from: 'center' },
          scrollTrigger: { trigger: '.search-tags', start: 'top 90%' },
        });
      });

      // Magnetic chips: they lean toward the cursor.
      mm.add(`(hover: hover) and (pointer: fine) and ${MQ.motionOK}`, () => {
        const chips = gsap.utils.toArray<HTMLElement>('.search-tag');
        const cleanups = chips.map((chip) => {
          const xTo = gsap.quickTo(chip, 'x', { duration: 0.4, ease: 'power3' });
          const yTo = gsap.quickTo(chip, 'y', { duration: 0.4, ease: 'power3' });
          const move = contextSafe!((e: PointerEvent) => {
            const r = chip.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.45);
          });
          const leave = contextSafe!(() => {
            gsap.to(chip, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.35)', overwrite: true });
          });
          chip.addEventListener('pointermove', move);
          chip.addEventListener('pointerleave', leave);
          return () => {
            chip.removeEventListener('pointermove', move);
            chip.removeEventListener('pointerleave', leave);
          };
        });
        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: root }
  );

  // Results cascade in whenever the term changes.
  useGSAP(
    () => {
      if (!term || window.matchMedia(MQ.reduce).matches) return;
      gsap.fromTo(
        '.search-results .explore-tile, .search-empty',
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.6, ease: 'power3.out', overwrite: true }
      );
    },
    { scope: root, dependencies: [term] }
  );

  const pickTag = (tag: string) => {
    setQuery((q) => (q.toLowerCase() === tag.toLowerCase() ? '' : tag));
  };

  return (
    <section id="search" ref={root} className="relative overflow-hidden bg-exp-night py-24 text-exp-cream md:py-32">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-exp-plum blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-exp-lagoon/25 blur-[120px]" />
      <div className="relative mx-auto w-[min(1200px,92%)]">
        <div className="flex items-start justify-between gap-6">
          <h2 className="leading-none">
            <span className="search-lead block text-[clamp(1.8rem,4vw,3.2rem)] font-semibold">Search your favourite</span>
            <span className="search-word mt-2 block font-display text-[clamp(3.2rem,10vw,8.5rem)] font-light tracking-[0.18em]">
              Experience
            </span>
          </h2>
          <div className="search-logo hidden rounded-2xl bg-exp-cream px-5 py-3 md:block">
            <img src="/Logo_color.svg" alt="TripHavenco" className="h-9 w-auto" />
          </div>
        </div>

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            inputRef.current?.blur();
          }}
          className="search-bar mt-12 flex max-w-3xl items-center gap-3 rounded-full border-[3px] border-white/80 bg-white/[0.04] py-2 backdrop-blur pl-7 pr-2 transition-colors focus-within:border-exp-marigold focus-within:shadow-[0_0_0_6px_rgba(255,182,39,.15)]"
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “Kathakali”, “Alappuzha” or “cooking”"
            aria-label="Search experiences"
            className="h-12 flex-1 bg-transparent text-lg text-white placeholder:text-white/35 focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="rounded-full p-2 text-white/60 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          )}
          <button
            type="submit"
            aria-label="Search"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-exp-coral to-exp-pink text-white transition-transform hover:scale-105"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>

        <div className="search-tags mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {SEARCH_TAGS.map((tag) => {
            const active = term.toLowerCase() === tag.toLowerCase();
            const accent = getCategory(resolveCategorySlug(tag)).accent;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => pickTag(tag)}
                aria-pressed={active}
                style={{ '--accent': accent } as CSSProperties}
                className={cn(
                  'search-tag flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-left text-sm font-semibold transition-colors duration-300',
                  active
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_10px_30px_-10px_var(--accent)]'
                    : 'border-white/20 text-white hover:border-[var(--accent)] hover:text-[var(--accent)]'
                )}
              >
                <span className={cn('h-2 w-2 rounded-full', active ? 'bg-white' : 'bg-[var(--accent)]')} />
                {tag}
              </button>
            );
          })}
        </div>

        {term && (
          <div className="search-results mt-14" aria-live="polite">
            <p className="mb-6 text-sm text-white/60">
              {results.length > 0 ? (
                <>
                  <span className="font-semibold text-white">{results.length}</span> experience{results.length === 1 ? '' : 's'} for “{term}”
                  {results.length > MAX_RESULTS && ` · showing the top ${MAX_RESULTS}`}
                </>
              ) : null}
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {results.slice(0, MAX_RESULTS).map((exp) => (
                  <ExperienceTile
                    key={exp.id}
                    experience={exp}
                    isLiked={likedIds.includes(exp.id)}
                    onToggleLike={onToggleLike}
                    onOpen={onOpen}
                  />
                ))}
              </div>
            ) : (
              <div className="search-empty rounded-[1.6rem] border border-dashed border-white/20 p-10 text-center">
                <p className="font-display text-2xl">Nothing for “{term}” yet</p>
                <p className="mt-2 text-white/60">New hosts join every week. Try one of the tags above.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchSection;
