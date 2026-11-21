import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ClipboardCheck, MapPinCheck, BadgeCheck, RefreshCw, Home } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = [
  {
    number: '01',
    label: 'Registration',
    title: 'Host details check',
    description: 'We review identity and property details before a listing can progress.',
    icon: ClipboardCheck,
  },
  {
    number: '02',
    label: 'Site visit',
    title: 'Review by a local ATP',
    description: 'Your area’s ATP reviews the home and basic safety before go-live.',
    icon: MapPinCheck,
  },
  {
    number: '03',
    label: 'Go live',
    title: 'Approval',
    description: 'Approved hosts get oriented and can start welcoming guests.',
    icon: BadgeCheck,
  },
  {
    number: '04',
    label: 'Ongoing',
    title: 'Regular check-ins',
    description: 'The ATP stays in touch, and guest feedback helps guide follow-ups.',
    icon: RefreshCw,
  },
];

export const HostVerificationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('.gsap-verify-header', {
        y: 40,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });

      gsap.from('.gsap-verify-card', {
        y: 32,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#0B1F2A] text-white py-12 sm:py-16"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="gsap-verify-header mb-8 sm:mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-200 text-xs font-bold mb-3">
            <Home className="w-3.5 h-3.5" />
            Our verification process
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-3">
            How we verify our hosts
          </h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed">
            Hosts go through a local Area Tourism Promoter review before their stay goes live.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                className="gsap-verify-card relative rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-white/10 leading-none">
                    {step.number}
                  </span>
                </div>
                <p className="text-[11px] uppercase tracking-wider text-[#FFD26E] font-semibold mb-1">
                  {step.label}
                </p>
                <h3 className="text-base font-bold mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-white/55">
          <span>Verified by our local ATP before going live</span>
          <span className="hidden sm:inline">•</span>
          <span>Form C support for foreign guests</span>
          <span className="hidden sm:inline">•</span>
          <span>Regular ATP check-ins</span>
        </div>
        <p className="mt-3 text-[11px] text-white/40 max-w-3xl">
          Verification reflects what our ATP sees at the time of the visit. Hosts remain
          responsible for the licences and approvals that apply to their property.
        </p>
      </div>
    </section>
  );
};

export default HostVerificationSection;
