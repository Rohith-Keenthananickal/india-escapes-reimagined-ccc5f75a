import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, MQ } from '../lib/motion';
import { EXPERIENCE_CATEGORIES, HYPER_LOCAL_TARGET, SEARCH_TAGS } from '../data/experienceContent';
import { ContourPattern } from './brand';

const ROW_A = EXPERIENCE_CATEGORIES.map((c) => c.short);
const ROW_B = SEARCH_TAGS.slice(0, 12);

const MarqueeRow = ({ items, className }: { items: string[]; className: string }) => (
  <div className={`flex w-max ${className}`} aria-hidden>
    {[0, 1].map((copy) => (
      <div key={copy} className="flex shrink-0 items-center">
        {items.map((item) => (
          <span key={`${copy}-${item}`} className="flex items-center whitespace-nowrap px-6">
            {item}
            <span className="ml-12 text-[0.35em] text-exp-gold [-webkit-text-stroke:0]">✦</span>
          </span>
        ))}
      </div>
    ))}
  </div>
);

export const HyperLocalCounter = () => {
  const root = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const format = (n: number) => Math.round(n).toLocaleString('en-IN');

      mm.add(MQ.motionOK, () => {
        // Counter is scrubbed to scroll: scroll back and it counts down.
        const state = { value: 0 };
        gsap.to(state, {
          value: HYPER_LOCAL_TARGET,
          ease: 'power2.out',
          onUpdate: () => {
            if (numberRef.current) numberRef.current.textContent = format(state.value);
          },
          scrollTrigger: { trigger: '.counter-stage', start: 'top 85%', end: 'center 45%', scrub: 0.6 },
        });

        gsap.from('.counter-word', {
          yPercent: 100,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.counter-stage', start: 'top 70%' },
        });

        // Infinite marquees whose speed (and direction) follow scroll velocity.
        const a = gsap.to('.marquee-a', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
        const b = gsap.fromTo('.marquee-b', { xPercent: -50 }, { xPercent: 0, duration: 46, ease: 'none', repeat: -1 });
        // Start deep into the repeat cycle so a negative timeScale (scrolling up) keeps looping instead of hitting 0.
        a.totalTime(a.duration() * 500);
        b.totalTime(b.duration() * 500);

        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const boost = gsap.utils.clamp(1, 8, 1 + Math.abs(self.getVelocity()) / 300);
            const dir = self.direction;
            gsap.to([a, b], { timeScale: boost * dir, duration: 0.2, overwrite: true });
            gsap.to([a, b], { timeScale: dir, duration: 1.2, delay: 0.25, ease: 'power2.out' });
          },
        });
      });

      mm.add(MQ.reduce, () => {
        if (numberRef.current) numberRef.current.textContent = format(HYPER_LOCAL_TARGET);
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-exp-sun py-24 text-exp-ink md:py-32">
      {/* sunset glow rising behind the number */}
      <ContourPattern className="text-exp-gold/40" seed={5} rings={12} />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[60rem] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-[120px]" />

      {/* top strip: category names, outlined so they never compete with the number */}
      <div className="pointer-events-none relative mb-14 overflow-hidden md:mb-20">
        <MarqueeRow
          items={ROW_A}
          className="marquee-a font-heading text-[clamp(2.2rem,5vw,4rem)] font-extrabold text-transparent [-webkit-text-stroke:1.5px_rgba(31,31,31,0.16)]"
        />
      </div>

      <div className="counter-stage relative mx-auto w-[min(1200px,92%)] text-center">
        <p className="mb-6 inline-flex items-center gap-3 rounded-full bg-exp-ink px-5 py-2 font-heading text-xs font-semibold uppercase tracking-[0.25em] text-exp-sun">
          One state. Endless stories.
        </p>
        <h2 className="font-heading font-extrabold">
          <span
            ref={numberRef}
            className="block pb-[0.06em] text-[clamp(4.5rem,15vw,12.5rem)] leading-[0.95] tracking-[-0.04em] text-exp-ink tabular-nums"
          >
            0
          </span>
          <span className="mt-4 block overflow-hidden pb-2 text-[clamp(1.6rem,4vw,3.2rem)] leading-tight">
            {['Hyper-local', 'Experiences'].map((w) => (
              <span key={w} className="counter-word mx-2 inline-block">
                {w === 'Experiences' ? <span className="text-exp-deep">{w}</span> : w}
              </span>
            ))}
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-exp-ink/70">
          Every one of them hosted by a neighbour, a farmer, an artist or a family, and waiting for a guest like you.
        </p>
        <span className="sr-only">{HYPER_LOCAL_TARGET.toLocaleString('en-IN')} hyper-local experiences</span>
      </div>

      {/* bottom strip: search tags */}
      <div className="pointer-events-none relative mt-14 overflow-hidden md:mt-20">
        <MarqueeRow
          items={ROW_B}
          className="marquee-b text-[clamp(1rem,2vw,1.5rem)] font-semibold uppercase tracking-[0.25em] text-exp-ink/35"
        />
      </div>
    </section>
  );
};

export default HyperLocalCounter;
