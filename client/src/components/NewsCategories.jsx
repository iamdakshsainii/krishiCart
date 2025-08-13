import React from "react";
import { NEWS_CATEGORIES } from "../utils/constants";
import "../assets/styles/news.css";

const NewsCategories = ({ onSelect, activeCategory }) => {
  return (
    <div className="news-categories">
      {NEWS_CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          className={activeCategory === cat.key ? "active" : ""}
          onClick={() => onSelect(cat.key)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default NewsCategories;
