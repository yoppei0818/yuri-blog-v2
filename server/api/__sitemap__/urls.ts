import { queryCollection } from '@nuxt/content/server'

export default defineSitemapEventHandler(async (event) => {
  const [articles, books] = await Promise.all([
    queryCollection(event, 'articles')
      .where('published', '=', true)
      .all(),
    queryCollection(event, 'books')
      .where('published', '=', true)
      .all(),
  ])

  const tags = new Set([
    ...articles.flatMap(article => article.tags),
    ...books.flatMap(book => book.tags ?? []),
  ])
  const archiveYears = new Set(
    articles.map(article => article.publishDate.slice(0, 4)),
  )

  return [
    ...articles.map(article => ({
      loc: article.path,
      lastmod: article.updated ?? article.publishDate,
    })),
    ...books.map(book => ({
      loc: book.path,
      lastmod: book.publishDate,
    })),
    ...Array.from(tags, tag => `/tags/${encodeURIComponent(tag)}`),
    ...Array.from(archiveYears, year => `/archives/${year}`),
  ]
})
