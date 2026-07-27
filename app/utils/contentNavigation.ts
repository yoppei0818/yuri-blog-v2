interface DatedContent {
  publishDate: string
}

interface TaggedContent {
  tags?: readonly string[]
}

export interface ArticleArchiveItem {
  count: number
  year: string
}

export interface ContentTagItem {
  count: number
  tag: string
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

export const createContentTagItems = (
  contentGroups: readonly (readonly TaggedContent[])[],
): ContentTagItem[] => {
  const tagCounts = contentGroups
    .flat()
    .reduce<Record<string, number>>((counts, content) => {
      content.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] ?? 0) + 1
      })

      return counts
    }, {})

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((current, next) => {
      return next.count - current.count || current.tag.localeCompare(next.tag, 'ja')
    })
}
