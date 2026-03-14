import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { fetchProductDetail, fetchProducts } from '../api/products';
import { useCart } from '../context/CartContext';

export default function ProductScreen({ route, navigation }: any) {
  const passedProduct = route?.params?.product;
  const passedProductId = route?.params?.productId;

  const [product, setProduct] = useState<any>(passedProduct || null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(!passedProduct);
  const [refreshing, setRefreshing] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  const loadProduct = async () => {
    try {
      const id = passedProductId || passedProduct?.id;
      if (!id) return;

      const data = await fetchProductDetail(id);
      setProduct(data);

      // Related products
      const allProducts = await fetchProducts();
      const relatedItems = allProducts
        .filter(
          (item: any) =>
            item.category === data.category && item.id !== data.id
        )
        .slice(0, 4);

      setRelated(relatedItems);
    } catch (error) {
      console.log('Error loading product', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProduct();
  }, []);

  const increaseQty = () => {
    if (product.stock > quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
  if (!product || product.stock === 0) {
    Alert.alert('Error', 'Product is out of stock');
    return;
  }

  // Add correct quantity times
  for (let i = 0; i < quantity; i++) {
    addToCart(product);
  }

  Alert.alert('Success', 'Added to cart');
};

  const handleBuyNow = () => {
    handleAddToCart();
    navigation.navigate('Cart');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* IMAGE */}
      <Image
        source={{
          uri:
            product.image ||
            'https://via.placeholder.com/400',
        }}
        style={styles.image}
      />

      {/* OUT OF STOCK BADGE */}
      {product.stock === 0 && (
        <View style={styles.outBadge}>
          <Text style={styles.outText}>Out of Stock</Text>
        </View>
      )}

      {/* DETAILS */}
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>₹{product.price}</Text>

      <Text style={styles.description}>
        {product.description}
      </Text>

      <Text
        style={[
          styles.stock,
          { color: product.stock > 0 ? '#16a34a' : '#dc2626' },
        ]}
      >
        {product.stock > 0
          ? `In Stock (${product.stock})`
          : 'Out of Stock'}
      </Text>

      {/* QUANTITY */}
      {product.stock > 0 && (
        <View style={styles.qtyContainer}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={decreaseQty}
          >
            <Text style={styles.qtyText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.qtyValue}>{quantity}</Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={increaseQty}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* BUTTONS */}
      <TouchableOpacity
        style={[
          styles.cartBtn,
          product.stock === 0 && { backgroundColor: '#9ca3af' },
        ]}
        disabled={product.stock === 0}
        onPress={handleAddToCart}
      >
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.buyBtn,
          product.stock === 0 && { backgroundColor: '#9ca3af' },
        ]}
        disabled={product.stock === 0}
        onPress={handleBuyNow}
      >
        <Text style={styles.buttonText}>Buy Now</Text>
      </TouchableOpacity>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <>
          <Text style={styles.relatedTitle}>
            Related Products
          </Text>

          {related.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.relatedCard}
              onPress={() =>
                navigation.push('ProductDetail', {
                  product: item,
                })
              }
            >
              <Image
                source={{ uri: item.image }}
                style={styles.relatedImage}
              />
              <View>
                <Text style={styles.relatedName}>
                  {item.name}
                </Text>
                <Text style={styles.relatedPrice}>
                  ₹{item.price}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 320,
    borderRadius: 12,
  },
  outBadge: {
    position: 'absolute',
    top: 25,
    left: 25,
    backgroundColor: '#dc2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  outText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  category: {
    marginTop: 15,
    fontSize: 13,
    color: '#6b7280',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 10,
  },
  stock: {
    fontWeight: '600',
    marginBottom: 15,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  qtyBtn: {
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 6,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  qtyValue: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartBtn: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buyBtn: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  relatedCard: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 10,
  },
  relatedImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  relatedName: {
    fontWeight: '600',
  },
  relatedPrice: {
    fontWeight: 'bold',
  },
});