import { useRef } from 'react';
import { Compass, Landmark, MapPin, Users } from 'lucide-react';
import { BrandPill, ContourPattern } from './brand';
import { gsap, useGSAP, SplitText, MQ } from '../lib/motion';

const PILLARS = [
  { icon: Users, color: '#1A8491', title: 'The people', text: 'Farmers, artists, fishermen and families hosting in their own homes.' },
  { icon: MapPin, color: '#D4A237', title: 'The places', text: 'Backwater hamlets, hill estates and temple towns off the usual map.' },
  { icon: Landmark, color: '#2BB0BB', title: 'The traditions', text: 'Rituals, recipes and crafts handed down for generations.' },
];

const BADGE_TEXT = 'local hosts · real homes · living traditions · ';

export const DiscoverSection = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOK, () => {
        // Frame opens like a window as it scrolls in, photo drifts inside it.
        gsap.fromTo(
          '.discover-frame',
          { clipPath: 'inset(14% 12% 14% 12% round 2rem)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 2rem)',
            ease: 'none',
            scrollTrigger: { trigger: '.discover-frame', start: 'top 85%', end: 'center 55%', scrub: 1 },
          }
        );
        gsap.fromTo(
          '.discover-photo',
          { yPercent: -10, scale: 1.25 },
          {
            yPercent: 10,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );

        SplitText.create('.discover-title', {
          type: 'chars',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 80,
              autoAlpha: 0,
              rotateX: -70,
              transformOrigin: '50% 100%',
              stagger: 0.025,
              duration: 0.9,
              ease: 'back.out(1.6)',
              scrollTrigger: { trigger: '.discover-title', start: 'top 80%' },
            }),
        });

        SplitText.create('.discover-body', {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 100,
              stagger: 0.08,
              duration: 1,
              ease: 'expo.out',
              scrollTrigger: { trigger: '.discover-body', start: 'top 85%' },
            }),
        });

        gsap.from('.discover-lead, .discover-eyebrow', {
          y: 30,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.discover-copy', start: 'top 80%' },
        });

        gsap.from('.discover-pillar', {
          y: 40,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.discover-pillars', start: 'top 88%' },
        });

        gsap.to('.discover-badge', { rotate: 360, duration: 22, ease: 'none', repeat: -1 });
      });
    },
    { scope: root }
  );

  return (
    <section id="discover" ref={root} className="relative overflow-hidden bg-exp-cream py-24 text-exp-ink md:py-32">
      <ContourPattern className="text-exp-gold/20" seed={3} />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-exp-sun/30 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-48 left-1/3 h-[28rem] w-[28rem] rounded-full bg-exp-teal/15 blur-[110px]" />
      <div className="relative mx-auto grid w-[min(1280px,92%)] items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* Visual */}
        <div className="relative">
          {/* brand teal block offset behind the photo */}
          <div className="absolute -bottom-5 -left-5 h-full w-full rounded-[2rem] bg-exp-teal md:-bottom-6 md:-left-6" aria-hidden />
          <div className="discover-frame relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-black md:aspect-[5/5.2]">
            <img
              src="/experiences/kathakali-makeup-closeup.jpg"
              alt="A Kathakali artist painting his face with natural pigments before a performance"
              className="discover-photo h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-exp-sun">Behind the curtain</p>
              <p className="font-heading text-xl font-bold">Chutti: the 90-minute Kathakali makeover</p>
            </div>
          </div>

          {/* Rotating badge */}
          <div className="absolute -right-4 -top-8 hidden h-32 w-32 items-center justify-center md:flex lg:-right-10">
            <svg viewBox="0 0 120 120" className="discover-badge absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="discover-badge-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2BB0BB" />
                  <stop offset="100%" stopColor="#1A8491" />
                </linearGradient>
                <path id="discover-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <circle cx="60" cy="60" r="58" fill="url(#discover-badge-grad)" />
              <text className="fill-white text-[8.5px] uppercase">
                {/* 2πr for r=46 ≈ 289: stretch letter-spacing so the phrase closes the loop exactly */}
                <textPath href="#discover-circle" textLength={287} lengthAdjust="spacing">
                  {BADGE_TEXT}
                </textPath>
              </text>
            </svg>
            <Compass className="relative h-8 w-8 text-exp-sun" strokeWidth={1.75} />
          </div>
        </div>

        {/* Copy */}
        <div className="discover-copy">
          <div className="discover-eyebrow mb-5">
            <BrandPill tone="teal">Hidden gems · Sceneries</BrandPill>
          </div>
          <h2
            className="discover-title font-heading text-[clamp(2.6rem,5.5vw,4.8rem)] font-extrabold leading-[1] tracking-[-0.03em]"
            style={{ perspective: 600 }}
          >
            Discover
            <br />
            <span className="text-exp-deep">Experiences</span>
          </h2>
          <p className="discover-lead mt-6 max-w-lg font-heading text-xl font-semibold leading-snug text-exp-ink/85 md:text-2xl">
            Explore the people, places, traditions and hidden treasures of Kerala.
          </p>
          <p className="discover-body mt-6 max-w-xl text-base leading-relaxed text-exp-ink/70 md:text-lg">
            Discover Kerala beyond the usual destinations with TripHavenco. Explore authentic local experiences rooted in
            the lives, traditions and talents of our communities. From village adventures and culinary journeys to art,
            culture, nature and spirituality, discover unique experiences created by local people, waiting to be explored
            and enjoyed.
          </p>

          <div className="discover-pillars mt-12 grid gap-6 sm:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, text, color }) => (
              <div key={title} className="discover-pillar border-t border-black/10 pt-5">
                <span
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${color}1f`, color }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p className="font-heading font-bold">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-exp-ink/60">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
