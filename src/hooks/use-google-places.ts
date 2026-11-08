import { useState, useEffect, useRef } from 'react';

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

export interface PlaceViewport {
  northeast: { lat: number; lng: number };
  southwest: { lat: number; lng: number };
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport?: PlaceViewport;
  };
  types: string[];
  /** Suggested search radius in km derived from viewport (clamped 15–75), else 40 */
  radius_km: number;
}

const DEFAULT_RADIUS_KM = 40;
const MIN_RADIUS_KM = 15;
const MAX_RADIUS_KM = 75;

/** Approximate Earth radius for haversine half-diagonal of a viewport. */
function radiusKmFromViewport(viewport: PlaceViewport): number {
  const { northeast: ne, southwest: sw } = viewport;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(ne.lat - sw.lat);
  const dLng = toRad(ne.lng - sw.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(sw.lat)) * Math.cos(toRad(ne.lat)) * Math.sin(dLng / 2) ** 2;
  const diagonalKm = 2 * R * Math.asin(Math.sqrt(a));
  const halfDiagonal = diagonalKm / 2;
  return Math.min(MAX_RADIUS_KM, Math.max(MIN_RADIUS_KM, Math.round(halfDiagonal)));
}

export const useGooglePlaces = () => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const mapDiv = useRef<HTMLDivElement | null>(null);

  // Initialize Google Places services
  useEffect(() => {
    const initializeServices = () => {
      try {
        // Check if Google Maps API is loaded
        if (!window.google || !window.google.maps || !window.google.maps.places) {
          return false;
        }

        // Initialize AutocompleteService
        if (!autocompleteService.current) {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
        
        // Create a dummy div for PlacesService (required by Google Maps API)
        if (!mapDiv.current) {
          mapDiv.current = document.createElement('div');
          mapDiv.current.style.display = 'none';
          document.body.appendChild(mapDiv.current);
        }
        
        // Initialize PlacesService
        if (!placesService.current) {
          placesService.current = new window.google.maps.places.PlacesService(mapDiv.current);
        }

        setIsInitialized(true);
        setError(null);
        return true;
             } catch (err) {
         setError(`Failed to initialize Google Places services: ${err}`);
         return false;
       }
    };

    // Try to initialize immediately
    if (!initializeServices()) {
      // If not ready, wait a bit and try again
      const timer = setTimeout(() => {
        initializeServices();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapDiv.current && document.body.contains(mapDiv.current)) {
        document.body.removeChild(mapDiv.current);
      }
    };
  }, []);

  const getPlacePredictions = async (input: string): Promise<PlacePrediction[]> => {
    if (!input.trim() || input.length < 2) {
      setPredictions([]);
      return [];
    }

         if (!isInitialized || !autocompleteService.current) {
       setError('Google Places service not available. Please wait for initialization.');
       return [];
     }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      try {
        autocompleteService.current!.getPlacePredictions(
          {
            input,
            componentRestrictions: { country: 'in' }, // Restrict to India
            types: ['(cities)'], // Focus on cities only
          },
                     (predictions, status) => {
             setIsLoading(false);
             
             if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              setPredictions(predictions);
              resolve(predictions);
            } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              setPredictions([]);
              resolve([]);
                         } else {
               const errorMsg = `Places API error: ${status}`;
               setError(errorMsg);
               setPredictions([]);
               resolve([]);
             }
          }
        );
             } catch (err) {
         setIsLoading(false);
         const errorMsg = `Error calling Places API: ${err}`;
         setError(errorMsg);
         setPredictions([]);
         resolve([]);
       }
    });
  };

  const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
    if (!isInitialized || !placesService.current) {
      setError('Google Places service not available');
      return null;
    }

    return new Promise((resolve) => {
      try {
        placesService.current!.getDetails(
          {
            placeId,
            fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types'],
          },
                     (place, status) => {
             if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
              const lat = place.geometry!.location!.lat();
              const lng = place.geometry!.location!.lng();
              let viewport: PlaceViewport | undefined;
              let radius_km = DEFAULT_RADIUS_KM;

              const bounds = place.geometry?.viewport;
              if (bounds) {
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();
                viewport = {
                  northeast: { lat: ne.lat(), lng: ne.lng() },
                  southwest: { lat: sw.lat(), lng: sw.lng() },
                };
                radius_km = radiusKmFromViewport(viewport);
              }

              resolve({
                place_id: place.place_id!,
                name: place.name!,
                formatted_address: place.formatted_address!,
                geometry: {
                  location: { lat, lng },
                  viewport,
                },
                types: place.types || [],
                radius_km,
              });
                         } else {
               const errorMsg = `Failed to get place details: ${status}`;
               setError(errorMsg);
               resolve(null);
             }
          }
        );
             } catch (err) {
         const errorMsg = `Error calling Place Details API: ${err}`;
         setError(errorMsg);
         resolve(null);
       }
    });
  };

  const clearPredictions = () => {
    setPredictions([]);
    setError(null);
  };

  return {
    predictions,
    isLoading,
    error,
    isInitialized,
    getPlacePredictions,
    getPlaceDetails,
    clearPredictions,
  };
};
