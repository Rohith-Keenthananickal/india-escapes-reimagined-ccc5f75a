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

interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
}

export const useGooglePlaces = () => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const mapDiv = useRef<HTMLDivElement | null>(null);

  // Initialize Google Places services
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      
      // Create a dummy div for PlacesService (required by Google Maps API)
      if (!mapDiv.current) {
        mapDiv.current = document.createElement('div');
        mapDiv.current.style.display = 'none';
        document.body.appendChild(mapDiv.current);
      }
      
      placesService.current = new window.google.maps.places.PlacesService(mapDiv.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapDiv.current) {
        document.body.removeChild(mapDiv.current);
      }
    };
  }, []);

  const getPlacePredictions = async (input: string): Promise<PlacePrediction[]> => {
    if (!input.trim() || input.length < 2) {
      setPredictions([]);
      return [];
    }

    if (!autocompleteService.current) {
      setError('Google Places service not available');
      return [];
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      autocompleteService.current!.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: 'in' }, // Restrict to India
          types: ['(cities)', 'geocode'], // Focus on cities and addresses
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
            setError(`Places API error: ${status}`);
            setPredictions([]);
            resolve([]);
          }
        }
      );
    });
  };

  const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
    if (!placesService.current) {
      setError('Google Places service not available');
      return null;
    }

    return new Promise((resolve) => {
      placesService.current!.getDetails(
        {
          placeId,
          fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types'],
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            resolve({
              place_id: place.place_id!,
              name: place.name!,
              formatted_address: place.formatted_address!,
              geometry: {
                location: {
                  lat: place.geometry!.location!.lat(),
                  lng: place.geometry!.location!.lng(),
                },
              },
              types: place.types || [],
            });
          } else {
            setError(`Failed to get place details: ${status}`);
            resolve(null);
          }
        }
      );
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
    getPlacePredictions,
    getPlaceDetails,
    clearPredictions,
  };
}; 