export default defineAppConfig({
  site: {
    name: "Yuri's Blog",
    description: '技術記事と読了本をまとめた個人ブログです。',
    author: 'Yuri',
  },
  ui: {
    colors: {
      primary: 'brand',
      secondary: 'mint',
      neutral: 'slate',
      info: 'sky',
      success: 'emerald',
      warning: 'amber',
      error: 'rose',
    },
    icons: {
      arrowLeft: 'i-lucide-arrow-left',
      arrowRight: 'i-lucide-arrow-right',
      check: 'i-lucide-check',
      chevronDown: 'i-lucide-chevron-down',
      chevronLeft: 'i-lucide-chevron-left',
      chevronRight: 'i-lucide-chevron-right',
      close: 'i-lucide-x',
      external: 'i-lucide-external-link',
      loading: 'i-lucide-loader-circle',
      search: 'i-lucide-search',
    },
  },
})
