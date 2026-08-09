<template>
  <aside
    class="article-callout"
    :class="`article-callout--${normalizedType}`"
    :aria-label="label"
  >
    <UIcon
      :name="icon"
      class="article-callout__icon"
      aria-hidden="true"
    />
    <div class="article-callout__content">
      <p
        v-if="title"
        class="article-callout__title"
      >
        {{ title }}
      </p>
      <div class="article-callout__body">
        <slot mdc-unwrap="p" />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
type CalloutType = 'note' | 'caution' | 'warning'

const props = withDefaults(defineProps<{
  type?: CalloutType
  title?: string
}>(), {
  type: 'note',
  title: '',
})

const normalizedType = computed<CalloutType>(() => {
  return ['note', 'caution', 'warning'].includes(props.type)
    ? props.type
    : 'note'
})

const calloutSettings: Record<CalloutType, { label: string, icon: string }> = {
  note: {
    label: '補足',
    icon: 'i-lucide-info',
  },
  caution: {
    label: '注意',
    icon: 'i-lucide-triangle-alert',
  },
  warning: {
    label: '警告',
    icon: 'i-lucide-circle-alert',
  },
}

const label = computed(() => props.title || calloutSettings[normalizedType.value].label)
const icon = computed(() => calloutSettings[normalizedType.value].icon)
</script>
