const topPageItemLimit = 3

export const useHomeContent = async () => {
  const { data: articles } = await useAsyncData('home:articles', () => {
    return queryCollection('articles')
      .where('published', '=', true)
      .order('publishDate', 'DESC')
      .all()
  })

  const { data: books } = await useAsyncData('home:books', () => {
    return queryCollection('books')
      .where('published', '=', true)
      .order('publishDate', 'DESC')
      .all()
  })

  const articleItems = computed(() => articles.value ?? [])
  const bookItems = computed(() => books.value ?? [])

  const latestArticles = computed(() => articleItems.value.slice(0, topPageItemLimit))
  const latestBooks = computed(() => bookItems.value.slice(0, topPageItemLimit))

  const archiveItems = computed(() => {
    const yearCounts = articleItems.value.reduce<Record<string, number>>((counts, article) => {
      const year = article.publishDate.slice(0, 4)
      counts[year] = (counts[year] ?? 0) + 1

      return counts
    }, {})

    return Object.entries(yearCounts)
      .map(([year, count]) => ({ year, count }))
      .sort((current, next) => next.year.localeCompare(current.year))
  })

  return {
    archiveItems,
    latestArticles,
    latestBooks,
  }
}
