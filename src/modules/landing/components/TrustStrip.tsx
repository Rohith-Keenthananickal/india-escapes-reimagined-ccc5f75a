import { MapPin, Home, Sparkles } from 'lucide-react';

export const TrustStrip = () => {
  return (
    <section className="w-full bg-gradient-to-r from-teal-50 via-white to-amber-50 border-y border-teal-100">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-center">
          <div className="inline-flex items-center gap-2 text-[#1A8491]">
            <Home className="w-4 h-4 shrink-0" />
            <span className="text-sm sm:text-base font-bold text-gray-900">
              50,000 Local Stays
            </span>
          </div>
          <span className="hidden sm:inline text-gray-300">|</span>
          <div className="inline-flex items-center gap-2 text-[#1A8491]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="text-sm sm:text-base font-bold text-gray-900">
              3,00,000 Hyperlocal Experiences
            </span>
          </div>
          <span className="hidden sm:inline text-gray-300">|</span>
          <div className="inline-flex items-center gap-2 text-[#1A8491]">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="text-sm sm:text-base font-semibold text-gray-700">
              spread across Kerala
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
