import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const userStats = [
    { label: 'Orders Completed', value: '47', icon: 'receipt-outline' },
    { label: 'Money Saved', value: '$234', icon: 'wallet-outline' },
    { label: 'Favorite Restaurants', value: '12', icon: 'heart-outline' },
  ];

  const menuItems = [
    { label: 'Personal Information', icon: 'person-outline', action: () => {} },
    { label: 'Payment Methods', icon: 'card-outline', action: () => {} },
    { label: 'Order History', icon: 'time-outline', action: () => {} },
    { label: 'Addresses', icon: 'location-outline', action: () => {} },
    { label: 'Notifications', icon: 'notifications-outline', action: () => {} },
    { label: 'Help & Support', icon: 'help-circle-outline', action: () => {} },
    { label: 'About', icon: 'information-circle-outline', action: () => {} },
    { label: 'Sign Out', icon: 'log-out-outline', action: () => router.replace('/'), danger: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>John Doe</Text>
              <Text style={styles.userEmail}>john.doe@example.com</Text>
              <View style={styles.memberSince}>
                <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                <Text style={styles.memberText}>Member since Jan 2024</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil-outline" size={18} color="#1E3A8A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {userStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name={stat.icon as any} size={24} color="#3B82F6" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Membership Card */}
        <View style={styles.membershipCard}>
          <View style={styles.membershipHeader}>
            <Text style={styles.membershipTitle}>Bird Eye Premium</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>FREE</Text>
            </View>
          </View>
          <Text style={styles.membershipDescription}>
            Upgrade to Premium for free delivery, exclusive deals, and priority support.
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem,
              ]}
              onPress={item.action}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, item.danger && styles.dangerIcon]}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={item.danger ? '#EF4444' : '#1E3A8A'}
                  />
                </View>
                <Text style={[styles.menuLabel, item.danger && styles.dangerText]}>
                  {item.label}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={item.danger ? '#EF4444' : '#9CA3AF'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Bird Eye v1.0.0</Text>
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
    paddingVertical: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  membershipCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    padding: 20,
  },
  membershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  membershipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  premiumBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  membershipDescription: {
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 16,
    lineHeight: 20,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: '#FEF2F2',
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  dangerText: {
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
