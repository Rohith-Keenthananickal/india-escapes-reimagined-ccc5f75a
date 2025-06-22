import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Waves, Leaf, Sun, Snowflake } from "lucide-react";

const SeasonalBooking = () => {
  const [activeTab, setActiveTab] = useState("summer");

  const seasons = [
    {
      id: "summer",
      title: "Summer Escapes",
      icon: Sun,
      color: "bg-yellow-500",
      properties: [
        {
          name: "Hill Station Cottage",
          location: "Munnar",
          price: 3200,
          image:
            "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/202205021616354878-d6bd36240a5411eda28b0a58a9feac02.jpg",
        },
        {
          name: "Cool Mountain Retreat",
          location: "Wayanad",
          price: 2800,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1024x768/488469872.jpg?k=6dbe643d583e33e703ed839c5122476e197d86cf55fe68b3e9ba5a8b2d1e2f18&o=&hp=1",
        },
        {
          name: "Silent Valley Eco Stay",
          location: "Palakkad",
          price: 2600,
          image:
            "https://content.jdmagicbox.com/comp/palakkad/a2/9999px491.x491.180628100509.n2a2/catalogue/silent-valley-farm-stay-pudur-palakkad-farm-house-on-rent-bs9ymwqv1y.jpg",
        },
      ],
    },
    {
      id: "monsoon",
      title: "Monsoon Magic",
      icon: Waves,
      color: "bg-blue-500",
      properties: [
        {
          name: "Rainforest Lodge",
          location: "Thekkady",
          price: 2500,
          image:
            "https://www.holidify.com/images/cmsuploads/compressed/282613902_20220901170640.jpg",
        },
        {
          name: "Misty Valley Home",
          location: "Idukki",
          price: 2200,
          image:
            "https://pix10.agoda.net/hotelImages/161/1615129/1615129_16101223350047693118.jpg?ca=13&ce=1&s=414x232&ar=16x9",
        },
        {
          name: "Backwater Breeze",
          location: "Alleppey",
          price: 2700,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1024x768/42865145.jpg?k=c2cf6c345084d1569bde3575f413a4bf6e82a140a654fbfd076952ff8f7265d0&o=&hp=1",
        },
      ],
    },
    {
      id: "onam",
      title: "Onam Specials",
      icon: Leaf,
      color: "bg-green-500",
      properties: [
        {
          name: "Heritage Homestay",
          location: "Kochi",
          price: 4500,
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE7_N4KohWUHU3stBMFpMqgOqMvW8b5YwOSw&s",
        },
        {
          name: "Cultural Village Stay",
          location: "Alappuzha",
          price: 3800,
          image:
            "https://mararibeachpalace.com/assets/Delux%20rooms%20near%20marari%20beach%20alappey.jpg",
        },
        {
          name: "Tradition Trails Resort",
          location: "Thrissur",
          price: 4100,
          image:
            "https://www.neelambari.co.in/assets/img/facility-banner-new.jpg",
        },
      ],
    },
    {
      id: "winter",
      title: "Winter Holidays",
      icon: Snowflake,
      color: "bg-purple-500",
      properties: [
        {
          name: "Cozy Beach Cottage",
          location: "Varkala",
          price: 3500,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1024x768/340493803.jpg?k=7ca6954bd87fd450c59ef93a9d90bf1f2335344946c1f44b034df8b1804ccb62&o=&hp=1",
        },
        {
          name: "Backwater Villa",
          location: "Kumarakom",
          price: 4200,
          image:
            "https://www.honeymoonbug.com/blog/wp-content/uploads/2021/07/Kumarakom-Lake-Resort.jpg",
        },
        {
          name: "Hilltop Wooden Chalet",
          location: "Wayanad",
          price: 3900,
          image:
            "https://pix10.agoda.net/property/69672057/0/d8a8e2a0336c1edffc73a188fe83498a.jpeg?ce=2&s=414x232",
        },
      ],
    },
  ];

  const activeSeason = seasons.find((s) => s.id === activeTab);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Book by Season or Festival
        </h2>

        {/* Season Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {seasons.map((season) => {
            const IconComponent = season.icon;
            return (
              <Button
                key={season.id}
                variant={activeTab === season.id ? "default" : "outline"}
                className={`flex items-center space-x-2 ${
                  activeTab === season.id ? season.color : ""
                }`}
                onClick={() => setActiveTab(season.id)}
              >
                <IconComponent className="w-4 h-4" />
                <span>{season.title}</span>
              </Button>
            );
          })}
        </div>

        {/* Seasonal Properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSeason?.properties.map((property, index) => (
            <Card
              key={index}
              className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <Badge
                  className={`absolute top-3 left-3 ${activeSeason.color}`}
                >
                  {activeSeason.title}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {property.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {property.location}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">
                    ₹{property.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600 text-sm">/ night</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mini Calendar */}
        <div className="mt-8 text-center">
          <Card className="inline-block p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                Upcoming Festivals: Onam (Aug-Sep), Diwali (Oct-Nov), Christmas
                (Dec)
              </span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SeasonalBooking;
