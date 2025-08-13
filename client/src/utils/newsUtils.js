export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const getArticleTitle = (article, lang = "en") =>
  lang === "hindi" ? article.titleHi : article.titleEn;

export const getArticleSummary = (article, lang = "en") =>
  lang === "hindi" ? article.summaryHi : article.summaryEn;

export const getArticleContent = (article, lang = "en") =>
  lang === "hindi" ? article.contentHi : article.contentEn;
