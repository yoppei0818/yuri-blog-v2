import type { MaybeRefOrGetter } from 'vue'

export const CONTENT_ITEMS_PER_PAGE = 9

const parsePageQuery = (value: unknown, totalPages: number) => {
  if (value === undefined) {
    return 1
  }

  if (
    typeof value !== 'string'
    || !/^[1-9]\d*$/.test(value)
  ) {
    throw createError({
      statusCode: 404,
      message: 'ページが見つかりません',
    })
  }

  const page = Number(value)

  if (!Number.isSafeInteger(page) || page > totalPages) {
    throw createError({
      statusCode: 404,
      message: 'ページが見つかりません',
    })
  }

  return page
}

export const useContentPagination = <T>(
  items: MaybeRefOrGetter<readonly T[]>,
  itemsPerPage = CONTENT_ITEMS_PER_PAGE,
) => {
  const route = useRoute()
  const allItems = computed(() => toValue(items))
  const totalItems = computed(() => allItems.value.length)
  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(totalItems.value / itemsPerPage))
  })
  const currentPage = computed(() => {
    return parsePageQuery(route.query.page, totalPages.value)
  })
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage

    return allItems.value.slice(start, start + itemsPerPage)
  })
  const showPagination = computed(() => totalItems.value > 0)

  const pageLink = (page: number) => {
    const query = { ...route.query }

    if (page === 1) {
      delete query.page
    }
    else {
      query.page = String(page)
    }

    return {
      path: route.path,
      query,
    }
  }

  return {
    currentPage,
    itemsPerPage,
    pageLink,
    paginatedItems,
    showPagination,
    totalItems,
    totalPages,
  }
}
