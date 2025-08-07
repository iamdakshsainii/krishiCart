"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../redux/slices/orderSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import {
  FaArrowLeft,
  FaLeaf,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaComment,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaStar,
} from "react-icons/fa";

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const { order, loading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const receiverId =
      user.role === "consumer" ? order.farmer._id : order.consumer._id;

    dispatch(
      sendMessage({
        receiver: receiverId,
        content: message,
        relatedOrder: id,
      })
    );

    setMessage("");
    setShowMessageForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300";
      case "accepted":
      case "completed":
        return "bg-gradient-to-r from-blue-600 to-blue-700 text-white";
      case "rejected":
      case "cancelled":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white";
      default:
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300";
    }
  };

  if (loading || !order) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 rounded-full opacity-15 animate-pulse delay-1000"></div>
      </div>

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Back Button */}
        <Link
          to={`/${user.role === "consumer" ? "" : "farmer/"}orders`}
          className="group inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-300 mb-8 font-semibold"
        >
          <FaArrowLeft className="mr-2 transition-transform group-hover:scale-110" />
          Back to Orders
        </Link>

        {/* Order Header */}
        <section className="bg-white rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white opacity-90 rounded-3xl" />
          <div className="relative z-10 p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-6 py-2 text-blue-800 font-semibold border border-blue-300 shadow">
                <FaStar className="text-blue-600" />
                Order Details
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
                  Order{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                    #{order._id.substring(0, 8)}
                  </span>
                </h1>
                <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div>
                <span
                  className={`inline-block px-5 py-2 rounded-full text-sm font-bold ${getStatusBadgeClass(order.status)}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Summary and Details */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Order Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border border-gray-100 shadow hover:shadow-lg transition">
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-800">
              <div className="p-3 rounded-lg bg-blue-700 shadow text-white">
                <FaLeaf />
              </div>
              Order Summary
            </h2>
            <div className="space-y-6">
              <div className="flex justify-between bg-white p-4 rounded shadow">
                <span className="font-medium text-gray-600">Total Amount:</span>
                <span className="font-extrabold text-blue-700 text-xl">
                  ₨{order.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between bg-white p-4 rounded shadow">
                <span className="font-medium text-gray-600">Payment Method:</span>
                <span className="capitalize font-semibold bg-blue-100 px-3 py-1 rounded text-blue-800">
                  {order.paymentMethod.replace("_", " ")}
                </span>
              </div>
              {order.notes && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Notes:</h3>
                  <div className="bg-white p-4 rounded border-l-4 border-blue-600 shadow">
                    <p className="text-gray-700">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery or Pickup */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border border-gray-100 shadow hover:shadow-lg transition">
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-800">
              <div className="p-3 rounded-lg bg-blue-700 shadow text-white">
                {order.pickupDetails ? <FaLeaf /> : <FaMapMarkerAlt />}
              </div>
              {order.pickupDetails ? "Pickup Details" : "Delivery Details"}
            </h2>
            {order.pickupDetails ? (
              <div className="space-y-6">
                <div className="flex bg-white p-4 rounded shadow">
                  <FaMapMarkerAlt className="mr-3 mt-1 text-blue-700" />
                  <span>{order.pickupDetails.location}</span>
                </div>
                {order.pickupDetails.date && (
                  <div className="flex bg-white p-4 rounded shadow">
                    <FaCalendarAlt className="mr-3 text-blue-700" />
                    <span>{formatDate(order.pickupDetails.date)}</span>
                  </div>
                )}
                {order.pickupDetails.time && (
                  <div className="flex bg-white p-4 rounded shadow">
                    <FaClock className="mr-3 text-blue-700" />
                    <span>{order.pickupDetails.time}</span>
                  </div>
                )}
              </div>
            ) : order.deliveryDetails ? (
              <div className="space-y-6">
                <div className="flex bg-white p-4 rounded shadow">
                  <FaMapMarkerAlt className="mr-3 mt-1 text-blue-700" />
                  <div>
                    <p>{order.deliveryDetails.address?.street}</p>
                    <p>
                      {order.deliveryDetails.address?.city},{" "}
                      {order.deliveryDetails.address?.state}{" "}
                      {order.deliveryDetails.address?.zipCode}
                    </p>
                  </div>
                </div>
                {order.deliveryDetails.date && (
                  <div className="flex bg-white p-4 rounded shadow">
                    <FaCalendarAlt className="mr-3 text-blue-700" />
                    <span>{formatDate(order.deliveryDetails.date)}</span>
                  </div>
                )}
                {order.deliveryDetails.time && (
                  <div className="flex bg-white p-4 rounded shadow">
                    <FaClock className="mr-3 text-blue-700" />
                    <span>{order.deliveryDetails.time}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center bg-white p-8 rounded shadow text-gray-500">
                No pickup or delivery details provided.
              </div>
            )}
          </div>
        </section>

        {/* Contact Details */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Customer Info */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border border-gray-100 shadow hover:shadow-lg transition">
            <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-800">
              <div className="p-3 rounded-lg bg-blue-700 shadow text-white">
                <FaUser />
              </div>
              Customer Information
            </h3>
            <div className="space-y-6">
              <div className="flex items-center bg-white p-4 rounded shadow">
                <FaUser className="mr-3 text-blue-700" />
                <span className="font-bold text-gray-800">{order.consumer.name}</span>
              </div>
              <div className="flex items-center bg-white p-4 rounded shadow">
                <FaEnvelope className="mr-3 text-blue-700" />
                <span>{order.consumer.email}</span>
              </div>
              {order.consumer.phone && (
                <div className="flex items-center bg-white p-4 rounded shadow">
                  <FaPhone className="mr-3 text-blue-700" />
                  <span>{order.consumer.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Farmer Info */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border border-gray-100 shadow hover:shadow-lg transition">
            <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-800">
              <div className="p-3 rounded-lg bg-blue-700 shadow text-white">
                <FaLeaf />
              </div>
              Farmer Information
            </h3>
            <div className="space-y-6">
              <div className="flex items-center bg-white p-4 rounded shadow">
                <FaUser className="mr-3 text-blue-700" />
                <span className="font-bold text-gray-800">{order.farmer.name}</span>
              </div>
              <div className="flex items-center bg-white p-4 rounded shadow">
                <FaEnvelope className="mr-3 text-blue-700" />
                <span>{order.farmer.email}</span>
              </div>
              {order.farmer.phone && (
                <div className="flex items-center bg-white p-4 rounded shadow">
                  <FaPhone className="mr-3 text-blue-700" />
                  <span>{order.farmer.phone}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Order Items */}
        <section className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-10">
            <h2 className="text-3xl font-extrabold mb-8 text-center">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-blue-100 sticky top-0">
                    <th className="p-6 text-left text-blue-800 font-semibold">Product</th>
                    <th className="p-6 text-center text-blue-800 font-semibold">Price</th>
                    <th className="p-6 text-center text-blue-800 font-semibold">Quantity</th>
                    <th className="p-6 text-right text-blue-800 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item._id} className="hover:bg-blue-50 transition group">
                      <td className="p-6 flex items-center gap-5">
                        <div className="w-20 h-20 rounded-3xl shadow overflow-hidden">
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-blue-50 text-blue-500 text-3xl">
                              <FaLeaf />
                            </div>
                          )}
                        </div>
                        <span className="text-gray-900 font-semibold text-lg">
                          {item.product.name}
                        </span>
                      </td>
                      <td className="p-6 text-center text-blue-700 font-semibold">
                        ₨{item.price.toFixed(2)}
                      </td>
                      <td className="p-6 text-center">
                        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="p-6 text-right text-blue-700 font-extrabold text-xl">
                        ₨{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <td colSpan={3} className="p-6 text-right font-extrabold text-xl rounded-bl-3xl">
                      Grand Total:
                    </td>
                    <td className="p-6 text-xl font-extrabold rounded-br-3xl">
                      ₨{order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* Messaging Section */}
        <section className="bg-white rounded-3xl shadow-2xl border border-gray-100 mt-10">
          <div className="p-10 text-center">
            <h2 className="text-3xl font-extrabold mb-8">
              Contact{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                {user.role === "consumer" ? "Farmer" : "Customer"}
              </span>
            </h2>
            {showMessageForm ? (
              <form
                className="max-w-lg mx-auto space-y-8"
                onSubmit={handleSendMessage}
                aria-label="Send message about order"
              >
                <textarea
                  required
                  rows={5}
                  className="w-full rounded-lg border-2 border-blue-300 p-6 font-medium text-gray-900 resize-none focus:border-blue-600 focus:ring-4 focus:ring-blue-200 outline-none"
                  placeholder={`Write your message here...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex justify-center gap-6">
                  <button
                    type="submit"
                    className="px-10 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:shadow-blue-500 transition transform hover:-translate-y-1 hover:scale-105"
                  >
                    Send
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMessageForm(false)}
                    className="px-10 py-4 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 rounded-lg px-8 py-5 font-semibold shadow-lg hover:bg-blue-100 transition transform hover:-translate-y-1 hover:scale-105 mx-auto"
                onClick={() => setShowMessageForm(true)}
                aria-label="Open message form"
              >
                <FaComment className="text-3xl" />
                Send a message about this order
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrderDetailPage;
