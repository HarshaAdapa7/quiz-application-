import api from './api';

export const getTeacherQuizzes = () => {
  return api.get('/teacher/quizzes');
};

export const createQuiz = (quizData) => {
  return api.post('/teacher/quiz', quizData);
};

export const deleteQuiz = (quizId) => {
  return api.delete(`/teacher/quiz/${quizId}`);
};
export const getTeacherAnalytics = () => {
  return api.get('/teacher/analytics');
};

export const getTeacherStudents = () => {
  return api.get('/teacher/students');
};
