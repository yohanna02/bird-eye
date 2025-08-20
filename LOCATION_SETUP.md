# Setting up Real-World Locations for Bird Eye App

## Overview
This implementation provides real-world location functionality using Google Places API and device location services.

## Features Implemented
1. **Location Input Component** - Custom component for selecting real addresses
2. **Google Places Autocomplete** - Search and select real locations
3. **Current Location** - Get user's current GPS location
4. **Address Geocoding** - Convert coordinates to readable addresses

## Setup Instructions

### 1. Get Google Places API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Places API**
   - **Geocoding API** 
   - **Maps JavaScript API** (optional)
4. Create an API Key:
   - Go to "Credentials" → "Create Credentials" → "API Key"
5. Restrict the API Key (Important for security):
   - Go to API Key settings
   - Under "Application restrictions", select "Android apps" or "iOS apps"
   - Add your app's bundle identifier

### 2. Configure API Key
1. Open `/config/api.ts`
2. Replace `YOUR_GOOGLE_PLACES_API_KEY_HERE` with your actual API key
3. Optionally configure country restrictions and default location

### 3. App Permissions
The app automatically requests location permissions when users try to use "Current Location" feature.

## Usage

### In Order Screen
- Pickup and Delivery location fields now use real-world location search
- Users can search for addresses or use current location
- Coordinates are stored for delivery tracking

### In Quick Order Modal  
- Same location functionality in the express order form
- Real addresses improve delivery accuracy

## Location Data Structure
```typescript
{
  address: string;           // Human-readable address
  coordinates: {
    latitude: number;
    longitude: number;
  }
}
```

## Testing Without API Key
If you haven't set up the Google Places API key yet:
1. The location buttons will still work for UI testing
2. You can manually enter addresses in the text fields
3. Current location feature requires device permissions

## Production Considerations
1. **API Key Security**: Never commit API keys to version control
2. **Usage Limits**: Monitor Google Places API usage and billing
3. **Offline Handling**: Consider caching recent locations
4. **Error Handling**: Graceful fallbacks when location services fail

## Cost Optimization
- Enable API key restrictions to prevent unauthorized usage
- Consider implementing location caching for frequently used addresses
- Use session tokens for Places Autocomplete to reduce costs
