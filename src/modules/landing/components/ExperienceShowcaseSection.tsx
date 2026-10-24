import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Users, Compass, ArrowRight, Sparkles, ImageOff } from 'lucide-react';
import { useLandingExperiences } from '../hooks/useLandingExperiences';

export const ExperienceShowcaseSection = () => {
  const navigate = useNavigate();
  const { data: experiences, isLoading } = useLandingExperiences(6);

  // Filter out any test/dummy items without a title
  const activeExperiences = (experiences || []).filter(
    (exp) => exp.title && exp.title !== 'string' && exp.status === 'ACTIVE'
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Authentic Local Encounters
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Curated Kerala Experiences
          </h2>
          <p className="text-gray-600 mt-2 text-base max-w-2xl">
            Immerse yourself in authentic village walks, canoe rides through tranquil backwaters, tea plantation treks, and cultural traditions led by passionate local hosts.
          </p>
        </div>

        <Button
          variant="outline"
          asChild
          className="self-start md:self-auto gap-2 border-amber-300 text-amber-900 hover:bg-amber-50 font-medium"
        >
          <Link to="/experiences">
            Explore All Experiences <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
              <Skeleton className="w-full h-52 rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : activeExperiences.length === 0 ? null : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            return (
              <Card
                key={exp.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-amber-300 flex flex-col justify-between bg-white rounded-2xl"
                onClick={() => navigate('/experiences')}
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 flex items-center justify-center">
                    {genuinePhoto ? (
                      <img
                        src={genuinePhoto}
                        alt={exp.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                        <ImageOff className="w-8 h-8 text-gray-300 mb-1" />
                        <span className="text-xs">No photo provided</span>
                      </div>
                    )}

                    {exp.category && (
                      <Badge className="absolute top-3 left-3 bg-amber-600 text-white shadow-sm font-medium">
                        {exp.category}
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-amber-600 transition-colors line-clamp-1 mb-2">
                      {exp.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {exp.description && exp.description !== 'No description provided.'
                        ? exp.description
                        : 'No description provided by the host.'}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{durationText}</span>
                      </div>
                      {exp.group_size ? (
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-amber-600" />
                          <span>Up to {exp.group_size} guests</span>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-amber-600" />
                        <span>Guided</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-5 pt-0 border-t border-gray-100 flex justify-between items-center mt-auto">
                  <div>
                    {exp.price && exp.price > 0 ? (
                      <>
                        <span className="text-xl font-extrabold text-gray-900">
                          ₹{exp.price.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-xs"> / {exp.is_price_by_guest ? 'person' : 'group'}</span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-gray-600">Price on inquiry</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-sm transition-all duration-200 hover:scale-105"
                  >
                    View Experience
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ExperienceShowcaseSection;
