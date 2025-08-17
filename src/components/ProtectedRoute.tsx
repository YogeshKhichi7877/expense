import React from 'react';
import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
import {useAuth} from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { state } = useAuth();

  if (state.loading) {
    return <LoadingSpinner />;
  }

  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;