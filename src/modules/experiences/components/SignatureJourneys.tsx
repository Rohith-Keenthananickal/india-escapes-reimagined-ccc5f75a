import { useRef, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { gsap, useGSAP, ScrollTrigger, MQ, formatINR } from '../lib/motion';
import { SIGNATURE_JOURNEYS, getCategory, onAccent } from '../data/experienceContent';
import { BrandPill, ContourPattern } from './brand';
import type { SignatureJourney } from '../types/experiences.types';
import { SmartImage } from './SmartImage';

interface SignatureJourneysProps {
  onExploreCategory: (slug: string) => void;
}

const unitLabel: Record<SignatureJourney['priceUnit'], string> = {
  package: 'per package',
  person: 'per person',
  group: 'per group',
};

export const SignatureJourneys = ({ onExploreCategory }: SignatureJourneysProps) => {
  const root = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const total = SIGNATURE_JOURNEYS.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const tintTo = (color?: string) =>
        color && gsap.to(root.current, { backgroundColor: color, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });

      gsap.from('.journeys-head > *', {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.journeys-head', start: 'top 85%' },
      });

      // ── Desktop: pin + horizontal track ─────────────────────────
      mm.add(`${MQ.desktop} and ${MQ.motionOK}`, () => {
        const track = root.current!.querySelector<HTMLElement>('.journeys-track')!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const counter = root.current!.querySelector<HTMLElement>('.journeys-index');

        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.journeys-pin',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set('.journeys-progress', { scaleX: self.progress });
              if (counter) {
                const i = Math.min(total, Math.round(self.progress * (total - 1)) + 1);
                counter.textContent = String(i).padStart(2, '0');
              }
            },
          },
        });

        // Each panel: photo drifts against the scroll direction, copy staggers in.
        gsap.utils.toArray<HTMLElement>('.journey-panel').forEach((panel) => {
          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: scrollTween,
            start: 'left 55%',
            end: 'right 55%',
            onToggle: (self) => self.isActive && tintTo(panel.dataset.tint),
          });
          gsap.fromTo(
            panel.querySelector('.journey-photo'),
            { xPercent: -12 },
            {
              xPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
          gsap.from(panel.querySelectorAll('.journey-reveal'), {
            y: 50,
            autoAlpha: 0,
            stagger: 0.07,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: 'left 70%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      });

      // ── Mobile / tablet: stacked cards ──────────────────────────
      mm.add(`${MQ.mobile} and ${MQ.motionOK}`, () => {
        gsap.utils.toArray<HTMLElement>('.journey-panel').forEach((panel) => {
          ScrollTrigger.create({
            trigger: panel,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => self.isActive && tintTo(panel.dataset.tint),
          });
          gsap.from(panel, {
            y: 70,
            autoAlpha: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 88%' },
          });
        });
      });
    },
    { scope: root }
  );

  const planJourney = (journey: SignatureJourney) =>
    navigate(`/contact?subject=${encodeURIComponent(`Experience package: ${journey.title}`)}`);

  return (
    <section id="journeys" ref={root} className="relative overflow-hidden bg-exp-ink text-white" style={{ backgroundColor: SIGNATURE_JOURNEYS[0].tint }}>
      <div className="journeys-pin relative lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden">
        <ContourPattern className="hidden text-white/[0.05] lg:block" seed={11} rings={12} />
        <div className="journeys-head relative mx-auto flex w-[min(1320px,92%)] flex-col justify-between gap-6 pb-10 pt-24 md:flex-row md:items-end lg:pb-8 lg:pt-20">
          <div>
            <BrandPill tone="teal" className="mb-5">Real family events · Family functions</BrandPill>
            <h2 className="font-heading text-[clamp(2.2rem,4.5vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
              Signature <span className="text-exp-sun">journeys</span>
            </h2>
            <p className="mt-4 max-w-xl text-white/70">
              Ready-made packages built around Kerala’s real moments: a family Sunday on the farm, a temple pilgrimage, a
              seat at a village wedding.
            </p>
          </div>
          <div className="hidden min-w-[220px] lg:block">
            <p className="mb-3 text-right font-heading text-sm">
              <span className="journeys-index text-2xl font-bold text-exp-sun">01</span>
              <span className="text-white/40"> / {String(total).padStart(2, '0')}</span>
            </p>
            <div className="h-px w-full bg-white/15">
              <div className="journeys-progress h-px w-full origin-left scale-x-0 bg-exp-sun" />
            </div>
            <p className="mt-3 text-right text-xs uppercase tracking-[0.25em] text-white/40">Scroll to travel →</p>
          </div>
        </div>

        <div className="journeys-track relative flex flex-col gap-16 px-[4vw] pb-24 lg:w-max lg:flex-row lg:gap-[4vw] lg:pb-0">
          {SIGNATURE_JOURNEYS.map((journey, i) => (
            <article
              key={journey.id}
              data-tint={journey.tint}
              style={{ '--accent': getCategory(journey.categorySlug).accent, '--on-accent': onAccent(getCategory(journey.categorySlug).accent) } as CSSProperties}
              className="journey-panel grid w-full items-center gap-8 lg:h-[min(58vh,620px)] lg:w-[min(1080px,82vw)] lg:grid-cols-[1.15fr_1fr] lg:gap-12"
            >
              <div className="relative h-[52vw] max-h-[460px] overflow-hidden rounded-[1.75rem] bg-black/30 sm:h-[44vw] lg:h-full lg:max-h-none">
                <div className="journey-photo absolute inset-y-0 -left-[14%] w-[128%]">
                  <SmartImage src={journey.image} alt={journey.title} className="h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-[var(--on-accent)] shadow-lg">
                  {getCategory(journey.categorySlug).name}
                </span>
              </div>

              <div className="relative">
                <span
                  className="journey-reveal pointer-events-none absolute -top-16 right-0 select-none font-heading text-[8rem] font-extrabold leading-none text-transparent lg:-top-24 lg:text-[10rem]"
                  style={{ WebkitTextStroke: '1.5px rgba(43,176,187,.28)' }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="journey-reveal mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 font-heading text-xs font-semibold text-white backdrop-blur">
                  {journey.audience}
                </p>
                <h3 className="journey-reveal font-heading text-[clamp(1.9rem,3.3vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">{journey.title}</h3>
                <p className="journey-reveal mt-3 text-white/65">{journey.tagline}</p>
                <ul className="mt-6 space-y-2.5">
                  {journey.highlights.map((h) => (
                    <li key={h} className="journey-reveal flex items-start gap-3 text-[15px] text-white/85">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-exp-sun text-exp-ink">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="journey-reveal mt-7 flex flex-wrap items-end justify-between gap-5 border-t border-white/10 pt-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Suggested package price</p>
                    <p className="font-heading text-2xl font-bold">
                      {formatINR(journey.priceFrom)} – {formatINR(journey.priceTo)}
                      <span className="ml-2 font-sans text-xs text-white/50">{unitLabel[journey.priceUnit]}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onExploreCategory(journey.categorySlug)}
                      className="rounded-full border border-white/25 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-white/10"
                    >
                      Similar
                    </button>
                    <button
                      onClick={() => planJourney(journey)}
                      className="group inline-flex items-center gap-2 rounded-full bg-exp-teal px-5 py-2.5 text-xs font-semibold text-exp-ink transition-colors hover:bg-exp-sun"
                    >
                      Plan this
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {/* trailing spacer so the last panel can settle in view */}
          <div className="hidden w-[6vw] shrink-0 lg:block" aria-hidden />
        </div>
      </div>
    </section>
  );
};

export default SignatureJourneys;
