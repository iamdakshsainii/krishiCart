// pages/farmer/NewsDetailPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../assets/styles/news.css";

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles } = useSelector((state) => state.news);

  const article = articles.find((item) => item.id === Number(id));

  if (!article) {
    return <div className="news-detail">Article not found.</div>;
  }

  return (
    <div className="news-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>
      <h1>{article.titleEn}</h1>
      <p className="news-date">{article.date} | {article.source}</p>
      <img src={article.image} alt={article.titleEn} className="news-detail-image" />
      <p className="news-content">{article.contentEn}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">Read full article</a>
    </div>
  );
};

export default NewsDetailPage;
