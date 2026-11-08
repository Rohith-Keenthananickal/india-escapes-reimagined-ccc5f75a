import { Plane } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AirportDistrict {
  name: string;
  code: string;
  stays: number;
  description: string;
}

const AIRPORT_DISTRICTS: AirportDistrict[] = [
  {
    name: 'Ernakulam (Kochi)',
    code: 'COK',
    stays: 120,
    description: 'Gateway to Backwaters & Heritage Fort Kochi',
  },
  {
    name: 'Thiruvananthapuram',
    code: 'TRV',
    stays: 85,
    description: 'Capital Heritage, Beaches & Ayurveda Hub',
  },
  {
    name: 'Calicut (Kozhikode)',
    code: 'CCJ',
    stays: 67,
    description: 'Malabar Culinary Traditions & Ancient Spice Coast',
  },
  {
    name: 'Kannur',
    code: 'CNN',
    stays: 42,
    description: 'Theyyam Rituals & Untouched Pristine Beaches',
  },
];

export const AirportDistrictsSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="w-12 h-12 bg-[#E1F4F6] rounded-full flex items-center justify-center mx-auto mb-3 text-[#1A8491]">
          <Plane className="w-6 h-6" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900">
          Airport-Accessible District Highlights
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          Direct connectivity to Kerala's finest homestays from all 4 international airports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {AIRPORT_DISTRICTS.map((district) => (
          <Card
            key={district.code}
            className="group hover:shadow-xl transition-all duration-300 text-center p-6 border-2 border-gray-100 hover:border-[#2BB0BB]/50 bg-white rounded-2xl flex flex-col justify-between"
          >
            <div className="mb-4">
              <div className="w-14 h-14 bg-brand-teal-50 group-hover:bg-[#E1F4F6] rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
                <Plane className="w-7 h-7 text-[#1A8491] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold font-heading text-gray-900 mb-1">
                {district.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {district.description}
              </p>
              <Badge className="bg-[#FFD26E]/20 text-[#1F1F1F] border border-[#D4A237]/40 font-semibold px-3 py-0.5 shadow-none">
                Airport Code: {district.code}
              </Badge>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-2">
              <div className="text-2xl font-extrabold text-[#1A8491]">
                {district.stays}+
              </div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Homestays Available
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AirportDistrictsSection;
