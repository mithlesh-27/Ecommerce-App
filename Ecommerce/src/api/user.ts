import { apiRequest } from './api';

/* FETCH CURRENT USER PROFILE */
export const fetchProfile = async () => {
  return await apiRequest('/auth/me', 'GET');
};

/* UPDATE USER PROFILE */
export const updateProfile = async (data: {
  name?: string;
  phone?: string;
  address?: string;
}) => {
  const payload: any = {};

  if (data.name) payload.name = data.name;
  if (data.phone) payload.phone = data.phone;
  if (data.address) payload.address = data.address;

  return await apiRequest('/auth/update-profile', 'PUT', payload);
};

/* CHANGE PASSWORD */
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return await apiRequest('/auth/change-password', 'PUT', data);
};