import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PropertyMap from "@/components/PropertyMap";
import NearbyLocations from "@/components/NearbyLocations";
import LocationCard from "@/components/LocationCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Mountain,
  Droplets,
  Home,
  Utensils,
  ShoppingBag,
  Star,
  Navigation,
  ExternalLink,
  Map,
  List,
  Grid,
  Search,
  Filter,
} from "lucide-react";

const LocationDemo = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<"map" | "list" | "grid">(
    "map"
  );
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const demoLocation = {
    id: "demo1",
    name: "Mountain View Homestay",
    type: "homestay",
    position: { lat: 30.4599, lng: 78.0648 },
    rating: 4.8,
    distance: 0,
    description: "Beautiful homestay with stunning mountain views",
    icon: Home,
    color: "purple",
    address: "Mall Road, Mussoorie, Uttarakhand",
    phone: "+91 98765 43210",
    website: "https://mountainview.com",
    openingHours: "Check-in: 2:00 PM, Check-out: 11:00 AM",
  };

  const sampleLocations = [
    {
      id: "waterfall1",
      name: "Kempty Falls",
      type: "waterfall",
      position: { lat: 30.4599 + 0.02, lng: 78.0648 + 0.01 },
      rating: 4.5,
      distance: 2.1,
      description: "Popular waterfall with scenic views and trekking trails",
      icon: Droplets,
      color: "blue",
      address: "Kempty Falls Road, Mussoorie",
      openingHours: "Open daily 6:00 AM - 6:00 PM",
    },
    {
      id: "restaurant1",
      name: "Mountain View Restaurant",
      type: "restaurant",
      position: { lat: 30.4599 + 0.005, lng: 78.0648 - 0.008 },
      rating: 4.4,
      distance: 0.9,
      description: "Cozy restaurant with mountain views and local cuisine",
      icon: Utensils,
      color: "orange",
      address: "Mall Road, Mussoorie",
      openingHours: "Open daily 8:00 AM - 10:00 PM",
      phone: "+91 98765 43211",
    },
    {
      id: "attraction1",
      name: "Gun Hill",
      type: "attraction",
      position: { lat: 30.4599 + 0.03, lng: 78.0648 - 0.02 },
      rating: 4.8,
      distance: 3.5,
      description: "Famous viewpoint and cable car with panoramic views",
      icon: Mountain,
      color: "red",
      address: "Gun Hill Road, Mussoorie",
      openingHours: "Open daily 9:00 AM - 5:00 PM",
    },
  ];

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Location Features Demo
          </h1>
          <p className="text-gray-600">
            Explore enhanced location features with icons, Google Maps
            integration, and interactive cards
          </p>
        </div>

        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <Map className="w-4 h-4" />
              <span>Interactive Map</span>
            </TabsTrigger>
            <TabsTrigger value="nearby" className="flex items-center space-x-2">
              <List className="w-4 h-4" />
              <span>Nearby Places</span>
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center space-x-2">
              <Grid className="w-4 h-4" />
              <span>Location Cards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Map className="w-5 h-5 text-blue-600" />
                  <span>Interactive Property Map</span>
                </CardTitle>
                <p className="text-gray-600">
                  Enhanced map with Google Places API integration, custom icons,
                  and click-to-redirect functionality
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-xl overflow-hidden border">
                  <PropertyMap
                    latitude={30.4599}
                    longitude={78.0648}
                    propertyName="Mountain View Homestay"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nearby" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-green-600" />
                  <span>Nearby Places Discovery</span>
                </CardTitle>
                <p className="text-gray-600">
                  Comprehensive nearby places with filtering, search, and
                  detailed information
                </p>
              </CardHeader>
              <CardContent>
                <NearbyLocations
                  latitude={30.4599}
                  longitude={78.0648}
                  propertyName="Mountain View Homestay"
                  showMap={false}
                  onLocationClick={handleLocationClick}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Grid className="w-5 h-5 text-purple-600" />
                  <span>Location Card Components</span>
                </CardTitle>
                <p className="text-gray-600">
                  Reusable location cards with different variants and
                  interactive features
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Detailed Card View
                    </h3>
                    <div className="max-w-md">
                      <LocationCard
                        location={demoLocation}
                        variant="detailed"
                        showActions={true}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Compact Card View
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sampleLocations.map((location) => (
                        <LocationCard
                          key={location.id}
                          location={location}
                          variant="compact"
                          onClick={() => handleLocationClick(location)}
                          showActions={false}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedLocation && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Selected Location Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Location Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedLocation.name}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {selectedLocation.type}
                    </p>
                    <p>
                      <span className="font-medium">Rating:</span>{" "}
                      {selectedLocation.rating} ⭐
                    </p>
                    <p>
                      <span className="font-medium">Distance:</span>{" "}
                      {selectedLocation.distance}km
                    </p>
                    <p>
                      <span className="font-medium">Description:</span>{" "}
                      {selectedLocation.description}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Actions</h4>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          selectedLocation.name
                        )}`;
                        window.open(url, "_blank");
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Google Maps
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.position.lat},${selectedLocation.position.lng}`;
                        window.open(url, "_blank");
                      }}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                    {selectedLocation.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          window.open(`tel:${selectedLocation.phone}`, "_self")
                        }
                      >
                        📞 Call {selectedLocation.phone}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="mr-4"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => navigate("/property/1")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            View Property Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationDemo;
