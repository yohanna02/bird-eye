import { api } from "@/convex/_generated/api";
import useUserType from "@/hooks/useUserType";
import convexQueries from "@/utils/convexQueries";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const userType = useUserType();
  const driverOrders = convexQueries(api.queries.getUserOrders);

  if (userType.status === "pending" || driverOrders.status === "pending") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={{ color: "#1E3A8A" }}>Loading user information...</Text>
      </View>
    );
  }

  if (userType.status === "error") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#EF4444", textAlign: "center" }}>
          Error loading user information. Please try again later.
        </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={{ color: "#1E3A8A", marginTop: 10 }}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to Bird Eye</Text>
          <Text style={styles.subtitleText}>
            Your reliable delivery service
          </Text>
        </View>

        {/* Customer Action Buttons */}
        {userType.data === "customer" && (
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
        )}

        {/* Recent Orders Section - For All User Types */}
        <View style={styles.mainActions}>
          <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
            {userType.data === "customer" ? "Your Orders" : "Available Orders"}
          </Text>

          <View style={styles.ordersListView}>
            {driverOrders.data?.length ? (
              driverOrders.data.map((order) => (
                <TouchableOpacity 
                  key={order._id} 
                  style={styles.orderCardVertical}
                  onPress={() => router.push(`/order-details?trackingId=${order.trackingId}`)}
                >
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderIdText}>
                      Order #{order.trackingId}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: !order.driverId
                            ? "#FEF3C7"
                            : "#D1FAE5",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: !order.driverId ? "#92400E" : "#065F46",
                          },
                        ]}
                      >
                        {order.driverId ? "Assigned" : "Unassigned"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.orderDetails}>
                    <View style={styles.orderDetailRow}>
                      <MaterialIcons
                        name="location-on"
                        size={16}
                        color="#6B7280"
                      />
                      <Text
                        style={styles.orderDetailText}
                        numberOfLines={1}
                      >
                        {order.pickupLocation.address}
                      </Text>
                    </View>

                    <View style={styles.orderDetailRow}>
                      <MaterialIcons
                        name="flag"
                        size={16}
                        color="#6B7280"
                      />
                      <Text
                        style={styles.orderDetailText}
                        numberOfLines={1}
                      >
                        {order.deliveryLocation.address}
                      </Text>
                    </View>

                    <View style={styles.orderDetailRow}>
                      <MaterialIcons
                        name="attach-money"
                        size={16}
                        color="#6B7280"
                      />
                      <Text style={styles.orderDetailText}>
                        ₦{order.deliveryFee + 50}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.orderActions}>
                    <View style={styles.viewDetailsButton}>
                      <Text style={styles.viewDetailsButtonText}>View Details</Text>
                      <MaterialIcons name="arrow-forward" size={16} color="#1E3A8A" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyOrdersContainer}>
                <MaterialIcons name="inbox" size={48} color="#9CA3AF" />
                <Text style={styles.emptyOrdersText}>
                  {userType.data === "customer" ? "No orders yet" : "No orders available"}
                </Text>
                <Text style={styles.emptyOrdersSubtext}>
                  {userType.data === "customer" 
                    ? "Place your first order to get started" 
                    : "Check back later for new delivery requests"}
                </Text>
              </View>
            )}
          </View>
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
  ordersScrollView: {
    marginTop: 16,
  },
  ordersListView: {
    marginTop: 16,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginRight: 16,
    width: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderCardVertical: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderDetails: {
    marginBottom: 16,
  },
  orderDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  orderDetailText: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  orderActions: {
    marginTop: "auto",
  },
  acceptButton: {
    backgroundColor: "#10B981",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  viewButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  viewButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 8,
  },
  viewDetailsButtonText: {
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyOrdersContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    width: 280,
  },
  emptyOrdersText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 12,
    textAlign: "center",
  },
  emptyOrdersSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
    textAlign: "center",
  },
});
