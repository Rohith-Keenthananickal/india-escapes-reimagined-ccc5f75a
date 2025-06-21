
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-56bc-622f-a480-c13ca1116fcf/raw?se=2025-06-21T20%3A48%3A10Z&sp=r&sv=2024-08-04&sr=b&scid=745757ac-c80b-5eae-b9d7-ded278a26dbb&skoid=e9d2f8b1-028a-4cff-8eb1-d0e66fbefcca&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-21T17%3A17%3A27Z&ske=2025-06-22T17%3A17%3A27Z&sks=b&skv=2024-08-04&sig=dP3eTV/AWN5ylDgauEy9UyiHTIDn%2BBCm9H3RmZJP8iA%3D",
      caption: "Backwater Bliss",
      description: "Experience Kerala's serene backwaters"
    },
    {
      image: "https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-addc-622f-983e-f04923737bc6/raw?se=2025-06-21T20%3A58%3A34Z&sp=r&sv=2024-08-04&sr=b&scid=9d820c3d-4e95-58d7-9935-babeb003be6c&skoid=e9d2f8b1-028a-4cff-8eb1-d0e66fbefcca&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-21T17%3A16%3A02Z&ske=2025-06-22T17%3A16%3A02Z&sks=b&skv=2024-08-04&sig=YcawyB4lt4ji5pIuYRvf3QgCOJ/cLvEU/A1sTVpBQOM%3D",
      caption: "Cultural Immersion",
      description: "Discover rich heritage and traditions"
    },
    {
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
      caption: "Hill Station Retreat",
      description: "Find peace in misty mountains"
    },
    {
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=1200&h=600&fit=crop",
      caption: "Coastal Harmony",
      description: "Relax by pristine beaches"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{slide.caption}</h3>
              <p className="text-lg opacity-90">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Title Overlay */}
      <div className="absolute top-8 left-8 text-white">
        <h1 className="text-3xl md:text-5xl font-bold">
          Start Your Journey<br />
          <span className="text-yellow-300">with Us</span>
        </h1>
      </div>
    </div>
  );
};

export default BannerSlider;
