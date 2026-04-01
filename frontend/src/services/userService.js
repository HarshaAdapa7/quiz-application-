import api from './api';

export const getUserProfile = (userId) => {
  return api.get(`/users/${userId}/profile`);
};

export const getLeaderboard = () => {
  return api.get('/users/leaderboard');
};

export const updateUserProfile = (userId, data) => {
  return api.put(`/users/${userId}/profile`, data);
};
