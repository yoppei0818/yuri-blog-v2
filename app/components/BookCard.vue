<template>
  <UCard
    :ui="{ body: 'p-3 sm:p-3' }"
    class="group relative h-full transition hover:-translate-y-0.5 hover:shadow-lg"
  >
    <article class="flex gap-4">
      <NuxtLink
        :to="book.path"
        class="absolute inset-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        :aria-label="`${book.title}の読書メモを読む`"
      />

      <div class="h-24 w-16 shrink-0 overflow-hidden rounded-md border border-default bg-muted">
        <img
          v-if="book.cover"
          :src="book.cover"
          :alt="`${book.title}の表紙`"
          class="h-full w-full object-cover"
        >
        <div v-else class="flex h-full items-center justify-center text-muted">
          <UIcon name="i-lucide-book-open" class="size-6" />
        </div>
      </div>

      <div class="min-w-0 flex-1">
        <p class="text-xs font-medium text-muted">
          {{ formatDate(book.publishDate) }}
        </p>
        <component
          :is="headingTag"
          class="mt-1 line-clamp-2 font-semibold text-highlighted group-hover:text-secondary"
        >
          {{ book.title }}
        </component>
        <p class="mt-1.5 text-sm text-muted">
          {{ book.author }}
        </p>
        <p v-if="book.publisher" class="mt-1 text-xs text-muted">
          {{ book.publisher }}
        </p>
        <div v-if="book.tags?.length" class="relative z-10 mt-2 flex flex-wrap gap-2">
          <NuxtLink
            v-for="tag in visibleTags"
            :key="tag"
            :to="tagPath(tag)"
            class="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            :aria-label="`${tag}タグのコンテンツを見る`"
          >
            <UBadge color="secondary" variant="subtle" size="sm">
              {{ tag }}
            </UBadge>
          </NuxtLink>
        </div>
      </div>
    </article>
  </UCard>
</template>

<script setup lang="ts">
interface BookCardItem {
  author: string
  cover?: string
  path: string
  publishDate: string
  publisher?: string
  tags?: string[]
  title: string
}

const props = withDefaults(defineProps<{
  book: BookCardItem
  headingTag?: 'h2' | 'h3'
  tagLimit?: number
}>(), {
  headingTag: 'h2',
  tagLimit: 2,
})

const { formatDate } = useJaDateFormatter()

const visibleTags = computed(() => (props.book.tags ?? []).slice(0, props.tagLimit))
const tagPath = (tag: string) => `/tags/${encodeURIComponent(tag)}`
</script>
