<template>
  <nav aria-label="パンくずリスト">
    <ol class="flex flex-wrap items-center gap-2 text-sm text-muted">
      <li
        v-for="(item, index) in items"
        :key="item.to ?? item.label"
        class="flex min-w-0 items-center gap-2"
      >
        <UIcon
          v-if="index > 0"
          name="i-lucide-chevron-right"
          class="size-3.5 shrink-0"
          aria-hidden="true"
        />
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="rounded-sm hover:text-highlighted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {{ item.label }}
        </NuxtLink>
        <span
          v-else
          class="truncate text-default"
          aria-current="page"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>
