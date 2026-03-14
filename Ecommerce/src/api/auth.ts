import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  return response.json();
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok && data.token) {
    await AsyncStorage.setItem('token', data.token);
  }

  return data;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem('token');
};
