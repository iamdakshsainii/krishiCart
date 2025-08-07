"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/slices/userSlice";
import { getAllOrders } from "../../redux/slices/orderSlice";
import { getCategories } from "../../redux/slices/categorySlice";
import { getProducts } from "../../redux/slices/productSlice";
import Loader from "../../components/Loader";
import { FaUsers, FaList, FaBox, FaUserCheck, FaArrowRight, FaChartLine } from "react-icons/fa6";
import { FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { adminOrders, loading: ordersLoading } = useSelector(
    (state) => state.orders
  );
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllOrders());
    dispatch(getCategories());
    dispatch(getProducts());
  }, [dispatch]);

  // Count users by role
  const userCounts = {
    total: users.length,
    farmers: users.filter((u) => u.role === "farmer").length,
    consumers: users.filter((u) => u.role === "consumer").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  // Count orders by status
  const orderCounts = {
    total: adminOrders.length,
    pending: adminOrders.filter((order) => order.status === "pending").length,
    accepted: adminOrders.filter((order) => order.status === "accepted").length,
    completed: adminOrders.filter((order) => order.status === "completed")
      .length,
    rejected: adminOrders.filter((order) => order.status === "rejected").length,
    cancelled: adminOrders.filter((order) => order.status === "cancelled")
      .length,
  };

  // Calculate total revenue
  const totalRevenue = adminOrders
    .filter((order) => order.status === "completed")
    .reduce((total, order) => total + order.totalAmount, 0);

  if (usersLoading || ordersLoading || categoriesLoading || productsLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="container mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Monitor and manage your platform performance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                <p className="text-sm text-gray-500">Active platform users</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">
                {userCounts.total - userCounts.admins}
              </p>
              <Link
                to="/admin/users"
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 text-sm font-medium group"
              >
                <span>View all</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Orders</h3>
                <p className="text-sm text-gray-500">All time orders</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl">
                <FaShoppingCart className="text-orange-600 text-xl" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">{orderCounts.total}</p>
              <Link
                to="/admin/orders"
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 text-sm font-medium group"
              >
                <span>View all</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                <p className="text-sm text-gray-500">Product categories</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl">
                <FaList className="text-purple-600 text-xl" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
              <Link
                to="/admin/categories"
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 text-sm font-medium group"
              >
                <span>Manage</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
                <p className="text-sm text-gray-500">From completed orders</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                <FaMoneyBillWave className="text-green-600 text-xl" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">₨{totalRevenue.toFixed(2)}</p>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <FaUsers className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">User Statistics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <GiFarmer className="text-green-600 text-2xl" />
                </div>
                <div>
                  <p className="text-green-700 font-medium">Farmers</p>
                  <p className="text-3xl font-bold text-green-800">{userCounts.farmers}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <FaUserCheck className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Consumers</p>
                  <p className="text-3xl font-bold text-blue-800">{userCounts.consumers}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <FaUsers className="text-purple-600 text-2xl" />
                </div>
                <div>
                  <p className="text-purple-700 font-medium">Admins</p>
                  <p className="text-3xl font-bold text-purple-800">{userCounts.admins}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <FaShoppingCart className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Order Statistics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <p className="text-blue-700 font-medium mb-1">Pending</p>
              <p className="text-2xl font-bold text-blue-800">{orderCounts.pending}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <p className="text-green-700 font-medium mb-1">Accepted</p>
              <p className="text-2xl font-bold text-green-800">{orderCounts.accepted}</p>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
              <p className="text-emerald-700 font-medium mb-1">Completed</p>
              <p className="text-2xl font-bold text-emerald-800">{orderCounts.completed}</p>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
              <p className="text-red-700 font-medium mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-800">{orderCounts.rejected}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <p className="text-orange-700 font-medium mb-1">Cancelled</p>
              <p className="text-2xl font-bold text-orange-800">{orderCounts.cancelled}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                <Link
                  to="/admin/orders"
                  className="text-blue-100 hover:text-white text-sm font-medium flex items-center space-x-1 group"
                >
                  <span>View All</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {adminOrders.length > 0 ? (
              <div className="p-6">
                <div className="space-y-4">
                  {adminOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <FaShoppingCart className="text-blue-500 text-sm" />
                        </div>
                        <div>
                          <Link
                            to={`/orders/${order._id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600"
                          >
                            #{order._id.substring(0, 8)}
                          </Link>
                          <p className="text-sm text-gray-600">{order.consumer.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "pending"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "accepted" || order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          ₨{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingCart className="text-blue-500 text-xl" />
                </div>
                <p className="text-gray-600">No orders yet.</p>
              </div>
            )}
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Recent Products</h2>
                <Link
                  to="/products"
                  className="text-blue-100 hover:text-white text-sm font-medium flex items-center space-x-1 group"
                >
                  <span>View All</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="p-6">
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shadow-sm">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaBox className="text-blue-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <Link
                            to={`/products/${product._id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600 block"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-gray-600">{product.farmer?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₨{product.price.toFixed(2)}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            product.quantityAvailable === 0
                              ? "bg-red-100 text-red-800"
                              : product.quantityAvailable < 5
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.quantityAvailable} {product.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBox className="text-blue-500 text-xl" />
                </div>
                <p className="text-gray-600">No products yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
