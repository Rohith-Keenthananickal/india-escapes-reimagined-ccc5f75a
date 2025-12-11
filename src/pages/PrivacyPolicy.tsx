import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, RefreshCw, Lock, Users, Building, Home } from "lucide-react";
const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("guest");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const guestPolicies = [{
    title: "Privacy Policy",
    icon: Shield,
    sections: [{
      subtitle: "Information We Collect",
      items: ["Account details (name, email, phone number)", "Booking details (dates, homestay, services opted)", "Location data (optional — for better recommendations)", "Payment information (processed securely through trusted gateways; we do not store card data)", "Device information (IP, app usage analytics)"]
    }, {
      subtitle: "How We Use Your Information",
      items: ["To process bookings and secure payments", "To provide personalised stay & experience recommendations", "For 24/7 customer support", "To ensure safety, verification, and compliance of stays", "To improve app performance and user experience"]
    }, {
      subtitle: "Sharing of Information",
      content: "We share information only with:",
      items: ["Verified Hosts for confirmed bookings", "Area Tourism Promoters (ATPs) for safety & verification", "Payment gateway providers", "Government authorities only if legally required"],
      note: "We never sell user data."
    }, {
      subtitle: "Data Retention",
      items: ["Booking history is stored for legal & service purposes", "You may request account deletion anytime"]
    }, {
      subtitle: "Your Rights",
      items: ["Access your data", "Correct incorrect details", "Delete your account/data", "Manage notifications & location permissions"]
    }]
  }, {
    title: "Terms of Service",
    icon: FileText,
    sections: [{
      subtitle: "User Obligations",
      items: ["Provide accurate information during booking", "Respect host property rules", "Avoid misuse, fraudulent bookings, or multi-account abuse"]
    }, {
      subtitle: "Booking Policy",
      items: ["Bookings are confirmed only after successful payment", "Host has the right to deny stay if guest violates safety rules", "Guests must show valid ID during check-in"]
    }, {
      subtitle: "Cancellation & Refunds",
      items: ["Refund eligibility will follow each host's cancellation policy", "Service fees may be non-refundable"]
    }, {
      subtitle: "Prohibited Activities",
      items: ["Illegal activities on the property", "Damage to property", "Harassment of hosts or ATPs", "Manipulating reviews or ratings"]
    }]
  }, {
    title: "Refund Policy",
    icon: RefreshCw,
    sections: [{
      subtitle: "Refund Guidelines",
      items: ["Full/partial refund depends on host's cancellation rules", "Processing time: 5–7 business days", "Refunds go back to original payment method", "No refunds for no-show or last-minute cancellations unless specified by host"]
    }]
  }, {
    title: "Safety Policy",
    icon: Lock,
    sections: [{
      subtitle: "Safety Measures",
      items: ["All homestays verified by ATPs", "Hosts undergo ID and property verification", "Emergency support available 24/7", "Guests must follow safety instructions provided by hosts"]
    }]
  }];
  const atpPolicies = [{
    title: "Privacy Policy",
    icon: Shield,
    sections: [{
      subtitle: "Information Collected",
      items: ["ATP profile details (name, phone, address)", "Host onboarding data & documents", "Inspection reports & photos", "Device/location data for verification routes"]
    }, {
      subtitle: "How We Use It",
      items: ["To verify homestay listings", "To track ATP performance & commissions", "To maintain platform quality standards"]
    }, {
      subtitle: "Sharing of Information",
      items: ["With hosts for onboarding progress", "With Trip Haven Co admin team", "Never shared with outsiders for commercial use"]
    }]
  }, {
    title: "Terms of Service",
    icon: FileText,
    sections: [{
      subtitle: "ATP Responsibilities",
      items: ["Verify homestays as per checklist", "Upload legitimate documents and photos", "Maintain professional behaviour with hosts & guests", "Conduct periodic inspections"]
    }, {
      subtitle: "Earnings & Commission",
      items: ["Commission available only for confirmed bookings", "Fraudulent onboarding will lead to account suspension"]
    }, {
      subtitle: "Prohibited Activities",
      items: ["Fake host listings", "Taking money personally from hosts or guests", "Manipulating reports or booking data"]
    }]
  }, {
    title: "Commission Policy",
    icon: RefreshCw,
    sections: [{
      subtitle: "Commission Details",
      items: ["Real-time commission dashboard", "Payments released monthly upon verification", "Commission disputes resolved within 7–14 days"]
    }]
  }, {
    title: "Safety & Conduct",
    icon: Lock,
    sections: [{
      subtitle: "Conduct Guidelines",
      items: ["ATPs must follow code of conduct", "No harassment or misuse of access", "Report unsafe homestays immediately"]
    }]
  }];
  const hostPolicies = [{
    title: "Privacy Policy",
    icon: Shield,
    sections: [{
      subtitle: "Data We Collect",
      items: ["Host details, photos, property documents", "Bank account details for payouts", "Guest chat & booking history", "Service & experience listing details"]
    }, {
      subtitle: "Why We Collect It",
      items: ["To verify homestay authenticity", "To process guest bookings", "To deliver secure payouts", "To maintain platform trust and safety"]
    }]
  }, {
    title: "Terms of Service",
    icon: FileText,
    sections: [{
      subtitle: "Host Responsibilities",
      items: ["Provide truthful property information", "Maintain cleanliness, hygiene, and safety", "Honour confirmed bookings", "Treat guests respectfully", "Update availability calendar regularly"]
    }, {
      subtitle: "Booking & Payout Rules",
      items: ["Payouts released after guest check-out", "Platform service charges apply", "Hosts must ensure accurate pricing"]
    }, {
      subtitle: "Prohibited Conduct",
      items: ["Accepting offline payments outside the platform", "Cancelling confirmed bookings without reason", "Uploading misleading or fake photos", "Harassing guests or misbehaving"]
    }]
  }, {
    title: "Cancellation & Refund Policy",
    icon: RefreshCw,
    sections: [{
      subtitle: "For Hosts Cancelling",
      items: ["Penalties may apply", "Calendar blocking may occur for repeated cancellations"]
    }, {
      subtitle: "For Guests",
      items: ["Host-specific cancellation policy applies"]
    }]
  }, {
    title: "Safety & Compliance",
    icon: Lock,
    sections: [{
      subtitle: "Safety Standards",
      items: ["All homestays must meet basic safety standards", "Fire safety, first-aid kit, and clean drinking water required", "Host must follow local laws & tourism regulations"]
    }]
  }];
  const renderPolicyCard = (policy: typeof guestPolicies[0]) => <Card key={policy.title} className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border/30">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <policy.icon className="h-5 w-5 text-primary" />
          </div>
          {policy.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {policy.sections.map((section, idx) => <div key={idx} className="space-y-3">
            <h4 className="font-semibold text-foreground/90 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              {section.subtitle}
            </h4>
            {section.content && <p className="text-muted-foreground text-sm pl-4">{section.content}</p>}
            <ul className="space-y-2 pl-4">
              {section.items.map((item, itemIdx) => <li key={itemIdx} className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  {item}
                </li>)}
            </ul>
            {section.note && <p className="text-sm font-medium text-primary pl-4">{section.note}</p>}
          </div>)}
      </CardContent>
    </Card>;
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-[30px]">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Legal Information
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Privacy Policy & Terms
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hevan Connect Travel Pvt. Ltd. is committed to protecting your privacy and ensuring transparency in all our operations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="grid grid-cols-3 w-full max-w-2xl bg-muted/50">
                <TabsTrigger value="guest" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Guest</span> Policies
                </TabsTrigger>
                <TabsTrigger value="atp" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">ATP</span> Policies
                </TabsTrigger>
                <TabsTrigger value="host" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Host</span> Policies
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="guest" className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Trip Haven Co – Main Website (Guest)</h2>
                <p className="text-muted-foreground">Policies for travelers and guests using our platform</p>
              </div>
              {guestPolicies.map(renderPolicyCard)}
            </TabsContent>

            <TabsContent value="atp" className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Trip Haven Co ATP – Area Tourism Promoter App</h2>
                <p className="text-muted-foreground">Official policies for Area Tourism Promoters</p>
              </div>
              {atpPolicies.map(renderPolicyCard)}
            </TabsContent>

            <TabsContent value="host" className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Trip Haven Co Host App – Homestay, Service & Experience Hosts</h2>
                <p className="text-muted-foreground">Official policies for homestay and service hosts</p>
              </div>
              {hostPolicies.map(renderPolicyCard)}
            </TabsContent>
          </Tabs>

          {/* Last Updated */}
          <div className="text-center mt-12 pt-8 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              Last updated: December 2024 | For questions, contact us at{" "}
              <a href="mailto:privacy@hevanconnect.com" className="text-primary hover:underline">
                privacy@hevanconnect.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>;
};
export default PrivacyPolicy;