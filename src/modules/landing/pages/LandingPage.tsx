import Navbar from '@/components/Navbar';
import BannerSlider from '@/components/BannerSlider';
import AIAssistant from '@/components/AIAssistant';
import SeasonalBooking from '@/components/SeasonalBooking';
import ValueProposition from '@/components/ValueProposition';
import MediaSection from '@/components/MediaSection';
import Certifications from '@/components/Certifications';

import { HeroSection } from '../components/HeroSection';
import { AnimatedStats } from '../components/AnimatedStats';
import { HomestayDiscoverySection } from '../components/HomestayDiscoverySection';
import { ExperienceShowcaseSection } from '../components/ExperienceShowcaseSection';
import { NewlyListedSection } from '../components/NewlyListedSection';
import { AirportDistrictsSection } from '../components/AirportDistrictsSection';
import { DistrictsSection } from '../components/DistrictsSection';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section & Search Bar */}
      <HeroSection />

      {/* Banner Slider Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Kerala's Beauty
          </h2>
          <p className="text-lg text-gray-600">
            Discover the diverse landscapes and rich culture of God's Own Country
          </p>
        </div>
        <BannerSlider />
      </div>

      {/* Platform Introduction & Animated Counters */}
      <section className="max-w-7xl mx-auto px-4 py-16 w-full">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            About Hevan Connect Travel
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-4xl">
            Hevan Connect Travel opens the doors to Kerala's most authentic homestay experiences—
            connecting travelers with traditional homes, vibrant local culture, and warm-hearted hosts.
            Every stay is handpicked to offer more than comfort: a deeper connection to the people,
            traditions, and natural beauty of Kerala. As a meaningful alternative to conventional
            accommodations, our platform helps guests discover immersive, affordable stays while
            supporting sustainable tourism and local livelihoods.
          </p>
          <AnimatedStats />
        </div>
      </section>

      {/* Live Homestays Discovery Section (Wired to Backend Properties API) */}
      <HomestayDiscoverySection />

      {/* Live Kerala Experiences Section (Wired to Backend Experiences API) */}
      <ExperienceShowcaseSection />

      {/* Airport-Accessible District Highlights */}
      <AirportDistrictsSection />

      {/* Newly Listed Homestays (Live Backend Feed) */}
      <NewlyListedSection />

      {/* Homestays by District (Wired to Backend Districts API) */}
      <DistrictsSection />

      {/* Seasonal Booking Section */}
      <SeasonalBooking />

      {/* Value Proposition Section */}
      <ValueProposition />

      {/* Media Section */}
      <MediaSection />

      {/* Certifications Section */}
      <Certifications />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Hevan Connect Travel</h3>
              <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                Your trusted platform for authentic Kerala homestay experiences.
              </p>
              <p className="text-xs text-gray-500">
                Supporting Kerala tourism and local communities through sustainable travel.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Cancellation Options</li>
                <li>Travel Insurance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Kerala Experiences</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Backwater Tours</li>
                <li>Spice Garden Visits</li>
                <li>Cultural Programs</li>
                <li>Ayurveda Wellness</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Connect With Us</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li
                  tabIndex={0}
                  aria-label="Instagram"
                  className="group relative flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white shadow-lg cursor-pointer transition-transform transform hover:scale-105 outline-none px-4 py-2 gap-2 w-fit"
                  onClick={() => window.open('https://instagram.com', '_blank', 'noopener,noreferrer')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="1.2em" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                  <span className="text-xs font-semibold">Instagram</span>
                </li>
                <li>About Us</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Hevan Connect Travel. All rights reserved. | Promoting sustainable Kerala tourism.</p>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default LandingPage;
