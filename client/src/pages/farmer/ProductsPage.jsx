"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProducts,
  deleteProduct,
} from "../../redux/slices/productSlice";
import Loader from "../../components/Loader";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaBox,
  FaEye,
} from "react-icons/fa";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { farmerProducts, loading } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(getFarmerProducts());
  }, [dispatch]);

  useEffect(() => {
    if (farmerProducts) {
      setFilteredProducts(
        farmerProducts.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [farmerProducts, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete._id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  if (loading && (!farmerProducts || farmerProducts.length === 0)) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-blue-900">My Products</h1>
          <p className="text-blue-700">Manage your product inventory</p>
        </div>
        {/* Corrected Add New Product Button */}
        <Link
          to="/farmer/products/add"
          className="mt-4 md:mt-0 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 shadow transition"
          aria-label="Add New Product"
        >
          <FaPlus />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto md:m-0">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            aria-label="Search products"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Products Table */}
      {filteredProducts.length > 0 ? (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Product",
                    "Price",
                    "Quantity",
                    "Category",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-600">
                              <FaBox className="text-xl" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-blue-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-blue-600 truncate max-w-xs">
                            {product.description.length > 50
                              ? product.description.substring(0, 50) + "..."
                              : product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-blue-900 font-semibold">
                        ₨{product.price.toFixed(2)} / {product.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div
                        className={`text-sm font-medium ${
                          product.quantityAvailable === 0
                            ? "text-red-600"
                            : product.quantityAvailable < 5
                            ? "text-orange-500"
                            : "text-blue-900"
                        }`}
                      >
                        {product.quantityAvailable} {product.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-blue-900">
                        {product.category?.name || "General"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isActive
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/products/${product._id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/farmer/products/edit/${product._id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                          aria-label={`Delete ${product.name}`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl">
          <FaBox className="text-blue-600 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-blue-900">
            No Products Found
          </h3>
          <p className="text-blue-700 mb-6">
            {searchTerm
              ? "No products match your search criteria."
              : "You haven't added any products yet."}
          </p>
          <Link
            to="/farmer/products/add"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Add Your First Product
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-blue-900">Confirm Delete</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-medium">{productToDelete?.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
