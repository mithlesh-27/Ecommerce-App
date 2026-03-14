// navigation/CartStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import PaymentScreen from '../screens/PaymentScreen';
import AddressListScreen from '../screens/AddressListScreen'; // make sure this exists
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import { CartStackParamList } from './types';

const Stack = createNativeStackNavigator<CartStackParamList>();

export default function CartStack() {
  return (
    <Stack.Navigator initialRouteName="CartScreen">
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{ title: 'My Cart' }}
      />

      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />

      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: 'Payment' }}
      />

      <Stack.Screen
        name="AddressList"
        component={AddressListScreen}
        options={{ title: 'Select Address' }}
      />

      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{ title: 'Order Successful' }}
      />
    </Stack.Navigator>
  );
}