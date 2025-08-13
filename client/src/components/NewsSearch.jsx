import React, { useState } from "react";
import "../assets/styles/news.css";

const NewsSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form className="news-search" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search agriculture news..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default NewsSearch;
