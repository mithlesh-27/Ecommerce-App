import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  TextInput,
  Animated,
  Alert
} from "react-native";

import LoadingButton from "../components/LoadingButton";
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CartStackParamList } from "../navigation/types";
import { fetchDefaultAddress, fetchAddresses, Address } from "../api/address";
import LinearGradient from "react-native-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";

type Props = NativeStackScreenProps<CartStackParamList, "Checkout">;

type Coupon = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
};

const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'SAVE25', type: 'percentage', value: 25 },
  { code: 'FLAT500', type: 'fixed', value: 500 },
  { code: 'WELCOME10', type: 'percentage', value: 10 },
  { code: 'MEGA50', type: 'percentage', value: 50 },
  { code: 'SUPER15', type: 'percentage', value: 15 },
  { code: 'BIGSALE20', type: 'percentage', value: 20 },
  { code: 'FESTIVE30', type: 'percentage', value: 30 },
  { code: 'FLAT100', type: 'fixed', value: 100 },
  { code: 'FLAT250', type: 'fixed', value: 250 },
  { code: 'FLAT750', type: 'fixed', value: 750 },
  { code: 'FLAT1000', type: 'fixed', value: 1000 },
  { code: 'FLAT2000', type: 'fixed', value: 2000 },
  { code: 'FIRSTORDER', type: 'percentage', value: 12 },
  { code: 'APPONLY15', type: 'percentage', value: 15 },
  { code: 'VIP40', type: 'percentage', value: 40 },
  { code: 'CLEARANCE60', type: 'percentage', value: 60 },
];

export default function CheckoutScreen({ navigation }: Props) {
  const { cart } = useCart();
  const { userToken } = useAuth();

  const [address, setAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(true);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const couponAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadAddresses = async () => {
      setLoadingAddress(true);
      try {
        if (!userToken) return;
        const defaultAddr = await fetchDefaultAddress(userToken);
        setAddress(defaultAddr);

        const allAddresses = await fetchAddresses(userToken);
        setAddresses(allAddresses || (defaultAddr ? [defaultAddr] : []));
      } catch (err) {
        console.log("Address load error", err);
      } finally {
        setLoadingAddress(false);
      }
    };
    loadAddresses();
  }, [userToken]);

  const subtotal = useMemo(() => cart.reduce((sum: number, item) => sum + (item.price ?? 0) * item.quantity, 0), [cart]);
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.type === "percentage"
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value;
  }, [appliedCoupon, subtotal]);
  const total = Math.max(subtotal - discount, 0);

  const applyCoupon = () => {
    const found = AVAILABLE_COUPONS.find(c => c.code.toLowerCase() === couponInput.trim().toLowerCase());
    if (!found) {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(found);
    setCouponError("");

    couponAnim.setValue(0);
    Animated.spring(couponAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
    setShowConfetti(true);
  };

  const validate = () => {
    if (!cart.length) return Alert.alert("Error", "Your cart is empty");
    if (!address) return Alert.alert("Error", "Please select a delivery address");

    if (!/^\d{10}$/.test(address.phone)) return Alert.alert("Error", "Invalid phone number");
    if (!/^\d{6}$/.test(address.pincode)) return Alert.alert("Error", "Invalid pincode");

    navigation.navigate("Payment", {
      name: address.label,
      phone: address.phone,
      address: address.line1,
      pincode: address.pincode,
      total,
      discount,
      coupon: appliedCoupon?.code || null
    });
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Delivery Address</Text>

        {loadingAddress ? <ActivityIndicator size="large" /> : address ? (
          <TouchableOpacity style={styles.addressCard} onPress={() => setModalVisible(true)}>
            <Text style={styles.label}>{address.label}</Text>
            <Text style={styles.addressText}>{address.line1}</Text>
            <Text style={styles.addressText}>{address.city}, {address.state} - {address.pincode}</Text>
            <Text style={styles.addressText}>{address.phone}</Text>
            <Text style={styles.changeBtn}>Change / Select</Text>
          </TouchableOpacity>
        ) : (
          <Text>No address found. Add one in Profile.</Text>
        )}

        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Address</Text>
            <FlatList
              data={addresses}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.addressCard} onPress={() => { setAddress(item); setModalVisible(false); }}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text>{item.line1}</Text>
                  <Text>{item.city}, {item.state} - {item.pincode}</Text>
                  <Text>{item.phone}</Text>
                </TouchableOpacity>
              )}
            />
            <LoadingButton title="Close" loading={false} onPress={() => setModalVisible(false)} />
          </View>
        </Modal>

        <Text style={styles.sectionTitle}>Apply Coupon</Text>
        <View style={styles.couponRow}>
          <TextInput style={styles.couponInput} placeholder="Enter coupon code" value={couponInput} onChangeText={setCouponInput} />
          <TouchableOpacity style={styles.applyBtn} onPress={applyCoupon}>
            <Animated.View style={[{ transform: [{ scale: couponAnim.interpolate({ inputRange: [0,1], outputRange: [1,1.3] }) }] }]}>
              <Text style={styles.applyText}>Apply</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
        {couponError ? <Text style={styles.error}>{couponError}</Text> : null}
        {appliedCoupon && !couponError && (
          <Animated.View style={[styles.couponSuccess, { opacity: couponAnim }]}>
            <Text style={styles.couponSuccessText}>Coupon "{appliedCoupon.code}" applied! 🎉</Text>
          </Animated.View>
        )}

        {showConfetti && <ConfettiCannon count={50} origin={{ x: 150, y: 0 }} fadeOut onAnimationEnd={() => setShowConfetti(false)} />}

        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <Text>Subtotal</Text>
            <Text>₹{subtotal.toFixed(2)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.row}>
              <Text style={styles.discount}>Discount</Text>
              <Text style={styles.discount}>-₹{discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.rowTotal}>
            <Text style={styles.total}>Total</Text>
            <Text style={styles.total}>₹{total.toFixed(2)}</Text>
          </View>
        </View>

        <LoadingButton title="Proceed to Payment" loading={false} onPress={validate} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  addressCard: { backgroundColor: "#fff", padding: 18, borderRadius: 14, marginBottom: 20, elevation: 3 },
  label: { fontWeight: "700", fontSize: 16, marginBottom: 4 },
  changeBtn: { color: "#4F46E5", fontWeight: "600", marginTop: 8 },
  addressText: { fontSize: 14, marginTop: 2 },
  sectionTitle: { fontWeight: "700", marginBottom: 10 },
  couponRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  couponInput: { flex: 1, backgroundColor: "#fff", padding: 14, borderRadius: 10 },
  applyBtn: { backgroundColor: "#000", paddingHorizontal: 20, justifyContent: "center", borderRadius: 10 },
  applyText: { color: "#fff", fontWeight: "700" },
  error: { color: "red", marginBottom: 8 },
  couponSuccess: { backgroundColor: "#D1FAE5", padding: 10, borderRadius: 10, marginBottom: 10 },
  couponSuccessText: { color: "#065F46", fontWeight: "700" },
  summaryCard: { backgroundColor: "#fff", padding: 16, borderRadius: 14, marginTop: 20, marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  rowTotal: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  discount: { color: "green" },
  total: { fontSize: 18, fontWeight: "700" },
  modalContainer: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 }
});