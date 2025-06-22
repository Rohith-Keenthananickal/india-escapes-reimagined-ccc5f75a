import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image:
        "https://www.tourmyholiday.com/upload/blogimage/kumarakom-backwaters-kumarakom-kerala-attr-hero-1.jpg",
      caption: "Backwater Bliss",
      description: "Experience Kerala's serene backwaters",
    },
    {
      image:
        "https://cochinculturalcentre.org/wp-content/uploads/2025/06/Highlights-from-Our-Recent-Cultural-Festivals-and-Performances.webp",
      caption: "Cultural Immersion",
      description: "Discover rich heritage and traditions",
    },
    {
      image:
        "https://www.sreestours.com/blog/wp-content/uploads/2022/07/Munnar.jpg",
      caption: "Hill Station Retreat",
      description: "Find peace in misty mountains",
    },
    {
      image:
        "https://www.oyorooms.com/travel-guide/wp-content/uploads/2019/04/Varkala-Beach.webp",
      caption: "Coastal Harmony",
      description: "Relax by pristine beaches",
    },
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
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {slide.caption}
              </h3>
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
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Title Overlay */}
      <div className="absolute top-8 left-8 text-white">
        <h1 className="text-3xl md:text-5xl font-bold">
          Start Your Journey
          <br />
          <span className="text-yellow-300">with Us</span>
        </h1>
      </div>
    </div>
  );
};

export default BannerSlider;
