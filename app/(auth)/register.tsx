import { useSignUp } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type UserType = "customer" | "driver";

export default function RegisterScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [userType, setUserType] = useState<UserType>("customer");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleRegister = useMutation({
    mutationFn: async () => {
      if (!isLoaded) {
        throw new Error("Clerk is not loaded");
      }

      if (
        !formData.email ||
        !formData.password ||
        !formData.name ||
        !formData.phone
      ) {
        throw new Error("Email, password, name, and phone are required");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Create the user account
      const user = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.name.split(" ")[0],
        lastName: formData.name.split(" ").slice(1).join(" ") || ""
      });
      
      await signUp.update({
        unsafeMetadata: {
          type: userType,
          phoneNumber: formData.phone
        }
      });

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      // Move to verification step
      setIsVerifying(true);
    },
    onSuccess: () => {
      Alert.alert(
        "Verification Code Sent",
        "Please check your email for the verification code."
      );
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
      Alert.alert("Error registering", error.message);
    },
  });

  const handleVerify = useMutation({
    mutationFn: async () => {
      if (!isLoaded || !signUp) {
        throw new Error("Clerk is not loaded");
      }

      if (!verificationCode) {
        throw new Error("Please enter the verification code");
      }

      // Complete the sign up process
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        return completeSignUp;
      } else {
        throw new Error("Verification failed. Please try again.");
      }
    },
    onSuccess: () => {
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/(protected)");
          },
        },
      ]);
    },
    onError: (error: Error) => {
      console.error("Verification error:", error);
      Alert.alert("Error verifying email", error.message);
    },
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#1E3A8A" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (isVerifying) {
                  setIsVerifying(false);
                } else {
                  router.back();
                }
              }}
            >
              <AntDesign
                name="arrowleft"
                size={24}
                style={styles.backButtonText}
              />
            </TouchableOpacity>
            <Text style={styles.title}>
              {isVerifying ? "Verify Email" : "Create Account"}
            </Text>
            <Text style={styles.subtitle}>
              {isVerifying
                ? "Enter the verification code sent to your email"
                : "Join the Bird Eye community"}
            </Text>
          </View>

          {isVerifying ? (
            /* Verification Form */
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Verification Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#9CA3AF"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  handleVerify.isPending && styles.registerButtonDisabled,
                ]}
                onPress={() => handleVerify.mutate()}
                disabled={handleVerify.isPending || !verificationCode}
              >
                {handleVerify.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.registerButtonText}>Verify Email</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => handleRegister.mutate()}
                disabled={handleRegister.isPending}
              >
                <Text style={styles.resendButtonText}>
                  Didn&apos;t receive code? Resend
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* User Type Selection */}
              <View style={styles.userTypeContainer}>
            <Text style={styles.sectionTitle}>I want to</Text>
            <View style={styles.userTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === "customer" && styles.userTypeButtonActive,
                ]}
                onPress={() => setUserType("customer")}
              >
                <Text style={styles.userTypeIcon}>�</Text>
                <Text
                  style={[
                    styles.userTypeText,
                    userType === "customer" && styles.userTypeTextActive,
                  ]}
                >
                  Place Orders
                </Text>
                <Text
                  style={[
                    styles.userTypeDescription,
                    userType === "customer" && styles.userTypeDescriptionActive,
                  ]}
                >
                  Order anything and get it delivered
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === "driver" && styles.userTypeButtonActive,
                ]}
                onPress={() => setUserType("driver")}
              >
                <Text style={styles.userTypeIcon}>🚗</Text>
                <Text
                  style={[
                    styles.userTypeText,
                    userType === "driver" && styles.userTypeTextActive,
                  ]}
                >
                  Make Deliveries
                </Text>
                <Text
                  style={[
                    styles.userTypeDescription,
                    userType === "driver" && styles.userTypeDescriptionActive,
                  ]}
                >
                  Earn money by delivering packages
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                value={formData.phone}
                onChangeText={(value) => updateFormData("phone", value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  updateFormData("confirmPassword", value)
                }
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.registerButton, handleRegister.isPending && styles.registerButtonDisabled]}
              onPress={() => handleRegister.mutate()}
              disabled={handleRegister.isPending}
            >
              {handleRegister.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.registerButtonText}>Create Account</Text>
                )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  backButtonText: {
    fontSize: 20,
    color: "#1E3A8A",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  userTypeContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 15,
  },
  userTypeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
  },
  userTypeButtonActive: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  userTypeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  userTypeTextActive: {
    color: "#1E3A8A",
  },
  userTypeDescription: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  userTypeDescriptionActive: {
    color: "#3B82F6",
  },
  form: {
    marginBottom: 20,
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
  registerButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    color: "#6B7280",
    fontSize: 16,
  },
  signInText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  resendButton: {
    alignItems: "center",
    marginTop: 15,
    paddingVertical: 10,
  },
  resendButtonText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "500",
  },
});
