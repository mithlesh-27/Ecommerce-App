import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../navigation/types';

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  name: string;
  phone: string;
  address: string;
  pincode: string;
};

type OrderContextType = {
  orders: Order[];
  addOrder: (
    items: CartItem[],
    total: number,
    name: string,
    phone: string,
    address: string,
    pincode: string
  ) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const ORDER_KEY = '@orders';

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(ORDER_KEY);
      if (stored) setOrders(JSON.parse(stored));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(ORDER_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = (
    items: CartItem[],
    total: number,
    name: string,
    phone: string,
    address: string,
    pincode: string
  ) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items,
      total,
      createdAt: new Date().toLocaleString(),
      name,
      phone,
      address,
      pincode,
    };

    setOrders(prev => [newOrder, ...prev]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used inside OrderProvider');
  return ctx;
};
