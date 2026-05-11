export const useJaDateFormatter = () => {
  const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const formatDate = (date: string) => dateFormatter.format(new Date(date))

  return {
    formatDate,
  }
}
