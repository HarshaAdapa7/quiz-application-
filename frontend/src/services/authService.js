import api from './api';

export const login = async (username, password) => {
  const response = await api.post('/auth/signin', { username, password });
  if (response.data.accessToken) {
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const register = async (username, email, password, role) => {
  return api.post('/auth/signup', { username, email, password, role });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};
