# Google Places Autocomplete Integration

This document describes the Google Places Autocomplete integration implemented in the India Escapes application.

## Overview

The search bar now includes real-time location suggestions powered by Google Places API. As users type in the destination field, they get instant suggestions for cities, landmarks, and addresses across India.

## Features

### 🔍 Real-time Search Suggestions
- **Debounced Search**: API calls are debounced (300ms delay) to prevent excessive requests
- **Minimum Input**: Requires at least 2 characters before showing suggestions
- **Loading States**: Shows loading spinner while fetching suggestions
- **Error Handling**: Gracefully handles API errors and network issues

### 🗺️ Location Data
- **Coordinates**: Automatically retrieves latitude and longitude for selected places
- **Place Details**: Gets comprehensive place information including formatted address
- **Visual Feedback**: Shows coordinates when a place is selected

### 🎯 Smart Filtering
- **Country Restriction**: Limited to India (`componentRestrictions: { country: 'in' }`)
- **Place Types**: Focuses on cities and geocoded addresses
- **Structured Results**: Shows main text and secondary text for better UX

## Implementation Details

### Components Created

1. **`useGooglePlaces` Hook** (`src/hooks/use-google-places.ts`)
   - Manages Google Places API services
   - Handles autocomplete predictions
   - Retrieves place details
   - Provides loading and error states

2. **`GoogleMapsLoader` Component** (`src/components/GoogleMapsLoader.tsx`)
   - Loads Google Maps API with Places library
   - Shows loading state while API loads
   - Handles API loading errors

3. **Enhanced Search Bar** (`src/components/EnhancedSearchBar.tsx`)
   - Integrated with Google Places Autocomplete
   - Real-time suggestions dropdown
   - Place selection handling
   - Visual feedback for selected places

### API Configuration

The integration uses the existing Google Maps API key from the environment variable:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Required Google Maps API Services

- **Places API**: For autocomplete and place details
- **Maps JavaScript API**: For map functionality (already implemented)

## Usage

### For Users
1. Click on the "Where" field in the search bar
2. Start typing a destination (minimum 2 characters)
3. Select from the dropdown suggestions
4. The selected place's coordinates will be displayed below the input

### For Developers
The integration is automatically available when the `EnhancedSearchBar` component is used. The Google Maps API must be properly configured with the Places library enabled.

## Technical Features

### Debounced Search
```typescript
const timeout = setTimeout(() => {
  if (value.trim().length >= 2) {
    getPlacePredictions(value);
    setShowSuggestions(true);
  } else {
    clearPredictions();
    setShowSuggestions(false);
  }
}, 300);
```

### Place Selection
```typescript
const handlePlaceSelect = async (prediction) => {
  const placeDetails = await getPlaceDetails(prediction.place_id);
  if (placeDetails) {
    setSelectedPlace(placeDetails);
    setDestination(prediction.description);
    // ... additional handling
  }
};
```

### Error Handling
- Graceful fallback to static suggestions if Google Places API fails
- Loading states for better user experience
- Console logging for debugging selected places

## Benefits

1. **Improved User Experience**: Real-time suggestions reduce typing and errors
2. **Accurate Location Data**: Precise coordinates for selected destinations
3. **Performance Optimized**: Debounced API calls prevent rate limiting
4. **Fallback Support**: Static suggestions when API is unavailable
5. **Visual Feedback**: Clear indication of selected places

## Future Enhancements

- [ ] Add recent searches functionality
- [ ] Implement place categories (cities, landmarks, etc.)
- [ ] Add distance calculation from user's location
- [ ] Integrate with booking flow to use selected coordinates
- [ ] Add place photos and additional details in suggestions

## Troubleshooting

### Common Issues

1. **No suggestions appearing**
   - Check if Google Maps API key is configured
   - Verify Places API is enabled in Google Cloud Console
   - Check browser console for API errors

2. **Suggestions not loading**
   - Ensure internet connection is stable
   - Check if API quota is exceeded
   - Verify API key has proper permissions

3. **Coordinates not showing**
   - Check if place details API call is successful
   - Verify selected place has valid geometry data

### Debug Information
Selected place details are logged to the browser console for debugging purposes. 