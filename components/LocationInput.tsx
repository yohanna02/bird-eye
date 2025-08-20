import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import * as Location from "expo-location";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { CONFIG } from "../config/api";

interface LocationInputProps {
  label: string;
  value: string;
  onLocationSelect: (location: {
    address: string;
    coordinates: { latitude: number; longitude: number };
  }) => void;
  required?: boolean;
  placeholder?: string;
}

export default function LocationInput({
  label,
  value,
  onLocationSelect,
  required = false,
  placeholder = "Enter location",
}: LocationInputProps) {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentLoadingPlaceId, setCurrentLoadingPlaceId] = useState<string | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // React Query mutation for searching places
  const searchPlacesMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&key=${CONFIG.GOOGLE_PLACES_API_KEY}&components=country:${CONFIG.COUNTRY_RESTRICTION}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }
      
      return data.predictions?.slice(0, 5) || [];
    },
    onSuccess: (data) => {
      setSearchResults(data);
    },
    onError: (error) => {
      console.error("Search error:", error);
      Alert.alert("Error", "Failed to search locations. Please try again.");
      setSearchResults([]);
    },
  });

  // React Query mutation for getting place details
  const getPlaceDetailsMutation = useMutation({
    mutationFn: async (placeId: string) => {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,geometry&key=${CONFIG.GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      
      if (!response.ok || !data.result) {
        throw new Error('Failed to get location details');
      }
      
      return data.result;
    },
    onSuccess: (data) => {
      const location = data.geometry?.location;
      onLocationSelect({
        address: data.formatted_address,
        coordinates: {
          latitude: location?.lat || 0,
          longitude: location?.lng || 0,
        },
      });
      setShowLocationModal(false);
      setSearchText("");
      setSearchResults([]);
      setCurrentLoadingPlaceId(null);
    },
    onError: (error) => {
      console.error("Place details error:", error);
      Alert.alert("Error", "Failed to get location details. Please try again.");
      setCurrentLoadingPlaceId(null);
    },
  });

  // React Query mutation for getting current location
  const getCurrentLocationMutation = useMutation({
    mutationFn: async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission to access location was denied");
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      return { latitude, longitude, reverseGeocode };
    },
    onSuccess: (data) => {
      const { latitude, longitude, reverseGeocode } = data;
      
      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        console.log(address);
        const addressParts = [
          address?.streetNumber,
          address?.street,
          address?.city,
          address?.region,
          address?.postalCode,
        ];

        const formattedAddress = addressParts
          .filter((part) => part && part.trim() !== "")
          .join(", ");

        onLocationSelect({
          address: formattedAddress || "Current Location",
          coordinates: { latitude, longitude },
        });
      } else {
        // Fallback if no address found
        onLocationSelect({
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          coordinates: { latitude, longitude },
        });
      }
      setShowLocationModal(false);
    },
    onError: (error) => {
      console.error("Error getting location:", error);
      if (error.message === "Permission to access location was denied") {
        Alert.alert(
          "Permission denied",
          "Permission to access location was denied. Please enable location services in your device settings."
        );
      } else {
        Alert.alert("Error", "Failed to get current location. Please try again.");
      }
    },
  });

  const searchPlaces = (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    searchPlacesMutation.mutate(query);
  };

  const getPlaceDetails = (placeId: string) => {
    setCurrentLoadingPlaceId(placeId);
    getPlaceDetailsMutation.mutate(placeId);
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Set new timeout for debounced search
    searchTimeout.current = setTimeout(() => {
      searchPlaces(text);
    }, 300);
  };

  const getCurrentLocation = () => {
    getCurrentLocationMutation.mutate();
  };

  return (
    <View>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => setShowLocationModal(true)}
      >
        <MaterialIcons name="location-on" size={20} color="#6B7280" />
        <Text style={[styles.locationText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={showLocationModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowLocationModal(false)}>
              <AntDesign name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Location</Text>
            <TouchableOpacity onPress={getCurrentLocation}>
              <MaterialIcons name="my-location" size={24} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Text style={styles.searchLabel}>Search for a location</Text>
            
            <TextInput
              style={styles.searchInput}
              placeholder="Type to search for locations..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={handleSearchTextChange}
              autoFocus
              returnKeyType="search"
            />

            {searchPlacesMutation.isPending && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#1E3A8A" />
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            )}

            <ScrollView style={styles.resultsContainer} keyboardShouldPersistTaps="handled">
              {searchResults.map((result, index) => {
                const isLoadingThisPlace = getPlaceDetailsMutation.isPending && currentLoadingPlaceId === result.place_id;
                return (
                  <TouchableOpacity
                    key={result.place_id || index}
                    style={[
                      styles.resultItem,
                      isLoadingThisPlace && styles.resultItemLoading
                    ]}
                    onPress={() => getPlaceDetails(result.place_id)}
                    activeOpacity={0.7}
                    disabled={isLoadingThisPlace}
                  >
                    {isLoadingThisPlace ? (
                      <ActivityIndicator size="small" color="#1E3A8A" />
                    ) : (
                      <MaterialIcons name="location-on" size={20} color="#6B7280" />
                    )}
                    <View style={styles.resultContent}>
                      <Text style={styles.resultMainText} numberOfLines={1}>
                        {result.structured_formatting?.main_text || result.description}
                      </Text>
                      <Text style={styles.resultSecondaryText} numberOfLines={1}>
                        {result.structured_formatting?.secondary_text || ""}
                      </Text>
                    </View>
                    {isLoadingThisPlace ? (
                      <Text style={styles.loadingLocationText}>Loading...</Text>
                    ) : (
                      <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                );
              })}
              
              {searchText.length >= 2 && searchResults.length === 0 && !searchPlacesMutation.isPending && (
                <View style={styles.noResultsContainer}>
                  <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
                  <Text style={styles.noResultsText}>No locations found</Text>
                  <Text style={styles.noResultsSubtext}>Try a different search term</Text>
                </View>
              )}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={[
              styles.currentLocationButton,
              getCurrentLocationMutation.isPending && styles.currentLocationButtonDisabled
            ]}
            onPress={getCurrentLocation}
            disabled={getCurrentLocationMutation.isPending}
          >
            {getCurrentLocationMutation.isPending ? (
              <>
                <ActivityIndicator size="small" color="#1E3A8A" />
                <Text style={styles.currentLocationText}>Getting Location...</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="my-location" size={20} color="#1E3A8A" />
                <Text style={styles.currentLocationText}>Use Current Location</Text>
              </>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    gap: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  placeholder: {
    color: "#9CA3AF",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  searchContainer: {
    flex: 1,
    padding: 20,
  },
  searchLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  googlePlacesWrapper: {
    flex: 1,
    minHeight: 200,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    color: "#6B7280",
    fontSize: 14,
  },
  resultsContainer: {
    flex: 1,
    maxHeight: 300,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "white",
    marginBottom: 1,
    borderRadius: 8,
    gap: 12,
  },
  resultItemLoading: {
    backgroundColor: "#F9FAFB",
    opacity: 0.8,
  },
  resultContent: {
    flex: 1,
  },
  resultMainText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  resultSecondaryText: {
    fontSize: 14,
    color: "#6B7280",
  },
  loadingLocationText: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 12,
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  autocompleteContainer: {
    flex: 0,
  },
  autocompleteInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  autocompleteList: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginTop: 8,
  },
  autocompleteRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  autocompleteDescription: {
    fontSize: 16,
    color: "#374151",
  },
  currentLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  currentLocationButtonDisabled: {
    backgroundColor: "#F9FAFB",
    opacity: 0.7,
  },
  currentLocationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
  },
});
