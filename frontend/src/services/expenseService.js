import api from './api';

export const getExpenses = async () => {
  const response = await api.get('/api/expenses');
  return response.data;
};

export const createExpense = async (data) => {
  const response = await api.post('/api/expenses', data);
  return response.data;
};

export const updateExpense = async (id, data) => {
  const response = await api.put(`/api/expenses/${id}`, data);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/api/expenses/${id}`);
  return response.data;
};
