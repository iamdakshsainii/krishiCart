import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Wheat,
  CloudRain,
  TrendingUp,
  Cpu,
  Building2,
  Newspaper,
  Star,
  Filter
} from 'lucide-react';
import { setSelectedCategory, fetchNews, resetNews } from '../redux/slices/newsSlice';
import { NEWS_CATEGORIES } from '../utils/constants';

const NewsCategories = () => {
  const dispatch = useDispatch();
  const { selectedCategory, loading } = useSelector(state => state.news);

  const categoryIcons = {
    agriculture: Wheat,
    weather: CloudRain,
    market: TrendingUp,
    technology: Cpu,
    government: Building2,
    general: Newspaper,
    trending: Star
  };

  const handleCategoryChange = (category) => {
    if (category !== selectedCategory) {
      dispatch(resetNews());
      dispatch(setSelectedCategory(category));
      dispatch(fetchNews({
        category: category === 'trending' ? 'agriculture' : category,
        page: 1
      }));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Filter className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">News Categories</h3>
      </div>

      {/* Mobile Dropdown */}
      <div className="block md:hidden mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        >
          {NEWS_CATEGORIES.map(category => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex flex-wrap gap-3">
        {NEWS_CATEGORIES.map(category => {
          const Icon = categoryIcons[category.id] || Newspaper;
          const isActive = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Icon size={18} />
              <span>{category.label}</span>
              {category.badge && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  isActive
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {category.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category Description */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600">
          {NEWS_CATEGORIES.find(cat => cat.id === selectedCategory)?.description ||
           "Stay updated with the latest news and insights for farmers and agriculture enthusiasts."}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <div className="text-lg font-bold text-blue-600">24/7</div>
          <div className="text-xs text-blue-700">Live Updates</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <div className="text-lg font-bold text-green-600">500+</div>
          <div className="text-xs text-green-700">Daily Articles</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
          <div className="text-lg font-bold text-yellow-600">98%</div>
          <div className="text-xs text-yellow-700">Accuracy Rate</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <div className="text-lg font-bold text-purple-600">10K+</div>
          <div className="text-xs text-purple-700">Trusted Readers</div>
        </div>
      </div>
    </div>
  );
};

export default NewsCategories;
