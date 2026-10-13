import api from './api';

export const getProfile = async () => {
  const response = await api.get('/api/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/api/profile', data);
  return response.data;
};
