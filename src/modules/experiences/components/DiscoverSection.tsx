import { useRef } from 'react';
import { Landmark, MapPin, Users } from 'lucide-react';
import { gsap, useGSAP, SplitText, MQ } from '../lib/motion';

const PILLARS = [
  { icon: Users, color: '#FF6B57', title: 'The people', text: 'Farmers, artists, fishermen and families hosting in their own homes.' },
  { icon: MapPin, color: '#1A8491', title: 'The places', text: 'Backwater hamlets, hill estates and temple towns off the usual map.' },
  { icon: Landmark, color: '#E09A00', title: 'The traditions', text: 'Rituals, recipes and crafts handed down for generations.' },
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
      <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-exp-marigold/25 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-48 left-1/3 h-[28rem] w-[28rem] rounded-full bg-exp-coral/15 blur-[110px]" />
      <div className="relative mx-auto grid w-[min(1280px,92%)] items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* Visual */}
        <div className="relative">
          <div className="discover-frame relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-black md:aspect-[5/5.2]">
            <img
              src="/experiences/kathakali-makeup-closeup.jpg"
              alt="A Kathakali artist painting his face with natural pigments before a performance"
              className="discover-photo h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">Behind the curtain</p>
              <p className="font-display text-xl italic">Chutti: the 90-minute Kathakali makeover</p>
            </div>
          </div>

          {/* Rotating badge */}
          <div className="absolute -right-4 -top-8 hidden h-32 w-32 items-center justify-center md:flex lg:-right-10">
            <svg viewBox="0 0 120 120" className="discover-badge absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="discover-badge-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFB627" />
                  <stop offset="55%" stopColor="#FF6B57" />
                  <stop offset="100%" stopColor="#F2559A" />
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
            <span className="relative text-2xl text-white">✦</span>
          </div>
        </div>

        {/* Copy */}
        <div className="discover-copy">
          <p className="discover-eyebrow mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-exp-coral">
            Hidden gems · Sceneries
          </p>
          <h2
            className="discover-title font-display text-[clamp(2.8rem,6vw,5.5rem)] font-normal uppercase leading-[0.92] tracking-[-0.01em]"
            style={{ perspective: 600 }}
          >
            Discover
            <br />
            <span className="text-exp-coral">Experiences</span>
          </h2>
          <p className="discover-lead mt-6 max-w-lg text-xl leading-snug text-[#3a3a3a] md:text-2xl">
            Explore the people, places, traditions and hidden treasures of Kerala.
          </p>
          <p className="discover-body mt-8 max-w-xl font-display text-lg leading-relaxed text-[#2b2b2b]">
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
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-black/60">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
