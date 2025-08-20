import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LocationInput from "../../components/LocationInput";

export default function OrdersScreen() {
  const router = useRouter();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  
  // Order Form State
  const [pickupLocation, setPickupLocation] = useState({
    address: "",
    coordinates: { latitude: 0, longitude: 0 },
  });
  const [deliveryLocation, setDeliveryLocation] = useState({
    address: "",
    coordinates: { latitude: 0, longitude: 0 },
  });
  const [itemDescription, setItemDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmitOrder = () => {
    if (!pickupLocation.address || !deliveryLocation.address || !itemDescription) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    
    // Generate a mock tracking ID
    const mockTrackingId = "BE" + Math.random().toString(36).substr(2, 8).toUpperCase();
    setTrackingId(mockTrackingId);
    
    // Show confirmation modal
    setShowConfirmationModal(true);
    
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setPickupLocation({ address: "", coordinates: { latitude: 0, longitude: 0 } });
    setDeliveryLocation({ address: "", coordinates: { latitude: 0, longitude: 0 } });
    setItemDescription("");
    setWeight("");
    setDeliveryTime("");
    setNotes("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <AntDesign name="arrowleft" size={24} color="#1E3A8A" />
          </TouchableOpacity>
          <Text style={styles.title}>Place Order</Text>
          <Text style={styles.subtitle}>Fill in the details for your delivery</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup & Delivery</Text>
            
            <View style={styles.inputContainer}>
              <LocationInput
                label="Pickup Location"
                value={pickupLocation.address}
                onLocationSelect={setPickupLocation}
                required={true}
                placeholder="Where should we pick up from?"
              />
            </View>

            <View style={styles.inputContainer}>
              <LocationInput
                label="Delivery Location"
                value={deliveryLocation.address}
                onLocationSelect={setDeliveryLocation}
                required={true}
                placeholder="Where should we deliver to?"
              />
            </View>
          </View>

          {/* Item Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Item Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Item Description <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe what you're sending (e.g., Documents, Electronics, Food)"
                placeholderTextColor="#9CA3AF"
                value={itemDescription}
                onChangeText={setItemDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weight (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 2 kg, 500g, Light"
                placeholderTextColor="#9CA3AF"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>

          {/* Delivery Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Preferences</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Preferred Delivery Time</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., ASAP, 2-4 PM, Morning"
                placeholderTextColor="#9CA3AF"
                value={deliveryTime}
                onChangeText={setDeliveryTime}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Special Instructions</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any special handling instructions or notes for the driver"
                placeholderTextColor="#9CA3AF"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Pricing Info */}
          <View style={styles.pricingSection}>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Base Delivery Fee</Text>
              <Text style={styles.pricingValue}>$15.00</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Service Fee</Text>
              <Text style={styles.pricingValue}>$2.50</Text>
            </View>
            <View style={[styles.pricingRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>$17.50</Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmitOrder}
          >
            <MaterialIcons name="send" size={20} color="white" />
            <Text style={styles.submitButtonText}>Place Order</Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmationModal}
        animationType="fade"
        transparent
      >
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationModal}>
            <MaterialIcons name="check-circle" size={60} color="#10B981" />
            <Text style={styles.confirmationTitle}>Order Confirmed!</Text>
            <Text style={styles.confirmationText}>
              Your delivery order has been placed successfully. A driver will be assigned shortly.
            </Text>
            <Text style={styles.trackingIdText}>
              Tracking ID: {trackingId}
            </Text>
            
            <View style={styles.confirmationButtons}>
              <TouchableOpacity 
                style={styles.secondaryConfirmButton}
                onPress={() => {
                  setShowConfirmationModal(false);
                  router.back();
                }}
              >
                <Text style={styles.secondaryConfirmButtonText}>Go Home</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryConfirmButton}
                onPress={() => setShowConfirmationModal(false)}
              >
                <Text style={styles.primaryConfirmButtonText}>Track Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: "white",
    margin: 16,
    marginBottom: 8,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  pricingSection: {
    backgroundColor: "white",
    margin: 16,
    marginBottom: 8,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  pricingLabel: {
    fontSize: 16,
    color: "#6B7280",
  },
  pricingValue: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  submitButton: {
    backgroundColor: "#1E3A8A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    margin: 16,
    gap: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  confirmationOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmationModal: {
    backgroundColor: "white",
    margin: 20,
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    maxWidth: 320,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginTop: 16,
    marginBottom: 8,
  },
  confirmationText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  trackingIdText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 24,
  },
  confirmationButtons: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryConfirmButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  secondaryConfirmButtonText: {
    color: "#1E3A8A",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryConfirmButton: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryConfirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
