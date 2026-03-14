import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';
import { useSnackbar } from '../utils/SnackbarContext';
import { fakePaymentApi } from '../utils/fakePaymentApi';
import LoadingButton from '../components/LoadingButton';
import { apiRequest } from '../api/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CartStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<CartStackParamList, 'Payment'>;

export default function PaymentScreen({ navigation, route }: Props) {
  const { cart, clearCart } = useCart();
  const { showSnackbar } = useSnackbar();

  const {
    total,
    discount = 0,
    coupon = null,
    name,
    phone,
    address,
    pincode,
  } = route.params;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const paymentRes = await fakePaymentApi();

      if (!paymentRes.success) {
        setError(paymentRes.error);
        setLoading(false);
        return;
      }

      // 🔥 SEND DELIVERY DETAILS TO BACKEND
      const orderResponse = await apiRequest('/orders', 'POST', {
        items: cart.map(item => ({
          product_id: Number(item.id),
          quantity: item.quantity,
          variant: item.variant || null,
        })),
        discount,
        coupon_code: coupon,
        name,
        phone,
        address,
        pincode,
      });

      clearCart();
      showSnackbar('Order Placed Successfully');

      navigation.replace('OrderSuccess', {
        orderId: orderResponse.orderId,
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure Payment</Text>
      <Text>Total: ₹{total}</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <LoadingButton
        title="Pay Now"
        loading={loading}
        onPress={handlePayment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  error: { color: 'red', marginTop: 10 },
});