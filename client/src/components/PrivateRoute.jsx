import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

/**
 * Hook to check authentication and role-based permissions.
 * Includes isFarmer(), isConsumer(), isAdmin() for Navbar compatibility.
 */
export const usePermissions = () => {
  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth || {}
  );

  // ✅ Access logic — allow both farmers and consumers
  const canAccessFarmConnect = () =>
    isAuthenticated &&
    (user?.role === "farmer" || user?.role === "consumer");

  // ✅ Match FarmConnectionPage naming (farmers can create)
  const canCreate = () =>
    isAuthenticated && user?.role === "farmer";

  // ✅ Match FarmConnectionPage naming (farmers & consumers can interact)
  const canInteract = () =>
    isAuthenticated &&
    (user?.role === "farmer" || user?.role === "consumer");

  // ✅ Role helpers for Navbar
  const isFarmer = () => user?.role === "farmer";
  const isConsumer = () => user?.role === "consumer";
  const isAdmin = () => user?.role === "admin";

  return {
    user,
    isAuthenticated,
    loading,
    canAccessFarmConnect,
    canCreate,
    canInteract,
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

  // Redirect admin users to admin dashboard
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Role-based restriction
  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // Authenticated → render the child route
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
