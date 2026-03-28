import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './services/authService';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import LiveArena from './pages/shared/LiveArena';

const PrivateRoute = ({ children, role }) => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/teacher/*" 
          element={
            <PrivateRoute role="ROLE_TEACHER">
              <TeacherDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/student/*" 
          element={
            <PrivateRoute role="ROLE_STUDENT">
              <StudentDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/live/:roomId" 
          element={
            <PrivateRoute>
              <LiveArena />
            </PrivateRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
