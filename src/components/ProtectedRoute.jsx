// src/components/auth/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth(); // <-- No longer need isLoading here
  const location = useLocation();

  // The check is now simple:
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;