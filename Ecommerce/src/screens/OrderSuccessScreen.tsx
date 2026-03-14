import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CartStackParamList } from '../navigation/types';
import { fetchOrderDetail } from '../api/orders';

type Props = NativeStackScreenProps<
  CartStackParamList,
  'OrderSuccess'
>;

export default function OrderSuccessScreen({
  route,
  navigation,
}: Props) {
  const { orderId } = route.params;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadOrder();

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadOrder = async () => {
    try {
      const data = await fetchOrderDetail(orderId);
      setOrder(data);
    } catch {
      console.log('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!order)
    return (
      <View style={styles.center}>
        <Text>Order not found</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      {/* SUCCESS ICON */}
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.check}>✓</Text>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.success}>
          Order Placed Successfully!
        </Text>

        <Text style={styles.orderId}>
          Order ID: {order.id}
        </Text>

        {/* DELIVERY CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Delivery Details
          </Text>

          <Text>Name: {order.name}</Text>
          <Text>Phone: {order.phone}</Text>
          <Text>Address: {order.address}</Text>
          <Text>Pincode: {order.pincode}</Text>
        </View>

        {/* ITEMS CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Items Ordered
          </Text>

          {order.items.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>
                Product: {item.name}
              </Text>

              {item.variant && (
                <Text style={styles.variant}>
                  Variant: {item.variant}
                </Text>
              )}

              <Text>
                ₹{item.price} × {item.quantity}
              </Text>

              <Text style={styles.itemTotal}>
                ₹{item.price * item.quantity}
              </Text>
            </View>
          ))}
        </View>

        {/* PRICE SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Price Summary
          </Text>

          <View style={styles.row}>
            <Text>Subtotal</Text>
            <Text>₹{order.subtotal}</Text>
          </View>

          <View style={styles.row}>
            <Text>Discount</Text>
            <Text style={{ color: 'green' }}>
              - ₹{order.discount}
            </Text>
          </View>

          <View style={styles.row}>
            <Text>Coupon</Text>
            <Text>
              {order.coupon_code || 'None'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalText}>
              Total Paid
            </Text>
            <Text style={styles.totalText}>
              ₹{order.total}
            </Text>
          </View>
        </View>

        {/* CONTINUE BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.buttonText}>
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  check: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
  },
  success: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  orderId: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemRow: {
    marginBottom: 10,
  },
  itemName: {
    fontWeight: '600',
  },
  variant: {
    fontSize: 12,
    color: '#666',
  },
  itemTotal: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});