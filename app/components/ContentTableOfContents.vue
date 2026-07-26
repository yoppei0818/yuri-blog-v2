<template>
  <div v-if="links.length">
    <details class="group rounded-lg border border-default bg-elevated lg:hidden">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
        <span class="flex items-center gap-2">
          <UIcon
            name="i-lucide-list"
            class="size-4 text-primary"
            aria-hidden="true"
          />
          <span class="text-sm font-semibold text-highlighted">
            目次
          </span>
        </span>
        <UIcon
          name="i-lucide-chevron-down"
          class="size-4 text-muted transition group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div class="border-t border-default px-4 py-3">
        <ContentTocList :links="links" />
      </div>
    </details>

    <nav
      aria-labelledby="desktop-table-of-contents-title"
      class="hidden rounded-lg border border-default bg-elevated p-4 lg:block"
    >
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-list"
          class="size-4 text-primary"
          aria-hidden="true"
        />
        <h2
          id="desktop-table-of-contents-title"
          class="text-sm font-semibold text-highlighted"
        >
          目次
        </h2>
      </div>
      <ContentTocList
        :links="links"
        class="mt-3"
      />
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { ContentTocLink } from './ContentTocList.vue'

defineProps<{
  links: ContentTocLink[]
}>()
</script>
