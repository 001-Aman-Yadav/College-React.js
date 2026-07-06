import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(reqUserRole(user))) {
    // Role not authorized, redirect to their home dashboard
    const role = reqUserRole(user);
    if (role === 'SuperAdmin' || role === 'Admin') {
      return <Navigate to="/admin" replace />;
    } else if (role === 'Teacher') {
      return <Navigate to="/teacher" replace />;
    } else {
      return <Navigate to="/student" replace />;
    }
  }

  return children;
};

// Helper helper for SuperAdmin/Admin unification
const reqUserRole = (user) => {
  return user?.role;
};

export default ProtectedRoute;
