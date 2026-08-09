<template>
  <div class="flex min-h-dvh flex-col bg-default text-default">
    <SiteHeader />

    <main class="flex-1 border-b border-default">
      <UContainer class="py-8">
        <div class="mx-auto max-w-6xl">
          <header class="border-b border-default pb-6">
            <div class="flex items-center gap-3">
              <span class="h-7 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              <h1 class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
                プロフィール
              </h1>
            </div>
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
                  SalesforceエンジニアからWebエンジニアに転職し、現在はWebエンジニアとして活動しています。<br>
                  主にNuxt、Django REST Frameworkを使用したWebアプリケーション開発を行っています。<br><br>
                  ゲーム、アニメ鑑賞、音楽鑑賞、旅行が趣味です。
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
                    :aria-label="link.label"
                  />
                </div>
              </div>
            </div>
          </UCard>

          <section class="mt-10" aria-labelledby="skills-title">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-code-xml" class="size-6 text-primary" />
              <h2 id="skills-title" class="text-2xl font-semibold text-highlighted">
                スキル
              </h2>
            </div>

            <div class="mt-5 columns-1 gap-4 sm:columns-2">
              <UCard
                v-for="group in skillGroups"
                :key="group.category"
                class="mb-4 inline-block w-full break-inside-avoid align-top"
                :ui="{ body: 'p-5 sm:p-5' }"
              >
                <div class="flex items-center gap-2">
                  <UIcon :name="group.icon" class="size-5 text-primary" />
                  <h3 class="font-semibold text-highlighted">
                    {{ group.category }}
                  </h3>
                </div>
                <div class="mt-4 grid grid-cols-2 gap-3">
                  <div
                    v-for="skill in group.skills"
                    :key="skill.name"
                    class="flex min-h-24 flex-col items-center justify-center rounded-lg border border-default bg-muted/40 p-3 text-center"
                  >
                    <UIcon
                      :name="skill.icon"
                      class="size-9 text-highlighted"
                      :style="skill.color ? { color: skill.color } : undefined"
                    />
                    <span class="mt-2 text-sm font-medium leading-5 text-highlighted">
                      {{ skill.name }}
                    </span>
                  </div>
                </div>
              </UCard>
            </div>
          </section>

          <section class="mt-10" aria-labelledby="career-title">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-briefcase-business" class="size-6 text-primary" />
              <h2 id="career-title" class="text-2xl font-semibold text-highlighted">
                経歴
              </h2>
            </div>

            <UTimeline
              :items="careerItems"
              color="primary"
              size="lg"
              class="mt-6"
            >
              <template #description="{ item }">
                <p class="leading-6 text-muted">
                  {{ item.summary }}
                </p>
                <div class="mt-4 grid gap-3">
                  <UCard
                    v-for="project in item.projects"
                    :key="project.title"
                    :ui="{ body: 'p-4 sm:p-4' }"
                    variant="subtle"
                  >
                    <h4 class="font-medium text-highlighted">
                      {{ project.title }}
                    </h4>
                    <p class="mt-2 text-sm leading-6 text-muted">
                      {{ project.description }}
                    </p>
                    <div class="mt-3 flex flex-wrap gap-2">
                      <UBadge
                        v-for="technology in project.technologies"
                        :key="technology"
                        color="primary"
                        variant="subtle"
                        size="sm"
                      >
                        {{ technology }}
                      </UBadge>
                    </div>
                  </UCard>
                </div>
              </template>
            </UTimeline>
          </section>
        </div>
      </UContainer>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const socialLinks = [
  { label: 'GitHub', icon: 'i-lucide-github', to: 'https://github.com/yoppei0818' },
  { label: 'X', icon: 'i-simple-icons-x', to: 'https://x.com/ydev_0818' },
  { label: 'Wantedly', icon: 'i-simple-icons-wantedly', to: 'https://www.wantedly.com/id/yohei0818' },
]

const skillGroups = [
  {
    category: 'フロントエンド',
    icon: 'i-lucide-monitor',
    skills: [
      { name: 'Vue.js', icon: 'i-simple-icons-vuedotjs', color: '#42b883' },
      { name: 'Nuxt', icon: 'i-simple-icons-nuxt', color: '#00dc82' },
    ],
  },
  {
    category: 'バックエンド',
    icon: 'i-lucide-server',
    skills: [
      { name: 'Django REST Framework', icon: 'i-simple-icons-django', color: '#44b78b' },
    ],
  },
  {
    category: 'クラウド・インフラ',
    icon: 'i-lucide-cloud',
    skills: [
      { name: 'AWS', icon: 'i-simple-icons-amazonwebservices', color: '#ff9900' },
      { name: 'ECS', icon: 'i-simple-icons-amazonecs', color: '#ff9900' },
      { name: 'ALB', icon: 'i-simple-icons-awselasticloadbalancing', color: '#ff9900' },
      { name: 'Route 53', icon: 'i-simple-icons-amazonroute53', color: '#8c4fff' },
      { name: 'Cognito', icon: 'i-simple-icons-amazoncognito', color: '#dd344c' },
      { name: 'Vercel', icon: 'i-simple-icons-vercel' },
    ],
  },
  {
    category: '開発ツール',
    icon: 'i-lucide-terminal',
    skills: [
      { name: 'Docker', icon: 'i-simple-icons-docker', color: '#2496ed' },
      { name: 'Git', icon: 'i-simple-icons-git', color: '#f05032' },
    ],
  },
  {
    category: '監視・エラー追跡',
    icon: 'i-lucide-chart-no-axes-combined',
    skills: [
      { name: 'Sentry', icon: 'i-simple-icons-sentry', color: '#8b73e6' },
    ],
  },
  {
    category: 'AI 開発ツール',
    icon: 'i-lucide-bot',
    skills: [
      { name: 'Codex', icon: 'i-simple-icons-openai', color: '#10a37f' },
    ],
  },
]

const careerItems = [
  {
    date: '2022年4月〜2025年4月',
    title: 'サークレイス株式会社',
    icon: 'i-lucide-building-2',
    summary: 'Salesforceエンジニアとして、 Lightning Platform上へのアプリケーション構築を担当していました。',
    projects: [
      {
        title: 'エネルギー商社/電力契約顧客基盤構築プロジェクト',
        description: '顧客（個人・法人）が電気をWebからご契約するための申込サイト、また電気をご契約された顧客（個人・法人）向けのマイページに対する新規機能開発/運用保守を担当。',
        technologies: ['JavaScript', 'CSS', 'HTML', 'React', 'Redux', 'Apex', 'Git', 'Backlog'],
      },
      {
        title: '東京都介護支援事業基盤開発プロジェクト',
        description: '社会福祉事業者が給付金の交付申請をWebから行うための申込ページ、また社会福祉事業者が現在の申請内容や過去の申請内容を確認したりお問い合わせが可能なマイページを構築/機能追加/保守を担当。',
        technologies: ['JavaScript', 'CSS', 'HTML', 'Apex', 'Git', 'Backlog'],
      },
    ],
  },
  {
    date: '2025年5月〜現在',
    title: '株式会社Stardy',
    icon: 'i-lucide-building-2',
    summary: '河野塾の中でも主にKONO式の新規機能開発や運用保守を担当しています。',
    projects: [
      {
        title: 'KONO式_管理画面刷新',
        description: 'KONO式の管理画面をNuxt UIを用いて刷新する業務を担当。',
        technologies: ['AWS', 'Docker', 'Vue.js', 'Nuxt.js', 'Notion', 'Django REST Framework'],
      },
      {
        title: 'KONO式_決済周り処理改善',
        description: 'StripeのWebhook受信に関する処理を改善する業務を担当。',
        technologies: ['AWS', 'Docker', 'Vue.js', 'Nuxt.js', 'Notion', 'Stripe', 'Django REST Framework'],
      },
      {
        title: 'KONO式_申込み定常化',
        description: 'KONO式の申込みがいつでも行えるよう、他部署と連携して要件を固めたり、要件の実装を担当。',
        technologies: ['AWS', 'Docker', 'Vue.js', 'Slack', 'Nuxt.js', 'Notion', 'Stripe', 'Django REST Framework'],
      },
      {
        title: '河野塾_LINE認証・連携',
        description: '河野塾ユーザが個人LINEと連携、およびLINEログインができる仕組みの構築を担当。',
        technologies: ['AWS', 'Docker', 'Vue.js', 'Nuxt.js', 'Notion', 'Cognito', 'Django REST Framework'],
      },
      {
        title: 'KONO式_授業システム刷新（保守・運用）',
        description: 'KONO式の授業システム刷新の保守・運用を担当。',
        technologies: ['Next.js', 'Sentry', 'Cloudflare', 'Vercel'],
      }
    ],
  },
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
