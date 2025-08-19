import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OrdersScreen() {
  const orders = [
    {
      id: '1',
      restaurant: 'McDonald\'s',
      items: ['Big Mac', 'Fries', 'Coke'],
      status: 'delivered',
      date: 'Today, 2:30 PM',
      price: 12.50,
    },
    {
      id: '2',
      restaurant: 'Pizza Hut',
      items: ['Margherita Pizza (Large)'],
      status: 'delivered',
      date: 'Yesterday, 7:45 PM',
      price: 18.99,
    },
    {
      id: '3',
      restaurant: 'Subway',
      items: ['Italian BMT', 'Cookies'],
      status: 'cancelled',
      date: '2 days ago, 1:15 PM',
      price: 9.75,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#10B981';
      case 'preparing':
        return '#F59E0B';
      case 'on_way':
        return '#3B82F6';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'preparing':
        return 'Preparing';
      case 'on_way':
        return 'On the way';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={20} color="#1E3A8A" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {orders.map((order) => (
          <TouchableOpacity key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.restaurantName}>{order.restaurant}</Text>
              <View 
                style={[
                  styles.statusBadge, 
                  { backgroundColor: getStatusColor(order.status) + '20' }
                ]}
              >
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>

            <Text style={styles.orderItems}>
              {order.items.join(', ')}
            </Text>

            <View style={styles.orderFooter}>
              <Text style={styles.orderDate}>{order.date}</Text>
              <Text style={styles.orderPrice}>${order.price.toFixed(2)}</Text>
            </View>

            <View style={styles.orderActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
              {order.status === 'delivered' && (
                <TouchableOpacity style={[styles.actionButton, styles.reorderButton]}>
                  <Text style={[styles.actionButtonText, styles.reorderButtonText]}>
                    Reorder
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {orders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptyDescription}>
              When you place your first order, it will appear here.
            </Text>
            <TouchableOpacity style={styles.startOrderingButton}>
              <Text style={styles.startOrderingText}>Start Ordering</Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  reorderButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  reorderButtonText: {
    color: '#FFFFFF',
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
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  startOrderingButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startOrderingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
