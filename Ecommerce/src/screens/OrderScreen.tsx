import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchOrders } from '../api/orders';

export default function OrderScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const navigation = useNavigation<any>();

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err: any) {
      console.log('Error loading orders');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED':
        return '#2563eb';
      case 'SHIPPED':
        return '#f59e0b';
      case 'DELIVERED':
        return '#16a34a';
      case 'CANCELLED':
        return '#dc2626';
      default:
        return '#000';
    }
  };

  return (
    <FlatList
      contentContainerStyle={{ padding: 15 }}
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('OrderDetail', {
              orderId: item.id,
            })
          }
        >
          <View style={styles.row}>
            <Text style={styles.orderId}>
              Order #{item.id}
            </Text>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {item.status}
              </Text>
            </View>
          </View>

          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>

          <Text style={styles.total}>
            ₹{item.total}
          </Text>

          {item.discount > 0 && (
            <Text style={styles.discount}>
              Saved ₹{item.discount}
            </Text>
          )}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
  },
  date: {
    marginTop: 5,
    color: '#666',
  },
  total: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  discount: {
    color: 'green',
    marginTop: 4,
  },
});