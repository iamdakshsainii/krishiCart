// "use client";
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Users,
//   MessageSquare,
//   Phone,
//   Mail,
//   MapPin,
//   Star,
//   Filter,
//   Search,
//   Heart,
//   Share,
//   MessageCircle,
//   ShoppingCart
// } from "lucide-react";
// import {
//   toggleLikePost,
//   sharePost,
//   setSelectedPost,
//   setUser
// } from "../redux/slices/farmConnectSlice";
// import CommentModal from "./farmer/CommentModal";

// const FarmerCustomerConnect = () => {
//   const dispatch = useDispatch();
//   const { posts, user } = useSelector((state) => state.farmConnect);
//   const { user: authUser } = useSelector((state) => state.auth);

//   const [activeTab, setActiveTab] = useState("marketplace");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");

//   useEffect(() => {
//     if (authUser) {
//       dispatch(
//         setUser({
//           name: authUser.name,
//           avatar: authUser.avatar || "/api/placeholder/40/40",
//           role: "customer",
//           location: authUser.location || "India"
//         })
//       );
//     } else {
//       dispatch(
//         setUser({
//           name: "Rahul Customer",
//           avatar: "/api/placeholder/40/40",
//           role: "customer",
//           location: "Delhi, India"
//         })
//       );
//     }
//   }, [dispatch, authUser]);

//   const categories = ["all", "Vegetables", "Fruits", "Grains", "Dairy", "Others"];

//   const farmers = [
//     {
//       id: 1,
//       name: "Raj Kumar Singh",
//       avatar: "/api/placeholder/60/60",
//       location: "Punjab, India",
//       rating: 4.8,
//       reviews: 156,
//       speciality: "Organic Vegetables",
//       phone: "+91-9876543210",
//       email: "raj.farmer@email.com",
//       description:
//         "Growing organic vegetables for 15+ years. Specializing in tomatoes, potatoes, and leafy greens.",
//       verified: true,
//       products: 24,
//       experience: "15 years"
//     },
//     {
//       id: 2,
//       name: "Priya Sharma",
//       avatar: "/api/placeholder/60/60",
//       location: "Haryana, India",
//       rating: 4.9,
//       reviews: 203,
//       speciality: "Fresh Fruits",
//       phone: "+91-9876543211",
//       email: "priya.farmer@email.com",
//       description:
//         "Premium fruit supplier with focus on seasonal fresh fruits and sustainable farming practices.",
//       verified: true,
//       products: 18,
//       experience: "12 years"
//     },
//     {
//       id: 3,
//       name: "Suresh Patel",
//       avatar: "/api/placeholder/60/60",
//       location: "Gujarat, India",
//       rating: 4.7,
//       reviews: 89,
//       speciality: "Grains & Pulses",
//       phone: "+91-9876543212",
//       email: "suresh.farmer@email.com",
//       description:
//         "Traditional grain farmer supplying quality wheat, rice, and various pulses to local markets.",
//       verified: true,
//       products: 12,
//       experience: "20 years"
//     }
//   ];

//   // ✅ Fixed comparison bug here
//   const filteredPosts = posts.filter((post) => {
//     if (post.type !== "product") return false;
//     const matchesSearch =
//       post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory =
//       selectedCategory === "all" || post.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   // ✅ Functions for handling actions
//   const handleLike = (postId) => {
//     dispatch(toggleLikePost({ postId, userId: authUser?.id || "guest" }));
//   };

//   const handleShareClick = (postId) => {
//     dispatch(sharePost(postId));
//     alert("Product shared successfully!");
//   };

//   const handleComment = (post) => {
//     dispatch(setSelectedPost(post));
//   };

//   const handleContact = (farmer, method) => {
//     if (method === "phone") {
//       window.open(`tel:${farmer.phone}`);
//     } else if (method === "email") {
//       window.open(`mailto:${farmer.email}`);
//     } else if (method === "message") {
//       alert(`Opening chat with ${farmer.name}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto p-4">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Farmer-Customer Connect</h1>
//               <p className="text-gray-600">
//                 Connect directly with farmers and buy fresh produce
//               </p>
//             </div>
//             <div className="flex items-center space-x-2">
//               <span className="text-sm text-gray-500">Connected as:</span>
//               <div className="flex items-center space-x-2">
//                 <img
//                   src={user?.avatar || "/api/placeholder/32/32"}
//                   alt="Profile"
//                   className="w-8 h-8 rounded-full"
//                 />
//                 <span className="font-medium">{user?.name || "User"}</span>
//                 <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
//                   {user?.role || "customer"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
//             <button
//               onClick={() => setActiveTab("marketplace")}
//               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//                 activeTab === "marketplace"
//                   ? "bg-white text-green-600 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <ShoppingCart className="h-4 w-4 inline mr-2" />
//               Marketplace
//             </button>
//             <button
//               onClick={() => setActiveTab("farmers")}
//               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//                 activeTab === "farmers"
//                   ? "bg-white text-green-600 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <Users className="h-4 w-4 inline mr-2" />
//               Find Farmers
//             </button>
//           </div>
//         </div>

//         {/* Marketplace View */}
//         {activeTab === "marketplace" && (
//           <>
//             {/* Search & Filter */}
//             <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//               <div className="flex flex-col md:flex-row md:items-center gap-4">
//                 <div className="flex-1 relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Search products, farmers..."
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg"
//                   />
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Filter className="h-4 w-4 text-gray-500" />
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="px-3 py-2 border rounded-lg"
//                   >
//                     {categories.map((category) => (
//                       <option key={category} value={category}>
//                         {category.charAt(0).toUpperCase() + category.slice(1)}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Product Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredPosts.map((post) => (
//                 <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
//                   {post.image && (
//                     <img
//                       src={post.image}
//                       alt="Product"
//                       className="w-full h-48 object-cover"
//                     />
//                   )}
//                   <div className="p-4">
//                     <div className="flex items-center space-x-2 mb-3">
//                       <img
//                         src={post.author.avatar}
//                         alt={post.author.name}
//                         className="w-8 h-8 rounded-full"
//                       />
//                       <div>
//                         <p className="font-medium text-sm">{post.author.name}</p>
//                         <div className="flex items-center space-x-1 text-xs text-gray-500">
//                           <MapPin className="h-3 w-3" />
//                           <span>{post.author.location}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <p className="text-gray-800 text-sm mb-3">{post.content}</p>
//                     <div className="flex items-center justify-between mb-4">
//                       {post.category && (
//                         <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
//                           {post.category}
//                         </span>
//                       )}
//                       {post.price && (
//                         <span className="font-bold text-green-600">{post.price}</span>
//                       )}
//                     </div>
//                     <div className="flex items-center justify-between text-sm border-t pt-3">
//                       <div className="flex items-center space-x-4">
//                         <button
//                           onClick={() => handleLike(post.id)}
//                           className={`flex items-center space-x-1 ${
//                             post.likes.includes(authUser?.id)
//                               ? "text-red-500"
//                               : "text-gray-500"
//                           }`}
//                         >
//                           <Heart
//                             className={`h-4 w-4 ${
//                               post.likes.includes(authUser?.id)
//                                 ? "fill-current"
//                                 : ""
//                             }`}
//                           />
//                           <span>{post.likes.length}</span>
//                         </button>
//                         <button
//                           onClick={() => handleComment(post)}
//                           className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
//                         >
//                           <MessageCircle className="h-4 w-4" />
//                           <span>{post.comments.length}</span>
//                         </button>
//                         <button
//                           onClick={() => handleShareClick(post.id)}
//                           className="flex items-center space-x-1 text-gray-500 hover:text-green-500"
//                         >
//                           <Share className="h-4 w-4" />
//                           <span>{post.shares}</span>
//                         </button>
//                       </div>
//                       <button className="bg-green-600 text-white px-4 py-1 rounded text-xs">
//                         Contact Farmer
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {/* Farmers View */}
//         {activeTab === "farmers" && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//             {farmers.map((farmer) => (
//               <div key={farmer.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md">
//                 <div className="flex items-center space-x-4 mb-4">
//                   <img
//                     src={farmer.avatar}
//                     alt={farmer.name}
//                     className="w-16 h-16 rounded-full"
//                   />
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-2">
//                       <h3 className="font-semibold">{farmer.name}</h3>
//                       {farmer.verified && (
//                         <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                           Verified
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex items-center text-sm text-gray-500">
//                       <MapPin className="h-3 w-3 mr-1" />
//                       {farmer.location}
//                     </div>
//                     <div className="flex items-center text-sm">
//                       <Star className="h-4 w-4 text-yellow-400 fill-current" />
//                       <span className="font-medium">{farmer.rating}</span>
//                       <span className="text-gray-500">({farmer.reviews} reviews)</span>
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-sm text-green-600">{farmer.speciality}</p>
//                 <p className="text-sm text-gray-600 mb-4">{farmer.description}</p>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handleContact(farmer, "message")}
//                     className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center"
//                   >
//                     <MessageSquare className="h-4 w-4 mr-1" /> Message
//                   </button>
//                   <button
//                     onClick={() => handleContact(farmer, "phone")}
//                     className="bg-blue-600 text-white p-2 rounded-lg"
//                   >
//                     <Phone className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => handleContact(farmer, "email")}
//                     className="bg-gray-600 text-white p-2 rounded-lg"
//                   >
//                     <Mail className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Comment Modal */}
//       <CommentModal />
//     </div>
//   );
// };

// export default FarmerCustomerConnect;
