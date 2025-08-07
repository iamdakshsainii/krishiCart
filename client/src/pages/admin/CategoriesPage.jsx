/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../redux/slices/categorySlice";
import Loader from "../../components/Loader";
import { FaPlus, FaEdit, FaTrash, FaLeaf, FaTags } from "react-icons/fa";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, success } = useSelector(
    (state) => state.categories
  );

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success && showModal) {
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        icon: "",
      });
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddClick = () => {
    setModalMode("add");
    setFormData({
      name: "",
      description: "",
      icon: "",
    });
    setShowModal(true);
  };

  const handleEditClick = (category) => {
    setModalMode("edit");
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
    });
    setShowModal(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      dispatch(createCategory(formData));
    } else {
      dispatch(
        updateCategory({ id: currentCategory._id, categoryData: formData })
      );
    }
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete._id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const categoryList = Array.isArray(categories) ? categories : [];

  if (loading && categoryList.length === 0) {
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
                <FaTags className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
                <p className="text-gray-600 mt-1">Organize and manage your product categories</p>
              </div>
            </div>
            <button
              onClick={handleAddClick}
              className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaPlus className="text-sm" />
              <span>Add New Category</span>
            </button>
          </div>
        </div>

        {/* Categories List */}
        {categoryList.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
              <h2 className="text-xl font-semibold text-white">All Categories ({categoryList.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50 border-b border-blue-100">
                  <tr>
                    <th className="text-left px-8 py-4 text-sm font-semibold text-blue-900 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left px-8 py-4 text-sm font-semibold text-blue-900 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-right px-8 py-4 text-sm font-semibold text-blue-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {categoryList.map((category, index) => (
                    <tr key={category._id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                            {category.icon ? (
                              <span className="text-blue-600 text-lg">
                                {category.icon}
                              </span>
                            ) : (
                              <FaLeaf className="text-blue-500 text-lg" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-lg">
                              {category.name}
                            </div>
                            <div className="text-sm text-blue-600">
                              Category #{index + 1}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-gray-600 max-w-md leading-relaxed">
                          {category.description || (
                            <span className="text-gray-400 italic">No description provided</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(category)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                            title="Edit Category"
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(category)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete Category"
                          >
                            <FaTrash className="text-lg" />
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
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 text-center py-16 px-8">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaTags className="text-blue-500 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Categories Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Get started by creating your first category to organize your products effectively.
              </p>
              <button
                onClick={handleAddClick}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create First Category
              </button>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 rounded-t-2xl">
                <h3 className="text-xl font-bold text-white">
                  {modalMode === "add" ? "Create New Category" : "Edit Category"}
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="p-8">
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Category Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter category description (optional)"
                  ></textarea>
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="icon"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Icon (emoji or symbol)
                  </label>
                  <input
                    type="text"
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 🌱, 🥕, 🍎"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : modalMode === "add"
                      ? "Create Category"
                      : "Update Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300">
              <div className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaTrash className="text-red-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Confirm Deletion</h3>
                <p className="text-gray-600 text-center mb-8">
                  Are you sure you want to delete the category{" "}
                  <span className="font-semibold text-gray-900">"{categoryToDelete?.name}"</span>?
                  <br />
                  <span className="text-sm text-red-500">This action cannot be undone.</span>
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium transition-all duration-200 shadow-lg"
                  >
                    Delete Category
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

export default CategoriesPage;
