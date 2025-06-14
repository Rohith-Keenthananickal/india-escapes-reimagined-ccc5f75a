
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Heart, Star } from 'lucide-react';

const ValueProposition = () => {
  const features = [
    {
      icon: Leaf,
      title: "Travel That Gives Back",
      description: "Stay in eco-friendly homes that support local communities, create jobs, and promote sustainable tourism across Kerala.",
      color: "text-green-500"
    },
    {
      icon: Heart,
      title: "Homes with a Heart",
      description: "Experience genuine Kerala hospitality by staying with local families who share their traditions, stories, and warm welcome.",
      color: "text-red-500"
    },
    {
      icon: Star,
      title: "Authentic Kerala Experiences",
      description: "Immerse yourself in traditional cooking, cultural rituals, festivals, and local customs for unforgettable memories.",
      color: "text-yellow-500"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Kerala Homestays?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-shadow duration-300 border-0 bg-white">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
