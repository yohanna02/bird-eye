import PinInput from "@/components/PinInput";
import { api } from "@/convex/_generated/api";
import useUserType from "@/hooks/useUserType";
import convexQueries from "@/utils/convexQueries";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { trackingId } = useLocalSearchParams<{ trackingId: string }>();

  const userType = useUserType();
  const orderDetails = convexQueries(api.queries.getSingleOrder, {
    trackingId: trackingId || "",
  });
  const acceptOrder = useMutation(api.mutations.acceptOrderMutation);
  const markPickedUp = useMutation(api.mutations.markOrderPickedUpMutation);
  const confirmDelivery = useMutation(api.mutations.confirmDeliveryMutation);
  const deleteOrder = useMutation(api.mutations.deleteOrderMutation);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isMarkingPickup, setIsMarkingPickup] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  const { isLoaded, isSignedIn } = useAuth();

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  if (userType.status === "pending" || orderDetails.status === "pending") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={{ color: "#1E3A8A" }}>Loading order details...</Text>
      </View>
    );
  }

  if (
    userType.status === "error" ||
    orderDetails.status === "error" ||
    !orderDetails.data
  ) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#EF4444", textAlign: "center" }}>
          Error loading order details. Please try again later.
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#1E3A8A", marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const order = orderDetails.data;

  const handleAcceptOrder = async () => {
    Alert.alert(
      "Accept Order",
      "Are you sure you want to accept this delivery order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Accept",
          style: "default",
          onPress: async () => {
            try {
              setIsAccepting(true);
              await acceptOrder({ trackingId: trackingId || "" });
              Alert.alert("Success", "Order accepted successfully!");
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to accept order. Please try again.");
              console.error("Error accepting order:", error);
            } finally {
              setIsAccepting(false);
            }
          },
        },
      ]
    );
  };

  const handleMarkPickedUp = async () => {
    Alert.alert(
      "Confirm Pickup",
      "Have you picked up the package from the pickup location?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Picked Up",
          style: "default",
          onPress: async () => {
            try {
              setIsMarkingPickup(true);
              await markPickedUp({ trackingId: trackingId || "" });
              Alert.alert("Success", "Order marked as picked up!");
            } catch (error) {
              Alert.alert("Error", "Failed to mark as picked up. Please try again.");
              console.error("Error marking pickup:", error);
            } finally {
              setIsMarkingPickup(false);
            }
          },
        },
      ]
    );
  };

  const handleDeliveryConfirmation = async (pin: string) => {
    try {
      await confirmDelivery({ trackingId: trackingId || "", pin });
      setShowPinModal(false);
      Alert.alert("Success", "Delivery confirmed successfully!");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to confirm delivery. Please try again.");
      console.error("Error confirming delivery:", error);
    }
  };

  const handleDeleteOrder = () => {
    Alert.alert(
      "Delete Order",
      "Are you sure you want to delete this order? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteOrder({ trackingId: trackingId || "" });
              Alert.alert("Success", "Order deleted successfully!");
              router.back();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete order. Please try again.");
              console.error("Error deleting order:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {/* Order Info Card */}
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderIdText}>Order #{order.trackingId}</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: 
                    order.status === "pending" ? "#FEF3C7" :
                    order.status === "assigned" ? "#DBEAFE" :
                    order.status === "picked_up" ? "#F3E8FF" :
                    "#D1FAE5",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: 
                      order.status === "pending" ? "#92400E" :
                      order.status === "assigned" ? "#1E40AF" :
                      order.status === "picked_up" ? "#7C3AED" :
                      "#065F46",
                  },
                ]}
              >
                {order.status === "pending" ? "Pending" :
                 order.status === "assigned" ? "Assigned" :
                 order.status === "picked_up" ? "Picked Up" :
                 "Delivered"}
              </Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Delivery Fee</Text>
            <Text style={styles.priceValue}>₦{order.deliveryFee + 500}</Text>
          </View>
        </View>

        {/* Location Details */}
        <View style={styles.locationCard}>
          <Text style={styles.sectionTitle}>Delivery Route</Text>

          <View style={styles.locationItem}>
            <View style={styles.locationIcon}>
              <MaterialIcons name="location-on" size={20} color="#10B981" />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Pickup Location</Text>
              <Text style={styles.locationAddress}>
                {order.pickupLocation.address}
              </Text>
            </View>
          </View>

          <View style={styles.routeLine} />

          <View style={styles.locationItem}>
            <View style={styles.locationIcon}>
              <MaterialIcons name="flag" size={20} color="#EF4444" />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Delivery Location</Text>
              <Text style={styles.locationAddress}>
                {order.deliveryLocation.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Package Details */}
        <View style={styles.packageCard}>
          <Text style={styles.sectionTitle}>Package Information</Text>

          {order.itemDescription && (
            <View style={styles.packageDetail}>
              <MaterialIcons name="inventory" size={20} color="#6B7280" />
              <View style={styles.packageInfo}>
                <Text style={styles.packageLabel}>Item Description</Text>
                <Text style={styles.packageValue}>{order.itemDescription}</Text>
              </View>
            </View>
          )}

          {order.weight && (
            <View style={styles.packageDetail}>
              <MaterialIcons name="scale" size={20} color="#6B7280" />
              <View style={styles.packageInfo}>
                <Text style={styles.packageLabel}>Weight</Text>
                <Text style={styles.packageValue}>{order.weight} kg</Text>
              </View>
            </View>
          )}

          <View style={styles.packageDetail}>
            <MaterialIcons name="route" size={20} color="#6B7280" />
            <View style={styles.packageInfo}>
              <Text style={styles.packageLabel}>Distance</Text>
              <Text style={styles.packageValue}>
                {order.distanceKm.toFixed(1)} km
              </Text>
            </View>
          </View>

          {order.deliveryTime && (
            <View style={styles.packageDetail}>
              <MaterialIcons name="schedule" size={20} color="#6B7280" />
              <View style={styles.packageInfo}>
                <Text style={styles.packageLabel}>Preferred Delivery Time</Text>
                <Text style={styles.packageValue}>{order.deliveryTime}</Text>
              </View>
            </View>
          )}

          {order.specialInstructions && (
            <View style={styles.packageDetail}>
              <MaterialIcons name="note" size={20} color="#6B7280" />
              <View style={styles.packageInfo}>
                <Text style={styles.packageLabel}>Special Instructions</Text>
                <Text style={styles.packageValue}>
                  {order.specialInstructions}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Driver Actions */}
        {userType.data === "driver" && (
          <View style={styles.driverActions}>
            {/* Accept Order - Only if order is pending */}
            {order.status === "pending" && (
              <TouchableOpacity
                style={[
                  styles.acceptButton,
                  isAccepting && styles.acceptButtonDisabled,
                ]}
                onPress={handleAcceptOrder}
                disabled={isAccepting}
              >
                {isAccepting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <MaterialIcons name="check-circle" size={24} color="white" />
                )}
                <Text style={styles.acceptButtonText}>
                  {isAccepting ? "Accepting..." : "Accept Order"}
                </Text>
              </TouchableOpacity>
            )}

            {/* Mark as Picked Up - Only if order is assigned to this driver */}
            {order.status === "assigned" && order.driverId && (
              <TouchableOpacity
                style={[
                  styles.pickupButton,
                  isMarkingPickup && styles.pickupButtonDisabled,
                ]}
                onPress={handleMarkPickedUp}
                disabled={isMarkingPickup}
              >
                {isMarkingPickup ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <MaterialIcons name="inventory" size={24} color="white" />
                )}
                <Text style={styles.pickupButtonText}>
                  {isMarkingPickup ? "Marking..." : "Mark as Picked Up"}
                </Text>
              </TouchableOpacity>
            )}

            {/* Confirm Delivery - Only if order is picked up */}
            {order.status === "picked_up" && order.driverId && (
              <TouchableOpacity
                style={styles.deliveryButton}
                onPress={() => setShowPinModal(true)}
              >
                <MaterialIcons name="local-shipping" size={24} color="white" />
                <Text style={styles.deliveryButtonText}>Confirm Delivery</Text>
              </TouchableOpacity>
            )}

            {/* Order Completed */}
            {order.status === "delivered" && (
              <View style={styles.completedContainer}>
                <MaterialIcons name="check-circle" size={24} color="#10B981" />
                <Text style={styles.completedText}>Order Completed</Text>
              </View>
            )}
          </View>
        )}

        {/* Customer Actions */}
        {userType.data === "customer" && (
          <View style={styles.customerActions}>
            {/* Show delivery PIN */}
            {order.deliveryPin && order.status !== "delivered" && (
              <View style={styles.pinContainer}>
                <Text style={styles.pinLabel}>Delivery PIN</Text>
                <Text style={styles.pinText}>{order.deliveryPin}</Text>
                <Text style={styles.pinSubtext}>
                  Share this PIN with the driver to confirm delivery
                </Text>
              </View>
            )}

            <View style={styles.customerButtonsContainer}>
              <TouchableOpacity style={styles.trackButton}>
                <MaterialIcons name="location-on" size={20} color="#1E3A8A" />
                <Text style={styles.trackButtonText}>Track Order</Text>
              </TouchableOpacity>

              {/* Delete Order - Only if order hasn't been picked up */}
              {(order.status === "pending" || order.status === "assigned") && (
                <TouchableOpacity style={styles.deleteOrderButton} onPress={handleDeleteOrder}>
                  <MaterialIcons name="delete" size={20} color="#EF4444" />
                  <Text style={styles.deleteOrderButtonText}>Delete Order</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* PIN Modal for Delivery Confirmation */}
      <Modal
        visible={showPinModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <PinInput
              onPinComplete={handleDeliveryConfirmation}
              onCancel={() => setShowPinModal(false)}
              title="Enter Delivery PIN"
            />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  placeholder: {
    width: 40,
  },
  orderCard: {
    backgroundColor: "white",
    margin: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderIdText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 16,
    color: "#6B7280",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  locationCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: "#E5E7EB",
    marginLeft: 15,
    marginVertical: 8,
  },
  packageCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  packageDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  packageInfo: {
    flex: 1,
  },
  packageLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 2,
  },
  packageValue: {
    fontSize: 14,
    color: "#374151",
  },
  acceptButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  acceptButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  acceptButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  driverActions: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  pickupButton: {
    backgroundColor: "#7C3AED",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  pickupButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  pickupButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  deliveryButton: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  deliveryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  completedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 8,
  },
  completedText: {
    color: "#10B981",
    fontSize: 16,
    fontWeight: "600",
  },
  pinContainer: {
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FCD34D",
    alignItems: "center",
  },
  pinLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 8,
  },
  pinText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#92400E",
    letterSpacing: 8,
    marginBottom: 8,
  },
  pinSubtext: {
    fontSize: 12,
    color: "#92400E",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customerActions: {
    flexDirection: "column",
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  customerButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  trackButton: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#1E3A8A",
    gap: 8,
  },
  trackButtonText: {
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteOrderButton: {
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FECACA",
    gap: 8,
  },
  deleteOrderButtonText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
  },
  contactButton: {
    flex: 1,
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
