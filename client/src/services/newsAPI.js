/* eslint-disable no-unused-vars */
// services/newsAPI.js  (moved from services/newsService.js name you used above)
import axios from "axios";

// ---------- ENV (Vite uses VITE_* keys) ----------
const NEWSAPI_KEY   = import.meta.env.VITE_NEWSAPI_KEY || "";
const NEWSDATA_KEY  = import.meta.env.VITE_NEWSDATA_KEY || "";
const GNEWS_KEY     = import.meta.env.VITE_GNEWS_KEY || "";

// Pick provider order (all free tiers). We try in order until one works.
const PROVIDERS = [
  { name: "newsapi",   baseURL: "https://newsapi.org/v2" },
  { name: "newsdata",  baseURL: "https://newsdata.io/api/1" },
  { name: "gnews",     baseURL: "https://gnews.io/api/v4" },
];

const toLang = (lang) => (lang === "hindi" || lang === "hi" ? "hi" : "en");

class NewsService {
  constructor() {
    this.client = axios.create({ timeout: 12000 });
  }

  // ---------- PUBLIC ----------
  async getAgricultureNews(language = "en", page = 1, pageSize = 12) {
    const q = 'agriculture OR farming OR farmer OR crops OR fertilizer OR "food prices" OR "agricultural policy" OR mandi';
    return this._fetch({ q, language, page, pageSize, sortBy: "publishedAt" });
  }

  async searchNews(query, language = "en", page = 1, pageSize = 12) {
    const q = `${query} AND (agriculture OR farming OR crops OR mandi)`;
    return this._fetch({ q, language, page, pageSize, sortBy: "publishedAt" });
  }

  async getNewsByCategory(category, language = "en", page = 1, pageSize = 12) {
    const map = {
      government: 'government policy subsidy scheme PM-Kisan "minimum support price" MSP agriculture',
      market: 'mandi prices market trend wheat paddy tomato onion fertilizer diesel inflation agriculture',
      technology: 'smart farming AI IoT drone precision irrigation sensor agri-tech agriculture',
      weather: 'monsoon rainfall weather climate drought flood IMD agriculture',
    };
    const q = map[(category || "").toLowerCase()] || "agriculture farming";
    return this._fetch({ q, language, page, pageSize, sortBy: "publishedAt" });
  }

  // ---------- CORE FETCH (cycles providers, normalizes) ----------
  async _fetch({ q, language, page, pageSize, sortBy }) {
    const lang = toLang(language);

    for (const p of PROVIDERS) {
      try {
        const res = await this._byProvider(p.name, {
          q, lang, page, pageSize, sortBy,
        });
        if (res && res.articles?.length) return res;
      } catch (e) {
        // try next provider
      }
    }

    // fallback to mock
    return this._mock(lang, page, pageSize);
  }

  async _byProvider(name, { q, lang, page, pageSize, sortBy }) {
    if (name === "newsapi") {
      if (!NEWSAPI_KEY) throw new Error("No NEWSAPI_KEY");
      const params = {
        q,
        language: lang,
        sortBy,
        page,
        pageSize,
        apiKey: NEWSAPI_KEY,
      };
      const { data } = await this.client.get("https://newsapi.org/v2/everything", { params });
      return this._normalize(name, data, { page, pageSize });
    }

    if (name === "newsdata") {
      if (!NEWSDATA_KEY) throw new Error("No NEWSDATA_KEY");
      const params = {
        apikey: NEWSDATA_KEY,
        q,
        language: lang, // supports hi,en + others
        page,
        page_size: pageSize,
        country: "in",
        category: "business,top,world", // still filter by q
      };
      const { data } = await this.client.get("https://newsdata.io/api/1/news", { params });
      return this._normalize(name, data, { page, pageSize });
    }

    if (name === "gnews") {
      if (!GNEWS_KEY) throw new Error("No GNEWS_KEY");
      const params = {
        q,
        lang,
        country: "in",
        max: pageSize,
        page,
        token: GNEWS_KEY,
        sortby: "publishedAt",
      };
      const { data } = await this.client.get("https://gnews.io/api/v4/search", { params });
      return this._normalize(name, data, { page, pageSize });
    }

    throw new Error("Unknown provider");
  }

  _normalize(provider, raw, { page, pageSize }) {
    let items = [];
    let total = 0;

    if (provider === "newsapi") {
      items = raw.articles || [];
      total = raw.totalResults || items.length;
    } else if (provider === "newsdata") {
      items = raw.results || [];
      total = raw.totalResults || raw.total || items.length;
    } else if (provider === "gnews") {
      items = raw.articles || [];
      total = raw.totalArticles || items.length;
    }

    const articles = (items || []).map((a, i) => {
      // normalize fields across providers
      const title = a.title || a.heading || "";
      const desc =
        a.description ||
        a.content ||
        a.excerpt ||
        a.summary ||
        "";

      const img =
        a.urlToImage || a.image_url || a.image || a.imageUrl ||
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=450&fit=crop";

      const published =
        a.publishedAt || a.pubDate || a.published_at || a.date || "";

      const source =
        (a.source && (a.source.name || a.source.title)) ||
        a.source_id ||
        a.source_name ||
        a.publisher ||
        "News";

      const url = a.url || a.link || a.article_url || "#";

      const summary = desc ? (desc.length > 220 ? desc.slice(0, 220) + "..." : desc) : "";

      const cat = this._categorize(`${title} ${desc}`);

      return {
        id: `${provider}-${page}-${i}-${title.slice(0, 10)}`,
        titleEn: title,
        titleHi: title,            // optional: hook for translator
        summaryEn: summary,
        summaryHi: summary,
        contentEn: desc,
        contentHi: desc,
        image: img,
        date: (published || "").split("T")[0] || "",
        category: cat,
        source,
        url,
      };
    });

    return { articles, totalResults: total, page, pageSize };
  }

  _categorize(text) {
    const t = (text || "").toLowerCase();
    if (/(government|policy|scheme|msp|subsidy)/.test(t)) return "Government Policy";
    if (/(price|mandi|market|inflation|cost)/.test(t)) return "Market Trends";
    if (/(technology|ai|iot|drone|smart)/.test(t)) return "Technology";
    if (/(weather|climate|rain|monsoon|flood|drought|imd)/.test(t)) return "Weather & Climate";
    return "General News";
  }

  _mock(lang = "en", page = 1, pageSize = 12) {
    const mock = [
      {
        id: "mock-1",
        titleEn: "Government Announces New Farmer Subsidies for 2025",
        titleHi: "सरकार ने 2025 के लिए नए किसान सब्सिडी की घोषणा की",
        summaryEn: "New subsidy package for modern equipment & sustainable farming.",
        summaryHi: "आधुनिक उपकरणों और टिकाऊ खेती के लिए नई सब्सिडी योजना।",
        contentEn: "The Ministry of Agriculture unveiled a subsidy scheme...",
        contentHi: "कृषि मंत्रालय ने नई सब्सिडी योजना जारी की...",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=450&fit=crop",
        date: "2025-01-15",
        category: "Government Policy",
        source: "KrishiCart",
        url: "#",
      },
      {
        id: "mock-2",
        titleEn: "Rising Fertilizer Costs Impact Farming Communities",
        titleHi: "बढ़ती उर्वरक लागत से किसानों पर असर",
        summaryEn: "Fertilizer prices increased by 15% this quarter.",
        summaryHi: "इस तिमाही में उर्वरक के दाम 15% बढ़े।",
        contentEn: "Fertilizer cost spike worries agri sector...",
        contentHi: "उर्वरक महंगाई से कृषि क्षेत्र चिंतित...",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=450&fit=crop",
        date: "2025-01-12",
        category: "Market Trends",
        source: "KrishiCart",
        url: "#",
      },
    ];
    const start = (page - 1) * pageSize;
    return { articles: mock.slice(start, start + pageSize), totalResults: mock.length, page, pageSize };
  }
}

const newsService = new NewsService();
export default newsService;

