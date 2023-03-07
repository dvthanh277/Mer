const numberFormatter = Intl.NumberFormat()
export const formatNumber = (number) => {
  if (number === null || number === undefined) {
    return null
  }
  return numberFormatter.format(number)
}
