import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

import HomeScreen from '../screens/HomeScreen'
import ProductScreen from '../screens/ProductScreen'
import CartScreen from '../screens/CartScreen'
import CheckoutScreen from '../screens/CheckoutScreen'
import PaymentScreen from '../screens/PaymentScreen'
import OrderSuccessScreen from '../screens/OrderSuccessScreen'
import OrderScreen from '../screens/OrderScreen'
import OrderDetailScreen from '../screens/OrderDetailScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import ProfileScreen from '../screens/ProfileScreen'
import EditProfileScreen from '../screens/EditProfileScreen'
import ChangePasswordScreen from '../screens/ChangePasswordScreen'
import AddressListScreen from '../screens/AddressListScreen'
import AddAddressScreen from '../screens/AddAddressScreen'
import EditAddressScreen from '../screens/EditAddressScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import ResetPasswordScreen from '../screens/ResetPasswordScreen'
import MapPickerScreen from '../screens/MapPickerScreen'

/* ================= TYPES ================= */

export type RootStackParamList = {
  Auth: undefined
  MainTabs: undefined
}

export type TabParamList = {
  Shop: undefined
  Cart: undefined
  Orders: undefined
  Profile: undefined
}

export type HomeStackParamList = {
  Home: undefined
  ProductDetail: { productId: string }
}

export type CartStackParamList = {
  CartScreen: undefined
  Checkout: undefined
  Payment: undefined
  OrderSuccess: undefined
}

export type OrdersStackParamList = {
  OrdersList: undefined
  OrderDetail: { orderId: string }
}

export type ProfileStackParamList = {
  ProfileMain: undefined
  EditProfile: undefined
  ChangePassword: undefined
  AddressList: undefined
  AddAddress: undefined
  EditAddress: { addr: any }
  MapPicker: undefined
}

export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  ResetPassword: undefined
}

/* ================= NAVIGATORS ================= */

const RootStack = createNativeStackNavigator<RootStackParamList>()
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>()
const Tab = createBottomTabNavigator<TabParamList>()
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>()
const CartStackNav = createNativeStackNavigator<CartStackParamList>()
const OrdersStackNav = createNativeStackNavigator<OrdersStackParamList>()
const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>()

/* ================= AUTH STACK ================= */

function AuthStack() {
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="Register" component={RegisterScreen} />
      <AuthStackNav.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStackNav.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </AuthStackNav.Navigator>
  )
}

/* ================= HOME STACK ================= */

function HomeStack() {
  return (
    <HomeStackNav.Navigator>
      <HomeStackNav.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Shop" }}
      />

      <HomeStackNav.Screen
        name="ProductDetail"
        component={ProductScreen}
        options={{ title: "Product Details" }}
      />
    </HomeStackNav.Navigator>
  )
}

/* ================= CART STACK ================= */

function CartStack() {
  return (
    <CartStackNav.Navigator>
      <CartStackNav.Screen
        name="CartScreen"
        component={CartScreen}
        options={{ title: "Your Cart" }}
      />

      <CartStackNav.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: "Checkout" }}
      />

      <CartStackNav.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: "Payment" }}
      />

      <CartStackNav.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{ headerShown: false }}
      />
    </CartStackNav.Navigator>
  )
}

/* ================= ORDERS STACK ================= */

function OrdersStack() {
  return (
    <OrdersStackNav.Navigator>
      <OrdersStackNav.Screen
        name="OrdersList"
        component={OrderScreen}
        options={{ title: "My Orders" }}
      />

      <OrdersStackNav.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: "Order Details" }}
      />
    </OrdersStackNav.Navigator>
  )
}

/* ================= PROFILE STACK ================= */

function ProfileStack() {
  return (
    <ProfileStackNav.Navigator>
      <ProfileStackNav.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />

      <ProfileStackNav.Screen
        name="EditProfile"
        component={EditProfileScreen}
      />

      <ProfileStackNav.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />

      <ProfileStackNav.Screen
        name="AddressList"
        component={AddressListScreen}
        options={{ title: "My Addresses" }}
      />

      <ProfileStackNav.Screen
        name="AddAddress"
        component={AddAddressScreen}
      />

      <ProfileStackNav.Screen
        name="EditAddress"
        component={EditAddressScreen}
      />

      <ProfileStackNav.Screen
        name="MapPicker"
        component={MapPickerScreen}
      />
    </ProfileStackNav.Navigator>
  )
}

/* ================= TABS ================= */

function TabsWithBadge() {

  const { cart } = useCart()

  const totalItems =
    cart?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0

  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (totalItems > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 120,
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true
        })
      ]).start()
    }
  }, [totalItems])

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#999",

        tabBarIcon: ({ color, size, focused }) => {

          let iconName: any

          if (route.name === "Shop") iconName = focused ? "home" : "home-outline"
          if (route.name === "Cart") iconName = focused ? "cart" : "cart-outline"
          if (route.name === "Orders") iconName = focused ? "receipt" : "receipt-outline"
          if (route.name === "Profile") iconName = focused ? "person" : "person-outline"

          return (
            <View>

              <Ionicons name={iconName} size={size} color={color} />

              {route.name === "Cart" && totalItems > 0 && (
                <Animated.View
                  style={[styles.badge, { transform: [{ scale: scaleAnim }] }]}
                >
                  <Text style={styles.badgeText}>{totalItems}</Text>
                </Animated.View>
              )}

            </View>
          )
        }
      })}
    >
      <Tab.Screen name="Shop" component={HomeStack} />
      <Tab.Screen name="Cart" component={CartStack} />
      <Tab.Screen name="Orders" component={OrdersStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  )
}

/* ================= ROOT ================= */

export default function AppNavigator() {

  const { userToken } = useAuth()

  if (userToken === undefined) return null

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>

        {userToken ? (
          <RootStack.Screen
            name="MainTabs"
            component={TabsWithBadge}
          />
        ) : (
          <RootStack.Screen
            name="Auth"
            component={AuthStack}
          />
        )}

      </RootStack.Navigator>
    </NavigationContainer>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  badge: {
    position: "absolute",
    right: -10,
    top: -5,
    backgroundColor: "#e11d48",
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold"
  }

})