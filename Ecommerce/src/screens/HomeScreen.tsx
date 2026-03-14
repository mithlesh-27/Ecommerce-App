import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchProducts } from '../api/products';
import { useCart } from '../context/CartContext';

export default function HomeScreen({ navigation }: any) {
  // ✅ ALL HOOKS AT TOP (NEVER CONDITIONAL)
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { addToCart } = useCart();

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.log('Error loading products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadProducts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const categories = useMemo(() => {
    const cats = products.map((p) => p.category || 'Other');
    return ['All', ...Array.from(new Set(cats))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const formatPrice = (price: number) =>
    `₹${Number(price).toLocaleString('en-IN')}`;

  return (
    <View style={{ flex: 1 }}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Discover Products
        </Text>

        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                selectedCategory === cat && {
                  backgroundColor: '#000',
                },
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={{
                  color:
                    selectedCategory === cat
                      ? '#fff'
                      : '#000',
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LOADING OVERLAY (NO EARLY RETURN) */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={styles.container}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    'ProductDetail',
                    { product: item }
                  )
                }
              >
                <Image
                  source={{
                    uri:
                      item.image ||
                      'https://via.placeholder.com/200',
                  }}
                  style={styles.image}
                />

                <Text numberOfLines={1} style={styles.name}>
                  {item.name}
                </Text>

                <Text style={styles.price}>
                  {formatPrice(item.price)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cartBtn}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.cartText}>
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchInput: {
    marginTop: 10,
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 10,
  },
  categoryBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 10,
  },
  container: {
    padding: 10,
    backgroundColor: '#f3f4f6',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 6,
    borderRadius: 14,
    padding: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 130,
    borderRadius: 10,
  },
  name: {
    fontWeight: '600',
    marginTop: 6,
  },
  price: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  cartBtn: {
    marginTop: 8,
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
