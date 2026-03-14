import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';
import { SnackbarProvider } from './src/utils/SnackbarContext';
import { OrderProvider } from './src/context/ordercontext';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SnackbarProvider>
          <CartProvider>
            <OrderProvider>
              <AppNavigator />
            </OrderProvider>
          </CartProvider>
        </SnackbarProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
