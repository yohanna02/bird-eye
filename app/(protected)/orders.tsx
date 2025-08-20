import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function OrdersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Order Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
});
