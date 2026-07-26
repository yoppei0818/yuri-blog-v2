import { createArticleArchiveItems } from '~/utils/contentNavigation'

const topPageItemLimit = 3

export const useHomeContent = async () => {
  const articlesData = useAsyncData('home:articles', () => {
    return queryCollection('articles')
      .where('published', '=', true)
      .order('publishDate', 'DESC')
      .all()
  })

  const booksData = useAsyncData('home:books', () => {
    return queryCollection('books')
      .where('published', '=', true)
      .order('publishDate', 'DESC')
      .all()
  })

  const [
    { data: articles },
    { data: books },
  ] = await Promise.all([articlesData, booksData])

  const articleItems = computed(() => articles.value ?? [])
  const bookItems = computed(() => books.value ?? [])

  const latestArticles = computed(() => articleItems.value.slice(0, topPageItemLimit))
  const latestBooks = computed(() => bookItems.value.slice(0, topPageItemLimit))

  const archiveItems = computed(() => createArticleArchiveItems(articleItems.value))

  return {
    archiveItems,
    latestArticles,
    latestBooks,
  }
}
