import { apiRequest } from './api';

/* Fetch current user profile */
export const fetchProfile = async () => {
  return await apiRequest('/auth/me', 'GET');
};

/* Update profile (name + addresses) */
export const updateProfile = async (data: { name: string; address?: any[] }) => {
  return await apiRequest('/auth/update-profile', 'PUT', data);
};

/* Change password */
export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
  return await apiRequest('/auth/change-password', 'PUT', data);
};

/* Get addresses */
export const fetchAddresses = async () => {
  return await apiRequest('/auth/addresses', 'GET');
};

/* Update addresses */
export const updateAddresses = async (addresses: any[]) => {
  return await apiRequest('/auth/addresses', 'PUT', { addresses });
};