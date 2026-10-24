import apiClient from '@/services/apiClient';
import type {
  PropertyDetailsAPIResponse,
  NormalizedPropertyDetails,
  RoomDetail,
  LocationDetailInfo,
} from '../types/propertyDetails.types';

export const propertyDetailsService = {
  async getPropertyById(id: string | number): Promise<NormalizedPropertyDetails> {
    const response = await apiClient.get<PropertyDetailsAPIResponse>(`/api/v1/properties/profile/${id}`);
    const prop = response.data;

    // Collect ONLY uploaded/real images from backend (deduplicated)
    const imageSet = new Set<string>();

    if (prop.cover_image && prop.cover_image.trim()) {
      imageSet.add(prop.cover_image.trim());
    }

    if (Array.isArray(prop.property_photos)) {
      prop.property_photos.forEach((photo) => {
        if (photo.image_url && photo.image_url.trim()) {
          imageSet.add(photo.image_url.trim());
        }
      });
    }

    if (Array.isArray(prop.exterior_images)) {
      prop.exterior_images.filter(Boolean).forEach((url) => imageSet.add(url.trim()));
    }
    if (Array.isArray(prop.bedroom_images)) {
      prop.bedroom_images.filter(Boolean).forEach((url) => imageSet.add(url.trim()));
    }
    if (Array.isArray(prop.bathroom_images)) {
      prop.bathroom_images.filter(Boolean).forEach((url) => imageSet.add(url.trim()));
    }
    if (Array.isArray(prop.living_dining_images)) {
      prop.living_dining_images.filter(Boolean).forEach((url) => imageSet.add(url.trim()));
    }

    const images = Array.from(imageSet);

    const details = prop.property_details;

    const languages = details?.host_languages && details.host_languages.length > 0
      ? details.host_languages
      : [];

    // Prioritize real address from location table, then nearby attractions, then property type
    let location = 'Kerala, India';
    if (prop.location?.address && prop.location.address.trim()) {
      location = prop.location.address.trim();
    } else if (details?.nearby_attractions && details.nearby_attractions.length > 0) {
      location = `${details.nearby_attractions[0]}, Kerala`;
    } else if (prop.property_type_name) {
      location = `${prop.property_type_name}, Kerala`;
    }

    const amenities: string[] = [];
    if (details?.comfort_services || (details?.comfort_services_list && details.comfort_services_list.length > 0)) {
      amenities.push('WiFi', 'Hot Water');
    }
    if (details?.meals_available) {
      amenities.push('Meals Available');
    }
    if (details?.airport_pickup) {
      amenities.push('Airport Transfer');
    }
    if (details?.laundry_service) {
      amenities.push('Laundry Service');
    }

    // Collect categorized photos for rooms
    const bedroomPhotos: string[] = [];
    const bathroomPhotos: string[] = [];
    const livingPhotos: string[] = [];
    const generalPhotos: string[] = [];

    if (Array.isArray(prop.property_photos)) {
      prop.property_photos.forEach((p) => {
        const url = p.image_url?.trim();
        if (!url) return;
        const cat = p.category?.toUpperCase();
        if (cat === 'BEDROOM') bedroomPhotos.push(url);
        else if (cat === 'BATHROOM') bathroomPhotos.push(url);
        else if (cat === 'LIVING_ROOM') livingPhotos.push(url);
        else generalPhotos.push(url);
      });
    }

    if (Array.isArray(prop.bedroom_images)) {
      prop.bedroom_images.filter(Boolean).forEach((u) => bedroomPhotos.push(u.trim()));
    }
    if (Array.isArray(prop.bathroom_images)) {
      prop.bathroom_images.filter(Boolean).forEach((u) => bathroomPhotos.push(u.trim()));
    }

    // Map rooms with associated images
    const rooms: RoomDetail[] = Array.isArray(prop.rooms)
      ? prop.rooms.map((r, index) => {
          const roomImages: string[] = [];

          // Assign bedroom photo(s)
          if (bedroomPhotos.length > 0) {
            const specificBedroom = bedroomPhotos[index % bedroomPhotos.length];
            roomImages.push(specificBedroom);
            // Add any other bedroom photos
            bedroomPhotos.forEach((bp) => {
              if (!roomImages.includes(bp)) roomImages.push(bp);
            });
          }

          // Add bathroom and living/amenity photos for complete room context
          bathroomPhotos.forEach((bp) => {
            if (!roomImages.includes(bp)) roomImages.push(bp);
          });
          livingPhotos.forEach((lp) => {
            if (!roomImages.includes(lp)) roomImages.push(lp);
          });

          // Fallback if no category photo exists
          if (roomImages.length === 0 && images.length > 0) {
            roomImages.push(images[index % images.length]);
          }

          return {
            id: r.id,
            roomType: r.room_type || 'Guest Room',
            count: r.count || 1,
            maxOccupancy: r.max_occupancy || 2,
            bedType: r.bed_type || 'Standard',
            view: r.view || undefined,
            amenities: Array.isArray(r.amenities) ? r.amenities : [],
            images: roomImages,
            coverImage: roomImages[0] || '',
          };
        })
      : [];

    // Parse lat/lng if not directly provided
    let latitude = prop.location?.latitude ?? undefined;
    let longitude = prop.location?.longitude ?? undefined;

    if ((latitude == null || longitude == null) && prop.location?.google_map_link) {
      const match = prop.location.google_map_link.match(/[?&]q=([-\d.]+),([-\d.]+)/);
      if (match) {
        latitude = parseFloat(match[1]);
        longitude = parseFloat(match[2]);
      }
    }

    // Map location details
    const locationDetails: LocationDetailInfo | null = prop.location
      ? {
          address: prop.location.address || location,
          googleMapLink: prop.location.google_map_link || undefined,
          latitude: latitude || 9.6788,
          longitude: longitude || 76.9741,
          floor: prop.location.floor || undefined,
          elderlyFriendly: prop.location.elderly_friendly ?? undefined,
          nearbyAirport: prop.location.nearby_airport || undefined,
          distanceToAirport: prop.location.distance_to_airport || undefined,
          nearestRailwayStation: prop.location.nearest_railway_station || undefined,
          distanceToRailwayStation: prop.location.distance_to_railway_station || undefined,
          nearestBusStand: prop.location.nearest_bus_stand || undefined,
          distanceToBusStand: prop.location.distance_to_bus_stand || undefined,
        }
      : null;

    // Host mapping
    const hostUser = prop.host;
    const hostName = hostUser?.full_name || details?.other_name || (languages.length > 0 ? `Host (${languages[0]})` : 'Property Host');
    const hostImage = hostUser?.profile_image || '';
    const hostEmail = hostUser?.email || undefined;
    const hostPhone = hostUser?.phone_number || prop.alternate_phone || undefined;
    const hostUserType = hostUser?.user_type || 'HOST';
    const memberSince = hostUser?.created_at ? new Date(hostUser.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : undefined;

    return {
      id: prop.id,
      userId: prop.user_id,
      title: prop.property_name || 'Kerala Homestay Retreat',
      location,
      price: 0,
      rating: 0,
      reviewCount: 0,
      images,
      propertyTypeName: prop.property_type_name || '',
      classification: prop.classification || 'UNCLASSIFIED',
      verificationStatus: prop.verification_status || 'DRAFT',
      progressStep: prop.progress_step || 1,
      isVerified: Boolean(prop.is_verified || prop.verification_status === 'APPROVED'),
      segmentName: prop.segment_name || undefined,
      host: {
        id: prop.user_id,
        name: hostName,
        email: hostEmail,
        phone: hostPhone,
        image: hostImage,
        languages,
        isVerified: Boolean(prop.is_verified || prop.verification_status === 'APPROVED'),
        userType: hostUserType,
        memberSince,
      },
      locationDetails,
      rooms,
      aboutSpace: details?.about_space || '',
      amenities,
      comfortServices: details?.comfort_services_list || [],
      houseRules: {
        checkInTime: details?.checkin_time || '14:00',
        checkOutTime: details?.checkout_time || '11:00',
        smokingAllowed: Boolean(details?.smoking_allowed),
        petsAllowed: Boolean(details?.pets_allowed),
        alcoholAllowed: Boolean(details?.alcohol_allowed),
        quietHours: details?.quiet_hours || '',
        visitorPolicy: details?.visitor_policy || '',
        housekeepingFrequency: details?.housekeeping_frequency || '',
      },
      nearbyActivities: details?.nearby_activities || [],
      nearbyAttractions: details?.nearby_attractions || [],
      seasonalExperiences: details?.seasonal_experiences || [],
    };
  },
};

export default propertyDetailsService;
