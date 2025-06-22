import {
  Home,
  Users,
  Leaf,
  Sparkles,
  HeartHandshake,
  Landmark,
} from "lucide-react";

const mainValues = [
  {
    icon: Sparkles,
    title: "Authentic Kerala Experiences",
    description:
      "We go beyond just bookings — we connect you with the heart of Kerala. Stay with welcoming local families and enjoy traditional food, culture, and everyday life, making each trip truly memorable.",
    color: "bg-yellow-100 text-yellow-600",
    aria: "Authentic Kerala Experiences",
  },
  {
    icon: HeartHandshake,
    title: "Homes with a Heart",
    description:
      "Our stays aren't hotels—they're homes filled with stories. You'll be hosted by real people who share their lives, spaces, and smiles. It's not just a room; it's a doorway to community, connection, and comfort.",
    color: "bg-pink-100 text-pink-600",
    aria: "Homes with a Heart",
  },
  {
    icon: Leaf,
    title: "Travel That Gives Back",
    description:
      "Your journey supports the planet and the people. We promote low-impact tourism by working with local communities, using vacant heritage homes, and encouraging eco-friendly stays that protect both culture and nature.",
    color: "bg-green-100 text-green-600",
    aria: "Travel That Gives Back",
  },
];

const highlights = [
  {
    icon: <Leaf className="w-6 h-6 text-green-500" aria-label="Eco-Friendly" />,
    title: "Eco-Friendly",
    quote:
      "“This homestay follows eco-conscious practices such as rainwater harvesting, solar energy, and organic farming.”",
    border: "border-green-300",
    bg: "bg-green-50",
  },
  {
    icon: (
      <Users className="w-6 h-6 text-blue-500" aria-label="Family Favorite" />
    ),
    title: "Family Favorite",
    quote:
      "“Perfect for family vacations — spacious homes, safe surroundings, and friendly hosts make this a great choice for travelers with kids or elders.”",
    border: "border-blue-300",
    bg: "bg-blue-50",
  },
  {
    icon: (
      <Landmark
        className="w-6 h-6 text-yellow-700"
        aria-label="Heritage Stay"
      />
    ),
    title: "Heritage Stay",
    quote:
      "“Experience living in a piece of Kerala's history. These homes reflect traditional architecture, antique furnishings, and timeless charm.”",
    border: "border-yellow-300",
    bg: "bg-yellow-50",
  },
];

const ValueProposition = () => {
  return (
    <>
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-14 tracking-tight">
            Why Choose Kerala Homestays?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
            {mainValues.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  tabIndex={0}
                  aria-label={item.aria}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 flex flex-col items-center focus:outline-none focus:ring-4 focus:ring-yellow-200"
                >
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-full mb-6 text-3xl ${item.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 text-base text-center leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((h, idx) => (
              <div
                key={h.title}
                tabIndex={0}
                aria-label={h.title}
                className={`rounded-xl border-2 ${h.border} ${h.bg} p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-100`}
              >
                <div className="mb-3">{h.icon}</div>
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  {h.title}
                </div>
                <div className="text-gray-600 text-center italic text-base">
                  {h.quote}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex-1 flex flex-col justify-center">
            <h2
              className="text-3xl font-extrabold text-green-700 mb-4"
              tabIndex={0}
              aria-label="Our Commitment to Sustainable Development"
            >
              Our Commitment to Sustainable Development
            </h2>
            <p
              className="text-gray-800 text-lg mb-4"
              tabIndex={0}
              aria-label="Sustainable Development Description"
            >
              At Hevan Connect Travel, we are proud to support{" "}
              <span className="font-bold">
                9 Sustainable Development Goals (SDGs)
              </span>{" "}
              set by the United Nations. These goals guide us to promote
              responsible tourism, empower local communities, and protect the
              environment. Explore how we contribute to a better future for
              Kerala and beyond.
            </p>
            <a
              href="https://sdgs.un.org/goals"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-base font-semibold text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
              tabIndex={0}
              aria-label="Learn More About Our 9 SDGs at the United Nations website"
            >
              Learn More About Our 9 SDGs →
            </a>
            <span
              className="block mt-4 text-xs text-gray-500"
              tabIndex={0}
              aria-label="Content Adaptation Note"
            >
              This content is adapted for our website. If approval or copyright
              is required, please let us know.
            </span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="grid grid-cols-6 sm:grid-cols-6 gap-4 w-full max-w-4xl">
              {Array.from({ length: 17 }, (_, idx) => {
                const num = (idx + 1).toString().padStart(2, "0");
                return (
                  <img
                    key={`E_GIF_${num}.gif`}
                    src={`/sgdicons/E_GIF_${num}.gif`}
                    alt={`Sustainable Development Goal ${
                      idx + 1
                    } animated icon`}
                    className="w-20 h-20 object-contain rounded shadow-md border border-gray-100"
                    tabIndex={0}
                    aria-label={`Sustainable Development Goal ${
                      idx + 1
                    } animated icon`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ValueProposition;
