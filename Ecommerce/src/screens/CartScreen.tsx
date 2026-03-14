import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { useCart } from '../context/CartContext';

export default function CartScreen({ navigation }: any) {
  const { cart, increaseQty, decreaseQty, removeFromCart, total } = useCart();
  const [refreshing, setRefreshing] = useState(false);

  const formatPrice = (amount: number) =>
    `₹${Number(amount).toLocaleString('en-IN')}`;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => removeFromCart(id)}>
      <Text style={styles.deleteText}>🗑</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: any) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.card}>

        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/150' }}
          style={styles.image}
        />

        <View style={styles.info}>

          <Text style={styles.name}>{item.name}</Text>

          {item.variants && (
            <View style={styles.variantBadge}>
              <Text style={styles.variantText}>{item.variants}</Text>
            </View>
          )}

          <Text style={styles.price}>{formatPrice(item.price)}</Text>

          <Text
            style={[
              styles.stock,
              { color: item.stock > 0 ? '#16a34a' : '#dc2626' },
            ]}
          >
            {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}
          </Text>

        </View>

        <View style={styles.qtyBox}>
          <TouchableOpacity
            onPress={() => decreaseQty(item.id)}
            style={styles.qtyBtn}
          >
            <Text style={styles.qtyText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.qty}>{item.quantity}</Text>

          <TouchableOpacity
            onPress={() => increaseQty(item.id)}
            style={[
              styles.qtyBtn,
              item.quantity >= item.stock && { opacity: 0.3 },
            ]}
            disabled={item.quantity >= item.stock}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Swipeable>
  );

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySub}>
          Looks like you haven't added anything yet
        </Text>

        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.shopText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={cart}
        keyExtractor={(item, index) =>
          `${item.id}-${item.variants || 'default'}-${index}`
        }
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <View style={styles.summary}>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            {cart.length} item{cart.length > 1 ? 's' : ''}
          </Text>
          <Text style={styles.summaryPrice}>{formatPrice(total)}</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Checkout')}>
          <LinearGradient
            colors={['#6366f1', '#4f46e5']}
            style={styles.checkoutButton}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#eee',
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: '600',
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },

  stock: {
    fontSize: 12,
    marginTop: 4,
  },

  variantBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },

  variantText: {
    fontSize: 11,
    color: '#4f46e5',
  },

  qtyBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  qtyText: {
    fontSize: 18,
    fontWeight: '600',
  },

  qty: {
    marginVertical: 6,
    fontWeight: '700',
  },

  deleteButton: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 16,
    marginBottom: 14,
  },

  deleteText: {
    color: '#fff',
    fontSize: 20,
  },

  summary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },

  summaryPrice: {
    fontSize: 20,
    fontWeight: '700',
  },

  checkoutButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  checkoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 60,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },

  emptySub: {
    color: '#6b7280',
    marginTop: 6,
  },

  shopButton: {
    marginTop: 20,
    backgroundColor: '#111827',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  shopText: {
    color: '#fff',
    fontWeight: '600',
  },
});