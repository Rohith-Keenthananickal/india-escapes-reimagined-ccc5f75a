import type { BackendPropertyItem } from '@/modules/landing/types/landing.types';

export interface HostUserSummary {
  id: number;
  full_name: string;
  email?: string | null;
  phone_number?: string | null;
  profile_image?: string | null;
  user_type?: string | null;
  created_at?: string | null;
}

export interface BackendLocationItem {
  id?: number;
  address?: string | null;
  google_map_link?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  floor?: string | null;
  elderly_friendly?: boolean | null;
  nearby_airport?: string | null;
  distance_to_airport?: string | null;
  nearest_railway_station?: string | null;
  distance_to_railway_station?: string | null;
  nearest_bus_stand?: string | null;
  distance_to_bus_stand?: string | null;
}

export interface BackendRoomItem {
  id: number;
  room_type: string;
  count: number;
  max_occupancy: number;
  bed_type: string;
  view?: string | null;
  amenities: string[];
  images?: string[];
}

export interface BackendPropertyPhotoItem {
  id: number;
  category: string;
  image_url: string;
  created_at?: string;
}

export interface BackendPropertyProfileData extends BackendPropertyItem {
  host?: HostUserSummary | null;
  location?: BackendLocationItem | null;
  rooms?: BackendRoomItem[] | null;
  property_photos?: BackendPropertyPhotoItem[] | null;
  facilities?: any[] | null;
  segment_id?: number | null;
  segment_name?: string | null;
}

export interface PropertyDetailsAPIResponse {
  status: string;
  data: BackendPropertyProfileData;
  message?: string;
}

export interface RoomDetail {
  id: number;
  roomType: string;
  count: number;
  maxOccupancy: number;
  bedType: string;
  view?: string;
  amenities: string[];
  images: string[];
  coverImage?: string;
}

export interface LocationDetailInfo {
  address: string;
  googleMapLink?: string;
  latitude?: number;
  longitude?: number;
  floor?: string;
  elderlyFriendly?: boolean;
  nearbyAirport?: string;
  distanceToAirport?: string;
  nearestRailwayStation?: string;
  distanceToRailwayStation?: string;
  nearestBusStand?: string;
  distanceToBusStand?: string;
}

export interface NormalizedPropertyDetails {
  id: number;
  userId: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  propertyTypeName?: string;
  classification: string;
  verificationStatus: string;
  progressStep: number;
  isVerified: boolean;
  segmentName?: string;
  host: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    image: string;
    languages: string[];
    isVerified: boolean;
    userType: string;
    memberSince?: string;
  };
  locationDetails: LocationDetailInfo | null;
  rooms: RoomDetail[];
  aboutSpace: string;
  amenities: string[];
  comfortServices: string[];
  houseRules: {
    checkInTime: string;
    checkOutTime: string;
    smokingAllowed: boolean;
    petsAllowed: boolean;
    alcoholAllowed: boolean;
    quietHours?: string;
    visitorPolicy?: string;
    housekeepingFrequency?: string;
  };
  nearbyActivities: string[];
  nearbyAttractions: string[];
  seasonalExperiences: string[];
}
