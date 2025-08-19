import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good Morning!</Text>
              <Text style={styles.location}>📍 New York, NY</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for restaurants, food..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>🍕</Text>
              </View>
              <Text style={styles.actionText}>Order Food</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>🚚</Text>
              </View>
              <Text style={styles.actionText}>Track Order</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>⭐</Text>
              </View>
              <Text style={styles.actionText}>Favorites</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>🎁</Text>
              </View>
              <Text style={styles.actionText}>Offers</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categories}>
              {[
                { emoji: '🍔', name: 'Burgers' },
                { emoji: '🍕', name: 'Pizza' },
                { emoji: '🍜', name: 'Asian' },
                { emoji: '🥗', name: 'Healthy' },
                { emoji: '🍰', name: 'Desserts' },
                { emoji: '☕', name: 'Coffee' },
              ].map((category, index) => (
                <TouchableOpacity key={index} style={styles.categoryCard}>
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.orderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.restaurantName}>McDonald&apos;s</Text>
              <Text style={styles.orderDetails}>Big Mac, Fries, Coke</Text>
              <Text style={styles.orderDate}>Today, 2:30 PM</Text>
            </View>
            <View style={styles.orderActions}>
              <Text style={styles.orderPrice}>$12.50</Text>
              <TouchableOpacity style={styles.reorderButton}>
                <Text style={styles.reorderText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.orderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.restaurantName}>Pizza Hut</Text>
              <Text style={styles.orderDetails}>Margherita Pizza (Large)</Text>
              <Text style={styles.orderDate}>Yesterday, 7:45 PM</Text>
            </View>
            <View style={styles.orderActions}>
              <Text style={styles.orderPrice}>$18.99</Text>
              <TouchableOpacity style={styles.reorderButton}>
                <Text style={styles.reorderText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  categories: {
    flexDirection: 'row',
    gap: 16,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  orderDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  orderActions: {
    alignItems: 'flex-end',
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  reorderButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  reorderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
