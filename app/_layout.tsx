import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";

const queryClient = new QueryClient();
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <QueryClientProvider client={queryClient}>
          <View style={{ flex: 1, backgroundColor: "#F3F4F6", paddingTop: 20 }}>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(protected)" />
              <Stack.Screen name="order-details" options={{ title: "Order Details", headerShown: true }} />
            </Stack>
          </View>
        </QueryClientProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
