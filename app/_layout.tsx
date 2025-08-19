import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(protected)" />
      </Stack>
    </View>
  );
}
