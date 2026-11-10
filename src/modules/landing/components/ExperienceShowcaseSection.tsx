import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Users, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { useLandingExperiences } from '../hooks/useLandingExperiences';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const ExperienceShowcaseSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { data: experiences, isLoading } = useLandingExperiences(6);

  // Filter out any test/dummy items without a title
  const activeExperiences = (experiences || []).filter(
    (exp) => exp.title && exp.title !== 'string' && exp.status === 'ACTIVE'
  );

  useGSAP(
    () => {
      if (activeExperiences.length === 0) return;

      gsap.from('.experience-card-item', {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.experience-grid',
          start: 'top 85%',
        },
      });
    },
    { dependencies: [activeExperiences.length], scope: containerRef }
  );

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-3 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD26E]/20 text-[#1F1F1F] border border-[#D4A237]/40 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A237]" /> Authentic Local Encounters
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-gray-900 tracking-tight">
            Curated Kerala Experiences
          </h2>
          <p className="text-gray-600 mt-1.5 sm:mt-2 text-xs sm:text-base max-w-2xl">
            Immerse yourself in authentic village walks, canoe rides through tranquil backwaters, tea plantation treks, and cultural traditions led by passionate local hosts.
          </p>
        </div>

        <Button
          variant="outline"
          asChild
          className="self-start md:self-auto gap-2 border-[#2BB0BB] text-[#1A8491] hover:bg-brand-teal-50 font-medium text-xs sm:text-sm"
        >
          <Link to="/experiences">
            Explore All Experiences <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
              <Skeleton className="w-full h-52 rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : activeExperiences.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 sm:p-10 text-center">
          <Compass className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">No experiences listed yet</h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Approved Kerala experiences will appear here as hosts publish village walks, canoe rides, and cultural immersions.
          </p>
        </div>
      ) : (
        <div className="experience-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {activeExperiences.map((exp) => {
            const genuinePhoto =
              exp.photos &&
              exp.photos.length > 0 &&
              exp.photos[0] &&
              !exp.photos[0].includes('example.com') &&
              !exp.photos[0].includes('string')
                ? exp.photos[0]
                : '';

            const durationText = exp.duration
              ? `${exp.duration} ${exp.duration_unit ? exp.duration_unit.toLowerCase() + (exp.duration > 1 ? 's' : '') : 'hours'}`
              : 'Not specified';

            const priceLabel = exp.is_price_by_guest ? '/ person' : '/ group';
            const guestCap = exp.group_size || 8;

            return (
              <div key={exp.id} className="experience-card-item">
                <Card
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#2BB0BB]/50 flex flex-col justify-between bg-white rounded-2xl h-full"
                  onClick={() => navigate('/experiences')}
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 flex items-center justify-center">
                      {genuinePhoto ? (
                        <img
                          src={genuinePhoto}
                          alt={exp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                          <Compass className="w-10 h-10 mb-1 stroke-1 text-gray-400" />
                          <span className="text-xs">Kerala Experience</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/95 text-gray-800 text-xs font-semibold backdrop-blur-sm border-0 shadow-sm capitalize">
                          {exp.category ? exp.category.toLowerCase().replace(/_/g, ' ') : 'Experience'}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <h3 className="font-heading font-bold text-lg text-gray-900 group-hover:text-[#1A8491] transition-colors line-clamp-1 mb-2">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
                        {exp.description || 'Authentic local immersion hosted by Kerala natives.'}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#2BB0BB]" />
                          <span>{durationText}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#2BB0BB]" />
                          <span>Up to {guestCap} guests</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <div className="px-5 pb-5 pt-0 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block">From</span>
                      <span className="font-heading font-extrabold text-lg text-gray-900">
                        ₹{Number(exp.price || 0).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500"> {priceLabel}</span>
                    </div>

                    <span className="text-xs font-semibold text-[#1A8491] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ExperienceShowcaseSection;
