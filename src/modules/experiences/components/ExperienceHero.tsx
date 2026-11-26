import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, ChevronDown, Compass } from 'lucide-react';
import { gsap, useGSAP, SplitText, MQ, scrollToSection } from '../lib/motion';
import { HERO_PHRASES, HYPER_LOCAL_TARGET, EXPERIENCE_CATEGORIES } from '../data/experienceContent';

const SLIDES = [
  { src: '/experiences/hero-kathakali-stage.jpg', caption: 'Kathakali & Mohiniyattam · Kochi' },
  {
    src: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=2000&q=75&auto=format&fit=crop',
    caption: 'Backwater villages · Alappuzha',
  },
  {
    src: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=2000&q=75&auto=format&fit=crop',
    caption: 'Kettuvallam cruise · Kumarakom',
  },
];

const SLIDE_SECONDS = 6.5;

/** Sunset gradient text (marigold → coral → pink). */
const ACCENT_TEXT = 'bg-gradient-to-r from-exp-marigold via-exp-coral to-exp-pink bg-clip-text text-transparent pr-[0.06em]';

interface ExploreLink {
  eyebrow: string;
  label: string;
  section?: string;
  href?: string;
}

const EXPLORE_LINKS: ExploreLink[] = [
  { eyebrow: 'Regional zones', label: 'Location', section: 'explore' },
  { eyebrow: 'Hidden gems', label: 'Sceneries', section: 'discover' },
  { eyebrow: 'Events', label: 'Family functions', section: 'journeys' },
  { eyebrow: 'Experiences', label: 'Category', section: 'categories' },
  { eyebrow: 'Where to rest', label: 'Stays', href: '/properties' },
];

export const ExperienceHero = () => {
  const root = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useGSAP(
    (context, contextSafe) => {
      const slides = gsap.utils.toArray<HTMLElement>('.hero-slide');
      const bars = gsap.utils.toArray<HTMLElement>('.hero-bar-fill');
      const captions = gsap.utils.toArray<HTMLElement>('.hero-caption');
      const counter = root.current?.querySelector<HTMLElement>('.hero-count');
      const mm = gsap.matchMedia();

      gsap.set(slides, { autoAlpha: 0 });
      gsap.set(slides[0], { autoAlpha: 1 });
      gsap.set(captions, { autoAlpha: 0, y: 10 });
      gsap.set(captions[0], { autoAlpha: 1, y: 0 });
      // Without motion only the first phrase shows (they share one grid cell).
      gsap.set(gsap.utils.toArray('.hero-phrase').slice(1), { autoAlpha: 0 });

      mm.add(MQ.motionOK, () => {
        // ── Intro ──────────────────────────────────────────────────
        const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
        intro.from('.hero-media', { scale: 1.25, duration: 2.2, ease: 'power3.out' }, 0);
        intro.from('.hero-veil', { autoAlpha: 1, duration: 1.4, ease: 'power2.out' }, 0);
        gsap.to('.hero-glow', {
          scale: 1.25,
          xPercent: 12,
          yPercent: -8,
          duration: 7,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          stagger: 2.5,
        });

        SplitText.create('.hero-title', {
          type: 'lines,words',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) => {
            // background-clip:text breaks when children are transformed, so move
            // the gradient from the <em> onto each split word.
            self.words.forEach((w) => {
              const em = w.closest('.hero-accent');
              if (!em) return;
              em.classList.remove(...ACCENT_TEXT.split(' '));
              w.classList.add(...ACCENT_TEXT.split(' '));
            });
            return gsap.from(self.words, {
              yPercent: 115,
              rotate: 4,
              duration: 1.3,
              stagger: 0.055,
              ease: 'expo.out',
              delay: 0.35,
            });
          },
        });

        intro
          .from('.hero-explore-item', { y: -24, autoAlpha: 0, stagger: 0.07, duration: 1 }, 0.3)
          .from('.hero-eyebrow', { y: 20, autoAlpha: 0, duration: 1 }, 0.5)
          .from('.hero-sub', { y: 30, autoAlpha: 0, duration: 1.1 }, 0.9)
          .from('.hero-cta > *', { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1, clearProps: 'transform,opacity,visibility' }, 1.05)
          .from('.hero-meta > *', { y: 20, autoAlpha: 0, stagger: 0.08, duration: 1 }, 1.2);

        // ── Ken Burns slideshow ────────────────────────────────────
        let index = 0;
        const play = (i: number) => {
          const img = slides[i].querySelector('img');
          gsap.fromTo(img, { scale: 1.18, xPercent: i % 2 ? -3 : 3 }, { scale: 1, xPercent: 0, duration: SLIDE_SECONDS + 1.5, ease: 'none' });
          gsap.fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: SLIDE_SECONDS, ease: 'none' });
          if (counter) counter.textContent = String(i + 1).padStart(2, '0');
          gsap.delayedCall(SLIDE_SECONDS, next);
        };
        const next = () => {
          const prev = index;
          index = (index + 1) % slides.length;
          gsap.set(bars[prev], { scaleX: 0 });
          gsap.set(slides[index], { zIndex: 2 });
          gsap.set(slides[prev], { zIndex: 1 });
          gsap.fromTo(slides[index], { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.6, ease: 'power2.inOut', onComplete: () => gsap.set(slides[prev], { autoAlpha: 0 }) });
          gsap.to(captions[prev], { autoAlpha: 0, y: -10, duration: 0.5 });
          gsap.fromTo(captions[index], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.4 });
          play(index);
        };
        play(0);

        // ── Rotating phrase ticker ─────────────────────────────────
        const phrases = gsap.utils.toArray<HTMLElement>('.hero-phrase');
        gsap.set(phrases, { yPercent: 110, autoAlpha: 0 });
        const ticker = gsap.timeline({ repeat: -1, delay: 1.6 });
        phrases.forEach((p) => {
          ticker
            .to(p, { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' })
            .to(p, { yPercent: -110, autoAlpha: 0, duration: 0.6, ease: 'power3.in' }, '+=1.7');
        });

        // ── Scroll-out: media drifts, copy lifts away ──────────────
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
          })
          .to('.hero-parallax', { yPercent: 18, scale: 1.08, ease: 'none' }, 0)
          .to('.hero-content', { y: -120, autoAlpha: 0, ease: 'none' }, 0)
          .to('.hero-veil-scroll', { autoAlpha: 0.85, ease: 'none' }, 0);
      });

      // ── Pointer parallax (desktop + fine pointer only) ───────────
      mm.add(`${MQ.desktop} and (pointer: fine) and ${MQ.motionOK}`, () => {
        const xTo = gsap.quickTo('.hero-media', 'x', { duration: 1.2, ease: 'power3' });
        const yTo = gsap.quickTo('.hero-media', 'y', { duration: 1.2, ease: 'power3' });
        const onMove = contextSafe!((e: MouseEvent) => {
          const { innerWidth: w, innerHeight: h } = window;
          xTo((e.clientX / w - 0.5) * -28);
          yTo((e.clientY / h - 0.5) * -18);
        });
        const el = root.current!;
        el.addEventListener('mousemove', onMove);
        return () => el.removeEventListener('mousemove', onMove);
      });
    },
    { scope: root }
  );

  const go = (link: ExploreLink) => {
    if (link.href) navigate(link.href);
    else if (link.section) scrollToSection(link.section);
  };

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[calc(100svh-4rem)] w-full flex-col overflow-hidden bg-exp-ink text-white md:min-h-[680px] md:h-[calc(100svh-4rem)]"
      aria-label="Experiences hero"
    >
      {/* Media */}
      <div className="hero-parallax absolute inset-0 will-change-transform">
        <div className="hero-media absolute -inset-8">
          {SLIDES.map((slide, i) => (
            <div key={slide.src} className="hero-slide absolute inset-0 overflow-hidden">
              <img
                src={slide.src}
                alt=""
                className="h-full w-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-exp-ink via-exp-ink/40 to-exp-ink/60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-exp-ink/80 via-transparent to-transparent" />
      {/* warm dusk glows */}
      <div className="hero-glow pointer-events-none absolute -bottom-48 -left-32 h-[34rem] w-[34rem] rounded-full bg-exp-coral/30 blur-[130px]" />
      <div className="hero-glow pointer-events-none absolute -right-24 top-1/4 h-[28rem] w-[28rem] rounded-full bg-exp-plum/60 blur-[120px]" />
      <div className="hero-veil-scroll pointer-events-none absolute inset-0 bg-exp-ink opacity-0" />
      <div className="hero-veil pointer-events-none absolute inset-0 bg-exp-ink opacity-0" />

      {/* Explore bar (top row in the design) */}
      <nav
        aria-label="Explore experiences by"
        className="relative z-10 mx-auto mt-6 hidden w-[min(1100px,92%)] grid-cols-5 rounded-2xl border border-white/15 bg-white/[0.06] px-2 py-2 backdrop-blur-md md:grid"
      >
        {EXPLORE_LINKS.map((link) => (
          <button
            key={link.label}
            onClick={() => go(link)}
            className="hero-explore-item group rounded-xl px-4 py-2 text-left transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
          >
            <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">{link.eyebrow}</span>
            <span className="mt-0.5 flex items-center gap-1 font-display text-lg text-white">
              {link.label}
              {!link.href && (
                <ChevronDown className="h-4 w-4 text-exp-marigold transition-transform duration-300 group-hover:translate-y-0.5" />
              )}
            </span>
          </button>
        ))}
      </nav>

      {/* Copy */}
      <div className="hero-content relative z-10 mx-auto mt-auto w-[min(1280px,92%)] pb-24 pt-28 md:pb-28 md:pt-10">
        <p className="hero-eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 backdrop-blur">
          <Compass className="h-3.5 w-3.5 text-exp-marigold" />
          TripHavenco Experiences · Kerala
        </p>

        <h1 className="hero-title max-w-5xl font-display text-[clamp(2.6rem,7vw,6.5rem)] font-light leading-[0.95] tracking-[-0.02em]">
          An open, provider-led <em className={`hero-accent font-normal italic ${ACCENT_TEXT}`}>experience</em>{' '}
          <em className={`hero-accent font-normal italic ${ACCENT_TEXT}`}>marketplace</em>
        </h1>

        <div className="hero-sub mt-6 max-w-2xl space-y-3">
          <p className="text-base text-white/75 md:text-lg">
            Featuring centrally managed categories and multiple classification tags, hosted by the people who live it.
          </p>
          <p className="flex flex-wrap items-center gap-x-2 text-lg md:text-2xl">
            <span className="text-white/60">Live</span>
            <span className="relative inline-grid overflow-hidden py-1 leading-tight" aria-hidden>
              {HERO_PHRASES.map((phrase) => (
                <span
                  key={phrase}
                  className="hero-phrase col-start-1 row-start-1 whitespace-nowrap font-display italic text-exp-marigold"
                >
                  {phrase}
                </span>
              ))}
            </span>
          </p>
          <span className="sr-only">{HERO_PHRASES.join(', ')}</span>
        </div>

        <div className="hero-cta mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => scrollToSection('explore')}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-exp-coral to-exp-pink px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(255,107,87,.7)] transition-[filter,box-shadow] hover:brightness-110"
          >
            Explore experiences
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
          <button
            onClick={() => scrollToSection('categories')}
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white hover:bg-white/10"
          >
            Choose a category
          </button>
        </div>
      </div>

      {/* Bottom meta: stats + slide indicator */}
      <div className="hero-meta absolute inset-x-0 bottom-0 z-10 mx-auto flex w-[min(1280px,92%)] items-end justify-between gap-6 border-t border-white/10 py-5 text-xs text-white/60">
        <div className="hidden gap-8 sm:flex">
          <span>
            <strong className="font-display text-base text-white">{HYPER_LOCAL_TARGET.toLocaleString('en-IN')}+</strong> hyper-local
            experiences
          </span>
          <span>
            <strong className="font-display text-base text-white">{EXPERIENCE_CATEGORIES.length}</strong> curated categories
          </span>
          <span className="hidden lg:inline">
            <strong className="font-display text-base text-white">100%</strong> local hosts
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden h-4 min-w-[180px] md:block">
            {SLIDES.map((s) => (
              <span key={s.caption} className="hero-caption absolute right-0 whitespace-nowrap">
                {s.caption}
              </span>
            ))}
          </div>
          <span className="font-display text-sm text-white">
            <span className="hero-count">01</span>
            <span className="text-white/40"> / {String(SLIDES.length).padStart(2, '0')}</span>
          </span>
          <div className="flex gap-1.5">
            {SLIDES.map((s) => (
              <span key={s.src} className="h-[2px] w-8 overflow-hidden bg-white/20">
                <span className="hero-bar-fill block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-exp-marigold to-exp-coral" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceHero;
