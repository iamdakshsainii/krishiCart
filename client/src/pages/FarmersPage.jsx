"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";
import {
  FaSearch,
  FaSeedling,
  FaUsers,
  FaFilter,
  FaMapMarkerAlt,
  FaChevronDown
} from "react-icons/fa";

const FarmersPage = () => {
  const dispatch = useDispatch();
  const { farmers, loading } = useSelector((state) => state.farmers);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
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

  // Unique locations for filter dropdown
  const locations = farmers
    ? [...new Set(farmers.map((f) => f.address?.city).filter(Boolean))]
    : [];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full px-6 py-3 mb-8 border border-white/30 hover:bg-white/25 transition-all duration-300">
            <FaUsers className="text-blue-200" />
            <span className="uppercase tracking-wider">Meet Our Community</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-100">
              Farmers
            </span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-10 opacity-90">
            Connect with passionate local farmers who are dedicated to bringing you the freshest,
            highest quality produce while supporting sustainable agriculture practices.
          </p>
          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
              <div className="text-3xl font-black text-white mb-1">{farmers?.length || 0}+</div>
              <div className="text-blue-200 font-medium text-sm">Active Farmers</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
              <div className="text-3xl font-black text-white mb-1">100%</div>
              <div className="text-blue-200 font-medium text-sm">Verified</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
              <div className="text-3xl font-black text-white mb-1">24/7</div>
              <div className="text-blue-200 font-medium text-sm">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters Section */}
      <section className="py-16 bg-white/90 backdrop-blur-sm border-b border-blue-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-blue-600/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-white border-2 border-blue-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-blue-300">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <FaSearch className="text-blue-500 text-xl group-hover:text-blue-600 transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search farmers by name..."
                  className="w-full px-6 py-6 pl-16 bg-transparent text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-0 text-lg font-medium"
                />
              </div>
            </div>
            <div className="md:col-span-4 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-blue-600/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-white border-2 border-blue-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-blue-300">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-blue-500 text-lg group-hover:text-blue-600 transition-colors duration-300" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                  <FaChevronDown className="text-blue-400 text-sm" />
                </div>
                <select
                  value={locationFilter}
                  onChange={handleLocationChange}
                  className="w-full px-6 py-6 pl-16 pr-12 bg-transparent text-blue-900 focus:outline-none focus:ring-0 text-lg font-medium appearance-none cursor-pointer"
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
            <div className="md:col-span-2">
              <button className="group w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-6 rounded-3xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 border-2 border-transparent hover:border-blue-400">
                <FaFilter className="group-hover:rotate-12 transition-transform duration-300" />
                <span>Filter</span>
              </button>
            </div>
          </div>
          {(searchTerm || locationFilter) && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-blue-800 font-semibold flex items-center gap-2">
                  <FaFilter className="text-blue-600" />
                  Active filters:
                </span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-2 bg-white text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-blue-200 hover:bg-blue-50 transition-colors duration-200">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="hover:bg-blue-100 rounded-full p-1 transition-colors duration-200 ml-1"
                      aria-label="Clear search filter"
                    >
                      <span className="text-blue-600 font-bold">×</span>
                    </button>
                  </span>
                )}
                {locationFilter && (
                  <span className="inline-flex items-center gap-2 bg-white text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-blue-200 hover:bg-blue-50 transition-colors duration-200">
                    Location: {locationFilter}
                    <button
                      onClick={() => setLocationFilter("")}
                      className="hover:bg-blue-100 rounded-full p-1 transition-colors duration-200 ml-1"
                      aria-label="Clear location filter"
                    >
                      <span className="text-blue-600 font-bold">×</span>
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Farmers Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {filteredFarmers.length > 0 ? (
            <>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-6 py-3 rounded-full text-sm font-semibold mb-4">
                  <FaSeedling className="text-blue-600" />
                  <span>{filteredFarmers.length} Farmers Available</span>
                </div>
                <h2 className="text-4xl font-black text-blue-900 mb-6">
                  Meet Our Amazing Farmers
                </h2>
                <p className="text-blue-700 text-lg max-w-2xl mx-auto leading-relaxed">
                  Discover passionate farmers in your area who are dedicated to quality and sustainability
                </p>
              </div>
              <div className="
                grid
                grid-cols-1
                sm:grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-8
              ">
                {filteredFarmers.map((farmer, index) => (
                  <div
                    key={farmer._id}
                    className="transform hover:scale-105 transition-all duration-300"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <FarmerCard farmer={farmer} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-blue-600/30 rounded-full blur-3xl"></div>
                <div className="relative w-40 h-40 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white">
                  <FaSeedling className="text-blue-600 text-5xl" />
                </div>
              </div>
              <h3 className="text-4xl font-black text-blue-900 mb-6">
                No Farmers Found
              </h3>
              <p className="text-blue-700 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                We couldn't find any farmers matching your search criteria.
                Try adjusting your filters or search terms to discover amazing local farmers.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("");
                  }}
                  className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-400"
                >
                  Clear All Filters
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-105">
                  Browse All Categories
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {(!isAuthenticated || user?.role !== "farmer") && (
        <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
          </div>
          <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
              <h2 className="text-5xl font-black mb-6">
                Are You a Farmer?
              </h2>
              <p className="text-xl text-blue-200 mb-10 leading-relaxed">
                Join our community of successful farmers and start connecting with customers who value quality and sustainability.
              </p>
              <button
                type="button"
                className="bg-white text-blue-700 px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200"
              >
                Join as a Farmer
              </button>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FarmersPage;
