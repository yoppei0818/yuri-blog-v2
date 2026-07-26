interface DatedContent {
  publishDate: string
}

export interface ArticleArchiveItem {
  count: number
  year: string
}

export const getContentYear = (content: DatedContent) => {
  return content.publishDate.slice(0, 4)
}

export const createArticleArchiveItems = <T extends DatedContent>(
  articles: readonly T[],
): ArticleArchiveItem[] => {
  const yearCounts = articles.reduce<Record<string, number>>((counts, article) => {
    const year = getContentYear(article)
    counts[year] = (counts[year] ?? 0) + 1

    return counts
  }, {})

  return Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .sort((current, next) => next.year.localeCompare(current.year))
}

export const filterArticlesByYear = <T extends DatedContent>(
  articles: readonly T[],
  year: string,
) => {
  return articles.filter(article => getContentYear(article) === year)
}
