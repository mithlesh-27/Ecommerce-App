import { apiRequest } from './api';

export const createOrder = async (items: any[]) => {
  return apiRequest('/orders', 'POST', { items });
};
