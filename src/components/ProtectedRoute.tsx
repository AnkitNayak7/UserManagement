import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const sessionId = localStorage.getItem('sessionId');
  const expiry = localStorage.getItem('sessionExpiry');
  const isSessionValid = sessionId && expiry && Date.now() <= parseInt(expiry);

  if (!isSessionValid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}; 