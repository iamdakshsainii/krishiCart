import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  X,
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  History,
  Sparkles,
  Mic,
  Globe
} from 'lucide-react';
import {
  setSearchTerm,
  fetchNews,
  resetNews,
  selectNews
} from '../redux/slices/newsSlice';
import { NEWS_CATEGORIES } from '../utils/constants';
import { getFromLocalStorage, saveToLocalStorage, debounce } from '../utils/newsUtils';

const NewsSearch = ({ placeholder = "Search agriculture news..." }) => {
  const dispatch = useDispatch();
  const { searchTerm, selectedCategory, loading } = useSelector(selectNews);

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [sortBy, setSortBy] = useState('publishedAt');
  const [searchHistory, setSearchHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const recognitionRef = useRef(null);

  // Popular search suggestions based on agriculture
  const popularSuggestions = [
    'Crop prices today',
    'Weather forecast farming',
    'Agricultural subsidies 2025',
    'Organic farming techniques',
    'Irrigation technology',
    'Pest management',
    'Harvest season updates',
    'Government farming schemes',
    'Agricultural loans',
    'Smart farming IoT',
    'Climate change agriculture',
    'Sustainable farming practices'
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setLocalSearchTerm(transcript);
        handleSearch(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Load search history on component mount
  useEffect(() => {
    const history = getFromLocalStorage('searchHistory', []);
    setSearchHistory(history);
  }, []);

  // Sync local search term with Redux state
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounced search functionality
  const debouncedSearch = debounce((term) => {
    if (term.trim() && term !== searchTerm) {
      handleSearch(term);
    }
  }, 500);

  useEffect(() => {
    if (localSearchTerm !== searchTerm) {
      debouncedSearch(localSearchTerm);
    }
  }, [localSearchTerm, searchTerm, debouncedSearch]);

  // Handle search execution
  const handleSearch = (term = localSearchTerm) => {
    const trimmedTerm = term.trim();

    dispatch(setSearchTerm(trimmedTerm));

    if (trimmedTerm) {
      // Add to search history
      const newHistory = [trimmedTerm, ...searchHistory.filter(item => item !== trimmedTerm)];
      const limitedHistory = newHistory.slice(0, 10); // Keep only last 10 searches
      setSearchHistory(limitedHistory);
      saveToLocalStorage('searchHistory', limitedHistory);

      // Fetch news with search term
      dispatch(fetchNews({
        category: selectedCategory,
        page: 1,
        searchTerm: trimmedTerm,
        sortBy,
        dateRange: dateRange.from && dateRange.to ? dateRange : null
      }));
    } else {
      // If empty search, reset to category news
      dispatch(fetchNews({
        category: selectedCategory,
        page: 1,
        searchTerm: ''
      }));
    }

    setShowSuggestions(false);
    searchInputRef.current?.blur();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);

    if (value.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    dispatch(setSearchTerm(''));
    dispatch(resetNews());
    setShowSuggestions(false);

    // Fetch category news without search term
    dispatch(fetchNews({
      category: selectedCategory,
      page: 1,
      searchTerm: ''
    }));

    searchInputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalSearchTerm(suggestion);
    handleSearch(suggestion);
  };

  const handleVoiceSearch = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Voice search error:', error);
      }
    }
  };

  const handleDateRangeChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);

    if (localSearchTerm.trim() || newDateRange.from || newDateRange.to) {
      handleSearch();
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    if (localSearchTerm.trim()) {
      handleSearch();
    }
  };

  const getFilteredSuggestions = () => {
    if (!localSearchTerm) return [];

    const term = localSearchTerm.toLowerCase();
    const historySuggestions = searchHistory
      .filter(item => item.toLowerCase().includes(term))
      .slice(0, 3);

    const popularFiltered = popularSuggestions
      .filter(item => item.toLowerCase().includes(term))
      .slice(0, 5);

    return [...historySuggestions, ...popularFiltered];
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !searchInputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="news-search">
      <div className="search-container">
        {/* Main Search Input */}
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />

          <input
            ref={searchInputRef}
            type="text"
            value={localSearchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => localSearchTerm && setShowSuggestions(true)}
            placeholder={placeholder}
            className="search-input"
            disabled={loading}
          />

          {/* Voice Search Button */}
          {recognitionRef.current && (
            <button
              onClick={handleVoiceSearch}
              className={`voice-search-btn ${isListening ? 'listening' : ''}`}
              disabled={isListening}
              title="Voice search"
            >
              <Mic size={18} />
            </button>
          )}

          {/* Clear Button */}
          {localSearchTerm && (
            <button
              onClick={handleClearSearch}
              className="clear-search-btn"
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}

          {/* Advanced Filter Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`advanced-filter-btn ${showAdvanced ? 'active' : ''}`}
            title="Advanced filters"
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Search Button */}
        <button
          onClick={() => handleSearch()}
          className={`search-btn ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>
                <Calendar size={16} />
                From Date
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => handleDateRangeChange('from', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="filter-group">
              <label>
                <Calendar size={16} />
                To Date
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => handleDateRangeChange('to', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                min={dateRange.from}
              />
            </div>

            <div className="filter-group">
              <label>
                <Clock size={16} />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="publishedAt">Latest First</option>
                <option value="relevancy">Most Relevant</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestions && (
        <div ref={suggestionsRef} className="search-suggestions">
          {/* Search History */}
          {searchHistory.length > 0 && !localSearchTerm && (
            <div className="suggestion-section">
              <div className="suggestion-header">
                <History size={16} />
                <span>Recent Searches</span>
              </div>
              {searchHistory.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className="suggestion-item history"
                >
                  <Clock size={14} />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* Filtered Suggestions */}
          {localSearchTerm && getFilteredSuggestions().length > 0 && (
            <div className="suggestion-section">
              <div className="suggestion-header">
                <Sparkles size={16} />
                <span>Suggestions</span>
              </div>
              {getFilteredSuggestions().map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  <Search size={14} />
                  <span dangerouslySetInnerHTML={{
                    __html: suggestion.replace(
                      new RegExp(localSearchTerm, 'gi'),
                      `<mark>$&</mark>`
                    )
                  }} />
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {!localSearchTerm && (
            <div className="suggestion-section">
              <div className="suggestion-header">
                <TrendingUp size={16} />
                <span>Popular Searches</span>
              </div>
              {popularSuggestions.slice(0, 6).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="suggestion-item popular"
                >
                  <TrendingUp size={14} />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Results Info */}
      {searchTerm && (
        <div className="search-results-info">
          <div className="results-text">
            {loading ? (
              <span>Searching for "{searchTerm}"...</span>
            ) : (
              <span>Search results for "{searchTerm}"</span>
            )}
          </div>

          <button
            onClick={handleClearSearch}
            className="clear-results-btn"
          >
            <X size={16} />
            Clear search
          </button>
        </div>
      )}

      {/* Voice Search Indicator */}
      {isListening && (
        <div className="voice-indicator">
          <div className="voice-animation">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
          <span>Listening... Speak now</span>
        </div>
      )}
    </div>
  );
};

export default NewsSearch;
