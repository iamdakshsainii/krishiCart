"use client";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { usePermissions } from "./PrivateRoute";
import {
  FaSeedling,
  FaShoppingCart,
  FaCrown,
  FaSignOutAlt,
  FaHandshake,
  FaHome,
  FaShoppingBasket,
  FaUsers,
  FaInfoCircle,
  FaCloud,
  FaLock,
  FaNewspaper, // ✅ News icon
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { canAccessFarmConnect, isFarmer, isConsumer, isAdmin } = usePermissions();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // ✅ Fixed comparison to === instead of =
  const isActiveLink = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { name: "Home", path: "/", icon: FaHome, public: true },
    { name: "Products", path: "/products", icon: FaShoppingBasket, public: true },
    { name: "Farmers", path: "/farmers", icon: FaUsers, public: true },
    // ✅ NEWS LINK ADDED HERE
    { name: "News", path: "/news", icon: FaNewspaper, public: true, isNew: true },
    {
      name: "Farm Connect",
      path: "/farm-connect",
      icon: FaHandshake,
      isNew: true,
      requiresAuth: true,
      allowedRoles: ["farmer", "consumer"],
      lockIcon: !canAccessFarmConnect(),
    },
    { name: "Weather", path: "/weather", icon: FaCloud, public: true },
    { name: "About", path: "/about", icon: FaInfoCircle, public: true },
  ];

  const getVisibleNavItems = () => {
    return navItems.filter((item) => {
      if (item.public) return true;
      if (item.requiresAuth && !isAuthenticated) return true;
      if (item.allowedRoles && isAuthenticated) {
        return item.allowedRoles.includes(user?.role);
      }
      return true;
    });
  };

  return (
    <nav
      className={`bg-white/95 backdrop-blur-lg shadow-xl border-r border-blue-100
        h-screen fixed top-0 left-0 flex flex-col w-64 z-50
        transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center space-x-3 p-4 border-b border-blue-100 hover:bg-blue-50 transition-colors"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur opacity-25"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 p-3 rounded-xl shadow-lg">
            <FaSeedling className="text-white text-xl" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900">
            KrishiCart
          </span>
          <p className="text-xs text-blue-600 font-medium -mt-1">PREMIUM</p>
        </div>
      </Link>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        <ul className="flex flex-col p-4 space-y-2">
          {getVisibleNavItems().map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.path);
            const isDisabled = item.requiresAuth && !isAuthenticated;
            const hasNoAccess =
              item.requiresAuth &&
              isAuthenticated &&
              !canAccessFarmConnect() &&
              item.name === "Farm Connect";

            const handleClick = (e) => {
              if (item.name === "Farm Connect" && !isAuthenticated) {
                e.preventDefault();
                navigate("/login", { state: { from: "/farm-connect" } });
                return;
              }
              if (hasNoAccess) e.preventDefault();
            };

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={handleClick}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 relative
                    ${isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                      : isDisabled || hasNoAccess
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-800 hover:bg-blue-50 hover:scale-105"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`text-lg ${
                        isActive
                          ? "text-white"
                          : isDisabled || hasNoAccess
                          ? "text-gray-400"
                          : "text-blue-600"
                      }`}
                    />
                    {(isDisabled || hasNoAccess) &&
                      item.name === "Farm Connect" && (
                        <FaLock className="text-xs text-gray-400" />
                      )}
                  </div>
                  <span>{item.name}</span>

                  {item.isNew && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse shadow-lg">
                      NEW
                    </span>
                  )}
                </Link>
              </li>
            );
          })}

          {/* Consumer Cart Link */}
          {isAuthenticated && isConsumer() && (
            <li>
              <Link
                to="/checkout"
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition-all duration-200
                  ${isActiveLink("/checkout")
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                    : "text-blue-800 hover:bg-blue-50 hover:scale-105"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <FaShoppingCart
                    className={`text-lg ${
                      isActiveLink("/checkout") ? "text-white" : "text-blue-600"
                    }`}
                  />
                  <span>Cart</span>
                </div>
                {cartItems.length > 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-bounce">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Profile Section */}
      <div className="border-t border-blue-100 p-4">
        {isAuthenticated ? (
          // Profile dropdown
          <div>
            <button
              onClick={toggleProfile}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <div className="relative w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center shadow-lg">
                {isAdmin() && (
                  <FaCrown className="absolute -top-1 -right-1 text-yellow-400 text-xs animate-pulse" />
                )}
                <span className="font-bold">{getUserInitials(user?.name)}</span>
              </div>
              <div className="flex-1 text-left">
                <span className="block truncate">{user?.name}</span>
                <span className="text-xs text-blue-200 capitalize">
                  {user?.role}
                  {user?.role === "consumer" && " 🛒"}
                  {user?.role === "farmer" && " 🌱"}
                  {user?.role === "admin" && " 👑"}
                </span>
              </div>
            </button>

            {isProfileOpen && (
              <div className="mt-3 space-y-2 bg-white rounded-lg shadow-lg border border-blue-100 p-2">
                {isAdmin() && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded-lg text-blue-800 transition-colors"
                  >
                    <FaCrown className="text-yellow-500" />
                    Admin Dashboard
                  </Link>
                )}
                {isFarmer() && (
                  <>
                    <Link
                      to="/farmer/dashboard"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded-lg text-blue-800 transition-colors"
                    >
                      <FaSeedling className="text-green-500" />
                      Farmer Dashboard
                    </Link>
                    <Link
                      to="/farmer/farm-connect"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded-lg text-blue-800 transition-colors"
                    >
                      <FaHandshake className="text-blue-500" />
                      Farm Connect Pro
                    </Link>
                  </>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded-lg text-blue-800 transition-colors"
                >
                  👤 Profile
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded-lg text-blue-800 transition-colors"
                >
                  📦 Orders
                </Link>
                <Link
                  to="/messages"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded-lg text-blue-800 transition-colors"
                >
                  💬 Messages
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                >
                  <FaSignOutAlt />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          // Login/Register buttons
          <div className="space-y-3">
            <Link
              to="/login"
              className="block px-4 py-3 text-blue-800 hover:bg-blue-50 rounded-lg font-semibold text-center transition-all duration-200 hover:scale-105"
            >
              🚀 Login
            </Link>
            <Link
              to="/register"
              className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold text-center shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              ✨ Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Mobile toggle */}
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-4 left-4 z-60 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        ☰
      </button>
    </nav>
  );
};

export default Navbar;
