import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Star, Calendar } from "lucide-react";

const MediaSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const testimonialVideos = [
    {
      id: 1,
      thumbnail:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop&crop=face",
      title: "Amazing Backwater Experience",
      guest: "Sarah from Germany",
      location: "Alleppey Homestay",
      duration: "2:30",
    },
    {
      id: 2,
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtbZrmO31kLTADxysnpooxBx9kCfOSeP_YSw&s",
      title: "Cultural Immersion Journey",
      guest: "Priya & Family",
      location: "Kochi Heritage Home",
      duration: "3:15",
    },
    {
      id: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=face",
      title: "Hill Station Adventure",
      guest: "Mike from Australia",
      location: "Munnar Mountain Stay",
      duration: "2:45",
    },
  ];

  const guestOfMonth = {
    name: "Anitha & Raj",
    story:
      '"Our family homestay in Wayanad exceeded all expectations. The hosts treated us like family, and we learned to cook traditional Kerala dishes. The kids loved the spice garden tour!"',
    image:
      "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Wayanad Spice Homestay",
    date: "December 2024",
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          See What Guests Are Saying
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Testimonials */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-6">Guest Video Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonialVideos.map((video) => (
                <Card
                  key={video.id}
                  className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="lg"
                        className="rounded-full bg-white text-black hover:bg-gray-100"
                      >
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-black bg-opacity-70 text-white">
                      {video.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {video.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">{video.guest}</p>
                    <p className="text-xs text-gray-500">{video.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Guest of the Month */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Guest of the Month</h3>
            <Card className="bg-gradient-to-br from-pink-50 to-orange-50 border border-pink-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={guestOfMonth.image}
                    alt={guestOfMonth.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-pink-200"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {guestOfMonth.name}
                    </h4>
                    <div className="flex items-center text-yellow-500 text-sm">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>

                <blockquote className="text-gray-700 mb-4 italic">
                  {guestOfMonth.story}
                </blockquote>

                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium">{guestOfMonth.location}</p>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{guestOfMonth.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">Follow our journey:</p>
              <ul className="flex justify-center space-x-4 wrapper">
                {/* Instagram Icon */}
                <li
                  tabIndex={0}
                  aria-label="Instagram"
                  className="icon instagram relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white shadow-lg cursor-pointer transition-transform transform hover:scale-110 focus:scale-110 outline-none"
                  onClick={() =>
                    window.open(
                      "https://instagram.com",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      window.open(
                        "https://instagram.com",
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                >
                  <span className="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                    Instagram
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1.6em"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="bi bi-instagram"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                  </svg>
                </li>
                {/* YouTube Icon */}
                <li
                  tabIndex={0}
                  aria-label="YouTube"
                  className="icon youtube relative w-12 h-12 flex items-center justify-center rounded-full bg-red-600 text-white shadow-lg cursor-pointer transition-transform transform hover:scale-110 focus:scale-110 outline-none"
                  onClick={() =>
                    window.open(
                      "https://youtube.com",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      window.open(
                        "https://youtube.com",
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                >
                  <span className="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                    YouTube
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    fill="currentColor"
                    height="1.6em"
                  >
                    <path d="M549.655 124.083c-6.281-23.65-24.84-42.21-48.48-48.48C458.781 64 288 64 288 64s-170.781 0-213.175 11.603c-23.64 6.27-42.199 24.83-48.48 48.48C16 166.477 16 256 16 256s0 89.523 10.345 131.917c6.281 23.65 24.84 42.21 48.48 48.48C117.219 448 288 448 288 448s170.781 0 213.175-11.603c23.64-6.27 42.199-24.83 48.48-48.48C560 345.523 560 256 560 256s0-89.523-10.345-131.917zM232 336V176l142.857 80L232 336z" />
                  </svg>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
