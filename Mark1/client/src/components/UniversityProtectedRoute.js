import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const UniversityProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  const role = getUserRole();

  if (!authenticated || role !== 'university') {
    return <Navigate to="/university/login" replace />;
  }

  return children;
};

export default UniversityProtectedRoute;


