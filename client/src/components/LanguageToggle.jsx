import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../redux/slices/newsSlice";

export default function LanguageToggle() {
  const dispatch = useDispatch();
  const language = useSelector((s) => s.news.language);

  return (
    <div className="inline-flex rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
      {["en","hindi"].map(l => (
        <button
          key={l}
          onClick={() => dispatch(setLanguage(l))}
          className={`px-3 py-1 text-sm ${language===l ? "bg-green-600 text-white" : "bg-white dark:bg-gray-800"}`}
        >
          {l === "en" ? "EN" : "हिंदी"}
        </button>
      ))}
    </div>
  );
}
