import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but not an admin, redirect to home
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If user is an admin, render the admin page
  return children;
};

export default ProtectedRoute;