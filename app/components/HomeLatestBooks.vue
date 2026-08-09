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

    <div class="mt-3 grid gap-3 md:grid-cols-2">
      <BookCard
        v-for="book in books"
        :key="book.path"
        :book="book"
        heading-tag="h3"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
interface BookItem {
  author: string
  path: string
  publishDate: string
  publisher?: string
  tags?: string[]
  title: string
}

defineProps<{
  books: BookItem[]
}>()
</script>
