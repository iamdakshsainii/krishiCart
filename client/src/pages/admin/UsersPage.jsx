"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllUsers, deleteUser } from "../../redux/slices/userSlice"
import Loader from "../../components/Loader"
import { FaSearch, FaUserEdit, FaTrash, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUsers, FaEye, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { GiFarmer } from "react-icons/gi"
import { FaUserCheck } from "react-icons/fa6"

const UsersPage = () => {
  const dispatch = useDispatch()
  const { users, loading } = useSelector((state) => state.users)

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(null)

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])

  useEffect(() => {
    if (users) {
      let filtered = [...users]

      // Apply role filter
      if (roleFilter !== "all") {
        filtered = filtered.filter((user) => user.role === roleFilter)
      }

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      setFilteredUsers(filtered)
    }
  }, [users, searchTerm, roleFilter])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value)
  }

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete._id))
      setShowDeleteModal(false)
      setUserToDelete(null)
    }
  }

  const toggleUserDetails = (userId) => {
    if (showUserDetails === userId) {
      setShowUserDetails(null)
    } else {
      setShowUserDetails(userId)
    }
  }

  const getUserRoleCount = (role) => {
    return users.filter(user => user.role === role).length;
  }

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  if (loading && users.length === 0) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="container mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <FaUsers className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                <p className="text-gray-600 mt-1">Manage platform users and their roles</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-gray-500">Total Users</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                <FaUsers className="text-blue-600 text-lg" />
              </div>
              <div>
                <p className="text-blue-700 font-medium text-sm">All Users</p>
                <p className="text-2xl font-bold text-blue-800">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                <GiFarmer className="text-green-600 text-lg" />
              </div>
              <div>
                <p className="text-green-700 font-medium text-sm">Farmers</p>
                <p className="text-2xl font-bold text-green-800">{getUserRoleCount('farmer')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl">
                <FaUserCheck className="text-purple-600 text-lg" />
              </div>
              <div>
                <p className="text-purple-700 font-medium text-sm">Consumers</p>
                <p className="text-2xl font-bold text-purple-800">{getUserRoleCount('consumer')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl">
                <FaUsers className="text-orange-600 text-lg" />
              </div>
              <div>
                <p className="text-orange-700 font-medium text-sm">Admins</p>
                <p className="text-2xl font-bold text-orange-800">{getUserRoleCount('admin')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search users by name or email..."
                  className="w-full px-4 py-3 pl-12 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-blue-400" />
                </div>
              </div>
            </div>

            {/* Role Filter */}
            <div className="md:w-1/4">
              <select
                value={roleFilter}
                onChange={handleRoleFilterChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Roles ({users.length})</option>
                <option value="consumer">Consumers ({getUserRoleCount('consumer')})</option>
                <option value="farmer">Farmers ({getUserRoleCount('farmer')})</option>
                <option value="admin">Admins ({getUserRoleCount('admin')})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
              <h2 className="text-xl font-semibold text-white">
                Users ({filteredUsers.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50 border-b border-blue-100">
                  <tr>
                    <th className="text-left px-8 py-4 text-sm font-semibold text-blue-900 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-center px-8 py-4 text-sm font-semibold text-blue-900 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-center px-8 py-4 text-sm font-semibold text-blue-900 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="text-right px-8 py-4 text-sm font-semibold text-blue-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {filteredUsers.map((user) => (
                    <React.Fragment key={user._id}>
                      <tr className="hover:bg-blue-50 transition-colors duration-150">
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center mr-4 shadow-sm">
                              <span className="text-blue-700 font-bold text-sm">
                                {getUserInitials(user.name)}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-lg">{user.name}</div>
                              <div className="text-sm text-blue-600">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span
                            className={`px-3 py-2 inline-flex text-sm font-semibold rounded-xl ${
                              user.role === "admin"
                                ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800"
                                : user.role === "farmer"
                                ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                                : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800"
                            }`}
                          >
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center text-gray-600 font-medium">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => toggleUserDetails(user._id)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200 flex items-center space-x-1"
                              title="View Details"
                            >
                              <FaEye className="text-lg" />
                              {showUserDetails === user._id ? (
                                <FaChevronUp className="text-sm" />
                              ) : (
                                <FaChevronDown className="text-sm" />
                              )}
                            </button>
                            {user.role !== "admin" && (
                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Delete User"
                              >
                                <FaTrash className="text-lg" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {showUserDetails === user._id && (
                        <tr className="bg-gradient-to-r from-blue-50 to-white">
                          <td colSpan="4" className="px-8 py-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h4 className="font-semibold text-gray-900 text-lg flex items-center space-x-2">
                                    <FaEnvelope className="text-blue-500" />
                                    <span>Contact Information</span>
                                  </h4>
                                  <div className="space-y-3 pl-6">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                      <div>
                                        <span className="text-gray-500 text-sm">Email:</span>
                                        <p className="font-medium text-gray-900">{user.email}</p>
                                      </div>
                                    </div>
                                    {user.phone && (
                                      <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <div>
                                          <span className="text-gray-500 text-sm">Phone:</span>
                                          <p className="font-medium text-gray-900">{user.phone}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {user.address && (
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 text-lg flex items-center space-x-2">
                                      <FaMapMarkerAlt className="text-blue-500" />
                                      <span>Address</span>
                                    </h4>
                                    <div className="space-y-2 pl-6">
                                      <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                                        <div>
                                          {user.address.street && (
                                            <p className="font-medium text-gray-900">{user.address.street}</p>
                                          )}
                                          {user.address.city && user.address.state && (
                                            <p className="text-gray-600">
                                              {user.address.city}, {user.address.state} {user.address.zipCode}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 text-center py-16 px-8">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-blue-500 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {roleFilter !== "all" || searchTerm
                  ? "No users match your current search and filter criteria. Try adjusting your filters or search terms."
                  : "No users are registered in the system yet."}
              </p>
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
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Confirm User Deletion</h3>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-center text-gray-700">
                    Are you sure you want to delete user{" "}
                    <span className="font-semibold text-gray-900">"{userToDelete?.name}"</span>?
                  </p>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Email: {userToDelete?.email}
                  </p>
                  <p className="text-center text-sm text-red-600 mt-3 font-medium">
                    This action cannot be undone.
                  </p>
                </div>
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
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersPage
