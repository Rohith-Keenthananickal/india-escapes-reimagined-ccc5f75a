import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BadgeCheck } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LOGOS = [
  {
    src: '/certifications/msme.png',
    alt: 'MSME – Micro, Small & Medium Enterprises',
    label: 'MSME registered',
  },
  {
    src: '/certifications/kerala-startup-mission.png',
    alt: 'Kerala Startup Mission',
    label: 'Kerala Startup Mission',
  },
  {
    src: '/certifications/nidhi.png',
    alt: 'NIDHI – National Integrated Database of Hospitality Industry',
    label: 'NIDHI registered',
  },
  {
    src: '/certifications/kerala-tourism.png',
    alt: 'Kerala Tourism',
    label: 'Kerala Tourism',
  },
];

export const TrustRecognitionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('.gsap-trust-header', {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });

      gsap.from('.gsap-trust-logo', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="gsap-cert-section w-full bg-[#14181F] text-white py-12 sm:py-16"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="gsap-trust-header text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
            <BadgeCheck className="w-3.5 h-3.5" />
            Trust and recognition
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-3">
            Recognised and registered
          </h2>
          <p className="text-sm sm:text-base text-white/65">
            TripHavenCo is backed by government and startup bodies. Logos shown here match
            documents we hold.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {LOGOS.map((logo) => (
            <article
              key={logo.src}
              className="gsap-trust-logo flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 min-h-[160px]"
            >
              <div className="w-full h-20 sm:h-24 flex items-center justify-center">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white/85 text-center">
                {logo.label}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-white/45">
          Want to verify a document? Write to{' '}
          <a
            href="mailto:Support@triphavenco.com"
            className="text-teal-300 hover:underline"
          >
            Support@triphavenco.com
          </a>{' '}
          and we&apos;ll share it.
        </p>
      </div>
    </section>
  );
};

export default TrustRecognitionSection;
