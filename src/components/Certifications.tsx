
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Leaf, Shield, Star, Globe, Heart, CheckCircle, Users, Medal, Building, Trophy, Crown } from "lucide-react";
import { useState } from "react";

const Certifications = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const certificationsByCategory = {
    "government": [
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
        borderColor: "border-blue-200",
        bgGradient: "from-blue-50 to-blue-100",
        iconBg: "from-blue-500 to-blue-600"
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
        borderColor: "border-amber-200",
        bgGradient: "from-amber-50 to-amber-100",
        iconBg: "from-amber-500 to-amber-600"
      }
    ],
    "international": [
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
        borderColor: "border-green-200",
        bgGradient: "from-green-50 to-green-100",
        iconBg: "from-green-500 to-green-600"
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
        borderColor: "border-indigo-200",
        bgGradient: "from-indigo-50 to-indigo-100",
        iconBg: "from-indigo-500 to-indigo-600"
      }
    ],
    "community": [
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
        borderColor: "border-rose-200",
        bgGradient: "from-rose-50 to-rose-100",
        iconBg: "from-rose-500 to-rose-600"
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
        borderColor: "border-purple-200",
        bgGradient: "from-purple-50 to-purple-100",
        iconBg: "from-purple-500 to-purple-600"
      }
    ]
  };

  const industryAwards = [
    {
      id: "innovation-2024",
      title: "Excellence in Tourism Innovation",
      organization: "Ministry of Tourism, Government of India",
      description: "Recognized for innovative approach in promoting authentic homestay experiences and digital transformation in rural tourism.",
      year: "2024",
      icon: Trophy,
      rank: "National Award"
    },
    {
      id: "sustainable-champion",
      title: "Sustainable Tourism Champion",
      organization: "Green Tourism India Foundation",
      description: "Awarded for outstanding commitment to environmental conservation and sustainable tourism practices across Kerala.",
      year: "2023",
      icon: Leaf,
      rank: "Environmental Excellence"
    },
    {
      id: "community-impact",
      title: "Community Impact & Cultural Preservation",
      organization: "Responsible Tourism Council of India",
      description: "Honored for significant positive impact on local communities and preservation of traditional Kerala culture.",
      year: "2024",
      icon: Crown,
      rank: "Social Impact"
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
        <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-2 ${cert.borderColor} bg-gradient-to-br ${cert.bgGradient}`}>
          <CardContent className="p-8">
            {/* Large Top Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cert.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title and Description */}
            <div className="text-center mb-6">
              <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                {cert.name}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {cert.shortDescription}
              </p>
            </div>

            {/* Status Chips */}
            <div className="flex justify-center gap-2">
              <Badge className={`bg-${cert.color}-100 text-${cert.color}-700 hover:bg-${cert.color}-200 font-medium`}>
                Certified {cert.year}
              </Badge>
            </div>
          </CardContent>

          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-white/95 backdrop-blur-sm transition-all duration-500 flex flex-col justify-center p-8 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="text-center">
              <div className="text-4xl mb-4">{cert.logo}</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{cert.name}</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {cert.fullDescription}
              </p>
              <div className="space-y-2">
                <Badge variant="outline" className="font-medium">
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

        {/* Tabbed Certifications */}
        <div className="mb-24">
          <Tabs defaultValue="government" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-4xl grid-cols-1 md:grid-cols-3 lg:grid-cols-3 h-auto p-2 bg-white shadow-lg rounded-2xl border border-gray-200">
                <TabsTrigger value="government" className="text-sm font-semibold py-4 px-6 rounded-xl transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                  Government Certified
                </TabsTrigger>
                <TabsTrigger value="international" className="text-sm font-semibold py-4 px-6 rounded-xl transition-all duration-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                  International Standards
                </TabsTrigger>
                <TabsTrigger value="community" className="text-sm font-semibold py-4 px-6 rounded-xl transition-all duration-300 data-[state=active]:bg-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                  Community Partnerships
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="government" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {certificationsByCategory.government.map(renderCertificationCard)}
              </div>
            </TabsContent>

            <TabsContent value="international" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {certificationsByCategory.international.map(renderCertificationCard)}
              </div>
            </TabsContent>

            <TabsContent value="community" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {certificationsByCategory.community.map(renderCertificationCard)}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Industry Awards - Gold Theme */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-lg mb-6">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Industry Recognition & Awards
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Prestigious awards from leading tourism organizations and government bodies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {industryAwards.map((award, index) => {
              const Icon = award.icon;
              return (
                <Card
                  key={award.id}
                  className="group relative overflow-hidden border-2 border-amber-200 hover:border-amber-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-amber-50 to-yellow-50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-yellow-400/5 to-orange-400/10"></div>
                  <CardContent className="relative p-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    
                    <div className="text-center mb-6">
                      <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold mb-4 shadow-lg">
                        {award.rank}
                      </Badge>
                      <h4 className="text-xl font-bold text-gray-900 mb-4 leading-tight line-clamp-2">
                        {award.title}
                      </h4>
                      <p className="text-sm text-amber-700 mb-4 font-semibold bg-amber-100 px-4 py-2 rounded-lg">
                        {award.organization}
                      </p>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed text-center">
                      {award.description}
                    </p>
                    
                    <div className="text-center mt-6">
                      <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">
                        {award.year}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
