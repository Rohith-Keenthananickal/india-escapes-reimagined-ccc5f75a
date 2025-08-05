# Google Places API Troubleshooting Guide

This guide helps you diagnose and fix issues with the Google Places API integration in the India Escapes application.

## Quick Diagnosis

1. **Check the Debug Panel**: Look for the debug panel in the bottom-right corner of the page
2. **Open Browser Console**: Press F12 and check the Console tab for error messages
3. **Verify API Key**: Ensure your Google Maps API key is properly configured

## Common Issues and Solutions

### 1. API Key Issues

**Symptoms:**
- "Google Maps API Key Missing" error
- "Failed to load Google Maps" error
- No suggestions appear when typing

**Solutions:**
1. Check if `.env` file exists in project root
2. Verify API key format: `VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key`
3. Ensure API key is valid and not expired
4. Check if API key has proper permissions

**Steps to get a new API key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
4. Create credentials (API key)
5. Restrict the API key to your domain for security

### 2. API Not Enabled

**Symptoms:**
- "Places API error: REQUEST_DENIED"
- "Failed to initialize Google Places services"

**Solutions:**
1. Enable Places API in Google Cloud Console
2. Enable Maps JavaScript API in Google Cloud Console
3. Wait 5-10 minutes after enabling APIs (propagation delay)

### 3. Quota Exceeded

**Symptoms:**
- "Places API error: OVER_QUERY_LIMIT"
- "Places API error: QUOTA_EXCEEDED"

**Solutions:**
1. Check your Google Cloud Console billing
2. Increase quota limits if needed
3. Implement better caching to reduce API calls

### 4. Network Issues

**Symptoms:**
- "Google Maps API not loaded yet"
- Timeout errors
- No response from API

**Solutions:**
1. Check internet connection
2. Verify no firewall blocking Google APIs
3. Try refreshing the page
4. Check if Google services are accessible

### 5. Initialization Timing Issues

**Symptoms:**
- "Google Places service not available"
- Services not initialized properly

**Solutions:**
1. Wait for the page to fully load
2. Check if Google Maps API loaded successfully
3. Refresh the page if needed

## Debug Information

The application includes a debug panel that shows:
- **Initialized**: Whether Google Places services are ready
- **Loading**: Current loading state
- **Error**: Any error messages
- **API Key**: Whether API key is present
- **Google Maps**: Whether Google Maps API is loaded
- **Places API**: Whether Places API is available

## Console Logs

Check browser console for these log messages:
- `Google Maps API loaded successfully` - API loaded correctly
- `AutocompleteService initialized` - Places service ready
- `PlacesService initialized` - Details service ready
- `Places API response: {status, predictionsCount}` - API responses
- `Place details response: {status, place}` - Place details responses

## Testing the Integration

1. **Basic Test**: Type "Mumbai" in the search bar
2. **Expected Result**: Should see suggestions like "Mumbai, Maharashtra, India"
3. **Selection Test**: Click on a suggestion
4. **Expected Result**: Should show coordinates below the input

## Fallback Behavior

If Google Places API fails, the application will:
1. Show static suggestions (pre-defined locations)
2. Display helpful error messages
3. Continue to function with basic search

## Environment Setup

Required environment variables:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## API Requirements

Your Google Maps API key needs access to:
- **Maps JavaScript API**: For map functionality
- **Places API**: For location search and autocomplete

## Rate Limits

- **Places Autocomplete**: 1000 requests per 100 seconds per user
- **Place Details**: 1000 requests per 100 seconds per user
- **Maps JavaScript API**: 25,000 map loads per day

## Security Best Practices

1. **Restrict API Key**: Limit to your domain
2. **Enable Billing**: Required for Places API
3. **Monitor Usage**: Check Google Cloud Console regularly
4. **Implement Caching**: Reduce API calls

## Support

If issues persist:
1. Check Google Cloud Console for detailed error logs
2. Verify API key permissions and quotas
3. Test with a simple HTML page to isolate issues
4. Contact Google Cloud Support if needed

## Recent Fixes Applied

1. **Improved Initialization**: Added retry logic for service initialization
2. **Better Error Handling**: More descriptive error messages
3. **Debug Panel**: Real-time status monitoring
4. **Fallback Support**: Graceful degradation when API fails
5. **Console Logging**: Detailed debugging information 