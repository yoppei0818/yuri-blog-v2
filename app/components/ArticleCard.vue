<template>
  <UCard
    :ui="{ body: 'p-0 sm:p-0' }"
    class="group relative h-full overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg"
  >
    <article class="flex h-full flex-col">
      <NuxtLink
        :to="article.path"
        class="absolute inset-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :aria-label="`${article.title}を読む`"
      />

      <div class="h-24 overflow-hidden border-b border-default bg-muted sm:h-28">
        <img
          v-if="article.thumbnail"
          :src="article.thumbnail"
          :alt="article.title"
          class="h-full w-full object-cover"
        >
        <div v-else class="flex h-full items-center justify-center text-muted">
          <UIcon name="i-lucide-file-text" class="size-8" />
        </div>
      </div>

      <div class="flex flex-1 flex-col p-3">
        <div v-if="article.tags.length" class="relative z-10 flex flex-wrap gap-2">
          <NuxtLink
            v-for="tag in visibleTags"
            :key="tag"
            :to="tagPath(tag)"
            class="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :aria-label="`${tag}タグのコンテンツを見る`"
          >
            <UBadge color="primary" variant="subtle" size="sm">
              {{ tag }}
            </UBadge>
          </NuxtLink>
        </div>

        <component
          :is="headingTag"
          class="mt-2 line-clamp-2 text-base font-semibold leading-6 text-highlighted group-hover:text-primary"
        >
          {{ article.title }}
        </component>

        <p
          v-if="showDescription && article.description"
          class="mt-2 line-clamp-2 text-sm leading-5 text-muted"
        >
          {{ article.description }}
        </p>

        <div class="mt-auto flex items-center gap-2 pt-3 text-xs text-muted">
          <UIcon name="i-lucide-calendar" class="size-4" />
          <time :datetime="article.publishDate">
            {{ formatDate(article.publishDate) }}
          </time>
        </div>
      </div>
    </article>
  </UCard>
</template>

<script setup lang="ts">
interface ArticleCardItem {
  description?: string
  path: string
  publishDate: string
  tags: string[]
  thumbnail?: string
  title: string
}

const props = withDefaults(defineProps<{
  article: ArticleCardItem
  headingTag?: 'h2' | 'h3'
  showDescription?: boolean
  tagLimit?: number
}>(), {
  headingTag: 'h2',
  showDescription: false,
  tagLimit: 2,
})

const { formatDate } = useJaDateFormatter()

const visibleTags = computed(() => props.article.tags.slice(0, props.tagLimit))
const tagPath = (tag: string) => `/tags/${encodeURIComponent(tag)}`
</script>
