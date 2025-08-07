"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../redux/slices/authSlice";
import { FaEnvelope, FaLock, FaLeaf, FaStar } from "react-icons/fa";
import Loader from "../components/Loader";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());

    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user?.role === "farmer") {
        navigate("/farmer/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 rounded-full opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white rounded-full opacity-30 animate-bounce delay-500"></div>
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 relative overflow-hidden">
          {/* Card Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white opacity-80 rounded-3xl"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              {/* Brand Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full px-4 py-2 mb-6 shadow-lg border border-blue-200 hover:scale-105 transition-transform duration-300">
                <FaStar className="text-blue-600" />
                <span className="uppercase tracking-wide">KrishiCart</span>
              </div>

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                  <FaLeaf className="text-white text-3xl" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                Welcome
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800"> Back</span>
              </h2>
              <p className="text-gray-600 mb-4">
                Sign in to continue your farm-fresh journey
              </p>
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                  Create one now
                </Link>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow-lg animate-shake">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-800 mb-2"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-900 font-medium placeholder-gray-400 hover:border-gray-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-gray-800 mb-2"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-900 font-medium placeholder-gray-400 hover:border-gray-300"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-300"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700 font-medium"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-bold text-blue-600 hover:text-blue-800 transition-colors duration-300"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                  disabled={loading}
                >
                  <span className="relative z-10">
                    {loading ? "Signing in..." : "Sign In"}
                  </span>
                  {!loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  )}
                </button>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Fast</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Trusted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
