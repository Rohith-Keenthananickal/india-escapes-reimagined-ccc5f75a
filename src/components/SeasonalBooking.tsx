import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Waves,
  Leaf,
  Sun,
  Snowflake,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface SeasonalProperty {
  name: string;
  location: string;
  price: number;
  image: string;
  perk: string;
}

interface Season {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  activeColor: string;
  badgeBg: string;
  properties: SeasonalProperty[];
}

const SEASONS: Season[] = [
  {
    id: 'summer',
    title: 'Summer Escapes',
    subtitle: 'Misty Hill Stations & Cool Estates (Mar - May)',
    icon: Sun,
    activeColor: 'bg-amber-500 text-white',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    properties: [
      {
        name: 'Tea Valley Hill Cottage',
        location: 'Munnar, Idukki',
        price: 3200,
        image:
          'https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/202205021616354878-d6bd36240a5411eda28b0a58a9feac02.jpg',
        perk: 'Private Tea Estate Walk',
      },
      {
        name: 'Cool Mist Mountain Retreat',
        location: 'Vythiri, Wayanad',
        price: 2800,
        image:
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/488469872.jpg?k=6dbe643d583e33e703ed839c5122476e197d86cf55fe68b3e9ba5a8b2d1e2f18&o=&hp=1',
        perk: 'Stream-side Campfire',
      },
      {
        name: 'Silent Valley Organic Farmstay',
        location: 'Attappadi, Palakkad',
        price: 2600,
        image:
          'https://content.jdmagicbox.com/comp/palakkad/a2/9999px491.x491.180628100509.n2a2/catalogue/silent-valley-farm-stay-pudur-palakkad-farm-house-on-rent-bs9ymwqv1y.jpg',
        perk: 'Organic Mango Orchard',
      },
    ],
  },
  {
    id: 'monsoon',
    title: 'Monsoon Magic',
    subtitle: 'Ayurvedic Rejuvenation & Lush Greenery (Jun - Aug)',
    icon: Waves,
    activeColor: 'bg-[#2BB0BB] text-white',
    badgeBg: 'bg-teal-100 text-[#1A8491] border-teal-200',
    properties: [
      {
        name: 'Rainforest Canopy Lodge',
        location: 'Thekkady, Idukki',
        price: 2500,
        image:
          'https://www.holidify.com/images/cmsuploads/compressed/282613902_20220901170640.jpg',
        perk: 'Ayurvedic Herbal Garden',
      },
      {
        name: 'Misty Valley Plantation Home',
        location: 'Vagamon, Idukki',
        price: 2200,
        image:
          'https://pix10.agoda.net/hotelImages/161/1615129/1615129_16101223350047693118.jpg?ca=13&ce=1&s=414x232&ar=16x9',
        perk: 'Panoramic Cloud Views',
      },
      {
        name: 'Canal Breeze Waterfront Villa',
        location: 'Kuttanad, Alleppey',
        price: 2700,
        image:
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/42865145.jpg?k=c2cf6c345084d1569bde3575f413a4bf6e82a140a654fbfd076952ff8f7265d0&o=&hp=1',
        perk: 'Private Shikkara Ride',
      },
    ],
  },
  {
    id: 'onam',
    title: 'Onam Harvest Specials',
    subtitle: 'Grand Sadhya Feasts & Boat Races (Aug - Sep)',
    icon: Leaf,
    activeColor: 'bg-emerald-600 text-white',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    properties: [
      {
        name: 'Nalukettu Ancestral Heritage Stay',
        location: 'Fort Kochi, Ernakulam',
        price: 4500,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE7_N4KohWUHU3stBMFpMqgOqMvW8b5YwOSw&s',
        perk: 'Complimentary Onam Sadhya',
      },
      {
        name: 'Marari Cultural Coastal Cottage',
        location: 'Mararikulam, Alappuzha',
        price: 3800,
        image:
          'https://mararibeachpalace.com/assets/Delux%20rooms%20near%20marari%20beach%20alappey.jpg',
        perk: 'Pookkalam Floral Workshop',
      },
      {
        name: 'Tradition Trails Heritage Resort',
        location: 'Arattupuzha, Thrissur',
        price: 4100,
        image: 'https://www.neelambari.co.in/assets/img/facility-banner-new.jpg',
        perk: 'Vallam Kali Boat Race Seats',
      },
    ],
  },
  {
    id: 'winter',
    title: 'Winter Holidays',
    subtitle: 'Pleasant Sun, Golden Sands & Campfires (Nov - Feb)',
    icon: Snowflake,
    activeColor: 'bg-sky-600 text-white',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
    properties: [
      {
        name: 'Sunset Cliff Beach Cottage',
        location: 'North Cliff, Varkala',
        price: 3500,
        image:
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/340493803.jpg?k=7ca6954bd87fd450c59ef93a9d90bf1f2335344946c1f44b034df8b1804ccb62&o=&hp=1',
        perk: 'Sunset Ocean Terrace',
      },
      {
        name: 'Kumarakom Lakefront Wooden Villa',
        location: 'Vembanad, Kottayam',
        price: 4200,
        image:
          'https://www.honeymoonbug.com/blog/wp-content/uploads/2021/07/Kumarakom-Lake-Resort.jpg',
        perk: 'Private Fishing Deck',
      },
      {
        name: 'Hilltop Teakwood Chalet',
        location: 'Meppadi, Wayanad',
        price: 3900,
        image:
          'https://pix10.agoda.net/property/69672057/0/d8a8e2a0336c1edffc73a188fe83498a.jpeg?ce=2&s=414x232',
        perk: 'Stargazing Balcony',
      },
    ],
  },
];

export const SeasonalBooking = () => {
  const [activeTab, setActiveTab] = useState('summer');
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const activeSeason = SEASONS.find((s) => s.id === activeTab) || SEASONS[0];

  // GSAP tab switch animation
  useGSAP(
    () => {
      if (!cardsGridRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>('.seasonal-card');

      gsap.fromTo(
        cards,
        {
          y: 35,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.09,
          ease: 'power3.out',
        }
      );

      // Interactive 3D tilt on card mousemove
      cards.forEach((card) => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = (-y / (rect.height / 2)) * 6;
          const rotateY = (x / (rect.width / 2)) * 6;

          gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 900,
            duration: 0.25,
            ease: 'power1.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
          });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
      });
    },
    { dependencies: [activeTab], scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-12 sm:py-20 bg-gray-50/70 border-y border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#1A8491] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#2BB0BB]" /> Time Your Trip
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-gray-900 tracking-tight">
            Book by Season & Festival
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            {activeSeason.subtitle}
          </p>
        </div>

        {/* Animated Season Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {SEASONS.map((season) => {
            const Icon = season.icon;
            const isActive = activeTab === season.id;
            return (
              <button
                key={season.id}
                type="button"
                onClick={() => setActiveTab(season.id)}
                className={`relative px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all duration-300 shadow-sm ${
                  isActive
                    ? `${season.activeColor} shadow-md scale-105`
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{season.title}</span>
              </button>
            );
          })}
        </div>

        {/* Seasonal Property Showcase Cards with 3D Tilt */}
        <div
          ref={cardsGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7"
          style={{ perspective: 1200 }}
        >
          {activeSeason.properties.map((prop, idx) => (
            <div
              key={`${prop.name}-${idx}`}
              onClick={() =>
                navigate(`/properties?destination=${encodeURIComponent(prop.location.split(',')[0])}`)
              }
              className="seasonal-card group cursor-pointer bg-white rounded-3xl overflow-hidden border border-gray-200/90 hover:border-[#2BB0BB]/60 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Photo & Badge */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={prop.image}
                  alt={prop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <Badge
                  className={`absolute top-3.5 left-3.5 ${activeSeason.badgeBg} text-xs font-bold shadow-sm border`}
                >
                  {prop.perk}
                </Badge>
              </div>

              {/* Card Body */}
              <CardContent className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2BB0BB]" />
                  <span>{prop.location}</span>
                </div>

                <h3 className="font-heading font-bold text-lg text-gray-900 group-hover:text-[#1A8491] transition-colors mb-4 line-clamp-1">
                  {prop.name}
                </h3>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-[#1A8491]">
                      ₹{prop.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">/ night</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1A8491] group-hover:translate-x-1 transition-transform">
                    <span>Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </CardContent>
            </div>
          ))}
        </div>

        {/* Kerala Festival Calendar Strip */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm text-xs sm:text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-[#1A8491] shrink-0" />
            <span>
              <strong>Kerala Cultural Highlights:</strong> Thrissur Pooram (Apr-May) • Nehru Trophy Boat Race (Aug) • Onam Celebrations (Aug-Sep) • Cochin Carnival (Dec)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonalBooking;
