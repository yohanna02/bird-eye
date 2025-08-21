// Configuration for API keys and other environment variables
export const CONFIG = {
  // Get your Google Places API key from: https://console.cloud.google.com/
  // 1. Go to Google Cloud Console
  // 2. Create a new project or select existing one
  // 3. Enable the following APIs:
  //    - Places API
  //    - Geocoding API
  //    - Maps JavaScript API (optional for maps)
  // 4. Create credentials (API Key)
  // 5. Restrict the API key to your app bundle ID for security
  GOOGLE_PLACES_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
  
  // Optional: Restrict search to specific countries (ISO 3166-1 alpha-2 country codes)
  COUNTRY_RESTRICTION: "ng", // e.g., "us" for United States, "ca" for Canada
  
  // Default location for searches (optional)
  DEFAULT_LOCATION: {
    latitude: 9.8175, // Nigeria
    longitude: 10.3122,
  },
};
