import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const AdminProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  const role = getUserRole();

  if (!authenticated || role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;


