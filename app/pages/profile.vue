<template>
  <div class="flex min-h-dvh flex-col bg-default text-default">
    <SiteHeader />

    <main class="flex-1 border-b border-default">
      <UContainer class="py-8 sm:py-12">
        <div class="mx-auto max-w-4xl">
          <ContentBreadcrumb :items="breadcrumbItems" />

          <header class="mt-6 border-b border-default pb-6">
            <div class="flex items-center gap-3">
              <span class="h-7 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              <h1 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
                プロフィール
              </h1>
            </div>
            <p class="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              このブログを書いている Yuri について紹介します。
            </p>
          </header>

          <UCard class="mt-6" :ui="{ body: 'p-6 sm:p-8' }">
            <div class="grid gap-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
              <UAvatar
                text="Y"
                size="3xl"
                color="primary"
                src="/images/site/profile-image.png"
                class="mx-auto size-32 sm:mx-0 sm:size-36"
              />

              <div class="text-center sm:text-left">
                <h2 class="text-2xl font-semibold text-highlighted">
                  Yuri
                </h2>
                <p class="mt-1 font-medium text-primary">
                  Web Developer
                </p>
                <p class="mt-4 leading-7 text-muted">
                  Web アプリケーション開発が好きなエンジニアです。個人開発や技術の学びを発信しています。
                </p>

                <div class="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                  <UButton
                    v-for="link in socialLinks"
                    :key="link.label"
                    :to="link.to"
                    :icon="link.icon"
                    color="neutral"
                    variant="soft"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ link.label }}
                  </UButton>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </UContainer>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const breadcrumbItems = [
  { label: 'ホーム', to: '/' },
  { label: 'プロフィール' },
]

const socialLinks = [
  { label: 'GitHub', icon: 'i-lucide-github', to: 'https://github.com/' },
  { label: 'X', icon: 'i-simple-icons-x', to: 'https://x.com/' },
]

useSeoMeta({
  title: 'プロフィール',
  description: 'Yuriのプロフィールと活動先を紹介します。',
  ogTitle: 'プロフィール',
  ogDescription: 'Yuriのプロフィールと活動先を紹介します。',
  twitterCard: 'summary',
  twitterTitle: 'プロフィール',
  twitterDescription: 'Yuriのプロフィールと活動先を紹介します。',
})
</script>
