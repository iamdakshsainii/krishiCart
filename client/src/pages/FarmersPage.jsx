"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";
import { FaSearch, FaSeedling, FaUsers, FaFilter, FaMapMarkerAlt } from "react-icons/fa";

const FarmersPage = () => {
  const dispatch = useDispatch();
  const { farmers, loading } = useSelector((state) => state.farmers);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    dispatch(getAllFarmers());
  }, [dispatch]);

  useEffect(() => {
    if (farmers) {
      let filtered = farmers.filter((farmer) =>
        farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (locationFilter) {
        filtered = filtered.filter(
          (farmer) =>
            farmer.address?.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
            farmer.address?.state?.toLowerCase().includes(locationFilter.toLowerCase())
        );
      }

      setFilteredFarmers(filtered);
    }
  }, [farmers, searchTerm, locationFilter]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleLocationChange = (e) => setLocationFilter(e.target.value);

  if (loading) {
    return <Loader />;
  }

  // Unique locations for filter dropdown
  const locations = farmers
    ? [...new Set(farmers.map((f) => f.address?.city).filter(Boolean))]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Header */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full px-6 py-3 mb-6 border border-white/30">
              <FaUsers className="text-blue-200" />
              <span className="uppercase tracking-wide">Meet Our Community</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white"> Farmers</span>
            </h1>

            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Connect with passionate local farmers who are dedicated to bringing you the freshest,
              highest quality produce while supporting sustainable agriculture practices.
            </p>

            {/* Stats */}
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-black text-white">{farmers?.length || 0}+</div>
                <div className="text-blue-200 font-medium">Active Farmers</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-white">100%</div>
                <div className="text-blue-200 font-medium">Verified</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-white">24/7</div>
                <div className="text-blue-200 font-medium">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-12 bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search Bar */}
              <div className="md:col-span-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-2xl blur opacity-50"></div>
                <div className="relative bg-white/90 backdrop-blur-lg border border-blue-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <FaSearch className="text-blue-600 text-xl" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search farmers by name..."
                    className="w-full px-6 py-5 pl-16 bg-transparent text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-0 text-lg font-medium"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div className="md:col-span-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-2xl blur opacity-50"></div>
                <div className="relative bg-white/90 backdrop-blur-lg border border-blue-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-blue-600 text-lg" />
                  </div>
                  <select
                    value={locationFilter}
                    onChange={handleLocationChange}
                    className="w-full px-6 py-5 pl-16 bg-transparent text-blue-900 focus:outline-none focus:ring-0 text-lg font-medium appearance-none cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Button */}
              <div className="md:col-span-2">
                <button className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                  <FaFilter className="group-hover:rotate-12 transition-transform duration-300" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || locationFilter) && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-blue-800 font-medium">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="hover:bg-blue-200 rounded-full p-1 transition-colors duration-200"
                      aria-label="Clear search filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {locationFilter && (
                  <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    Location: {locationFilter}
                    <button
                      onClick={() => setLocationFilter("")}
                      className="hover:bg-blue-200 rounded-full p-1 transition-colors duration-200"
                      aria-label="Clear location filter"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Farmers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {filteredFarmers.length > 0 ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">
                  {filteredFarmers.length} Farmers Found
                </h2>
                <p className="text-blue-700 text-lg">
                  Discover amazing farmers in your area who are passionate about quality and sustainability
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredFarmers.map((farmer) => (
                  <div
                    key={farmer._id}
                    className="transform hover:scale-105 transition-transform duration-300"
                  >
                    <FarmerCard farmer={farmer} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-full blur-2xl"></div>
                <div className="relative w-32 h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <FaSeedling className="text-blue-600 text-4xl" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-blue-900 mb-4">
                No Farmers Found
              </h3>
              <p className="text-blue-700 text-lg mb-8 max-w-2xl mx-auto">
                We couldn't find any farmers matching your search criteria.
                Try adjusting your filters or search terms to discover amazing local farmers.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Clear All Filters
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-600 hover:text-white">
                  Browse All Categories
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl font-black mb-6">
            Are You a Farmer?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Join our community of successful farmers and start connecting with customers who value quality and sustainability.
          </p>
          <button
            type="button"
            className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Join as a Farmer
          </button>
        </div>
      </section>
    </div>
  );
};

export default FarmersPage;
