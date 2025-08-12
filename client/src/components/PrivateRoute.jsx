import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

/**
 * Hook to check authentication and role-based permissions.
 * This version includes isFarmer(), isConsumer(), isAdmin() for Navbar compatibility.
 */
export const usePermissions = () => {
  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth || {}
  );

  // Access logic
  const canAccessFarmConnect = () =>
    user?.role === "farmer" || user?.role === "customer";

  const canCreateContent = () => user?.role === "farmer";
  const canInteractWithContent = () => isAuthenticated;

  // ✅ Role functions for Navbar.jsx
  const isFarmer = () => user?.role === "farmer";
  const isConsumer = () => user?.role === "customer";
  const isAdmin = () => user?.role === "admin";

  return {
    user,
    isAuthenticated,
    loading,
    canAccessFarmConnect,
    canCreateContent,
    canInteractWithContent,
    isFarmer,
    isConsumer,
    isAdmin
  };
};

/**
 * PrivateRoute component for protecting routes
 * @param {Array} roles - optional array of allowed roles
 */
const PrivateRoute = ({ roles }) => {
  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth || {}
  );

  // Show loader until auth state resolves
  if (loading) {
    return <Loader />;
  }

  // If admin is logged in — redirect to admin dashboard
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Role-based route restriction
  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // Authenticated → render nested route content
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
