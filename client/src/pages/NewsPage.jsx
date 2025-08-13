import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews, setCategory, setQuery, toggleBookmark } from "../redux/slices/newsSlice";
import NewsCard from "../components/NewsCard";
import NewsTicker from "../components/NewsTicker";
import LanguageToggle from "../components/LanguageToggle";
import "../assets/styles/news.css";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "government", label: "Govt Policy" },
  { key: "market", label: "Market" },
  { key: "technology", label: "Tech" },
  { key: "weather", label: "Weather" },
];

export default function NewsPage() {
  const dispatch = useDispatch();
  const { articles, loading, error, activeCategory, language, page, hasMore, headlines, bookmarks, query } =
    useSelector((s) => s.news);

  const [showBookmarks, setShowBookmarks] = useState(false);

  // initial + refresh on deps
  useEffect(() => {
    dispatch(fetchNews({ category: activeCategory, language, page: 1 }));
  }, [dispatch, activeCategory, language]);

  // infinite scroll
  const sentinelRef = useRef(null);
  const onIntersect = useCallback((entries) => {
    if (entries[0].isIntersecting && !loading && hasMore && !showBookmarks) {
      dispatch(fetchNews({ category: activeCategory, query, language, page: page + 1 }));
    }
  }, [loading, hasMore, dispatch, activeCategory, language, page, showBookmarks, query]);

  useEffect(() => {
    const obs = new IntersectionObserver(onIntersect, { rootMargin: "200px" });
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [onIntersect]);

  const handleCategory = (key) => {
    dispatch(setCategory(key === "all" ? null : key));
  };

  const [searchInput, setSearchInput] = useState("");
  const doSearch = (e) => {
    e.preventDefault();
    dispatch(setQuery(searchInput.trim()));
    dispatch(fetchNews({ query: searchInput.trim(), language, page: 1 }));
  };

  const list = showBookmarks ? bookmarks : articles;

  return (
    <div className="min-h-screen">
      {/* Ticker */}
      <NewsTicker items={headlines} />

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold">KrishiCart News</h1>
        <div className="flex items-center gap-3">
          <button
            className={`px-3 py-1 rounded-full text-sm border ${showBookmarks ? "bg-green-600 text-white border-green-600" : "bg-white dark:bg-gray-800"}`}
            onClick={() => setShowBookmarks((s) => !s)}
          >
            {showBookmarks ? "Showing Bookmarks" : "Show Bookmarks"}
          </button>
          <LanguageToggle />
        </div>
      </div>

      {/* Categories + Search */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((c) => {
            const active = (activeCategory || "all") === c.key;
            return (
              <button
                key={c.key}
                onClick={() => handleCategory(c.key)}
                className={`px-3 py-1 rounded-full text-sm border ${active ? "bg-green-600 text-white border-green-600" : "bg-white dark:bg-gray-800"}`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={doSearch} className="mb-6">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full md:w-2/3 border rounded-xl px-4 py-2 outline-none dark:bg-gray-800"
            placeholder="Search agriculture news (e.g., 'wheat prices', 'monsoon')"
          />
        </form>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {error && <p className="text-red-600 mb-4">Error: {error}</p>}

        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <NewsCard key={a.id} article={a} onOpen={() => window.open(a.url, "_blank")} />
          ))}
        </div>

        {/* Loader / Sentinel */}
        <div ref={sentinelRef} className="h-12 flex items-center justify-center">
          {loading && <span className="text-gray-500">Loading…</span>}
          {!hasMore && !showBookmarks && <span className="text-gray-400 text-sm">You’re all caught up.</span>}
          {showBookmarks && !bookmarks.length && <span className="text-gray-400 text-sm">No bookmarks yet.</span>}
        </div>
      </div>
    </div>
  );
}
