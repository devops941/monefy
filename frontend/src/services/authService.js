import Constants from 'expo-constants';

const getBaseUrl = () => {
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) return `http://${host}:5000`;
  return 'http://localhost:5000';
};

export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${getBaseUrl()}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
};
