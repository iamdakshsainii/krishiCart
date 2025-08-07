"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import {
  FaSeedling,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaCrown,
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-blue-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Epic Logo + Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <FaSeedling className="text-white text-xl" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900 tracking-tight">
                KrishiCart
              </span>
              <span className="text-xs text-blue-600 font-medium -mt-1 tracking-wider">
                PREMIUM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {["Home", "Products", "Farmers", "About"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="relative group text-blue-800 hover:text-blue-600 transition-all duration-300 font-semibold text-lg"
              >
                <span className="relative z-10">{item}</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-700 group-hover:w-full transition-all duration-300"></div>
              </Link>
            ))}

            {/* Cart with Epic Design */}
            {isAuthenticated && user?.role === "consumer" && (
              <Link to="/checkout" className="relative group">
                <div className="relative p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group-hover:scale-110 shadow-lg">
                  <FaShoppingCart className="text-blue-700 text-xl" />
                  {cartItems.length > 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                      {cartItems.length}
                    </div>
                  )}
                </div>
              </Link>
            )}

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="group relative"
                  aria-label="User menu"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    {user?.role === "admin" && (
                      <FaCrown className="absolute -top-1 -right-1 text-yellow-400 text-xs" />
                    )}
                    {getUserInitials(user?.name)}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl py-3 z-20 border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-blue-100">
                      <p className="text-sm font-medium text-gray-600">Signed in as</p>
                      <p className="text-lg font-bold text-blue-800">{user?.name}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium capitalize mt-1">
                        {user?.role}
                      </span>
                    </div>

                    <div className="py-2">
                      {user?.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center space-x-3 px-4 py-3 text-blue-800 hover:bg-blue-50 transition-colors duration-200 font-medium"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FaCrown className="text-yellow-500" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      {user?.role === "farmer" && (
                        <Link
                          to="/farmer/dashboard"
                          className="flex items-center space-x-3 px-4 py-3 text-blue-800 hover:bg-blue-50 transition-colors duration-200 font-medium"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FaSeedling className="text-green-500" />
                          <span>Farmer Dashboard</span>
                        </Link>
                      )}
                      {user?.role !== "admin" && (
                        <>
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 px-4 py-3 text-blue-800 hover:bg-blue-50 transition-colors duration-200 font-medium"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FaUser className="text-blue-500" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/orders"
                            className="flex items-center space-x-3 px-4 py-3 text-blue-800 hover:bg-blue-50 transition-colors duration-200 font-medium"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FaShoppingCart className="text-blue-500" />
                            <span>Orders</span>
                          </Link>
                        </>
                      )}
                      <Link
                        to="/messages"
                        className="flex items-center space-x-3 px-4 py-3 text-blue-800 hover:bg-blue-50 transition-colors duration-200 font-medium"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <span className="text-blue-500">💬</span>
                        <span>Messages</span>
                      </Link>
                    </div>

                    <div className="border-t border-blue-100 pt-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium"
                      >
                        <FaSignOutAlt />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-blue-800 hover:text-blue-600 transition-colors font-semibold text-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="relative group overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-bold hover:scale-105"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="relative p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 shadow-lg"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="text-2xl text-blue-700" />
              ) : (
                <FaBars className="text-2xl text-blue-700" />
              )}
            </button>
          </div>
        </div>

        {/* Epic Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-xl border border-blue-100">
              <div className="flex flex-col space-y-4">
                {["Home", "Products", "Farmers", "About"].map((item) => (
                  <Link
                    key={item}
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-blue-800 hover:text-blue-600 transition-colors font-semibold text-lg py-2 border-b border-blue-100 last:border-b-0"
                    onClick={toggleMenu}
                  >
                    {item}
                  </Link>
                ))}

                {isAuthenticated && user?.role === "consumer" && (
                  <Link
                    to="/checkout"
                    className="flex items-center justify-between text-blue-800 hover:text-blue-600 transition-colors font-semibold text-lg py-2 border-b border-blue-100"
                    onClick={toggleMenu}
                  >
                    <div className="flex items-center space-x-3">
                      <FaShoppingCart />
                      <span>Shopping Cart</span>
                    </div>
                    {cartItems.length > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                )}

                {isAuthenticated ? (
                  <div className="pt-4 border-t border-blue-200">
                    <div className="bg-blue-100 rounded-xl p-4 mb-4">
                      <p className="text-sm text-blue-600 font-medium">Signed in as</p>
                      <p className="text-lg font-bold text-blue-800">{user?.name}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-blue-200 text-blue-700 rounded-full font-medium capitalize mt-1">
                        {user?.role}
                      </span>
                    </div>

                    {user?.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center space-x-3 text-blue-800 hover:text-blue-600 transition-colors font-medium py-2"
                        onClick={toggleMenu}
                      >
                        <FaCrown className="text-yellow-500" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    {user?.role === "farmer" && (
                      <Link
                        to="/farmer/dashboard"
                        className="flex items-center space-x-3 text-blue-800 hover:text-blue-600 transition-colors font-medium py-2"
                        onClick={toggleMenu}
                      >
                        <FaSeedling className="text-green-500" />
                        <span>Farmer Dashboard</span>
                      </Link>
                    )}
                    {user?.role !== "admin" && (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 text-blue-800 hover:text-blue-600 transition-colors font-medium py-2"
                          onClick={toggleMenu}
                        >
                          <FaUser className="text-blue-500" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center space-x-3 text-blue-800 hover:text-blue-600 transition-colors font-medium py-2"
                          onClick={toggleMenu}
                        >
                          <FaShoppingCart className="text-blue-500" />
                          <span>Orders</span>
                        </Link>
                      </>
                    )}
                    <Link
                      to="/messages"
                      className="flex items-center space-x-3 text-blue-800 hover:text-blue-600 transition-colors font-medium py-2"
                      onClick={toggleMenu}
                    >
                      <span className="text-blue-500">💬</span>
                      <span>Messages</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors font-medium py-2 mt-4 pt-4 border-t border-blue-200 w-full text-left"
                    >
                      <FaSignOutAlt />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 pt-4 border-t border-blue-200">
                    <Link
                      to="/login"
                      className="text-blue-800 hover:text-blue-600 transition-colors font-semibold text-lg py-2"
                      onClick={toggleMenu}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-bold text-center"
                      onClick={toggleMenu}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
