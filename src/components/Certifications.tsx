import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Leaf, Shield, Star, Globe, Heart, CheckCircle, Users, Zap } from "lucide-react";

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
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
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
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
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
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-50",
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
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
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
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
      borderColor: "border-violet-200",
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
      color: "from-yellow-500 to-amber-600",
      bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50",
      borderColor: "border-yellow-200",
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
      category: "National Award"
    },
    {
      id: 2,
      title: "Sustainable Tourism Champion",
      organization: "Green Tourism India Foundation",
      description: "Awarded for outstanding commitment to environmental conservation and sustainable tourism practices across Kerala.",
      year: "2023",
      category: "Environmental Excellence"
    },
    {
      id: 3,
      title: "Community Impact & Cultural Preservation",
      organization: "Responsible Tourism Council of India",
      description: "Honored for significant positive impact on local communities and preservation of traditional Kerala culture and heritage.",
      year: "2024",
      category: "Social Impact"
    }
  ];

  const trustMetrics = [
    {
      icon: Shield,
      title: "100% Verified Hosts",
      description: "Every host undergoes thorough background verification and property inspection",
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50"
    },
    {
      icon: CheckCircle,
      title: "Quality Assured",
      description: "Regular quality audits and guest feedback monitoring ensure consistent standards",
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 to-green-50"
    },
    {
      icon: Users,
      title: "Local Community Support",
      description: "Direct economic benefits to local families and preservation of traditional livelihoods",
      color: "from-rose-500 to-pink-600",
      bgColor: "from-rose-50 to-pink-50"
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Seamless booking process with real-time availability and instant confirmation",
      color: "from-amber-500 to-orange-600",
      bgColor: "from-amber-50 to-orange-50"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Certifications & Accreditations
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our commitment to excellence is validated through internationally recognized certifications, 
            government accreditations, and industry awards that demonstrate our dedication to quality, 
            sustainability, and authentic experiences.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Certifications
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Internationally recognized standards and government certifications ensuring quality and compliance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert) => {
              const Icon = cert.icon;
              return (
                <Card
                  key={cert.id}
                  className={`group cursor-pointer hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 ${cert.borderColor} hover:scale-105 hover:border-opacity-100`}
                >
                  <div className={`${cert.bgColor} p-8 h-full`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-5xl">{cert.logo}</div>
                      <Badge className={`bg-gradient-to-r ${cert.color} text-white font-semibold px-3 py-1`}>
                        {cert.category}
                      </Badge>
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                      {cert.name}
                    </h4>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                      {cert.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-500">
                        <Icon className="w-4 h-4 mr-2" />
                        <span className="font-medium">Certified {cert.year}</span>
                      </div>
                      <Badge variant="outline" className="text-xs font-medium border-gray-300">
                        {cert.validity}
                      </Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Awards Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Industry Recognition & Awards
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Prestigious awards and recognition from leading tourism organizations and government bodies
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((award) => (
              <Card
                key={award.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-500 overflow-hidden border-2 border-amber-200 hover:border-amber-300 hover:scale-105"
              >
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-8 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl">🏆</div>
                    <div className="text-right">
                      <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold mb-2">
                        {award.category}
                      </Badge>
                      <div className="text-sm text-gray-600 font-medium">{award.year}</div>
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                    {award.title}
                  </h4>
                  
                  <p className="text-sm text-gray-600 mb-4 font-semibold">
                    {award.organization}
                  </p>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {award.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Why Choose Hevan Connect Travel?
            </h3>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              Our platform combines professional standards with authentic experiences, 
              ensuring every stay meets the highest quality and safety requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trustMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className={`w-20 h-20 bg-gradient-to-br ${metric.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-10 h-10 bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">{metric.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{metric.description}</p>
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