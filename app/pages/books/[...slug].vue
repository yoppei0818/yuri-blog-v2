<template>
  <div class="flex min-h-dvh flex-col bg-default text-default">
    <SiteHeader />

    <main class="flex-1 border-b border-default">
      <UContainer class="py-8 sm:py-12">
        <article class="mx-auto max-w-3xl">
          <UButton
            to="/books"
            icon="i-lucide-arrow-left"
            label="読了本一覧へ戻る"
            color="neutral"
            variant="ghost"
            size="sm"
            class="mb-6"
          />

          <header class="border-b border-default pb-8">
            <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div class="mx-auto w-32 shrink-0 sm:mx-0 sm:w-40">
                <div class="aspect-[2/3] overflow-hidden rounded-lg border border-default bg-muted shadow-sm">
                  <img
                    :src="book.cover"
                    :alt="`${book.title}の表紙`"
                    class="h-full w-full object-cover"
                  >
                </div>
              </div>

              <div class="min-w-0 flex-1">
                <div
                  v-if="book.tags?.length"
                  class="flex flex-wrap gap-2"
                >
                  <UBadge
                    v-for="tag in book.tags"
                    :key="tag"
                    color="secondary"
                    variant="subtle"
                  >
                    {{ tag }}
                  </UBadge>
                </div>

                <h1
                  class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
                  :class="{ 'mt-4': book.tags?.length }"
                >
                  {{ book.title }}
                </h1>

                <dl class="mt-6 grid gap-3 text-sm">
                  <div class="flex gap-3">
                    <dt class="w-16 shrink-0 text-muted">
                      著者
                    </dt>
                    <dd class="font-medium text-highlighted">
                      {{ book.author }}
                    </dd>
                  </div>

                  <div
                    v-if="book.publisher"
                    class="flex gap-3"
                  >
                    <dt class="w-16 shrink-0 text-muted">
                      出版社
                    </dt>
                    <dd class="text-highlighted">
                      {{ book.publisher }}
                    </dd>
                  </div>

                  <div class="flex gap-3">
                    <dt class="w-16 shrink-0 text-muted">
                      読了日
                    </dt>
                    <dd class="flex items-center gap-2 text-highlighted">
                      <UIcon name="i-lucide-calendar" class="size-4 text-muted" />
                      <time :datetime="book.publishDate">
                        {{ formatDate(book.publishDate) }}
                      </time>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </header>

          <ContentRenderer
            :value="book"
            class="content-body content-body-secondary mt-10"
          />
        </article>
      </UContainer>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { formatDate } = useJaDateFormatter()

const { data: book } = await useAsyncData(
  `book:${route.path}`,
  () => queryCollection('books')
    .path(route.path)
    .where('published', '=', true)
    .first(),
)

if (!book.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '読了本が見つかりません',
  })
}

const description = computed(() => {
  return `${book.value?.author}『${book.value?.title}』の読書メモです。`
})

useSeoMeta({
  title: () => book.value?.title,
  description,
  ogTitle: () => book.value?.title,
  ogDescription: description,
  ogImage: () => book.value?.cover,
})
</script>
