import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Star,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Share2,
  Heart,
  Bed,
  Users,
  ExternalLink,
  Phone,
  Mail,
  Plane,
  Train,
  Bus,
  Sparkles,
  Award,
  Accessibility,
  Sparkle,
  Camera,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { usePropertyDetails } from '../hooks/usePropertyDetails';
import { PropertyImageGallery } from '../components/PropertyImageGallery';
import { PropertyBookingCard } from '../components/PropertyBookingCard';
import { PropertyLocationMap } from '../components/PropertyLocationMap';
import type { RoomDetail } from '../types/propertyDetails.types';

export const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
  const [activeRoomPhotoIdx, setActiveRoomPhotoIdx] = useState(0);

  const { data: property, isLoading, isError, error, refetch } = usePropertyDetails(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8 w-full space-y-8 flex-1">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-[420px] w-full rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="max-w-lg mx-auto px-4 py-24 text-center flex-1">
          <div className="p-8 bg-white border border-rose-200 rounded-3xl shadow-sm">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Homestay Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error instanceof Error ? error.message : 'Unable to retrieve this homestay profile.'}
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate('/properties')}>
                Back to Homestays
              </Button>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const hostInitials = property.host.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleOpenRoomModal = (room: RoomDetail) => {
    setSelectedRoom(room);
    setActiveRoomPhotoIdx(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between mb-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Stays
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
              className="text-xs gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSaved(!isSaved)}
              className="text-xs gap-1.5"
            >
              <Heart
                className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`}
              />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="mb-6 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              {property.title}
            </h1>
            {property.classification && property.classification !== 'UNCLASSIFIED' && (
              <Badge className="bg-amber-100 text-amber-900 border border-amber-200 font-semibold px-2.5 py-0.5">
                <Award className="w-3.5 h-3.5 mr-1 text-amber-600" />
                {property.classification} Homestay
              </Badge>
            )}
            {property.propertyTypeName && (
              <Badge variant="outline" className="text-gray-600 border-gray-300">
                {property.propertyTypeName}
              </Badge>
            )}
            {property.segmentName && (
              <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200">
                {property.segmentName}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
              <span className="font-bold text-gray-900">
                {property.rating > 0 ? property.rating.toFixed(1) : 'New'}
              </span>
              <span className="ml-1 text-gray-500">
                {property.reviewCount > 0 ? `(${property.reviewCount} reviews)` : '· New to platform'}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 text-rose-500 mr-1 shrink-0" />
              <span>{property.location}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <PropertyImageGallery
          images={property.images}
          title={property.title}
          classification={property.classification}
          isVerified={property.host.isVerified}
        />

        {/* Key Highlights Strip (Airbnb Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Verified Homestay</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Government tourism approved & background inspected.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Accessibility className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">
                {property.locationDetails?.elderlyFriendly ? 'Senior & Mobility Friendly' : 'Easy Access'}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {property.locationDetails?.floor || 'Ground level accommodation'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Serene Environment</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {property.houseRules.quietHours ? `Quiet hours: ${property.houseRules.quietHours}` : 'Peaceful natural stay'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Sparkle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Dedicated Host Care</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Personalized local hospitality with authentic local cuisine.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
          {/* Details Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Host Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {property.host.image ? (
                  <img
                    src={property.host.image}
                    alt={property.host.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold flex items-center justify-center text-xl shadow-sm border-2 border-white">
                    {hostInitials || 'H'}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Hosted by {property.host.name}
                    {property.host.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                        <Shield className="w-3 h-3" /> Verified Host
                      </span>
                    )}
                  </h3>
                  <div className="text-sm text-gray-500 space-y-0.5 mt-0.5">
                    {property.host.languages.length > 0 && (
                      <p>Speaks {property.host.languages.join(', ')}</p>
                    )}
                    {property.host.memberSince && (
                      <p className="text-xs text-gray-400">Hosting on Heaven Connect since {property.host.memberSince}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Direct Host Contact for Guests */}
              <div className="flex items-center gap-2">
                {property.host.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-1.5 text-xs text-gray-700 hover:text-emerald-700 hover:border-emerald-300"
                  >
                    <a href={`tel:${property.host.phone}`}>
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call Host
                    </a>
                  </Button>
                )}
                {property.host.email && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-1.5 text-xs text-gray-700 hover:text-blue-700 hover:border-blue-300"
                  >
                    <a href={`mailto:${property.host.email}`}>
                      <Mail className="w-3.5 h-3.5 text-blue-600" /> Send Message
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* About the Space */}
            <div className="space-y-4 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">About this homestay</h2>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                {property.aboutSpace || 'Welcome to this authentic homestay experience in Kerala.'}
              </p>
            </div>

            {/* Rooms & Accommodations with Visual Image Previews */}
            {property.rooms.length > 0 && (
              <div className="space-y-4 pb-8 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Where you'll sleep</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {property.rooms.length} room configuration{property.rooms.length > 1 ? 's' : ''} available • Click to view photos
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {property.rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => handleOpenRoomModal(room)}
                      className="group border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer flex flex-col"
                    >
                      {/* Room Photo Preview Header */}
                      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                        {room.coverImage ? (
                          <img
                            src={room.coverImage}
                            alt={room.roomType}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                            <Bed className="w-8 h-8 text-gray-300 mb-1" />
                            <span className="text-xs">Homestay Room</span>
                          </div>
                        )}

                        {/* Photo Count Tag */}
                        {room.images && room.images.length > 0 && (
                          <span className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Camera className="w-3 h-3" />
                            {room.images.length} {room.images.length === 1 ? 'photo' : 'photos'}
                          </span>
                        )}

                        {room.view && (
                          <Badge className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold shadow-sm border capitalize">
                            {room.view.toLowerCase()} View
                          </Badge>
                        )}
                      </div>

                      {/* Room Metadata Body */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition-colors">
                              {room.roomType}
                            </h4>
                            <span className="text-xs text-gray-500 shrink-0 font-medium">
                              {room.count} {room.count > 1 ? 'Units' : 'Unit'}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                            <div className="flex items-center gap-1.5">
                              <Bed className="w-4 h-4 text-gray-500" />
                              <span>{room.bedType} Bed</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span>Up to {room.maxOccupancy} guests</span>
                            </div>
                          </div>
                        </div>

                        {room.amenities.length > 0 && (
                          <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1.5">
                            {room.amenities.slice(0, 3).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 rounded text-[11px]"
                              >
                                {amenity}
                              </span>
                            ))}
                            {room.amenities.length > 3 && (
                              <span className="px-1.5 py-0.5 text-gray-400 text-[11px]">
                                +{room.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        <div className="pt-1 flex items-center justify-between text-xs text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                          <span>View room photos</span>
                          <span>→</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Getting Around & Location with Interactive Google Map */}
            <div className="space-y-4 pb-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Where you'll be & Getting around</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Explore the property surroundings, location map, and arrival distances</p>
                </div>
                {property.locationDetails?.googleMapLink && (
                  <Button variant="outline" size="sm" asChild className="text-xs gap-1.5">
                    <a
                      href={property.locationDetails.googleMapLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Full Map
                    </a>
                  </Button>
                )}
              </div>

              <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Property Address</h4>
                    <p className="text-gray-600 text-sm">{property.location}</p>
                    {property.locationDetails?.floor && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {property.locationDetails.floor}
                        {property.locationDetails.elderlyFriendly && ' • Senior & Mobility Friendly'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Interactive Google Map Component */}
                {property.locationDetails && (
                  <div className="pt-1">
                    <PropertyLocationMap
                      latitude={property.locationDetails.latitude || 9.6788}
                      longitude={property.locationDetails.longitude || 76.9741}
                      title={property.title}
                      address={property.locationDetails.address || property.location}
                      googleMapLink={property.locationDetails.googleMapLink}
                      propertyImage={property.images && property.images.length > 0 ? property.images[0] : undefined}
                    />
                  </div>
                )}

                {/* Transit Connectivity Details */}
                {(property.locationDetails?.nearbyAirport ||
                  property.locationDetails?.nearestRailwayStation ||
                  property.locationDetails?.nearestBusStand) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-gray-100 text-xs">
                    {property.locationDetails.nearbyAirport && (
                      <div className="flex items-start gap-2.5 p-3 bg-sky-50/70 border border-sky-100 rounded-xl">
                        <Plane className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-gray-900">Nearest Airport</p>
                          <p className="text-gray-700 text-xs mt-0.5">{property.locationDetails.nearbyAirport}</p>
                          <p className="text-sky-700 font-medium text-[11px] mt-0.5">
                            {property.locationDetails.distanceToAirport}
                          </p>
                        </div>
                      </div>
                    )}
                    {property.locationDetails.nearestRailwayStation && (
                      <div className="flex items-start gap-2.5 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                        <Train className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-gray-900">Railway Station</p>
                          <p className="text-gray-700 text-xs mt-0.5">{property.locationDetails.nearestRailwayStation}</p>
                          <p className="text-emerald-700 font-medium text-[11px] mt-0.5">
                            {property.locationDetails.distanceToRailwayStation}
                          </p>
                        </div>
                      </div>
                    )}
                    {property.locationDetails.nearestBusStand && (
                      <div className="flex items-start gap-2.5 p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
                        <Bus className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-gray-900">Bus Stand</p>
                          <p className="text-gray-700 text-xs mt-0.5">{property.locationDetails.nearestBusStand}</p>
                          <p className="text-amber-700 font-medium text-[11px] mt-0.5">
                            {property.locationDetails.distanceToBusStand}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Amenities & Comfort Services */}
            <div className="space-y-4 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from(new Set([...property.amenities, ...property.comfortServices])).map(
                  (amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-700 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Nearby Activities & Seasonal Experiences */}
            {(property.nearbyActivities.length > 0 || property.seasonalExperiences.length > 0) && (
              <div className="space-y-4 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Surroundings & Experiences</h2>

                {property.nearbyActivities.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">Nearby Activities</h4>
                    <div className="flex flex-wrap gap-2">
                      {property.nearbyActivities.map((act, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 shadow-sm"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {property.seasonalExperiences.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Seasonal Highlights
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {property.seasonalExperiences.map((exp, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-medium text-amber-800"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Things to Know: House Rules & Policies */}
            <div className="space-y-4 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Things to know</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-semibold text-gray-900">{property.houseRules.checkInTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-semibold text-gray-900">{property.houseRules.checkOutTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  {property.houseRules.petsAllowed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500" />
                  )}
                  <span>Pets {property.houseRules.petsAllowed ? 'Allowed' : 'Not Allowed'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {property.houseRules.smokingAllowed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500" />
                  )}
                  <span>Smoking {property.houseRules.smokingAllowed ? 'Allowed' : 'Not Allowed'}</span>
                </div>
                {property.houseRules.quietHours && (
                  <div className="flex items-center gap-2 sm:col-span-2 text-gray-600">
                    <Sparkles className="w-4 h-4 text-gray-400" />
                    <span>Quiet hours: <strong className="text-gray-900">{property.houseRules.quietHours}</strong></span>
                  </div>
                )}
                {property.houseRules.visitorPolicy && (
                  <div className="flex items-start gap-2 sm:col-span-2 text-gray-600">
                    <Shield className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <span>Visitor policy: <span className="text-gray-900">{property.houseRules.visitorPolicy}</span></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Booking Widget */}
          <div className="lg:col-span-1">
            <PropertyBookingCard property={property} />
          </div>
        </div>
      </main>

      {/* Room Photo Gallery & Details Modal */}
      {selectedRoom && (
        <Dialog open={Boolean(selectedRoom)} onOpenChange={(open) => !open && setSelectedRoom(null)}>
          <DialogContent className="max-w-3xl p-6 bg-white rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <DialogHeader className="pb-3 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {selectedRoom.roomType}
                  </DialogTitle>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    {selectedRoom.view && <span className="capitalize">{selectedRoom.view.toLowerCase()} View</span>}
                    {selectedRoom.view && <span>•</span>}
                    <span>{selectedRoom.bedType} Bed</span>
                    <span>•</span>
                    <span>Up to {selectedRoom.maxOccupancy} guests</span>
                    <span>•</span>
                    <span>{selectedRoom.count} {selectedRoom.count > 1 ? 'Units' : 'Unit'} in Homestay</span>
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 overflow-y-auto pr-1 flex-1 py-2">
              {/* Main Room Photo Display */}
              {selectedRoom.images && selectedRoom.images.length > 0 ? (
                <div className="space-y-2">
                  <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-gray-100 border">
                    <img
                      src={selectedRoom.images[activeRoomPhotoIdx] || selectedRoom.images[0]}
                      alt={`${selectedRoom.roomType} - Photo ${activeRoomPhotoIdx + 1}`}
                      className="w-full h-full object-cover transition-all"
                    />

                    {/* Carousel navigation buttons if multiple photos */}
                    {selectedRoom.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRoomPhotoIdx((prev) =>
                              prev === 0 ? selectedRoom.images.length - 1 : prev - 1
                            );
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRoomPhotoIdx((prev) =>
                              prev === selectedRoom.images.length - 1 ? 0 : prev + 1
                            );
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                          {activeRoomPhotoIdx + 1} / {selectedRoom.images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Selector Strip */}
                  {selectedRoom.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedRoom.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveRoomPhotoIdx(idx)}
                          className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                            idx === activeRoomPhotoIdx
                              ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-48 w-full bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400 border">
                  <Bed className="w-10 h-10 text-gray-300 mb-2" />
                  <p className="text-sm">No specific photos uploaded for this room</p>
                </div>
              )}

              {/* Room Amenities & Comforts */}
              {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-gray-900 text-sm">Room Features & Amenities</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {selectedRoom.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl text-xs text-gray-700 border border-gray-100"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t flex justify-end">
              <Button
                onClick={() => setSelectedRoom(null)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs px-5"
              >
                Close Room Details
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PropertyDetailsPage;
