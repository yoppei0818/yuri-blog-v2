<template>
  <UApp>
    <div class="flex min-h-dvh flex-col bg-default text-default">
      <SiteHeader />

      <main class="flex flex-1 items-center border-b border-default">
        <UContainer class="w-full py-12 sm:py-20">
          <UCard class="mx-auto max-w-2xl">
            <div class="flex flex-col items-center px-2 py-8 text-center sm:px-8 sm:py-12">
              <div class="flex size-14 items-center justify-center rounded-full bg-muted text-muted">
                <UIcon :name="errorContent.icon" class="size-7" />
              </div>

              <p class="mt-5 font-mono text-sm font-semibold tracking-widest text-primary">
                ERROR {{ statusCode }}
              </p>
              <h1 class="mt-2 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
                {{ errorContent.title }}
              </h1>
              <p class="mt-4 max-w-lg text-sm leading-7 text-muted sm:text-base">
                <span
                  v-for="sentence in descriptionLines"
                  :key="sentence"
                  class="block"
                >
                  {{ sentence }}
                </span>
              </p>

              <div class="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                <UButton
                  icon="i-lucide-house"
                  label="トップへ戻る"
                  size="lg"
                  class="cursor-pointer justify-center"
                  @click="navigateTo('/')"
                />
                <UButton
                  icon="i-lucide-file-text"
                  label="記事一覧を見る"
                  color="neutral"
                  variant="soft"
                  size="lg"
                  class="cursor-pointer justify-center"
                  @click="navigateTo('/articles')"
                />
              </div>

              <div class="mt-8 flex items-center gap-3 rounded-lg bg-muted px-4 py-3 text-left text-sm text-muted">
                <UIcon name="i-lucide-search" class="size-5 shrink-0" />
                <p>
                  記事や読了本は、画面上部の検索ボタンまたは
                  <UKbd value="meta" size="sm" />
                  <span class="mx-1">+</span>
                  <UKbd value="K" size="sm" />
                  から検索できます。
                </p>
              </div>
            </div>
          </UCard>
        </UContainer>
      </main>

      <SiteFooter />
    </div>
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error.statusCode || 500)
const isNotFound = computed(() => statusCode.value === 404)
const errorContent = computed(() => isNotFound.value
  ? {
      title: 'ページが見つかりません',
      description: 'URLが変更されたか、ページが削除された可能性があります。トップページや記事一覧から目的のページをお探しください。',
      icon: 'i-lucide-file-question-mark',
    }
  : {
      title: 'ページを表示できませんでした',
      description: '一時的な問題が発生している可能性があります。時間をおいて再度お試しいただくか、トップページへお戻りください。',
      icon: 'i-lucide-triangle-alert',
    })

const pageTitle = computed(() => `${statusCode.value} - ${errorContent.value.title}`)
const descriptionLines = computed(() => {
  return errorContent.value.description
    .split('。')
    .filter(Boolean)
    .map(sentence => `${sentence}。`)
})

useHead({
  htmlAttrs: {
    lang: 'ja',
  },
  title: pageTitle,
})

useSeoMeta({
  robots: 'noindex, nofollow',
})

const navigateTo = async (path: string) => {
  await clearError({ redirect: path })
}
</script>
