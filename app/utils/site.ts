export const createAbsoluteUrl = (siteUrl: string, path: string) => {
  return new URL(path, `${siteUrl.replace(/\/$/, '')}/`).toString()
}