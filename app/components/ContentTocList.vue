<template>
  <ul class="space-y-2">
    <li
      v-for="link in links"
      :key="link.id"
    >
      <a
        :href="`#${link.id}`"
        class="block rounded-sm text-sm leading-6 text-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {{ link.text }}
      </a>
      <ContentTocList
        v-if="link.children?.length"
        :links="link.children"
        class="mt-2 border-l border-default pl-3"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
export interface ContentTocLink {
  id: string
  text: string
  children?: ContentTocLink[]
}

defineProps<{
  links: ContentTocLink[]
}>()
</script>
