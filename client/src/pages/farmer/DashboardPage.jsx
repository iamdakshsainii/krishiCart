"use client";

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFarmerProducts } from "../../redux/slices/productSlice";
import { getFarmerOrders } from "../../redux/slices/orderSlice";
import { getConversations } from "../../redux/slices/messageSlice";
import Loader from "../../components/Loader";
import {
  FaBox,
  FaShoppingCart,
  FaComment,
  FaPlus,
  FaChartLine,
} from "react-icons/fa";

// Card component for stats
const DashboardCard = ({ title, icon, value, link, linkText, iconColor }) => (
  <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-full text-white ${iconColor} text-2xl flex items-center justify-center shadow`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="text-4xl font-extrabold text-gray-900">{value}</div>
    {link && (
      <Link
        to={link}
        className="mt-6 inline-block text-blue-600 font-semibold hover:text-blue-800 transition"
      >
        {linkText} &rarr;
      </Link>
    )}
  </div>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { farmerProducts, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { farmerOrders, loading: ordersLoading } = useSelector(
    (state) => state.orders
  );
  const { conversations, loading: messagesLoading } = useSelector(
    (state) => state.messages
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getFarmerProducts());
    dispatch(getFarmerOrders());
    dispatch(getConversations());
  }, [dispatch]);

  const orderCounts = {
    pending: ordersLoading
      ? 0
      : farmerOrders.filter((order) => order.status === "pending").length,
    accepted: ordersLoading
      ? 0
      : farmerOrders.filter((order) => order.status === "accepted").length,
    completed: ordersLoading
      ? 0
      : farmerOrders.filter((order) => order.status === "completed").length,
    rejected: ordersLoading
      ? 0
      : farmerOrders.filter((order) => order.status === "rejected").length,
    cancelled: ordersLoading
      ? 0
      : farmerOrders.filter((order) => order.status === "cancelled").length,
  };

  const unreadMessages = messagesLoading
    ? 0
    : conversations.reduce(
        (total, conversation) => total + conversation.unreadCount,
        0
      );

  const totalRevenue = ordersLoading
    ? 0
    : farmerOrders
        .filter((order) => order.status === "completed")
        .reduce((total, order) => total + order.totalAmount, 0);

  if (productsLoading || ordersLoading || messagesLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-900">
            Farmer Dashboard
          </h1>
          <p className="text-blue-700 text-lg">Welcome back, {user?.name}!</p>
        </div>
        <button
          onClick={() => navigate("/farmer/products/add")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          <div className="flex items-center space-x-2">
            <FaPlus />
            <span>Add New Product</span>
          </div>
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <DashboardCard
          title="Total Products"
          icon={<FaBox />}
          value={farmerProducts.length}
          link="/farmer/products"
          linkText="Manage Products"
          iconColor="bg-blue-600"
        />
        <DashboardCard
          title="Pending Orders"
          icon={<FaShoppingCart />}
          value={orderCounts.pending}
          link="/farmer/orders"
          linkText="View Orders"
          iconColor="bg-blue-500"
        />
        <DashboardCard
          title="Accepted Orders"
          icon={<FaShoppingCart />}
          value={orderCounts.accepted}
          link="/farmer/orders"
          linkText="View Accepted"
          iconColor="bg-blue-500"
        />
        <DashboardCard
          title="Unread Messages"
          icon={<FaComment />}
          value={unreadMessages}
          link="/messages"
          linkText="View Messages"
          iconColor="bg-blue-500"
        />
        <DashboardCard
          title="Total Revenue"
          icon={<FaChartLine />}
          value={`₨${totalRevenue.toFixed(2)}`}
          iconColor="bg-blue-700"
        />
      </div>

      {/* Recent Orders Table */}
      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-900">Recent Orders</h2>
          <Link to="/farmer/orders" className="text-blue-600 hover:text-blue-800 font-semibold">
            View All Orders &rarr;
          </Link>
        </div>
        {farmerOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 sticky top-0">
                  <th className="text-left py-2 px-4 font-semibold text-blue-800 border-b border-blue-300">Order ID</th>
                  <th className="text-left py-2 px-4 font-semibold text-blue-800 border-b border-blue-300">Customer</th>
                  <th className="text-center py-2 px-4 font-semibold text-blue-800 border-b border-blue-300">Date</th>
                  <th className="text-center py-2 px-4 font-semibold text-blue-800 border-b border-blue-300">Status</th>
                  <th className="text-right py-2 px-4 font-semibold text-blue-800 border-b border-blue-300">Total</th>
                </tr>
              </thead>
              <tbody>
                {farmerOrders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="hover:bg-blue-50">
                    <td className="py-3 px-4 border-b border-blue-200 text-blue-700">
                      <Link to={`/orders/${order._id}`} className="underline hover:text-blue-900">
                        #{order._id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-200">{order.consumer.name}</td>
                    <td className="py-3 px-4 border-b border-blue-200 text-center">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 border-b border-blue-200 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "pending"
                            ? "bg-blue-200 text-blue-900"
                            : order.status === "accepted" || order.status === "completed"
                            ? "bg-blue-600 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-200 text-right font-semibold text-blue-900">
                      ₨{order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-8 text-blue-700 text-lg">No orders yet.</p>
        )}
      </section>

      {/* Low Stock Products */}
      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-900">Low Stock Products</h2>
          <Link to="/farmer/products" className="text-blue-600 hover:text-blue-800 font-semibold">
            Manage Inventory &rarr;
          </Link>
        </div>
        {farmerProducts.filter((p) => p.quantityAvailable < 10).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 sticky top-0">
                  <th className="text-left py-2 px-4 font-semibold text-blue-800 border-b border-blue-300">Product</th>
                  <th className="text-center py-2 px-4 font-semibold text-blue-800 border-b border-blue-300">Price</th>
                  <th className="text-center py-2 px-4 font-semibold text-blue-800 border-b border-blue-300">Quantity Left</th>
                  <th className="text-right py-2 px-4 font-semibold text-blue-800 border-b border-blue-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {farmerProducts
                  .filter((p) => p.quantityAvailable < 10)
                  .slice(0, 5)
                  .map((product) => (
                    <tr key={product._id} className="hover:bg-blue-50">
                      <td className="py-3 px-4 border-b border-blue-200 flex items-center gap-3 text-blue-900">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-blue-500 font-bold">
                            N/A
                          </div>
                        )}
                        <span>{product.name}</span>
                      </td>
                      <td className="text-center py-3 px-4 border-b border-blue-200 text-blue-900">
                        ₨{product.price.toFixed(2)}
                      </td>
                      <td className="text-center py-3 px-4 border-b border-blue-200">
                        <span
                          className={`font-semibold ${
                            product.quantityAvailable === 0
                              ? "text-red-500"
                              : product.quantityAvailable < 5
                              ? "text-orange-500"
                              : "text-blue-600"
                          }`}
                        >
                          {product.quantityAvailable} {product.unit}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 border-b border-blue-200">
                        <Link
                          to={`/farmer/products/edit/${product._id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Update Stock
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-8 text-blue-700 text-lg">No low stock products.</p>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
