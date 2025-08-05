# Search Results Feature

## Overview
The search results page provides a comprehensive view of available properties with a split-screen layout featuring:
- **Left side**: Property listings with filtering options
- **Right side**: Interactive map with property markers

## Features

### Search Functionality
- **EnhancedSearchBar**: Users can search for destinations using Google Places API
- **Date Selection**: Check-in and check-out date picker
- **Guest Selection**: Configurable number of adults, children, and rooms
- **Search Trigger**: Click the search button or press Enter to navigate to results

### Search Results Page (`/search`)
- **URL Parameters**: Automatically captures search criteria from the search bar
- **Responsive Design**: Works on desktop and mobile devices
- **View Modes**: Toggle between list and map views (especially useful on mobile)

### Property Listings
- **Property Cards**: Display property images, details, and pricing
- **Interactive Elements**: Like/heart properties, book now buttons
- **Property Details**: Guests, bedrooms, bathrooms, ratings, reviews
- **Badges**: New, Certified, Superhost indicators

### Filtering System
- **Price Range**: Slider to filter by price (₹0 - ₹10,000)
- **Rating Filter**: Filter by minimum rating (4.5+, 4.0+, 3.5+)
- **Amenities**: Checkbox filters for WiFi, Kitchen, Parking, Pool, Mountain View, Fireplace
- **Clear Filters**: Reset all filters to default

### Interactive Map
- **Google Maps Integration**: Uses Google Maps JavaScript API
- **Property Markers**: Each property displayed as a marker on the map
- **Info Windows**: Click markers to see property details and booking options
- **Auto-centering**: Map automatically centers on the average position of all properties

### Mobile Responsiveness
- **Adaptive Layout**: Different layouts for mobile and desktop
- **View Toggle**: Mobile users can switch between list and map views
- **Touch-friendly**: Optimized for touch interactions
- **Responsive Cards**: Property cards adapt to screen size

## Technical Implementation

### Components
- `EnhancedSearchBar.tsx`: Main search interface with Google Places integration
- `SearchResults.tsx`: Results page with split-screen layout
- `GoogleMapsLoader.tsx`: Google Maps API loader component

### Routing
- Route: `/search`
- Parameters: `destination`, `checkIn`, `checkOut`, `guests`
- Navigation: Triggered from search bar button or Enter key

### Data Structure
```typescript
interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  host: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  position: { lat: number; lng: number };
  isNew?: boolean;
  isCertified?: boolean;
  isSuperhost?: boolean;
}
```

### State Management
- **Local State**: Property data, filters, view mode, selected property
- **URL State**: Search parameters from URL query string
- **User Interactions**: Like/heart functionality, filter selections

## Usage

### For Users
1. **Search**: Enter destination in the search bar
2. **Select Dates**: Choose check-in and check-out dates
3. **Add Guests**: Configure number of guests and rooms
4. **Search**: Click search button or press Enter
5. **Browse Results**: View properties in list or map view
6. **Filter**: Use sidebar filters to narrow down results
7. **Book**: Click "Book now" to proceed to property details

### For Developers
1. **Add Properties**: Update the mock data array in `SearchResults.tsx`
2. **Customize Filters**: Modify amenity options and filter logic
3. **Styling**: Update Tailwind classes for custom styling
4. **API Integration**: Replace mock data with real API calls

## Future Enhancements
- **Real-time Search**: Live search results as user types
- **Advanced Filters**: More filter options (property type, instant booking, etc.)
- **Saved Searches**: Allow users to save and reuse search criteria
- **Property Comparison**: Side-by-side property comparison
- **Wishlist**: Save favorite properties for later
- **Reviews Integration**: Display detailed reviews and ratings
- **Pricing Calendar**: Show dynamic pricing based on dates
- **Virtual Tours**: 360° property tours
- **Chat Support**: In-app chat with property hosts

## Dependencies
- `@react-google-maps/api`: Google Maps integration
- `react-router-dom`: Navigation and URL handling
- `lucide-react`: Icons
- `date-fns`: Date formatting
- Tailwind CSS: Styling 