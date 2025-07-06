
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Leaf, Shield, Star, Globe, Heart, CheckCircle, Users, Medal, Building, Trophy, Crown } from "lucide-react";
import { useState } from "react";

const Certifications = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const certificationGroups = [
    {
      title: "Professional Certifications",
      subtitle: "Government & Official Recognition",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-100",
      titleColor: "text-blue-900",
      items: [
        {
          id: "kerala-tourism",
          name: "Kerala Tourism Department",
          logo: "🏛️",
          shortDescription: "Official government recognition for authentic cultural experiences",
          fullDescription: "Official recognition from the Government of Kerala Tourism Department, ensuring compliance with state tourism standards and authentic cultural experiences.",
          year: "2024",
          status: "Valid until Dec 2025",
          icon: Building,
          color: "blue",
          badge: "Govt Certified",
          badgeColor: "bg-blue-600"
        },
        {
          id: "fssai",
          name: "FSSAI Food Safety",
          logo: "🍽️",
          shortDescription: "Certified food safety standards across all homestays",
          fullDescription: "Food Safety and Standards Authority of India certification ensuring highest standards of food hygiene and safety in all homestay kitchens.",
          year: "2024",
          status: "Valid until Mar 2025",
          icon: Shield,
          color: "amber",
          badge: "Safety Certified",
          badgeColor: "bg-amber-600"
        }
      ]
    },
    {
      title: "Eco & Sustainability",
      subtitle: "International Environmental Standards",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-100",
      titleColor: "text-green-900",
      items: [
        {
          id: "iso-14001",
          name: "ISO 14001 Certification",
          logo: "🌿",
          shortDescription: "International environmental management standards",
          fullDescription: "International standard for environmental management systems, demonstrating commitment to sustainable practices and environmental responsibility.",
          year: "2023",
          status: "Valid until Nov 2024",
          icon: Leaf,
          color: "green",
          badge: "International Standard",
          badgeColor: "bg-green-600"
        },
        {
          id: "unwto",
          name: "UNWTO Sustainable Tourism",
          logo: "🌍",
          shortDescription: "World Tourism Organization recognition for sustainability",
          fullDescription: "Recognition from the World Tourism Organization for outstanding contribution to sustainable tourism development and cultural heritage preservation.",
          year: "2023",
          status: "Lifetime Achievement",
          icon: Globe,
          color: "indigo",
          badge: "Global Recognition",
          badgeColor: "bg-indigo-600"
        }
      ]
    },
    {
      title: "Community Partnerships",
      subtitle: "Local Impact & Cultural Preservation",
      bgColor: "from-rose-50 to-pink-50",
      borderColor: "border-rose-100",
      titleColor: "text-rose-900",
      items: [
        {
          id: "responsible-tourism",
          name: "Responsible Tourism Partnership",
          logo: "🤝",
          shortDescription: "Supporting community development and cultural preservation",
          fullDescription: "Certified partner of the Kerala Responsible Tourism Mission, supporting community development and cultural preservation initiatives.",
          year: "2024",
          status: "Ongoing Partnership",
          icon: Heart,
          color: "rose",
          badge: "Community Partner",
          badgeColor: "bg-rose-600"
        },
        {
          id: "hospitality-excellence",
          name: "Premium Hospitality Excellence",
          logo: "⭐",
          shortDescription: "Exceptional hospitality and guest satisfaction standards",
          fullDescription: "Awarded for exceptional hospitality standards, guest satisfaction, and maintaining premium quality across all homestay experiences.",
          year: "2024",
          status: "Annual Recognition",
          icon: Star,
          color: "purple",
          badge: "Excellence Award",
          badgeColor: "bg-purple-600"
        }
      ]
    },
    {
      title: "Tourism & Hospitality Awards",
      subtitle: "Industry Recognition & Achievements",
      bgColor: "from-amber-50 to-yellow-50",
      borderColor: "border-amber-100",
      titleColor: "text-amber-900",
      items: [
        {
          id: "innovation-2024",
          name: "Excellence in Tourism Innovation",
          logo: "🏆",
          shortDescription: "Recognized for innovative approach in promoting authentic homestay experiences",
          fullDescription: "Recognized for innovative approach in promoting authentic homestay experiences and digital transformation in rural tourism.",
          year: "2024",
          status: "National Award",
          icon: Trophy,
          color: "yellow",
          badge: "Awarded 2024",
          badgeColor: "bg-yellow-600"
        },
        {
          id: "sustainable-champion",
          name: "Sustainable Tourism Champion",
          logo: "🌱",
          shortDescription: "Outstanding commitment to environmental conservation",
          fullDescription: "Awarded for outstanding commitment to environmental conservation and sustainable tourism practices across Kerala.",
          year: "2023",
          status: "Environmental Excellence",
          icon: Leaf,
          color: "emerald",
          badge: "Champion Award",
          badgeColor: "bg-emerald-600"
        },
        {
          id: "community-impact",
          name: "Community Impact & Cultural Preservation",
          logo: "👑",
          shortDescription: "Significant positive impact on local communities",
          fullDescription: "Honored for significant positive impact on local communities and preservation of traditional Kerala culture.",
          year: "2024",
          status: "Social Impact",
          icon: Crown,
          color: "orange",
          badge: "Impact Award",
          badgeColor: "bg-orange-600"
        }
      ]
    }
  ];

  const trustMetrics = [
    { icon: Shield, title: "100% Verified Hosts", stat: "500+", description: "Thoroughly verified hosts and properties" },
    { icon: CheckCircle, title: "Quality Assured", stat: "98%", description: "Consistent standards through regular audits" },
    { icon: Users, title: "Community Support", stat: "300+", description: "Local families directly benefited" },
    { icon: Medal, title: "Guest Satisfaction", stat: "4.8/5", description: "High ratings and repeat bookings" }
  ];

  const renderCertificationCard = (cert: any) => {
    const Icon = cert.icon;
    const isHovered = hoveredCard === cert.id;
    
    return (
      <div
        key={cert.id}
        className="group relative"
        onMouseEnter={() => setHoveredCard(cert.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer border-2 border-gray-200 bg-white hover:border-gray-300 h-80">
          {/* Top Badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge className={`${cert.badgeColor} text-white text-xs font-semibold px-2 py-1 shadow-lg`}>
              {cert.badge}
            </Badge>
          </div>

          <CardContent className="p-8 h-full flex flex-col">
            {/* Large Top Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-${cert.color}-500 to-${cert.color}-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title and Description */}
            <div className="text-center mb-6 flex-1">
              <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                {cert.name}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {cert.shortDescription}
              </p>
            </div>

            {/* Status Chips */}
            <div className="flex justify-center gap-2 mt-auto">
              <Badge className={`bg-${cert.color}-100 text-${cert.color}-700 hover:bg-${cert.color}-200 font-medium`}>
                Certified {cert.year}
              </Badge>
              <Badge variant="outline" className="text-gray-600 border-gray-300">
                {cert.status}
              </Badge>
            </div>
          </CardContent>

          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-white/98 backdrop-blur-sm transition-all duration-500 flex flex-col justify-center p-8 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="text-center">
              <div className="text-4xl mb-4">{cert.logo}</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{cert.name}</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {cert.fullDescription}
              </p>
              <div className="space-y-2">
                <Badge className={`${cert.badgeColor} text-white font-medium`}>
                  {cert.status}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-6">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Certifications & Accreditations
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our commitment to excellence validated through internationally recognized certifications 
            and prestigious industry awards.
          </p>
        </div>

        {/* Grouped Certifications */}
        <div className="space-y-16 mb-24">
          {certificationGroups.map((group, groupIndex) => (
            <div 
              key={groupIndex} 
              className="animate-fade-in"
              style={{ animationDelay: `${groupIndex * 200}ms` }}
            >
              {/* Group Header */}
              <div className={`relative p-8 rounded-3xl bg-gradient-to-r ${group.bgColor} border ${group.borderColor} mb-8`}>
                <div className="text-center">
                  <h3 className={`text-3xl font-bold ${group.titleColor} mb-2`}>
                    {group.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {group.subtitle}
                  </p>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                {group.items.map(renderCertificationCard)}
              </div>

              {/* Divider */}
              {groupIndex < certificationGroups.length - 1 && (
                <div className="flex justify-center mt-16">
                  <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="relative animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 rounded-3xl"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Hevan Connect Travel?
              </h3>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Professional standards combined with authentic experiences, ensuring quality and supporting local communities.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trustMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div 
                    key={index} 
                    className="text-center group hover-scale"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg border border-gray-200">
                        <Icon className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {metric.stat}
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      {metric.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed px-2">
                      {metric.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
