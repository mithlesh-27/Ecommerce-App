import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { fetchOrderDetail, cancelOrder } from '../api/orders';
import { fetchProductById } from '../api/products';
import { useCart } from '../context/CartContext';

export default function OrderDetailScreen({ route, navigation }: any) {
  const { orderId } = route.params;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [reorderVisible, setReorderVisible] = useState(false);
  const [reorderItems, setReorderItems] = useState<any[]>([]);

  const { addToCart } = useCart();

  /* ---------------- LOAD ORDER ---------------- */

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const data = await fetchOrderDetail(Number(orderId));
      setOrder(data ?? null);
    } catch (error) {
      console.log('Order fetch error:', error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HELPERS ---------------- */

  const formatPrice = (amount: number) =>
    `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  const getOrderItems = () => {
    if (!order) return [];

    if (Array.isArray(order.items)) return order.items;
    if (Array.isArray(order.order_items)) return order.order_items;
    if (Array.isArray(order.products)) return order.products;

    return [];
  };

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
        return '#6b7280';
    }
  };

  /* ---------------- CANCEL ---------------- */

  const handleCancel = async () => {
    try {
      setLoading(true);
      await cancelOrder(order?.id);
      await loadOrder();
      Alert.alert('Success', 'Order cancelled');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Cancel failed');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REORDER PREP ---------------- */

  const handleReorderPress = async () => {
    try {
      setLoading(true);

      const originalItems = getOrderItems();

      if (!originalItems.length) {
        Alert.alert('No items found in this order');
        return;
      }

      const updatedItems = [];

      for (const item of originalItems) {
        const productId =
          item?.product_id ??
          item?.productId ??
          item?.id;

        if (!productId) continue;

        const fresh = await fetchProductById(productId);

        updatedItems.push({
          ...item,
          resolvedId: productId,
          stock: fresh?.stock ?? 0,
          selected: (fresh?.stock ?? 0) > 0,
        });
      }

      setReorderItems(updatedItems);
      setReorderVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to prepare reorder');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: number) => {
    setReorderItems(prev =>
      prev.map(item =>
        item.resolvedId === id
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  /* ---------------- CONFIRM REORDER ---------------- */

  const confirmReorder = () => {
    const selected = reorderItems.filter(i => i.selected);

    if (!selected.length) {
      Alert.alert('Select at least one item');
      return;
    }

    selected.forEach(item => {
      const qtyToAdd = Math.min(
        item.quantity ?? 0,
        item.stock ?? 0
      );

      for (let i = 0; i < qtyToAdd; i++) {
        addToCart({
          id: item.resolvedId,
          name: item.name,
          price: item.price,
          image: item.image,
          stock: item.stock,
        });
      }
    });

    setReorderVisible(false);
    navigation.navigate('Cart');
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /* ---------------- ORDER NOT FOUND ---------------- */

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Order not found</Text>
      </View>
    );
  }

  const items = getOrderItems();

  /* ---------------- MAIN UI ---------------- */

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={styles.container}
        data={items}
        keyExtractor={(item, index) =>
          String(
            item?.product_id ??
              item?.productId ??
              item?.id ??
              index
          )
        }
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Order #{order.id}</Text>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(order.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {order.status}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                Delivery Details
              </Text>
              <Text>👤 {order.name}</Text>
              <Text>📞 {order.phone}</Text>
              <Text>📍 {order.address}</Text>
              <Text>Pincode: {order.pincode}</Text>
            </View>

            <Text style={styles.sectionTitle}>
              Items
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image
              source={{
                uri:
                  item?.image ||
                  'https://via.placeholder.com/100',
              }}
              style={styles.productImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>
                {item?.name}
              </Text>
              <Text>Qty: {item?.quantity}</Text>
            </View>
            <Text style={styles.itemTotal}>
              {formatPrice(
                (item?.price ?? 0) *
                  (item?.quantity ?? 0)
              )}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <>
            <View style={styles.summaryCard}>
              <View style={styles.row}>
                <Text>Subtotal</Text>
                <Text>{formatPrice(order.subtotal)}</Text>
              </View>
              <View style={styles.row}>
                <Text>Total</Text>
                <Text style={styles.totalText}>
                  {formatPrice(order.total)}
                </Text>
              </View>
            </View>

            {order.status === 'PLACED' && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCancel}
              >
                <Text style={styles.btnText}>
                  Cancel Order
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.reorderBtn}
              onPress={handleReorderPress}
            >
              <Text style={styles.btnText}>
                Reorder
              </Text>
            </TouchableOpacity>
          </>
        }
      />

      {/* ---------------- REORDER MODAL ---------------- */}

      <Modal visible={reorderVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Select Items to Reorder
          </Text>

          <FlatList
            data={reorderItems}
            keyExtractor={(item, index) =>
              String(item?.resolvedId ?? index)
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() =>
                  toggleSelect(item.resolvedId)
                }
              >
                <Image
                  source={{
                    uri:
                      item?.image ||
                      'https://via.placeholder.com/100',
                  }}
                  style={styles.modalImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>
                    {item?.name}
                  </Text>
                  <Text>
                    Ordered: {item?.quantity}
                  </Text>
                  <Text
                    style={{
                      color:
                        item.stock > 0
                          ? '#16a34a'
                          : '#dc2626',
                    }}
                  >
                    {item.stock > 0
                      ? `Stock: ${item.stock}`
                      : 'Out of Stock'}
                  </Text>
                </View>
                <Text style={{ fontSize: 18 }}>
                  {item.selected ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={confirmReorder}
          >
            <Text style={styles.btnText}>
              Add Selected to Cart
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setReorderVisible(false)
            }
          >
            <Text style={{ textAlign: 'center', marginTop: 10 }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f3f4f6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  statusBadge: {
    padding: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  statusText: { color: '#fff', fontSize: 12 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
  },
  sectionTitle: { fontWeight: 'bold', marginBottom: 8 },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  itemName: { fontWeight: '600' },
  itemTotal: { fontWeight: 'bold' },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    marginTop: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalText: { fontWeight: 'bold', fontSize: 16 },
  cancelBtn: {
    backgroundColor: '#dc2626',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  reorderBtn: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { flex: 1, padding: 16, backgroundColor: '#fff' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  confirmBtn: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
});