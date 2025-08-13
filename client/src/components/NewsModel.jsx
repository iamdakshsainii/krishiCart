import React from "react";
import "../assets/styles/news.css";

const NewsModal = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2>{article.titleEn}</h2>
        <p className="news-date">{article.date} | {article.source}</p>
        <img src={article.image} alt={article.titleEn} />
        <p>{article.contentEn}</p>
      </div>
    </div>
  );
};

export default NewsModal;
