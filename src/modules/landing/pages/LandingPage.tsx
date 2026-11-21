import { useRef, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from '@/components/Navbar';
import BannerSlider from '@/components/BannerSlider';
import EnhancedSearchBar from '@/components/EnhancedSearchBar';
import AIAssistant from '@/components/AIAssistant';
import SeasonalBooking from '@/components/SeasonalBooking';
import ValueProposition from '@/components/ValueProposition';

import { HeroSection } from '../components/HeroSection';
import { LaunchCountdownStrip } from '../components/LaunchCountdownStrip';
import { TrustStrip } from '../components/TrustStrip';
import { InfiniteLoopedPanels } from '../components/InfiniteLoopedPanels';
import { AnimatedStats } from '../components/AnimatedStats';
import { HomestayDiscoverySection } from '../components/HomestayDiscoverySection';
import { ExperienceShowcaseSection } from '../components/ExperienceShowcaseSection';
import { NewlyListedSection } from '../components/NewlyListedSection';
import { DistrictsSection } from '../components/DistrictsSection';
import { HostVerificationSection } from '../components/HostVerificationSection';
import { TrustRecognitionSection } from '../components/TrustRecognitionSection';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const APP_LINKS = [
  { label: 'ATP App', key: 'atp' },
  { label: 'Host App', key: 'host' },
  { label: 'Experience Provider App', key: 'experience' },
] as const;

export const LandingPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const refreshTimer1 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    const refreshTimer2 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1800);

    return () => {
      clearTimeout(refreshTimer1);
      clearTimeout(refreshTimer2);
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  useGSAP(
    () => {
      gsap.from('.gsap-explore-header', {
        y: 40,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gsap-explore-section',
          start: 'top 85%',
        },
      });

      gsap.from('.gsap-about-content', {
        y: 45,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gsap-about-section',
          start: 'top 85%',
        },
      });

      gsap.from('.gsap-seasonal-section', {
        y: 45,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gsap-seasonal-section',
          start: 'top 85%',
        },
      });
    },
    { scope: pageRef }
  );

  const handleAppComingSoon = (label: string) => {
    toast({
      title: `${label} coming soon`,
      description: 'App download links will be published here when available.',
    });
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gray-50 flex flex-col selection:bg-[#2BB0BB] selection:text-white w-full max-w-full overflow-x-clip"
    >
      <LaunchCountdownStrip />

      {/* Navbar + search stick together for the whole landing scroll */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <Navbar sticky={false} />
        <EnhancedSearchBar compactOnScroll />
      </div>

      <HeroSection />
      <TrustStrip />
      <InfiniteLoopedPanels />

      <div
        id="ecosystem"
        className="gsap-explore-section max-w-7xl mx-auto px-4 py-12 sm:py-16 w-full scroll-mt-28"
      >
        <div className="gsap-explore-header mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-gray-900 mb-2 sm:mb-3 tracking-tight">
            How TripHavenCo ecosystem works
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-gray-600">
            Verified hosts, verified experiences and a local always nearby.
          </p>
        </div>
        <BannerSlider />
      </div>

      <section className="gsap-about-section max-w-7xl mx-auto px-4 py-12 sm:py-16 w-full">
        <div className="gsap-about-content">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[#1A8491] text-xs font-bold mb-3 sm:mb-4">
            <span>Genuine Connections • Low Impact Travel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-gray-900 mb-3 sm:mb-5 tracking-tight">
            About TripHavenCo
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-gray-600 leading-relaxed mb-4 max-w-4xl">
            TripHavenCo opens the doors to Kerala&apos;s most authentic homestay experiences—
            connecting travellers with traditional homes, vibrant local culture, and warm-hearted hosts.
            Every stay is handpicked to offer more than comfort: a deeper connection to the people,
            traditions, and natural beauty of Kerala. As a meaningful alternative to conventional
            accommodations, our platform helps guests discover immersive, affordable stays while
            supporting sustainable tourism and local livelihoods.
          </p>
          <AnimatedStats />
        </div>
      </section>

      <HomestayDiscoverySection />
      <ExperienceShowcaseSection />
      <NewlyListedSection />
      <DistrictsSection />

      <div className="gsap-seasonal-section">
        <SeasonalBooking />
      </div>

      <div className="gsap-value-section w-full">
        <ValueProposition />
      </div>

      {/* <HostVerificationSection /> */}
      <TrustRecognitionSection />

      <footer className="bg-gray-900 text-white py-12 sm:py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-2 shrink-0">
                <img
                  src="/Logo_color.svg"
                  alt="TripHavenCo"
                  className="h-8 md:h-9 w-auto object-contain"
                />
              </Link>
              <p className="text-gray-400 mb-4 text-sm leading-relaxed mt-3">
                TripHavenCo is a community tourism platform that connects travellers with verified
                local hosts and authentic Kerala experiences. A dedicated Area Tourism Promoter
                (ATP) supports every destination, so guests stay with confidence and local families
                earn fairly.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">
                Support
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">
                Kerala Experiences
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  Backwater Tours
                  <span className="text-[10px] uppercase tracking-wide text-amber-300/90">
                    Coming soon
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  Spice Garden Visits
                  <span className="text-[10px] uppercase tracking-wide text-amber-300/90">
                    Coming soon
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  Cultural Programs
                  <span className="text-[10px] uppercase tracking-wide text-amber-300/90">
                    Coming soon
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  Ayurveda Wellness
                  <span className="text-[10px] uppercase tracking-wide text-amber-300/90">
                    Coming soon
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">
                Partner apps
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {APP_LINKS.map((app) => (
                  <li key={app.key}>
                    <button
                      type="button"
                      onClick={() => handleAppComingSoon(app.label)}
                      className="hover:text-white transition-colors text-left"
                    >
                      {app.label}
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-amber-300/90">
                        Coming soon
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">
                Connect With Us
              </h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <button
                    type="button"
                    aria-label="Instagram"
                    className="group relative flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white shadow-lg cursor-pointer transition-transform transform hover:scale-105 outline-none px-4 py-2 gap-2 w-fit"
                    onClick={() =>
                      window.open(
                        'https://www.instagram.com/triphavenco/',
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1.2em"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                    </svg>
                    <span className="text-xs font-semibold">Instagram</span>
                  </button>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} TripHavenCo. All rights reserved. | Promoting
              sustainable Kerala tourism.
            </p>
          </div>
        </div>
      </footer>

      <AIAssistant />
    </div>
  );
};

export default LandingPage;
