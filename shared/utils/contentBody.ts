interface ContentBody {
  value?: readonly unknown[]
}

interface ContentWithBody {
  body?: ContentBody | null
}

export const hasContentBody = (content: ContentWithBody) => {
  return Boolean(content.body?.value?.length)
}
