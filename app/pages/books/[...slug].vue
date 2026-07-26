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
            class="book-body mt-10"
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

<style scoped>
.book-body {
  color: var(--ui-text);
  font-size: 1rem;
  line-height: 1.8;
}

.book-body :deep(h2) {
  margin-block: 2.5rem 1rem;
  border-left: 0.25rem solid var(--ui-secondary);
  padding-left: 0.75rem;
  color: var(--ui-text-highlighted);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
}

.book-body :deep(h3) {
  margin-block: 2rem 0.75rem;
  color: var(--ui-text-highlighted);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
}

.book-body :deep(p),
.book-body :deep(ul),
.book-body :deep(ol),
.book-body :deep(blockquote),
.book-body :deep(pre) {
  margin-block: 1rem;
}

.book-body :deep(ul),
.book-body :deep(ol) {
  padding-left: 1.5rem;
}

.book-body :deep(ul) {
  list-style: disc;
}

.book-body :deep(ol) {
  list-style: decimal;
}

.book-body :deep(a) {
  color: var(--ui-primary);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.book-body :deep(blockquote) {
  border-left: 0.25rem solid var(--ui-border);
  padding-left: 1rem;
  color: var(--ui-text-muted);
}

.book-body :deep(pre) {
  overflow-x: auto;
  border-radius: var(--ui-radius);
  background: var(--ui-bg-muted);
  padding: 1rem;
}

.book-body :deep(:not(pre) > code) {
  border-radius: calc(var(--ui-radius) / 2);
  background: var(--ui-bg-muted);
  padding: 0.125rem 0.375rem;
  font-size: 0.9em;
}

.book-body :deep(img) {
  max-width: 100%;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
}
</style>
