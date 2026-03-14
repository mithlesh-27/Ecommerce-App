// navigation/types.ts
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderSuccessParams = {
  orderId: string;
  items: CartItem[];
  total: number;
  name: string;
  phone: string;
  address: string;
  pincode: string;
};

export type CartStackParamList = {
  CartScreen: undefined;
  Checkout: undefined;

  // Payment receives delivery details
  Payment: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
    total: number;
    discount: number;
    coupon: string | null;
  };

  AddressList: undefined; // ✅ Added AddressList screen

  OrderSuccess: OrderSuccessParams;
};