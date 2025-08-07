"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrderStatus } from "../../redux/slices/orderSlice";
import OrderItem from "../../components/OrderItem";
import Loader from "../../components/Loader";
import { FaSearch, FaFilter, FaShoppingBasket, FaClipboardList, FaEdit } from "react-icons/fa";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { adminOrders, loading } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (adminOrders) {
      let filtered = [...adminOrders];

      if (filter !== "all") {
        filtered = filtered.filter((order) => order.status === filter);
      }

      if (searchTerm) {
        filtered = filtered.filter(
          (order) =>
            order._id.includes(searchTerm) ||
            order.consumer.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            order.farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredOrders(filtered);
    }
  }, [adminOrders, filter, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = () => {
    if (selectedOrder && newStatus) {
      dispatch(updateOrderStatus({ id: selectedOrder._id, status: newStatus }));
      setShowStatusModal(false);
    }
  };

  const getOrderStatusCount = (status) => {
    return adminOrders.filter(order => order.status === status).length;
  };

  if (loading && adminOrders.length === 0) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="container mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <FaClipboardList className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-gray-600 mt-1">Track and manage all platform orders</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{adminOrders.length}</div>
              <div className="text-sm text-gray-500">Total Orders</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by order ID, customer, or farmer..."
                  className="w-full px-4 py-3 pl-12 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-blue-400" />
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-3">
              <FaFilter className="text-blue-500" />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === "all"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                  }`}
                >
                  All ({adminOrders.length})
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === "pending"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                      : "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
                  }`}
                >
                  Pending ({getOrderStatusCount('pending')})
                </button>
                <button
                  onClick={() => setFilter("accepted")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === "accepted"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                      : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                  }`}
                >
                  Accepted ({getOrderStatusCount('accepted')})
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === "completed"
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  Completed ({getOrderStatusCount('completed')})
                </button>
                <button
                  onClick={() => setFilter("rejected")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === "rejected"
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                      : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                  }`}
                >
                  Rejected ({getOrderStatusCount('rejected')})
                </button>
                <button
                  onClick={() => setFilter("cancelled")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === "cancelled"
                      ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  Cancelled ({getOrderStatusCount('cancelled')})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <OrderItem order={order} />
                </div>
                <div className="border-t border-blue-100 bg-blue-50 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Order Actions:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "pending" ? "bg-orange-100 text-orange-800" :
                      order.status === "accepted" ? "bg-green-100 text-green-800" :
                      order.status === "completed" ? "bg-emerald-100 text-emerald-800" :
                      order.status === "rejected" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleUpdateStatus(order)}
                    disabled={order.status === "completed" || order.status === "cancelled"}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-blue-600"
                  >
                    <FaEdit className="text-sm" />
                    <span>Update Status</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 text-center py-16 px-8">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaShoppingBasket className="text-blue-500 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {filter === "all" && !searchTerm
                  ? "There are no orders in the system yet. Orders will appear here once customers start placing them."
                  : "No orders match your current search and filter criteria. Try adjusting your filters or search terms."}
              </p>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 rounded-t-2xl">
                <h3 className="text-xl font-bold text-white">Update Order Status</h3>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <p className="text-gray-900 font-medium">
                      Order #{selectedOrder._id.substring(0, 8)}
                    </p>
                    <p className="text-gray-600">
                      Customer: {selectedOrder.consumer.name}
                    </p>
                    <p className="text-gray-600">
                      Farmer: {selectedOrder.farmer.name}
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    New Status
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusUpdate}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-200 shadow-lg"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
