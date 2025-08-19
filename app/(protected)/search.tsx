import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', emoji: '🍽️' },
    { id: 'burgers', name: 'Burgers', emoji: '🍔' },
    { id: 'pizza', name: 'Pizza', emoji: '🍕' },
    { id: 'asian', name: 'Asian', emoji: '🍜' },
    { id: 'healthy', name: 'Healthy', emoji: '🥗' },
    { id: 'desserts', name: 'Desserts', emoji: '🍰' },
  ];

  const restaurants = [
    {
      id: '1',
      name: 'McDonald\'s',
      cuisine: 'Fast Food',
      rating: 4.2,
      deliveryTime: '15-25 min',
      deliveryFee: 2.99,
      image: '🍔',
    },
    {
      id: '2',
      name: 'Pizza Hut',
      cuisine: 'Italian',
      rating: 4.5,
      deliveryTime: '20-30 min',
      deliveryFee: 3.49,
      image: '🍕',
    },
    {
      id: '3',
      name: 'Panda Express',
      cuisine: 'Chinese',
      rating: 4.3,
      deliveryTime: '10-20 min',
      deliveryFee: 2.49,
      image: '🥡',
    },
    {
      id: '4',
      name: 'Subway',
      cuisine: 'Sandwiches',
      rating: 4.1,
      deliveryTime: '5-15 min',
      deliveryFee: 1.99,
      image: '🥪',
    },
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    
    // Simple category matching
    const categoryMatch = {
      burgers: ['Fast Food'],
      pizza: ['Italian'],
      asian: ['Chinese'],
      healthy: ['Salads', 'Healthy'],
    };
    
    return matchesSearch && categoryMatch[selectedCategory]?.includes(restaurant.cuisine);
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Restaurants</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, cuisines..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categories}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Results */}
      <ScrollView style={styles.resultsSection} showsVerticalScrollIndicator={false}>
        {filteredRestaurants.length > 0 ? (
          <>
            <Text style={styles.resultsHeader}>
              {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
            </Text>
            {filteredRestaurants.map((restaurant) => (
              <TouchableOpacity key={restaurant.id} style={styles.restaurantCard}>
                <View style={styles.restaurantImage}>
                  <Text style={styles.restaurantEmoji}>{restaurant.image}</Text>
                </View>
                
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                  
                  <View style={styles.restaurantMeta}>
                    <View style={styles.rating}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    </View>
                    <Text style={styles.deliveryTime}>{restaurant.deliveryTime}</Text>
                    <Text style={styles.deliveryFee}>${restaurant.deliveryFee} delivery</Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptyDescription}>
              Try adjusting your search or browse different categories.
            </Text>
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
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
  categoriesSection: {
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#1E3A8A',
  },
  resultsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginVertical: 16,
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  restaurantEmoji: {
    fontSize: 24,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  deliveryTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  deliveryFee: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
