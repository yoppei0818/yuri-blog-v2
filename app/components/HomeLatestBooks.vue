<template>
  <section id="books" aria-labelledby="books-title" class="scroll-mt-24 border-t border-default pt-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div class="flex items-center gap-3">
          <span class="h-5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
          <h2 id="books-title" class="text-xl font-semibold text-highlighted">
            最新の読了本
          </h2>
        </div>
        <p class="mt-1.5 text-sm text-muted">
          これまでに読んだ本の記録と学びをまとめています。
        </p>
      </div>
      <UButton
        to="/books"
        variant="ghost"
        color="neutral"
        trailing-icon="i-lucide-arrow-right"
        size="sm"
      >
        全ての読了本を見る
      </UButton>
    </div>

    <div class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <UCard
        v-for="book in books"
        :key="book.id"
        :ui="{ body: 'p-3 sm:p-3' }"
      >
        <article class="flex gap-4">
          <div class="h-24 w-16 shrink-0 overflow-hidden rounded-md border border-default bg-muted">
            <img
              v-if="book.cover"
              :src="book.cover"
              :alt="book.title"
              class="h-full w-full object-cover"
            >
            <div
              v-else
              class="flex h-full items-center justify-center text-muted"
            >
              <UIcon name="i-lucide-book-open" class="size-6" />
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium text-muted">
              {{ formatDate(book.publishDate) }}
            </p>
            <h3 class="mt-1 line-clamp-2 font-semibold text-highlighted">
              {{ book.title }}
            </h3>
            <p class="mt-1.5 text-sm text-muted">
              {{ book.author }}
            </p>
            <p v-if="book.publisher" class="mt-1 text-xs text-muted">
              {{ book.publisher }}
            </p>
            <div v-if="book.tags?.length" class="mt-2 flex flex-wrap gap-2">
              <UBadge
                v-for="tag in book.tags.slice(0, 2)"
                :key="tag"
                color="secondary"
                variant="subtle"
                size="sm"
              >
                {{ tag }}
              </UBadge>
            </div>
          </div>
        </article>
      </UCard>
    </div>
  </section>
</template>

<script setup lang="ts">
interface BookItem {
  author: string
  cover?: string
  id: string
  publishDate: string
  publisher?: string
  tags?: string[]
  title: string
}

defineProps<{
  books: BookItem[]
}>()

const { formatDate } = useJaDateFormatter()
</script>
