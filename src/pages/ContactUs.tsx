import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Building2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent(
    'Regus Upper Crest, Skyline Builders, Info Park Road, Kusumagiri PO, Kakkanad, Kochi, Kerala 682030'
  );

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 sm:py-14">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[#1A8491] text-xs font-bold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            Contact Us
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-gray-900 tracking-tight mb-2">
            Heaven Connect Travel Private Limited – TripHavenCo
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Reach our team in Kakkanad, Kochi for support, partnerships, and general enquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Company details</h2>
            <dl className="space-y-3 text-sm text-gray-700">
              <div>
                <dt className="text-xs uppercase tracking-wider text-gray-500 font-semibold">CIN</dt>
                <dd className="font-medium">U52291KL2025PTC092533</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-gray-500 font-semibold">DPIIT</dt>
                <dd className="font-medium">DIPP203076</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Registered address
                </dt>
                <dd className="leading-relaxed">
                  Regus Upper Crest - Skyline Builders
                  <br />
                  Info Park Road, Kusumagiri PO
                  <br />
                  Kakkanad, Kochi, Kerala, India - 682030
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Get in touch</h2>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:Support@triphavenco.com"
                className="flex items-center gap-2 text-gray-700 hover:text-[#1A8491]"
              >
                <Mail className="w-4 h-4 text-[#1A8491]" />
                Support@triphavenco.com
              </a>
              <a
                href="tel:+918129111291"
                className="flex items-center gap-2 text-gray-700 hover:text-[#1A8491]"
              >
                <Phone className="w-4 h-4 text-[#1A8491]" />
                +91 8129111291
              </a>
              <p className="flex items-start gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-[#1A8491] mt-0.5 shrink-0" />
                Kakkanad, Kochi, Kerala
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-2">
              <Button asChild className="bg-[#1A8491] hover:bg-[#15707A]">
                <a href="tel:+918129111291">
                  <Phone className="w-4 h-4 mr-2" />
                  Call us
                </a>
              </Button>
              <Button asChild variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <a
                  href="https://wa.me/918129111291"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer">
                  <MapPin className="w-4 h-4 mr-2" />
                  Open map
                </a>
              </Button>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;
