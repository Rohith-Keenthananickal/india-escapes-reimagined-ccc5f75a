
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Leaf, Shield, Star, Globe, Heart, CheckCircle, Users, Zap, Medal, Certificate, TrendingUp } from "lucide-react";

const Certifications = () => {
  const certifications = [
    {
      id: 1,
      name: "Kerala Tourism Department Certified",
      logo: "🏛️",
      description: "Official recognition from the Government of Kerala Tourism Department, ensuring compliance with state tourism standards and authentic cultural experiences.",
      category: "Government Certified",
      year: "2024",
      icon: Award,
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-white",
      borderColor: "border-blue-200",
      validity: "Valid until Dec 2025"
    },
    {
      id: 2,
      name: "ISO 14001 Environmental Management",
      logo: "🌿",
      description: "International standard for environmental management systems, demonstrating commitment to sustainable practices and environmental responsibility.",
      category: "International Standard",
      year: "2023",
      icon: Leaf,
      color: "from-green-600 to-green-700",
      bgColor: "bg-white",
      borderColor: "border-green-200",
      validity: "Valid until Nov 2024"
    },
    {
      id: 3,
      name: "Responsible Tourism Partnership",
      logo: "🤝",
      description: "Certified partner of the Kerala Responsible Tourism Mission, supporting community development and cultural preservation initiatives.",
      category: "Community Partnership",
      year: "2024",
      icon: Heart,
      color: "from-rose-600 to-rose-700",
      bgColor: "bg-white",
      borderColor: "border-rose-200",
      validity: "Ongoing Partnership"
    },
    {
      id: 4,
      name: "FSSAI Food Safety Certification",
      logo: "🍽️",
      description: "Food Safety and Standards Authority of India certification ensuring highest standards of food hygiene and safety in all homestay kitchens.",
      category: "Food Safety",
      year: "2024",
      icon: Shield,
      color: "from-amber-600 to-amber-700",
      bgColor: "bg-white",
      borderColor: "border-amber-200",
      validity: "Valid until Mar 2025"
    },
    {
      id: 5,
      name: "UNWTO Sustainable Tourism Award",
      logo: "🌍",
      description: "Recognition from the World Tourism Organization for outstanding contribution to sustainable tourism development and cultural heritage preservation.",
      category: "International Award",
      year: "2023",
      icon: Globe,
      color: "from-indigo-600 to-indigo-700",
      bgColor: "bg-white",
      borderColor: "border-indigo-200",
      validity: "Lifetime Achievement"
    },
    {
      id: 6,
      name: "Premium Hospitality Excellence",
      logo: "⭐",
      description: "Awarded for exceptional hospitality standards, guest satisfaction, and maintaining premium quality across all homestay experiences.",
      category: "Quality Excellence",
      year: "2024",
      icon: Star,
      color: "from-purple-600 to-purple-700",
      bgColor: "bg-white",
      borderColor: "border-purple-200",
      validity: "Annual Recognition"
    }
  ];

  const awards = [
    {
      id: 1,
      title: "Excellence in Tourism Innovation 2024",
      organization: "Ministry of Tourism, Government of India",
      description: "Recognized for innovative approach in promoting authentic homestay experiences and digital transformation in rural tourism.",
      year: "2024",
      category: "National Award",
      icon: Medal
    },
    {
      id: 2,
      title: "Sustainable Tourism Champion",
      organization: "Green Tourism India Foundation",
      description: "Awarded for outstanding commitment to environmental conservation and sustainable tourism practices across Kerala.",
      year: "2023",
      category: "Environmental Excellence",
      icon: Leaf
    },
    {
      id: 3,
      title: "Community Impact & Cultural Preservation",
      organization: "Responsible Tourism Council of India",
      description: "Honored for significant positive impact on local communities and preservation of traditional Kerala culture and heritage.",
      year: "2024",
      category: "Social Impact",
      icon: Heart
    }
  ];

  const trustMetrics = [
    {
      icon: Shield,
      title: "100% Verified Hosts",
      description: "Every host undergoes thorough background verification and property inspection",
      stat: "500+",
      color: "from-blue-600 to-blue-700"
    },
    {
      icon: CheckCircle,
      title: "Quality Assured",
      description: "Regular quality audits and guest feedback monitoring ensure consistent standards",
      stat: "98%",
      color: "from-green-600 to-green-700"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Direct economic benefits to local families and preservation of traditional livelihoods",
      stat: "300+",
      color: "from-rose-600 to-rose-700"
    },
    {
      icon: TrendingUp,
      title: "Guest Satisfaction",
      description: "Consistently high ratings and repeat bookings from satisfied travelers",
      stat: "4.8/5",
      color: "from-amber-600 to-amber-700"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-6">
            <Certificate className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Certifications & Accreditations
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our unwavering commitment to excellence is validated through internationally recognized certifications, 
            government accreditations, and prestigious industry awards that demonstrate our dedication to quality, 
            sustainability, and authentic travel experiences.
          </p>
        </div>

        {/* Professional Certifications */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Certifications
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Internationally recognized standards and government certifications ensuring the highest quality and compliance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert) => {
              const Icon = cert.icon;
              return (
                <Card
                  key={cert.id}
                  className={`group relative overflow-hidden border-2 ${cert.borderColor} hover:border-opacity-80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50"></div>
                  <CardContent className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                        {cert.logo}
                      </div>
                      <Badge className={`bg-gradient-to-r ${cert.color} text-white font-semibold px-4 py-2 shadow-lg`}>
                        {cert.category}
                      </Badge>
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-700 transition-colors duration-300">
                      {cert.name}
                    </h4>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm line-clamp-3">
                      {cert.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500 font-medium">
                        <Icon className="w-5 h-5 mr-2 text-gray-400" />
                        <span>Certified {cert.year}</span>
                      </div>
                      <Badge variant="outline" className="text-xs font-medium border-gray-300 text-gray-600 bg-gray-50">
                        {cert.validity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Industry Awards */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Industry Recognition & Awards
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Prestigious awards and recognition from leading tourism organizations and government bodies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((award) => {
              const Icon = award.icon;
              return (
                <Card
                  key={award.id}
                  className="group relative overflow-hidden border-2 border-amber-200 hover:border-amber-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-yellow-50/30"></div>
                  <CardContent className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold mb-2 shadow-lg">
                          {award.category}
                        </Badge>
                        <div className="text-sm text-gray-600 font-semibold bg-amber-50 px-3 py-1 rounded-full">
                          {award.year}
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-amber-700 transition-colors duration-300">
                      {award.title}
                    </h4>
                    
                    <p className="text-sm text-amber-700 mb-4 font-semibold bg-amber-50 px-3 py-2 rounded-lg">
                      {award.organization}
                    </p>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {award.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 rounded-3xl"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Hevan Connect Travel?
              </h3>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Our platform combines professional standards with authentic experiences, ensuring every stay meets 
                the highest quality and safety requirements while supporting local communities.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trustMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg border border-gray-200">
                        <Icon className={`w-10 h-10 text-transparent bg-gradient-to-r ${metric.color} bg-clip-text`} />
                      </div>
                      <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${metric.color} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
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
