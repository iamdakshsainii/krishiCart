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
      technology: 'from-blue-500 to-cyan-500',
      business: 'from-green-500 to-emerald-500',
      sports: 'from-orange-500 to-red-500',
      entertainment: 'from-purple-500 to-pink-500',
      health: 'from-teal-500 to-green-500',
      politics: 'from-indigo-500 to-blue-500',
      default: 'from-gray-500 to-gray-600'
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
    <article className="group relative bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden cursor-pointer border border-gray-200/50 dark:border-gray-700/50 hover:border-transparent hover:-translate-y-3 hover:scale-[1.02] transform-gpu will-change-transform">

      {/* Priority indicator */}
      {priorityLevel === 'high' && (
        <div className="absolute top-3 right-3 z-20">
          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
            <TrendingUp size={10} className="text-white" />
            <span className="text-xs font-bold text-white">HOT</span>
          </div>
        </div>
      )}

      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
      </div>

      {/* Image Container */}
      <div className="relative overflow-hidden">
        <div className={`w-full h-56 bg-gradient-to-br ${getCategoryColor(article.category)} ${!imageLoaded ? 'animate-pulse' : ''}`}>
          <img
            src={article.image}
            alt={article.titleEn}
            className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onClick={handleCardClick}
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category and reading time */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-bold bg-gradient-to-r ${getCategoryColor(article.category)} text-white shadow-lg backdrop-blur-sm border border-white/20`}>
            {article.category}
          </span>
          <div className="flex items-center gap-1 px-2 py-1 bg-black/30 backdrop-blur-md rounded-lg text-white text-xs">
            <Clock size={10} />
            {readingTime} min read
          </div>
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white text-xs">
          <div className="flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg">
            <Eye size={10} />
            {views}
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg">
            <Calendar size={10} />
            {formatDate(article.date)}
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
          <button
            className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl hover:bg-white hover:scale-110 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            title="Share article"
          >
            <Share2 size={14} className="text-gray-700" />
          </button>
          <button
            className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl hover:bg-white hover:scale-110 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              speak(`${article.titleEn}. ${article.summaryEn}`);
            }}
            title={isPlaying ? "Stop reading" : "Read aloud"}
          >
            {isPlaying ? (
              <Pause size={14} className="text-blue-600" />
            ) : (
              <Play size={14} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative p-6 space-y-4" onClick={handleCardClick}>
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
          {article.titleEn}
        </h3>

        {/* Summary */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
          {article.summaryEn}
        </p>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          {/* Left actions */}
          <div className="flex items-center gap-2">
            <button
              className={`group/btn flex items-center gap-2 px-3 py-2 rounded-2xl transition-all duration-300 hover:scale-105 ${
                liked
                  ? "bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 text-red-500"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 dark:hover:from-pink-900/20 dark:hover:to-red-900/20 hover:text-red-500"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLike();
              }}
            >
              <Heart
                size={16}
                className={`transition-all duration-300 ${liked ? 'fill-current scale-110' : 'group-hover/btn:scale-110'}`}
              />
              <span className="text-xs font-medium">Like</span>
            </button>

            <button
              className={`group/btn flex items-center gap-2 px-3 py-2 rounded-2xl transition-all duration-300 hover:scale-105 ${
                saved
                  ? "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-500"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:text-blue-500"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleSave();
              }}
            >
              <Star
                size={16}
                className={`transition-all duration-300 ${saved ? 'fill-current scale-110' : 'group-hover/btn:scale-110'}`}
              />
              <span className="text-xs font-medium">Save</span>
            </button>
          </div>

          {/* Read more button */}
          <a
            className="group/link flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
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
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-1500 ease-out" />
        </div>
      </div>
    </article>
  );
}
