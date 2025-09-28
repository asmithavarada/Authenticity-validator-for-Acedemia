import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const AgencyProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  if (!authenticated || userRole !== 'agency') {
    return <Navigate to="/agency/login" replace />;
  }

  return children;
};

export default AgencyProtectedRoute;