import { apiRequest } from './api';

export const fetchProducts = () =>
  apiRequest('/products');

export const fetchProductDetail = (id: number) =>
  apiRequest(`/products/${id}`);

export const fetchProductById = (id: number) =>
  apiRequest(`/products/${id}`);