import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, ExternalLink, Layers, Compass, Loader2 } from 'lucide-react';

interface PropertyLocationMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  googleMapLink?: string;
  propertyImage?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '380px',
  borderRadius: '1rem',
};

const defaultOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export const PropertyLocationMap = ({
  latitude,
  longitude,
  title,
  address,
  googleMapLink,
  propertyImage,
}: PropertyLocationMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const [isSatellite, setIsSatellite] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'property-location-map-script',
    googleMapsApiKey: apiKey,
  });

  const center = { lat: latitude, lng: longitude };

  const onLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
    },
    []
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const toggleMapType = () => {
    if (!map) return;
    const newType = isSatellite ? 'roadmap' : 'hybrid';
    map.setMapTypeId(newType);
    setIsSatellite(!isSatellite);
  };

  const handleDirections = () => {
    if (googleMapLink) {
      window.open(googleMapLink, '_blank');
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
    }
  };

  if (loadError || !apiKey) {
    // Elegant fallback card if Google Maps script fails to load
    return (
      <div className="relative w-full h-[360px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-emerald-50/50 border border-gray-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mb-3 text-rose-600 shadow-sm">
          <MapPin className="w-7 h-7" />
        </div>
        <h4 className="font-bold text-gray-900 text-base mb-1">{title}</h4>
        <p className="text-sm text-gray-600 max-w-md mb-4">{address}</p>
        <Button onClick={handleDirections} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md">
          <ExternalLink className="w-4 h-4" /> Open in Google Maps
        </Button>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[380px] rounded-2xl bg-gray-100 animate-pulse flex flex-col items-center justify-center text-gray-400 gap-2 border border-gray-200">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="text-xs font-medium">Loading interactive map...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Map Header Floating Overlay Controls */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={toggleMapType}
          className="bg-white/95 backdrop-blur-sm shadow-md text-xs font-semibold gap-1.5 hover:bg-white text-gray-800 border"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          {isSatellite ? 'Street Map' : 'Satellite'}
        </Button>
        <Button
          size="sm"
          onClick={handleDirections}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md text-xs font-semibold gap-1.5"
        >
          <Navigation className="w-3.5 h-3.5" />
          Get Directions
        </Button>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={defaultOptions}
      >
        <Marker
          position={center}
          onClick={() => setShowInfoWindow(!showInfoWindow)}
          animation={google.maps.Animation.DROP}
        />

        {showInfoWindow && (
          <InfoWindow
            position={center}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <div className="p-1 max-w-[220px]">
              {propertyImage && (
                <img
                  src={propertyImage}
                  alt={title}
                  className="w-full h-24 object-cover rounded-md mb-1.5"
                />
              )}
              <h5 className="font-bold text-gray-900 text-xs leading-snug">{title}</h5>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{address}</p>
              <div className="mt-1.5 pt-1.5 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[10px] text-emerald-700 font-semibold">Verified Location</span>
                <button
                  onClick={handleDirections}
                  className="text-[10px] text-blue-600 font-bold hover:underline"
                >
                  Directions →
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default PropertyLocationMap;
