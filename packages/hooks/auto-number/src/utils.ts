export const convertPlaceholder = (value: string): string => {
	let prefix = value
	const date = new Date()

	prefix = prefix.replace(/\[yyyy\]/gi, date.getFullYear().toString())
	prefix = prefix.replace(/\[mm\]/gi, (date.getMonth() + 1).toString().padStart(2, '0'))
	prefix = prefix.replace(/\[dd\]/gi, date.getDate().toString().padStart(2, '0'))

	return prefix
}

export const generateAutoNumber = (prefix: string, number: number, minNumberOfDigits: number): string => {
  let numberStr = number.toString()
  if (numberStr.length < minNumberOfDigits) {
    numberStr = numberStr.padStart(minNumberOfDigits, '0')
  }

  return `${prefix}${numberStr}`
}

export const getNextNumber = (latestNumber: null | number, startNumber: number): number => {
  let nextNumber = startNumber

  if (latestNumber !== null) {
    nextNumber = latestNumber < startNumber 
      ? startNumber + 1
      : latestNumber + 1
  }

  return nextNumber
}

export default {
  convertPlaceholder,
  generateAutoNumber,
  getNextNumber,
}
