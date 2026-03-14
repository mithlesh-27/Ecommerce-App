import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from  '../api/config'

export const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  body?: any
) => {
  const token = await AsyncStorage.getItem('token');

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.message === 'Invalid or expired token') {
      await AsyncStorage.removeItem('token');
      throw new Error('Session expired. Please login again.');
    }

    throw new Error(data.message || 'Request failed');
  }

  return data;
};
