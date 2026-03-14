import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { ProfileStackParamList } from "../navigation/AppNavigator";
import { fetchAddresses, deleteAddress, setDefaultAddress } from "../api/address";
import { useAuth } from "../context/AuthContext";

type Props = NativeStackScreenProps<ProfileStackParamList, "AddressList">;
type Address = {
  id: number;
  label: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  is_default: boolean;
};

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AddressListScreen({ navigation }: Props) {
  const { userToken } = useAuth();

  // ===== HOOKS: Always called in same order =====
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingDefault, setLoadingDefault] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch addresses
  const loadAddresses = useCallback(async () => {
    if (!userToken) return;
    setRefreshing(true);
    try {
      const data = await fetchAddresses(userToken);
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error fetching addresses:", err);
      setAddresses([]);
    } finally {
      setRefreshing(false);
    }
  }, [userToken]);

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [loadAddresses])
  );

  // ===== Set Default Address =====
  const toggleDefault = async (id: number) => {
    if (!userToken) return;
    setLoadingDefault(id);
    try {
      await setDefaultAddress(id, userToken);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      loadAddresses();
    } catch (err) {
      console.log("Error setting default:", err);
    } finally {
      setLoadingDefault(null);
    }
  };

  // ===== Delete Address =====
  const removeAddress = (id: number) => {
    Alert.alert("Delete Address", "Are you sure you want to delete this address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoadingDelete(id);
          try {
            await deleteAddress(id, userToken!);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            loadAddresses();
          } catch (err) {
            console.log("Delete error:", err);
          } finally {
            setLoadingDelete(null);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Add Address */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddAddress")}
      >
        <Text style={styles.addBtnText}>+ Add New Address</Text>
      </TouchableOpacity>

      {/* Empty State */}
      {addresses.length === 0 && !refreshing && (
        <Text style={styles.noAddressesText}>No addresses found.</Text>
      )}

      {/* Address Cards */}
      {addresses.map((addr) => (
        <View key={addr.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.label}>{addr.label}</Text>
            <View style={styles.switchRow}>
              <Text style={styles.defaultText}>Default</Text>
              {loadingDefault === addr.id ? (
                <ActivityIndicator size="small" color="#6366F1" />
              ) : (
                <Switch
                  value={addr.is_default}
                  onValueChange={() => toggleDefault(addr.id)}
                  trackColor={{ true: "#6366F1", false: "#ddd" }}
                  thumbColor="#fff"
                />
              )}
            </View>
          </View>

          <Text style={styles.text}>{addr.line1}</Text>
          <Text style={styles.text}>{addr.city}, {addr.state}</Text>
          <Text style={styles.text}>{addr.pincode}</Text>
          <Text style={styles.text}>{addr.phone}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate("EditAddress", { addr })}
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeAddress(addr.id)}
            >
              {loadingDelete === addr.id ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <Text style={styles.deleteText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA", paddingHorizontal: 16 },
  addBtn: {
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginVertical: 16,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  noAddressesText: { textAlign: "center", marginTop: 20, color: "#9CA3AF", fontSize: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  label: { fontWeight: "700", fontSize: 16, color: "#111827" },
  switchRow: { flexDirection: "row", alignItems: "center" },
  defaultText: { fontSize: 12, color: "#6B7280", marginRight: 6 },
  text: { fontSize: 14, color: "#374151", marginBottom: 2 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  editBtn: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    backgroundColor: "#E0E7FF",
    borderRadius: 12,
  },
  deleteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
  },
  editText: { color: "#4F46E5", fontWeight: "600" },
  deleteText: { color: "#DC2626", fontWeight: "600" },
});