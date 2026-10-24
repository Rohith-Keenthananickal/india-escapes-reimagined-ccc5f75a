import { useState, useEffect } from 'react';
import EnhancedSearchBar from '@/components/EnhancedSearchBar';

const HERO_IMAGES = [
  'https://www.keralatourism.holiday/blog/wp-content/uploads/2024/11/Untitled-3.jpg',
  'https://t3.ftcdn.net/jpg/08/66/94/00/360_F_866940051_zYRBRlqHLSSWMM3Su2Mr0AiLDja8cQwM.jpg',
  'https://cdn.guidetour.in/wp-content/uploads/2018/01/Kovalam-Tourist-Places.jpg.webp',
  'https://www.tusktravel.com/blog/wp-content/uploads/2022/03/Kerala-kumarakom-Place.jpg',
];

export const HeroSection = () => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="w-full">
        <EnhancedSearchBar />
      </div>

      <div className="relative min-h-[580px] bg-cover bg-center bg-no-repeat overflow-hidden">
        {/* Animated Background Images */}
        {HERO_IMAGES.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt="Kerala landscape background"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              idx === currentHeroIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
            draggable={false}
            aria-hidden={idx !== currentHeroIndex}
          />
        ))}

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/30 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-[580px] px-4 text-center">
          <div className="max-w-4xl mx-auto mb-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Live like a local. Discover Kerala's soul
              <br />
              <span className="text-yellow-300">with a welcoming family</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto font-light leading-relaxed">
              Experience authentic homestays and connect with Kerala's rich culture & warm hospitality
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
