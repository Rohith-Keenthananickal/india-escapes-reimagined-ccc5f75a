
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Leaf, Shield, Star, Globe, Heart, CheckCircle, Users, Zap, Medal, TrendingUp, ChevronRight } from "lucide-react";
import { useState } from "react";

const Certifications = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const professionalCertifications = [
    {
      id: "kerala-tourism",
      name: "Kerala Tourism Department Certified",
      icon: Award,
      description: "Official recognition from the Government of Kerala Tourism Department, ensuring compliance with state tourism standards.",
      fullDescription: "Official recognition from the Government of Kerala Tourism Department, ensuring compliance with state tourism standards and authentic cultural experiences throughout Kerala's diverse regions.",
      status: "Certified 2024",
      validity: "Valid till Dec 2025",
      badge: "Govt Certified",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "fssai-food",
      name: "FSSAI Food Safety Certification",
      icon: Shield,
      description: "Food Safety and Standards Authority of India certification ensuring highest standards of food hygiene.",
      fullDescription: "Food Safety and Standards Authority of India certification ensuring highest standards of food hygiene and safety in all homestay kitchens, with regular audits and compliance monitoring.",
      status: "Certified 2024",
      validity: "Valid till Mar 2025",
      badge: "Food Safety",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    }
  ];

  const ecoSustainability = [
    {
      id: "iso-14001",
      name: "ISO 14001 Environmental Management",
      icon: Leaf,
      description: "International standard for environmental management systems, demonstrating commitment to sustainable practices.",
      fullDescription: "International standard for environmental management systems, demonstrating commitment to sustainable practices and environmental responsibility across all operations and partner homestays.",
      status: "Certified 2023",
      validity: "Valid till Nov 2024",
      badge: "International Standard",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: "unwto-sustainable",
      name: "UNWTO Sustainable Tourism Award",
      icon: Globe,
      description: "Recognition from the World Tourism Organization for outstanding contribution to sustainable tourism development.",
      fullDescription: "Recognition from the World Tourism Organization for outstanding contribution to sustainable tourism development and cultural heritage preservation in Kerala's backwater regions.",
      status: "Awarded 2023",
      validity: "Lifetime Achievement",
      badge: "International Award",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    }
  ];

  const communityPartnerships = [
    {
      id: "responsible-tourism",
      name: "Responsible Tourism Partnership",
      icon: Heart,
      description: "Certified partner of the Kerala Responsible Tourism Mission, supporting community development initiatives.",
      fullDescription: "Certified partner of the Kerala Responsible Tourism Mission, supporting community development and cultural preservation initiatives while ensuring direct economic benefits to local families.",
      status: "Partner 2024",
      validity: "Ongoing Partnership",
      badge: "Community Partner",
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200"
    }
  ];

  const hospitalityAwards = [
    {
      id: "hospitality-excellence",
      name: "Premium Hospitality Excellence",
      icon: Star,
      description: "Awarded for exceptional hospitality standards and guest satisfaction across all homestay experiences.",
      fullDescription: "Awarded for exceptional hospitality standards, guest satisfaction, and maintaining premium quality across all homestay experiences with consistent 4.8+ ratings.",
      status: "Awarded 2024",
      validity: "Annual Recognition",
      badge: "Quality Excellence",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: "tourism-innovation",
      name: "Excellence in Tourism Innovation 2024",
      icon: Medal,
      description: "Recognized for innovative approach in promoting authentic homestay experiences and digital transformation.",
      fullDescription: "Recognized by the Ministry of Tourism, Government of India for innovative approach in promoting authentic homestay experiences and digital transformation in rural tourism sector.",
      status: "Awarded 2024",
      validity: "National Recognition",
      badge: "National Award",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    }
  ];

  const trustMetrics = [
    {
      icon: Shield,
      title: "100% Verified Hosts",
      description: "Every host undergoes thorough background verification",
      stat: "500+",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: CheckCircle,
      title: "Quality Assured",
      description: "Regular quality audits and guest feedback monitoring",
      stat: "98%",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Direct economic benefits to local families",
      stat: "300+",
      color: "from-rose-500 to-rose-600"
    },
    {
      icon: TrendingUp,
      title: "Guest Satisfaction",
      description: "Consistently high ratings and repeat bookings",
      stat: "4.8/5",
      color: "from-amber-500 to-amber-600"
    }
  ];

  const CertificationCard = ({ cert, delay = 0 }: { cert: any; delay?: number }) => {
    const Icon = cert.icon;
    const isHovered = hoveredCard === cert.id;

    return (
      <Card
        className={`group relative overflow-hidden border-2 ${cert.borderColor} hover:border-opacity-60 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 bg-white cursor-pointer animate-fade-in`}
        style={{ animationDelay: `${delay}ms` }}
        onMouseEnter={() => setHoveredCard(cert.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="absolute top-4 right-4">
          <Badge className={`bg-gradient-to-r ${cert.color} text-white font-medium text-xs px-3 py-1 shadow-sm`}>
            {cert.badge}
          </Badge>
        </div>
        
        <CardContent className="p-6 pt-16">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
            <Icon className={`w-8 h-8 text-transparent bg-gradient-to-r ${cert.color} bg-clip-text`} />
          </div>
          
          <h4 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
            {cert.name}
          </h4>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {isHovered ? cert.fullDescription : cert.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-xs font-medium border-gray-300 text-gray-600 bg-gray-50">
              {cert.status}
            </Badge>
            <Badge variant="outline" className="text-xs font-medium border-green-300 text-green-700 bg-green-50">
              {cert.validity}
            </Badge>
          </div>

          {isHovered && (
            <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-200">
              <span>View Details</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const SectionHeader = ({ title, subtitle, delay = 0 }: { title: string; subtitle: string; delay?: number }) => (
    <div className={`text-center mb-12 animate-fade-in`} style={{ animationDelay: `${delay}ms` }}>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-4 rounded-full"></div>
      <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
    </div>
  );

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-xl mb-8">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Certifications & Accreditations
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our commitment to excellence is validated through internationally recognized certifications and prestigious industry awards.
          </p>
        </div>

        {/* Professional Certifications */}
        <div className="mb-20">
          <SectionHeader 
            title="Professional Certifications"
            subtitle="Government and international certifications ensuring the highest quality and compliance standards"
            delay={100}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {professionalCertifications.map((cert, index) => (
              <CertificationCard key={cert.id} cert={cert} delay={200 + index * 100} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-20">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-md"></div>
        </div>

        {/* Eco & Sustainability */}
        <div className="mb-20">
          <SectionHeader 
            title="Eco & Sustainability"
            subtitle="Environmental management and sustainable tourism certifications for responsible travel"
            delay={300}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ecoSustainability.map((cert, index) => (
              <CertificationCard key={cert.id} cert={cert} delay={400 + index * 100} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-20">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-md"></div>
        </div>

        {/* Community Partnerships */}
        <div className="mb-20">
          <SectionHeader 
            title="Community Partnerships"
            subtitle="Collaborative initiatives supporting local communities and cultural preservation"
            delay={500}
          />
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-2xl mx-auto">
            {communityPartnerships.map((cert, index) => (
              <CertificationCard key={cert.id} cert={cert} delay={600 + index * 100} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-20">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-md"></div>
        </div>

        {/* Tourism & Hospitality Awards */}
        <div className="mb-24">
          <SectionHeader 
            title="Tourism & Hospitality Awards"
            subtitle="Prestigious awards recognizing excellence in hospitality and tourism innovation"
            delay={700}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hospitalityAwards.map((cert, index) => (
              <CertificationCard key={cert.id} cert={cert} delay={800 + index * 100} />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="relative animate-fade-in" style={{ animationDelay: '900ms' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 rounded-3xl"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Hevan Connect Travel?
              </h3>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Our platform combines professional standards with authentic experiences, ensuring every stay meets 
                the highest quality and safety requirements.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trustMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="text-center group animate-fade-in" style={{ animationDelay: `${1000 + index * 100}ms` }}>
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
