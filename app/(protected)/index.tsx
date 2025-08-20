import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
import LocationInput from "../../components/LocationInput";

export default function HomeScreen() {
  const router = useRouter();
  const [showQuickOrderModal, setShowQuickOrderModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  
  // Quick Order Form State
  const [pickupLocation, setPickupLocation] = useState({
    address: "",
    coordinates: { latitude: 0, longitude: 0 },
  });
  const [deliveryLocation, setDeliveryLocation] = useState({
    address: "",
    coordinates: { latitude: 0, longitude: 0 },
  });
  const [itemDescription, setItemDescription] = useState("");

  const handleQuickOrder = () => {
    if (!pickupLocation.address || !deliveryLocation.address || !itemDescription) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    // Generate a mock tracking ID
    const mockTrackingId = "BE" + Math.random().toString(36).substr(2, 8).toUpperCase();
    setTrackingId(mockTrackingId);
    
    // Close quick order modal and show confirmation
    setShowQuickOrderModal(false);
    setShowConfirmationModal(true);
    
    // Reset form
    setPickupLocation({ address: "", coordinates: { latitude: 0, longitude: 0 } });
    setDeliveryLocation({ address: "", coordinates: { latitude: 0, longitude: 0 } });
    setItemDescription("");
  };

  const resetQuickOrderForm = () => {
    setPickupLocation({ address: "", coordinates: { latitude: 0, longitude: 0 } });
    setDeliveryLocation({ address: "", coordinates: { latitude: 0, longitude: 0 } });
    setItemDescription("");
    setShowQuickOrderModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to Bird Eye</Text>
          <Text style={styles.subtitleText}>Your reliable delivery service</Text>
        </View>

        {/* Main Action Buttons */}
        <View style={styles.mainActions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push("/(protected)/orders")}
          >
            <MaterialIcons name="shopping-cart" size={24} color="white" />
            <Text style={styles.primaryButtonText}>Place Order</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryButton}>
              <MaterialIcons name="videocam" size={24} color="#1E3A8A" />
              <Text style={styles.secondaryButtonText}>Live Feed</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <MaterialIcons name="location-on" size={24} color="#1E3A8A" />
              <Text style={styles.secondaryButtonText}>Track Driver</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Order Section */}
        <View style={styles.quickOrderSection}>
          <Text style={styles.sectionTitle}>Quick Order</Text>
          <Text style={styles.sectionSubtitle}>
            Need something delivered quickly? Use our express form
          </Text>
          
          <TouchableOpacity 
            style={styles.quickOrderButton}
            onPress={() => setShowQuickOrderModal(true)}
          >
            <AntDesign name="plus" size={20} color="#1E3A8A" />
            <Text style={styles.quickOrderButtonText}>Start Quick Order</Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose Bird Eye?</Text>
          
          <View style={styles.featureItem}>
            <MaterialIcons name="speed" size={20} color="#1E3A8A" />
            <Text style={styles.featureText}>Fast & Reliable Delivery</Text>
          </View>
          
          <View style={styles.featureItem}>
            <MaterialIcons name="security" size={20} color="#1E3A8A" />
            <Text style={styles.featureText}>Secure & Tracked Packages</Text>
          </View>
          
          <View style={styles.featureItem}>
            <MaterialIcons name="support-agent" size={20} color="#1E3A8A" />
            <Text style={styles.featureText}>24/7 Customer Support</Text>
          </View>
        </View>
      </ScrollView>

      {/* Quick Order Modal */}
      <Modal
        visible={showQuickOrderModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={resetQuickOrderForm}>
              <AntDesign name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Quick Order</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Item Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What are we delivering?"
                placeholderTextColor="#9CA3AF"
                value={itemDescription}
                onChangeText={setItemDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleQuickOrder}
            >
              <Text style={styles.submitButtonText}>Submit Order</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmationModal}
        animationType="fade"
        transparent
      >
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationModal}>
            <MaterialIcons name="check-circle" size={60} color="#10B981" />
            <Text style={styles.confirmationTitle}>Order Placed!</Text>
            <Text style={styles.confirmationText}>
              Your order has been submitted successfully.
            </Text>
            <Text style={styles.trackingIdText}>
              Tracking ID: {trackingId}
            </Text>
            
            <TouchableOpacity 
              style={styles.confirmationButton}
              onPress={() => setShowConfirmationModal(false)}
            >
              <Text style={styles.confirmationButtonText}>Great!</Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  mainActions: {
    padding: 20,
    paddingTop: 10,
  },
  primaryButton: {
    backgroundColor: "#1E3A8A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  secondaryButtonText: {
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "600",
  },
  quickOrderSection: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  quickOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  quickOrderButtonText: {
    color: "#1E3A8A",
    fontSize: 16,
    fontWeight: "600",
  },
  featuresSection: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#374151",
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
  modalContent: {
    flex: 1,
    padding: 20,
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
  submitButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
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
    maxWidth: 300,
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
  },
  trackingIdText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 24,
  },
  confirmationButton: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  confirmationButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
