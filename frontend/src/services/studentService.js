import api from './api';

export const getAvailableQuizzes = () => {
  return api.get('/student/quizzes');
};

export const submitAttempt = (attemptData) => {
  return api.post('/student/attempt', attemptData);
};

export const getMyAttempts = () => {
  return api.get('/student/attempts');
};
