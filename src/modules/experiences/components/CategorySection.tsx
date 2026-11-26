import { useRef, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, ScrollTrigger, MQ } from '../lib/motion';
import { EXPERIENCE_CATEGORIES } from '../data/experienceContent';
import { SmartImage } from './SmartImage';

interface CategorySectionProps {
  counts: Record<string, number>;
  onSelect: (slug: string) => void;
}

export const CategorySection = ({ counts, onSelect }: CategorySectionProps) => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motionOK, () => {
        gsap.from('.cat-heading > *', {
          y: 40,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.cat-heading', start: 'top 80%' },
        });

        // Cards rise in rows as they enter (batched so each row staggers together).
        gsap.set('.cat-card', { y: 80, autoAlpha: 0, rotateX: -12 });
        ScrollTrigger.batch('.cat-card', {
          start: 'top 90%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              autoAlpha: 1,
              rotateX: 0,
              stagger: 0.08,
              duration: 1,
              ease: 'expo.out',
              overwrite: true,
            }),
        });
      });

      // Pointer tilt + glare (only where hover exists).
      mm.add(`(hover: hover) and (pointer: fine) and ${MQ.motionOK}`, () => {
        const cards = gsap.utils.toArray<HTMLElement>('.cat-card-inner');
        const cleanups = cards.map((card) => {
          const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
          const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
          const glare = card.querySelector<HTMLElement>('.cat-glare');
          const img = card.querySelector<HTMLElement>('.cat-img');

          const move = contextSafe!((e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            ry((px - 0.5) * 14);
            rx((0.5 - py) * 12);
            if (glare) gsap.set(glare, { background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.45), transparent 55%)` });
          });
          const enter = contextSafe!(() => {
            gsap.to(img, { scale: 1.12, duration: 0.8, ease: 'power3.out' });
            gsap.to(glare, { autoAlpha: 1, duration: 0.3 });
          });
          const leave = contextSafe!(() => {
            rx(0);
            ry(0);
            gsap.to(img, { scale: 1, duration: 0.8, ease: 'power3.out' });
            gsap.to(glare, { autoAlpha: 0, duration: 0.4 });
          });

          card.addEventListener('pointermove', move);
          card.addEventListener('pointerenter', enter);
          card.addEventListener('pointerleave', leave);
          return () => {
            card.removeEventListener('pointermove', move);
            card.removeEventListener('pointerenter', enter);
            card.removeEventListener('pointerleave', leave);
          };
        });
        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: root }
  );

  return (
    <section id="categories" ref={root} className="relative overflow-hidden bg-exp-night py-24 text-white md:py-32">
      {/* soft light blobs */}
      <div className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-exp-lagoon/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[24rem] w-[24rem] rounded-full bg-exp-pink/20 blur-[120px]" />

      <div className="relative mx-auto w-[min(1320px,92%)]">
        <div className="cat-heading mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-exp-marigold">Experiences · Category</p>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4.5rem)] font-light leading-none">
              Choose your <em className="bg-gradient-to-r from-exp-marigold via-exp-coral to-exp-pink bg-clip-text pr-[0.06em] italic text-transparent">category</em>
            </h2>
          </div>
          <p className="max-w-sm text-white/70">
            Ten centrally curated worlds, each tagged and checked by our area coordinators. Pick one to see what local hosts
            are offering.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" style={{ perspective: 1200 }}>
          {EXPERIENCE_CATEGORIES.map((cat, i) => {
            const count = counts[cat.slug] ?? 0;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onSelect(cat.slug)}
                className="cat-card group text-left focus-visible:outline-none"
                style={{ '--accent': cat.accent } as CSSProperties}
                aria-label={`${cat.name}: ${count} experiences`}
              >
                <div
                  className="cat-card-inner relative flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-white p-2.5 text-exp-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,.6)] ring-0 ring-[var(--accent)] transition-[box-shadow] duration-300 group-hover:shadow-[0_30px_60px_-20px_var(--accent)] group-hover:ring-2 group-focus-visible:ring-4"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="relative aspect-[16/11] overflow-hidden rounded-[1.2rem]">
                    <SmartImage src={cat.image} alt={cat.name} className="cat-img h-full w-full object-cover" />
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `linear-gradient(to top, ${cat.accent}aa, transparent)` }}
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[var(--accent)] px-2.5 py-1 font-display text-xs font-semibold text-white shadow-lg">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col px-2 pb-2 pt-4" style={{ transform: 'translateZ(30px)' }}>
                    <h3 className="font-semibold leading-tight">{cat.name}</h3>
                    <p className="mt-2 line-clamp-4 text-[13px] leading-relaxed text-black/60">{cat.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-4 text-xs font-medium">
                      <span className="flex items-center gap-1.5 font-semibold text-exp-ink/70">
                        <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                        {count > 0 ? `${count} experience${count === 1 ? '' : 's'}` : 'Coming soon'}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-exp-ink text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-[var(--accent)]">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                  <div className="cat-glare pointer-events-none invisible absolute inset-0 rounded-[1.6rem] opacity-0 mix-blend-soft-light" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
