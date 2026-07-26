<template>
  <UCard>
    <div class="flex flex-col items-center px-4 py-10 text-center sm:py-14">
      <div class="flex size-12 items-center justify-center rounded-full bg-muted text-muted">
        <UIcon :name="icon" class="size-6" />
      </div>
      <h2 class="mt-4 text-lg font-semibold text-highlighted">
        {{ title }}
      </h2>
      <p class="mt-2 max-w-md text-sm leading-6 text-muted">
        {{ description }}
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  description: string
  icon?: string
  title: string
}>(), {
  icon: 'i-lucide-inbox',
})
</script>
