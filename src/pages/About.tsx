import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { 
  Globe, 
  Heart, 
  Users, 
  Shield, 
  Leaf, 
  Mountain, 
  Camera,
  Lightbulb,
  Eye,
  Target,
  CheckCircle
} from "lucide-react";

// Import images
import aboutHero from "@/assets/about-hero.jpg";
import sustainability from "@/assets/sustainability.jpg";
import localExperience from "@/assets/local-experience.jpg";
import techInnovation from "@/assets/tech-innovation.jpg";
import sdgVisual from "@/assets/sdg-visual.jpg";

const About = () => {
  const whyChooseData = [
    {
      icon: Globe,
      title: "Segment-Wise Travel",
      description: "Explore destinations by themes—beach, hill, forest, village, wellness, or city. Build multi-stop journeys with deeper, more meaningful travel experiences."
    },
    {
      icon: Shield,
      title: "On-Ground Safety Support",
      description: "Every location has a dedicated Safety Officer to ensure verified stays, local support, and guest safety 24 hours."
    },
    {
      icon: Heart,
      title: "Authentic Local Experiences",
      description: "Enjoy hands-on activities like cooking with locals, pottery, yoga, and Ayurveda—all run by real community hosts, not third-party vendors."
    },
    {
      icon: Lightbulb,
      title: "Smart + Personal Planning",
      description: "Use AI-powered tools to search by mood or interest, add multiple stays to your Journey Cart, and receive a custom itinerary map after booking."
    },
    {
      icon: Users,
      title: "Direct Host Connection",
      description: "No middlemen. Hosts set their own prices. Guests connect directly with trained hosts before arrival—transparent, fair, and personal."
    },
    {
      icon: Leaf,
      title: "Responsible & Inclusive Travel",
      description: "Support eco-friendly, women-led, and LGBTQ+ friendly stays. Bookings benefit local families, artisans, and service providers."
    }
  ];

  const sdgGoals = [
    { number: 1, title: "No Poverty", description: "Creating income for local hosts and artisans" },
    { number: 4, title: "Quality Education", description: "Training and education for hosts and local teams" },
    { number: 5, title: "Gender Equality", description: "Empowering women through hosting and coordination roles" },
    { number: 8, title: "Decent Work", description: "Driving local job creation and entrepreneurship" },
    { number: 9, title: "Industry Innovation", description: "Using smart technology to strengthen rural tourism infrastructure" },
    { number: 10, title: "Reduced Inequalities", description: "Bringing tourism to underrepresented areas" },
    { number: 11, title: "Sustainable Cities", description: "Promoting sustainable living through eco-friendly homestays" },
    { number: 12, title: "Responsible Consumption", description: "Encouraging responsible use of resources" },
    { number: 13, title: "Climate Action", description: "Supporting low-impact travel to fight climate change" },
    { number: 17, title: "Partnerships", description: "Building strong partnerships with communities and government bodies" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={aboutHero} 
            alt="Cultural exchange and authentic travel experiences" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            About Hevan Connect Travel
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Revolutionizing Global Tourism Through
            <span className="text-primary"> Authentic Connections</span>
          </h1>
          <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            A tech-driven tourism startup that bridges global travelers with authentic homestays, 
            immersive cultural experiences, and trusted local services across Europe, North America, and Asia.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="p-8 bg-card border border-border">
                <CardContent className="p-0">
                  <p className="text-lg text-foreground leading-relaxed">
                    <strong>Hevan Connect Travel Pvt. Ltd.</strong> is a tech-driven tourism startup incorporated 
                    under the Registrar of Companies, operating a digital platform that bridges global travelers 
                    with authentic homestays, immersive cultural experiences, and trusted local services.
                  </p>
                  <p className="text-lg text-foreground leading-relaxed mt-4">
                    With active networks across Europe, North America, and Asia, we are committed to promoting 
                    responsible tourism by empowering communities and creating value for both travelers and hosts. 
                    We believe that travel is not just about destinations—it's about people, culture, and connection.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="lg:order-first">
              <img 
                src={localExperience} 
                alt="Local cultural experiences and authentic connections" 
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Goals */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission */}
            <Card className="p-8 bg-card border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To unlock the untapped potential of traditional homes worldwide by turning them into 
                  sustainable travel experiences, connecting international travelers with local hosts, 
                  and fostering meaningful cross-cultural exchange.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="p-8 bg-card border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To revolutionize global tourism through a community-powered model where authenticity, 
                  technology, and sustainability drive every travel experience—making every stay feel 
                  like home, no matter where you are.
                </p>
              </CardContent>
            </Card>

            {/* Goals */}
            <Card className="p-8 bg-card border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Our Goal</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">Connect travelers with culturally rooted, locally hosted stays</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">Support rural and underrepresented communities through income and entrepreneurship</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">Enable responsible, ethical, and immersive travel experiences</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">Deliver a personalized, tech-enabled journey-building experience</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">Maintain a network of on-ground Area Safety Officers for safe, seamless, supported stays</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Hevan Connect */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Hevan Connect?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We're not just offering a place to stay—we're reimagining the future of tourism. 
              Built around people, purpose, and place, we deliver more than bookings—we deliver 
              stories, safety, and sustainability.
            </p>
            <div className="w-full h-64 mb-8">
              <img 
                src={techInnovation} 
                alt="Technology innovation in travel planning" 
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card key={index} className="p-6 bg-card border border-border hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* SDG Goals - Redesigned */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-accent rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-secondary rounded-full"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                UN Sustainable Development Goals
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Supporting Global Sustainability
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                At Hevan Connect, we align with 10 key UN Sustainable Development Goals (SDGs) 
                through our responsible tourism model. Every booking creates a ripple effect of 
                positive impact across communities worldwide.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-primary">10</h3>
                  <p className="text-sm text-muted-foreground">SDG Goals Supported</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-primary">3</h3>
                  <p className="text-sm text-muted-foreground">Continents Active</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src={sustainability} 
                alt="Sustainable tourism and eco-friendly travel" 
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* SDG Goals Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {sdgGoals.map((goal, index) => (
              <Card key={index} className="group p-6 bg-white/80 backdrop-blur-sm border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white">
                <CardContent className="p-0 text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all">
                      <span className="text-white font-bold text-lg">{goal.number}</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-3 text-sm group-hover:text-primary transition-colors">{goal.title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{goal.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Impact Statement */}
          <div className="text-center">
            <Card className="p-8 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex items-center justify-center mb-6">
                  <img 
                    src={sdgVisual} 
                    alt="UN SDG Goals Visual" 
                    className="w-20 h-20 rounded-full object-cover shadow-lg"
                  />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Creating Positive Impact Together</h3>
                <p className="text-foreground leading-relaxed max-w-4xl mx-auto">
                  Through our platform, every booking creates a ripple effect of positive impact—from empowering 
                  local communities and preserving cultural heritage to promoting sustainable travel practices and 
                  fostering global understanding. Together, we're building a more connected, equitable, and 
                  sustainable world, one stay at a time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;