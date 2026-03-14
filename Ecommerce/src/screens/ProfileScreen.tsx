import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const MenuItem = ({ icon, title, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={18} color="#6366f1" />
        </View>
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#bbb" />
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* PREMIUM HEADER */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>

          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* ACCOUNT SECTION */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account</Text>

          <MenuItem
            icon="create-outline"
            title="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
          />

          <MenuItem
            icon="lock-closed-outline"
            title="Change Password"
            onPress={() => navigation.navigate('ChangePassword')}
          />
        </View>

        {/* SHOP SECTION */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Shop</Text>

          <MenuItem
            icon="receipt-outline"
            title="My Orders"
            onPress={() =>
              navigation.navigate('Orders', {
                screen: 'OrdersList',
              })
            }
          />

          <MenuItem
            icon="location-outline"
            title="Saved Addresses"
            onPress={() => navigation.navigate('AddressList')} // ✅ Fixed
          />

          <MenuItem
            icon="card-outline"
            title="Payment Methods"
            onPress={() => Alert.alert('Coming soon')}
          />

          <MenuItem
            icon="settings-outline"
            title="Settings"
            onPress={() => Alert.alert('Coming soon')}
          />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  /* HEADER */
  header: {
    backgroundColor: '#111827',
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#6366f1',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },

  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },

  name: { fontSize: 20, fontWeight: '600', color: '#fff' },

  email: { marginTop: 6, fontSize: 14, color: '#9ca3af' },

  /* CARD */
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 5,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 20,
    marginVertical: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  /* MENU ITEM */
  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  menuLeft: { flexDirection: 'row', alignItems: 'center' },

  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  menuText: { fontSize: 15, fontWeight: '500', color: '#111827' },

  /* LOGOUT */
  logoutBtn: {
    marginTop: 35,
    marginHorizontal: 20,
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  logoutText: { color: '#fff', fontWeight: '600', marginLeft: 8, fontSize: 15 },
});