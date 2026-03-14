import { apiRequest } from './api';

export const fetchOrders = () =>
  apiRequest('/orders');

export const fetchOrderDetail = (id: number) =>
  apiRequest(`/orders/${id}`);

export const cancelOrder = (id: number) =>
  apiRequest(`/orders/${id}/cancel`, 'PUT');

export const downloadInvoice = (id: number) =>
  apiRequest(`/orders/${id}/invoice`);