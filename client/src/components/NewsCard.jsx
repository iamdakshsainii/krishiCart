/* eslint-disable no-empty */
import { Calendar, Bookmark, Volume2, ExternalLink } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleBookmark } from "../redux/slices/newsSlice";

export default function NewsCard({ article, onOpen }) {
  const dispatch = useDispatch();
  const bookmarks = useSelector((s) => s.news.bookmarks);
  const saved = bookmarks.some((b) => b.id === article.id);

  const speak = (text) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      // if Hindi is selected, let browser choose a Hindi voice if present
      window.speechSynthesis.speak(u);
    } catch {}
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
      onClick={() => onOpen(article)}
    >
      <img src={article.image} alt={article.titleEn} className="w-full h-44 object-cover" />
      <div className="p-4 space-y-2">
        <span className="text-xs font-semibold text-green-600">{article.category}</span>
        <h3 className="text-lg font-bold line-clamp-2">{article.titleEn}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{article.summaryEn}</p>

        <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={14} /> {article.date}
          </div>
          <div className="flex items-center gap-3">
            <button
              className="hover:opacity-80"
              onClick={(e) => { e.stopPropagation(); speak(`${article.titleEn}. ${article.summaryEn}`); }}
              title="Read aloud"
            >
              <Volume2 size={16} />
            </button>
            <button
              className={`hover:opacity-80 ${saved ? "text-green-600" : ""}`}
              onClick={(e) => { e.stopPropagation(); dispatch(toggleBookmark(article)); }}
              title={saved ? "Bookmarked" : "Bookmark"}
            >
              <Bookmark size={16} />
            </button>
            <a
              className="hover:opacity-80"
              href={article.url} target="_blank" rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Open source"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
