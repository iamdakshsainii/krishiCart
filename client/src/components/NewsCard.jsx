import { Calendar, Heart, Volume2, ExternalLink, Play, Pause, Share2, Eye, Clock, TrendingUp, Star } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function NewsCard({ article, onOpen }) {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [views, setViews] = useState(Math.floor(Math.random() * 1000) + 50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Calculate reading time
    const wordsPerMinute = 200;
    const words = (article.titleEn + ' ' + article.summaryEn).split(' ').length;
    setReadingTime(Math.max(1, Math.ceil(words / wordsPerMinute)));
  }, [article]);

  const toggleSave = () => {
    setSaved(!saved);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.titleEn,
          text: article.summaryEn,
          url: article.url,
        });
      } else {
        await navigator.clipboard.writeText(article.url);
        // You could add a toast notification here
      }
    } catch (error) {
      console.log('Sharing failed', error);
    }
  };

  const speak = (text) => {
    try {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleCardClick = () => {
    setViews(prev => prev + 1);
    onOpen(article);
  };

  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      technology: 'from-blue-500 to-blue-600',
      business: 'from-blue-400 to-blue-500',
      sports: 'from-blue-600 to-indigo-500',
      entertainment: 'from-indigo-500 to-blue-600',
      health: 'from-blue-500 to-cyan-500',
      politics: 'from-indigo-600 to-blue-700',
      default: 'from-blue-500 to-blue-600'
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  const getPriorityLevel = () => {
    // Simulate priority based on views and recency
    if (views > 500) return 'high';
    if (views > 200) return 'medium';
    return 'low';
  };

  const priorityLevel = getPriorityLevel();

  return (
    <article className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden cursor-pointer border border-blue-100 hover:border-blue-200 hover:-translate-y-1 transform-gpu will-change-transform">

      {/* Priority indicator */}
      {priorityLevel === 'high' && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-500 rounded-full shadow-lg">
            <TrendingUp size={10} className="text-white" />
            <span className="text-xs font-bold text-white">HOT</span>
          </div>
        </div>
      )}

      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-100/50 via-blue-200/50 to-blue-100/50 animate-pulse" />
      </div>

      {/* Image Container */}
      <div className="relative overflow-hidden">
        <div className={`w-full h-56 bg-gradient-to-br ${getCategoryColor(article.category)} ${!imageLoaded ? 'animate-pulse' : ''}`}>
          <img
            src={article.image}
            alt={article.titleEn}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onClick={handleCardClick}
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Category and reading time */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${getCategoryColor(article.category)} text-white shadow-md`}>
            {article.category}
          </span>
          <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-blue-600 text-xs font-medium">
            <Clock size={10} />
            {readingTime} min
          </div>
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white text-xs">
          <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-full">
            <Eye size={10} />
            {views}
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-full">
            <Calendar size={10} />
            {formatDate(article.date)}
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            title="Share article"
          >
            <Share2 size={14} className="text-blue-600" />
          </button>
          <button
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              speak(`${article.titleEn}. ${article.summaryEn}`);
            }}
            title={isPlaying ? "Stop reading" : "Read aloud"}
          >
            {isPlaying ? (
              <Pause size={14} className="text-blue-600" />
            ) : (
              <Play size={14} className="text-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative p-6 space-y-4" onClick={handleCardClick}>
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-all duration-300">
          {article.titleEn}
        </h3>

        {/* Summary */}
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {article.summaryEn}
        </p>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-blue-100">
          {/* Left actions */}
          <div className="flex items-center gap-2">
            <button
              className={`group/btn flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                liked
                  ? "bg-blue-50 text-blue-600"
                  : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLike();
              }}
            >
              <Heart
                size={16}
                className={`transition-all duration-300 ${liked ? 'fill-current' : 'group-hover/btn:scale-110'}`}
              />
              Like
            </button>

            <button
              className={`group/btn flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                saved
                  ? "bg-blue-50 text-blue-600"
                  : "bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleSave();
              }}
            >
              <Star
                size={16}
                className={`transition-all duration-300 ${saved ? 'fill-current' : 'group-hover/btn:scale-110'}`}
              />
              Save
            </button>
          </div>

          {/* Read more button */}
          <a
            className="group/link flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Read More
            <ExternalLink size={14} className="group-hover/link:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>

      {/* Enhanced shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-blue-200/30 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-1000 ease-out" />
        </div>
      </div>
    </article>
  );
}
