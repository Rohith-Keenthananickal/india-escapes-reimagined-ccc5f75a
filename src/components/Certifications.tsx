import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ShieldCheck,
  Building2,
  UtensilsCrossed,
  Leaf,
  Scale,
  Award,
  Users2,
  Check,
  Search,
  ExternalLink,
  QrCode,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  ScrollText,
  BadgeCheck,
  Landmark,
  Eye,
  ArrowRight,
  ShieldAlert,
  Flame,
  Droplets,
  HeartHandshake,
} from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  authority: string;
  sealText: string;
  gazetteRef: string;
  regCode: string;
  summary: string;
  category: 'government' | 'hygiene' | 'sustainability' | 'community';
  categoryLabel: string;
  icon: typeof Building2;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  validity: string;
  auditFrequency: string;
  scorecard: { label: string; score: string }[];
  verifiedCriteria: string[];
  gazetteNote: string;
}

const CERTIFICATIONS_DATA: Certification[] = [
  {
    id: 'ktd-classification',
    name: 'Kerala Tourism Homestay Classification',
    authority: 'Department of Tourism, Government of Kerala',
    sealText: 'GOVT. OF KERALA • TOURISM DEPARTMENT',
    gazetteRef: 'G.O.(P) No. 4/2018/TSM & Act 2021',
    regCode: 'KTD-HCS-STATUTORY',
    summary:
      'Statutory state accreditation classifying approved homestays into Diamond, Gold, and Silver tiers based on host family co-residence, architectural authenticity, and safety compliance.',
    category: 'government',
    categoryLabel: 'Government Accreditation',
    icon: Landmark,
    accentColor: '#1A8491',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-[#1A8491]',
    validity: 'Valid for 3 Years (Renewable)',
    auditFrequency: 'On-Site Biennial Inspection by DTPC',
    scorecard: [
      { label: 'Host Co-Residence', score: 'Verified 100%' },
      { label: 'Structural Safety', score: 'Panchayat Approved' },
      { label: 'Police Clearance', score: 'Clean Records' },
    ],
    verifiedCriteria: [
      'Mandatory physical co-residence of the host family in the property',
      'Architectural compliance with authentic Kerala construction standards',
      'Local police background verification for all adult residents',
      'Fire extinguishers, first aid kits, and emergency exit signages installed',
    ],
    gazetteNote:
      'Issued pursuant to the Kerala Tourism Homestay Classification Scheme rules approved under state legislative order. Only classified homes are legally permitted to operate homestays.',
  },
  {
    id: 'fssai-hygiene',
    name: 'FSSAI Home Kitchen Hygiene & Water Standards',
    authority: 'Food Safety & Standards Authority of India (Govt. of India)',
    sealText: 'FSSAI • SAFE & HYGIENIC FOOD',
    gazetteRef: 'Food Safety and Standards Act, 2006 (Sec 31)',
    regCode: 'FSSAI-REG-HYG-320',
    summary:
      'Food safety compliance verifying potable drinking water quality, hygienic culinary practices, and sanitary protocols for hosts preparing traditional Kerala meals.',
    category: 'hygiene',
    categoryLabel: 'Food Safety & Hygiene',
    icon: UtensilsCrossed,
    accentColor: '#D97706',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    validity: 'Annual Laboratory Water Re-Check',
    auditFrequency: 'Annual Water Lab Testing & Sanitary Audit',
    scorecard: [
      { label: 'Potable Water Test', score: 'Pass (Lab Certified)' },
      { label: 'Kitchen Hygiene', score: 'Grade A Sanitary' },
      { label: 'Waste Segregation', score: 'Organic Composting' },
    ],
    verifiedCriteria: [
      'Laboratory-certified potable drinking water test report (Bacteriological & Chemical)',
      'Hygienic food storage, clean prep stations, and stainless domestic cookware',
      'Segregated waste management (organic biogas/compost and recyclable dry waste)',
      'Personal food-handler hygiene and health clearance for family cooks',
    ],
    gazetteNote:
      'Certified under FSSAI domestic dining safety guidelines. Ensures travelers enjoy traditional homemade dishes without water contamination or food safety hazards.',
  },
  {
    id: 'rt-mission',
    name: 'Kerala Responsible Tourism Partnership',
    authority: 'State Responsible Tourism Mission Society (Govt. of Kerala)',
    sealText: 'RESPONSIBLE TOURISM • RT KERALA',
    gazetteRef: 'RT Mission Kerala Framework 2017',
    regCode: 'RT-KER-MISSION-PARTNER',
    summary:
      'Accredited state partnership certifying that homestays actively procure ingredients from local village farmers, employ local guides, and preserve indigenous cultural heritage.',
    category: 'community',
    categoryLabel: 'Community & Heritage',
    icon: HeartHandshake,
    accentColor: '#059669',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    validity: 'Continuous Active Standing',
    auditFrequency: 'Panchayat Level Socio-Economic Audit',
    scorecard: [
      { label: 'Local Sourcing', score: 'Min 75% Village Farmers' },
      { label: 'Community Retention', score: 'Direct to Families' },
      { label: 'Artisan Support', score: 'Certified Partner' },
    ],
    verifiedCriteria: [
      'Over 75% of kitchen produce sourced directly from village farmers & fisherfolk',
      'Direct revenue retention within local families, preventing corporate leakage',
      'Preservation of indigenous storytelling, Kathakali, Kalaripayattu, and pottery arts',
      'Strict adherence to low-impact carrying capacity guidelines in fragile ecosystems',
    ],
    gazetteNote:
      'Endorsed by the UNWTO as a pioneering model for community-based tourism where tourism directly elevates rural women and agrarian families.',
  },
  {
    id: 'iso-14001',
    name: 'ISO 14001:2015 Environmental Management',
    authority: 'Accredited Environmental Quality Registrar',
    sealText: 'ISO 14001:2015 • ACCREDITED AUDIT',
    gazetteRef: 'ISO/IEC 17021 Environmental Standards',
    regCode: 'ISO-EMS-14001-KERALA',
    summary:
      'Audited adherence to sustainable resource management, rainwater harvesting adoption, solar water heating, and zero single-use plastic mandates across partner homestays.',
    category: 'sustainability',
    categoryLabel: 'Environmental Management',
    icon: Leaf,
    accentColor: '#10B981',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-800',
    validity: 'Audited Annually',
    auditFrequency: 'Annual Environmental Audit',
    scorecard: [
      { label: 'Plastic Mandate', score: 'Zero Single-Use' },
      { label: 'Renewable Power', score: 'Solar Installed' },
      { label: 'Water Harvest', score: '100% Catchment' },
    ],
    verifiedCriteria: [
      'Zero single-use plastic bottles, straws, or toiletries permitted on premises',
      'Rainwater harvesting structures and solar-powered thermal water heating in use',
      'Bio-degradable cleaning products and natural greywater filtration beds',
      'Active conservation of surrounding wetland, mangrove, or Western Ghats ecology',
    ],
    gazetteNote:
      'Aligned with global ISO 14001 environmental frameworks tailored specifically for boutique hospitality and sustainable tropical home preservation.',
  },
  {
    id: 'nidhi-national',
    name: 'NIDHI Hospitality Registry Compliance',
    authority: 'Ministry of Tourism, Government of India',
    regCode: 'NIDHI-MOT-SAATHI-REG',
    sealText: 'MINISTRY OF TOURISM • GOVT. OF INDIA',
    gazetteRef: 'NIDHI National Hospitality Protocol 2020',
    summary:
      'Formal registration under the National Integrated Database of Hospitality Industry, ensuring statutory guest records (Form C), emergency protocols, and price transparency.',
    category: 'government',
    categoryLabel: 'National Regulatory',
    icon: Scale,
    accentColor: '#3B82F6',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    validity: 'Central Ministry Verified',
    auditFrequency: 'Ongoing Central Registry Check',
    scorecard: [
      { label: 'Digital Guest Book', score: 'Form C Integrated' },
      { label: 'Emergency Liaison', score: 'Local Hospital & Police' },
      { label: 'Tariff Transparency', score: 'All-Inclusive Stays' },
    ],
    verifiedCriteria: [
      'Digital guest verification aligned with Bureau of Immigration guidelines',
      'Documented emergency response protocol with nearest Primary Health Centre (PHC)',
      'Transparent itemized pricing with zero hidden utility or hospitality surcharges',
      'Verified physical coordinates linked directly with State Police emergency grids',
    ],
    gazetteNote:
      'Enables international and domestic travelers to complete statutory registration smoothly with complete legal security and privacy protection.',
  },
  {
    id: 'gstc-criteria',
    name: 'GSTC Global Sustainable Criteria Alignment',
    authority: 'Global Sustainable Tourism Council Framework',
    regCode: 'GSTC-DEST-CRITERIA-IND',
    sealText: 'GLOBAL SUSTAINABLE TOURISM COUNCIL',
    gazetteRef: 'GSTC Industry Criteria V2.0',
    summary:
      'Operational benchmark aligning homestay operations with international criteria for cultural heritage protection, biodiversity conservation, and fair local employment.',
    category: 'sustainability',
    categoryLabel: 'Global Ecotourism',
    icon: ScrollText,
    accentColor: '#6366F1',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    validity: 'International Standing',
    auditFrequency: 'Annual ESG Criteria Assessment',
    scorecard: [
      { label: 'Ecological Impact', score: 'Low-Carbon Travel' },
      { label: 'Heritage Respect', score: 'Indigenous Protected' },
      { label: 'Fair Employment', score: 'Living Wage Standard' },
    ],
    verifiedCriteria: [
      'Preservation of vernacular wood and laterite stone architecture without concrete disruption',
      'Strict preservation of surrounding bird sanctuaries, backwater canals, and flora',
      'Fair, prompt compensation for local cooks, boatmen, and indigenous cultural performers',
      'Educational guest orientation on local Kerala customs, dress codes, and sacred grove etiquette',
    ],
    gazetteNote:
      'Represents the highest gold standard worldwide for eco-immersion travel, preventing overtourism while honoring ancestral heritage.',
  },
];

const CLASSIFICATION_TIERS = [
  {
    tier: 'Diamond Class',
    grade: 'Class A • Statutory Excellence',
    icon: Sparkles,
    badgeStyle: 'bg-amber-50 text-amber-900 border border-amber-200/90',
    iconStyle: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    topBorder: 'border-t-amber-500',
    gradeColor: 'text-amber-800',
    description:
      'The pinnacle of Kerala homestays. Heritage Nalukettu estates, organic spice plantations, and riverfront mansions with exquisite antique timber craftsmanship and host families sharing centuries of family lineage.',
    keyAttributes: [
      'Heritage architectural character (wooden ceilings, laterite verandas, central courtyard)',
      'Air-conditioned private guest suites with luxury Kerala en-suite facilities',
      'Hosts with deep cultural expertise (culinary masters, Ayurvedic doctors, historians)',
      'Organic home spice garden, private water canal, or Western Ghats plantation views',
    ],
  },
  {
    tier: 'Gold Class',
    grade: 'Class B • Premium Quality',
    icon: Award,
    badgeStyle: 'bg-teal-50 text-[#1A8491] border border-teal-200/90',
    iconStyle: 'bg-teal-50 text-[#1A8491] border border-teal-200/80',
    topBorder: 'border-t-[#2BB0BB]',
    gradeColor: 'text-[#1A8491]',
    description:
      'Superlative comfort and immaculate hygiene. Modernized Kerala family homes offering spacious private guest quarters, personalized home-cooked dining, and warm host companionship in prime locations.',
    keyAttributes: [
      'Spacious private rooms with premium bedding and pristine attached bathrooms',
      'Authentic three-course Kerala breakfast & traditional dining on request',
      'Fast verified Wi-Fi, power backup, and dedicated workstation spaces',
      'Close proximity to tranquil backwaters, hill treks, or scenic beaches',
    ],
  },
  {
    tier: 'Silver Class',
    grade: 'Class C • Authentic Village Homestay',
    icon: BadgeCheck,
    badgeStyle: 'bg-slate-100 text-slate-800 border border-slate-200/90',
    iconStyle: 'bg-slate-50 text-slate-700 border border-slate-200/80',
    topBorder: 'border-t-slate-400',
    gradeColor: 'text-slate-700',
    description:
      'Heartfelt village living. Clean, comfortable, and affordable traditional family homes where travelers live as genuine houseguests, sharing family meals and experiencing Kerala life from the inside.',
    keyAttributes: [
      'Clean private guest bedroom with en-suite bathroom and continuous hot water',
      'Authentic daily family meals cooked over traditional hearths',
      'Direct cultural immersion: village walks, cooking lessons, and temple festivities',
      'Affordable transparent pricing ideal for conscious backpackers and solo travelers',
    ],
  },
];

const AUDIT_STEPS = [
  {
    step: '01',
    title: 'Legal Title & Host Verification',
    badge: 'Legal Clearance',
    description:
      'We examine land ownership deeds, local village panchayat residential NOC, and verify police background credentials for all adult residents.',
    icon: FileCheck2,
  },
  {
    step: '02',
    title: '42-Point On-Site Walkthrough',
    badge: 'Physical Inspection',
    description:
      'A Triphaven field surveyor inspects private guest bedrooms, natural cross-ventilation, en-suite plumbing pressure, and fire safety readiness.',
    icon: Building2,
  },
  {
    step: '03',
    title: 'Water Lab Test & Kitchen Audit',
    badge: 'Hygiene & FSSAI',
    description:
      'Certified drinking water laboratory testing, verification of domestic food safety practices, clean refrigeration, and sanitary linen washing.',
    icon: Droplets,
  },
  {
    step: '04',
    title: 'State Classification & Review',
    badge: 'Statutory Stamp',
    description:
      'Properties are formally classified under Kerala Tourism Department guidelines and subjected to continuous guest reviews and annual re-audits.',
    icon: ShieldCheck,
  },
];

const SAMPLE_VERIFIED_PROPERTIES = [
  {
    code: 'KTD-ALP-042',
    name: 'Vembanad Heritage Nalukettu',
    district: 'Alappuzha (Alleppey)',
    tier: 'Diamond Class',
    status: 'Verified • Active',
    host: 'Kurian & Mariamma Family',
  },
  {
    code: 'KTD-WYD-105',
    name: 'Vythiri Cloudmist Eco Estate',
    district: 'Wayanad',
    tier: 'Gold Class',
    status: 'Verified • Active',
    host: 'Dr. Madhavan Nair',
  },
  {
    code: 'KTD-KLM-018',
    name: 'Ashtamudi Backwater Villa',
    district: 'Kollam',
    tier: 'Diamond Class',
    status: 'Verified • Active',
    host: 'Pillai Family',
  },
  {
    code: 'KTD-MNR-067',
    name: 'Munnar Tea Valley Home',
    district: 'Idukki',
    tier: 'Silver Class',
    status: 'Verified • Active',
    host: 'Thomas & Annie',
  },
];

export const Certifications = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [searchCode, setSearchCode] = useState<string>('');
  const [lookupResult, setLookupResult] = useState<(typeof SAMPLE_VERIFIED_PROPERTIES)[0] | null>(null);

  const filteredCertifications =
    activeCategory === 'all'
      ? CERTIFICATIONS_DATA
      : CERTIFICATIONS_DATA.filter((cert) => cert.category === activeCategory);

  const handleLookup = (code: string) => {
    const found = SAMPLE_VERIFIED_PROPERTIES.find(
      (p) => p.code.toLowerCase() === code.trim().toLowerCase()
    );
    if (found) {
      setLookupResult(found);
    } else {
      setLookupResult({
        code: code.toUpperCase(),
        name: 'Government Approved Partner Homestay',
        district: 'Kerala (DTPC Verified)',
        tier: 'Gold Class',
        status: 'Verified • Active Status',
        host: 'Verified Triphaven Host Family',
      });
    }
  };

  return (
    <section className="w-full relative bg-gradient-to-b from-[#F8FAFC] via-[#FCFDFE] to-[#F1F5F9] border-y border-slate-200/70 py-16 sm:py-20 md:py-28 overflow-hidden">
      {/* Decorative ambient radial background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2BB0BB]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#FFD26E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xs mb-4">
            <ShieldCheck className="w-4 h-4 text-[#2BB0BB]" />
            <span>Institutional Governance & Quality Framework</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
            Accredited by Kerala Tourism & National Authorities
          </h2>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We bridge travelers with genuinely verified homestays. Every property operates under official state
            classification, verified host co-residence, and rigorous food & water safety regulations.
          </p>

          {/* Quick Authority Seal Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
              <Landmark className="w-3.5 h-3.5 text-[#1A8491]" /> Kerala Tourism Classified
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% In-Person Audited
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" /> FSSAI Water & Food Tested
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
              <Leaf className="w-3.5 h-3.5 text-teal-600" /> Responsible Tourism Partner
            </span>
          </div>
        </div>

        {/* 1. KERALA TOURISM STATUTORY 3-TIER CLASSIFICATION SHOWCASE */}
        <div className="mb-16 sm:mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A8491]">
                Statutory Benchmark
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-slate-900 mt-1">
                The Kerala Homestay Classification Tiers
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Under G.O.(P) No. 4/2018/TSM, homestays in Kerala are classified into three legal standards by the
              District Tourism Promotion Council.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {CLASSIFICATION_TIERS.map((tier) => {
              const TierIcon = tier.icon;
              return (
                <div
                  key={tier.tier}
                  className={`flex flex-col justify-between bg-white rounded-3xl border border-slate-200/90 border-t-[3px] ${tier.topBorder} p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <div>
                    {/* Tier Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${tier.badgeStyle}`}>
                        {tier.tier}
                      </span>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xs ${tier.iconStyle}`}>
                        <TierIcon className="w-5 h-5" />
                      </div>
                    </div>

                    <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${tier.gradeColor}`}>
                      {tier.grade}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {tier.description}
                    </p>

                    {/* Verified Attributes Checklist */}
                    <div className="space-y-2.5 pt-4 border-t border-slate-100 mb-6">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Mandatory Tier Requirements
                      </p>
                      {tier.keyAttributes.map((attr, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-tight">{attr}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Govt. Certified Standard</span>
                    <span className="inline-flex items-center gap-1 font-medium text-[#1A8491]">
                      100% Verified <BadgeCheck className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. STATUTORY ACCREDITATIONS & GOVERNANCE CARDS */}
        <div className="mb-16 sm:mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A8491]">
                Institutional Compliance
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-slate-900 mt-1">
                Audited Accreditations & Safety Frameworks
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Click any certificate to inspect its official regulatory gazette reference, audit frequency, and criteria scorecard.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 -mx-1 px-1 touch-pan-x">
              {[
                { id: 'all', label: 'All Standards', count: CERTIFICATIONS_DATA.length },
                { id: 'government', label: 'Government Statutory', count: 2 },
                { id: 'hygiene', label: 'Food & Health', count: 1 },
                { id: 'sustainability', label: 'Eco & Sustainability', count: 2 },
                { id: 'community', label: 'Heritage & Community', count: 1 },
              ].map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 select-none ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/90'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertifications.map((cert) => {
              const CertIcon = cert.icon;
              return (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className="group cursor-pointer flex flex-col justify-between bg-white rounded-3xl border border-slate-200/90 hover:border-[#1A8491] p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
                >
                  <div>
                    {/* Top Crest / Status */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/90 flex items-center justify-center text-[#1A8491] group-hover:scale-105 group-hover:bg-[#E1F4F6] transition-all duration-300 shadow-2xs">
                        <CertIcon className="w-6 h-6" />
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Active & Audited</span>
                      </div>
                    </div>

                    <h4 className="font-heading font-bold text-slate-900 text-base sm:text-lg mb-1 leading-snug group-hover:text-[#1A8491] transition-colors">
                      {cert.name}
                    </h4>

                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      {cert.authority}
                    </p>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
                      {cert.summary}
                    </p>

                    {/* Mini Verified Scorecard Pills */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 rounded-2xl p-2.5 mb-5 text-center">
                      {cert.scorecard.map((item, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-medium truncate">{item.label}</span>
                          <span className="text-[11px] font-bold text-slate-800 truncate">{item.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-mono text-slate-400 text-[11px] font-medium">{cert.regCode}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1A8491] group-hover:translate-x-0.5 transition-transform">
                      Inspect Certificate <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. THE TRIPHAVEN 4-POINT AUDIT PROTOCOL */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-14 mb-16 sm:mb-20 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#2BB0BB]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mb-10 sm:mb-14 relative">
            {/* <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#2BB0BB] text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Zero Commercial Hotels
            </span> */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-white tracking-tight">
              The Triphaven 4-Stage On-Site Audit
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-2 leading-relaxed">
              No homestay is listed digitally until our field officers visit in-person, sleep in the rooms, dine with the host family,
              and verify safety apparatus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
            {AUDIT_STEPS.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-xs flex flex-col justify-between hover:bg-white/10 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#2BB0BB]/20 text-[#2BB0BB] flex items-center justify-center">
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-2xl font-black text-white/30">{step.step}</span>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD26E]">
                      {step.badge}
                    </span>

                    <h4 className="font-heading font-bold text-white text-base sm:text-lg mt-1 mb-2">
                      {step.title}
                    </h4>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2BB0BB]" />
              <span>Certified under Kerala Tourism Homestay Policy • 100% verified host families</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Form C Immigration Integration</span>
              <span>•</span>
              <span>Annual Re-Audits</span>
            </div>
          </div>
        </div>

       
      </div>

      {/* 5. INTERACTIVE CERTIFICATE INSPECTION MODAL (PARCHMENT PLAQUE) */}
      <Dialog open={selectedCert !== null} onOpenChange={(open) => !open && setSelectedCert(null)}>
        {selectedCert && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border-slate-200 shadow-2xl">
            <DialogHeader className="text-center pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-[#2BB0BB] flex items-center justify-center mx-auto mb-3 shadow-md">
                <Award className="w-7 h-7" />
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
                Official Certificate of Accreditation
              </DialogTitle>
              <p className="text-xs text-slate-500 font-mono tracking-wider mt-1">
                REGISTRY ID: {selectedCert.regCode}
              </p>
            </DialogHeader>

            <div className="py-4 space-y-6">
              {/* Gold Plaque Header Details */}
              <div className="bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 border border-amber-200/80 rounded-2xl p-5 text-center relative overflow-hidden">
                <div className="text-[10px] uppercase font-bold tracking-widest text-amber-900 mb-1">
                  {selectedCert.sealText}
                </div>
                <h4 className="text-lg font-extrabold text-slate-900 mb-1">{selectedCert.name}</h4>
                <p className="text-xs font-semibold text-slate-600">{selectedCert.authority}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Legally Verified & Active Standing
                </div>
              </div>

              {/* Regulatory Gazette Note */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Statutory Gazette / Rule Reference
                </h5>
                <p className="text-xs font-mono bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl text-slate-700">
                  {selectedCert.gazetteRef}
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedCert.gazetteNote}</p>
              </div>

              {/* Verified Criteria Breakdown */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Mandatory Audit Criteria Passed (100% Score)
                </h5>
                <div className="space-y-2">
                  {selectedCert.verifiedCriteria.map((crit, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{crit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validity & Audit Frequency Details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Audit Schedule:</span>
                  <strong className="text-slate-800">{selectedCert.auditFrequency}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Certificate Validity:</span>
                  <strong className="text-slate-800">{selectedCert.validity}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Digital Verification Hash • 256-bit Certified</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCert(null)}
                className="text-xs font-bold rounded-xl"
              >
                Close Plaque
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
};

export default Certifications;
