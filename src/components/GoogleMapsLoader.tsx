import { useEffect, useState } from 'react';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

const libraries: Libraries = ['places'];

export const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded: mapsLoaded, loadError: mapsLoadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey || '',
    libraries,
  });

  useEffect(() => {
    if (mapsLoaded) {
      setIsLoaded(true);
    }
    if (mapsLoadError) {
      setLoadError(mapsLoadError);
    }
  }, [mapsLoaded, mapsLoadError]);

  // Debug logging


  if (loadError) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>Failed to load Google Maps: {loadError.message}</p>
        <p className="text-sm text-gray-600 mt-2">
          Please check your Google Maps API key configuration.
        </p>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">Setup Required:</p>
          <ol className="text-xs text-yellow-700 mt-1 list-decimal list-inside">
            <li>Create a <code>.env</code> file in the project root</li>
            <li>Add <code>VITE_GOOGLE_MAPS_API_KEY=your_api_key_here</code></li>
            <li>Get API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
            <li>Enable Maps JavaScript API and Places API</li>
          </ol>
        </div>
      </div>
    );
  }

  if (!googleMapsApiKey) {
    return (
      <div className="text-center p-4 text-red-600">
        <p className="font-medium">Google Maps API Key Missing</p>
        <p className="text-sm text-gray-600 mt-2">
          Please configure your Google Maps API key to use location search.
        </p>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">Setup Required:</p>
          <ol className="text-xs text-yellow-700 mt-1 list-decimal list-inside">
            <li>Create a <code>.env</code> file in the project root</li>
            <li>Add <code>VITE_GOOGLE_MAPS_API_KEY=your_api_key_here</code></li>
            <li>Get API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
            <li>Enable Maps JavaScript API and Places API</li>
          </ol>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading Google Maps...</p>
        <p className="text-xs text-gray-400 mt-1">This may take a few seconds</p>
      </div>
    );
  }

  return <>{children}</>;
}; 