"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConsumerOrders } from "../redux/slices/orderSlice";
import OrderItem from "../components/OrderItem";
import Loader from "../components/Loader";
import { FaShoppingBasket, FaStar, FaFilter } from "react-icons/fa";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getConsumerOrders());
  }, [dispatch]);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((order) => order.status === filter);

  const filterOptions = [
    {
      key: "all",
      label: "All Orders",
      color: "from-slate-600 to-slate-700",
      count: orders.length,
    },
    {
      key: "pending",
      label: "Pending",
      color: "from-amber-400 to-amber-600",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      key: "accepted",
      label: "Accepted",
      color: "from-blue-500 to-indigo-600",
      count: orders.filter((o) => o.status === "accepted").length,
    },
    {
      key: "completed",
      label: "Completed",
      color: "from-blue-600 to-blue-700", // changed from green to blue gradient
      count: orders.filter((o) => o.status === "completed").length,
    },
    {
      key: "rejected",
      label: "Rejected",
      color: "from-red-500 to-rose-600",
      count: orders.filter((o) => o.status === "rejected").length,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      color: "from-gray-500 to-slate-600",
      count: orders.filter((o) => o.status === "cancelled").length,
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Background layers */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-50 rounded-full opacity-40" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-100 rounded-2xl rotate-12 opacity-30" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full opacity-25" />
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-blue-50 rounded-2xl -rotate-12 opacity-35" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-5 py-1 shadow-sm mb-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="font-semibold uppercase text-sm tracking-wide text-blue-700">
              Order Management
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-gray-900">
            <span>My</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Orders
            </span>
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
            Effortlessly track and manage your farm-fresh orders with a streamlined dashboard.
          </p>
        </div>

        {/* Filter */}
        <div className="max-w-6xl mx-auto mt-12 mb-12">
          <div className="flex justify-center mb-8">
            <div className="flex items-center bg-white px-6 py-2 rounded-full shadow border border-gray-100">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <FaFilter size={16} />
              </div>
              <span className="ml-3 text-gray-700 font-semibold">Filter Orders</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filterOptions.map(({ key, label, color, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`relative rounded-2xl p-6 bg-white border-2 transition-transform duration-300 ${
                  filter === key
                    ? "border-blue-300 shadow-lg shadow-blue-100"
                    : "border-gray-100 hover:border-blue-200 hover:shadow-md"
                } hover:scale-105 hover:-translate-y-1`}
              >
                <div className={`w-3 h-3 rounded-full mb-4 bg-gradient-to-r ${color}`} />
                <div className="text-3xl font-bold text-gray-900 mb-2">{count}</div>
                <div className="text-sm font-medium text-gray-600">{label}</div>
                {filter === key && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-b-2xl" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List or Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="max-w-4xl mx-auto mt-20 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full mx-auto flex items-center justify-center mb-6">
              <FaShoppingBasket className="text-blue-400 text-4xl" />
            </div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-2">
              No Orders Found
            </h3>
            <p className="max-w-xl mx-auto text-gray-600">
              {filter === "all"
                ? "You haven’t placed any orders yet. Start shopping to see your orders here."
                : `No ${filter} orders found. Try choosing a different filter.`}
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {filter === "all"
                  ? "All Orders"
                  : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}
              </h2>
              <div className="text-sm bg-gray-100 text-gray-700 rounded-full px-3 py-1">
                {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}
              </div>
            </div>

            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="transform hover:scale-[1.02] transition-transform duration-200"
                >
                  <OrderItem order={order} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
