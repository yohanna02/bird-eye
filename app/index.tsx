import { useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  // Show loading spinner while Clerk is loading
  if (!isLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If user is signed in, redirect to protected area
  if (isSignedIn) {
    return <Redirect href="/(protected)" />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Icon placeholder */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🦅</Text>
          <Text style={styles.appName}>Bird Eye</Text>
          <Text style={styles.tagline}>Fast & Reliable Delivery</Text>
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          <Text style={styles.welcomeText}>Welcome to Bird Eye</Text>
          <Text style={styles.description}>
            Your trusted partner for quick and secure deliveries. Order anything
            you need or become a delivery driver and start earning.
          </Text>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logoText: {
    fontSize: 60,
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#E0E7FF",
    textAlign: "center",
  },
  mainContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#E0E7FF",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "white",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  secondaryButtonText: {
    color: "white",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
});
