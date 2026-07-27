<template>
  <div class="flex min-h-dvh flex-col bg-default text-default">
    <SiteHeader />

    <main class="flex-1 border-b border-default">
      <UContainer class="py-8">
        <div class="mx-auto max-w-6xl">
          <header class="border-b border-default pb-6 sm:flex sm:items-end sm:justify-between sm:gap-6">
            <div>
              <div class="flex items-center gap-3">
                <span class="h-7 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                <h1 class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
                  読了本一覧
                </h1>
              </div>
            </div>
            <p class="mt-4 shrink-0 text-sm text-muted sm:mt-0">
              全 <span class="font-semibold text-highlighted">{{ books.length }}</span> 件
            </p>
          </header>

          <div
            v-if="books.length"
            class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <BookCard
              v-for="book in paginatedBooks"
              :key="book.path"
              :book="book"
              heading-tag="h2"
              :tag-limit="3"
            />
          </div>

          <ContentEmptyState
            v-else
            class="mt-6"
            icon="i-lucide-book-open"
            title="公開中の読了本はありません"
            description="読書記録を準備しています。公開までしばらくお待ちください。"
          />

          <ContentPagination
            v-if="showPagination"
            class="mt-8"
            :page="currentPage"
            :total="books.length"
            :items-per-page="itemsPerPage"
            :to="pageLink"
          />
        </div>
      </UContainer>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData('books:index', () => {
  return queryCollection('books')
    .where('published', '=', true)
    .order('publishDate', 'DESC')
    .all()
})

const books = computed(() => data.value ?? [])
const {
  currentPage,
  itemsPerPage,
  pageLink,
  paginatedItems: paginatedBooks,
  showPagination,
} = useContentPagination(books)

const pageTitle = computed(() => {
  return currentPage.value === 1
    ? '読了本一覧'
    : `読了本一覧（${currentPage.value}ページ目）`
})

useSeoMeta({
  title: pageTitle,
  description: 'これまでに読んだ本と、そこから得た学びをまとめた読了本一覧です。',
  ogTitle: pageTitle,
  ogDescription: 'これまでに読んだ本と、そこから得た学びをまとめた読了本一覧です。',
  twitterCard: 'summary',
  twitterTitle: pageTitle,
  twitterDescription: 'これまでに読んだ本と、そこから得た学びをまとめた読了本一覧です。',
})
</script>
