type HrTime = [number, number]

export function parseHrtime(
  unit: 'second' | 'milli' | 'micro' | 'nano',
  hrtime: HrTime,
): number {
  switch (unit) {
    case 'second':
      return hrtime[0] + hrtime[1] / 1000000000

    case 'milli':
      return hrtime[0] * 1000 + hrtime[1] / 1000000

    case 'micro':
      return hrtime[0] * 1000000 + hrtime[1] / 1000

    case 'nano':
      return hrtime[0] * 1000000000 + hrtime[1]

    default:
      return parseHrtime('nano', hrtime)
  }
}

export function startTime(): HrTime {
  return process.hrtime()
}

export function diffTime(start: HrTime): number {
  const end = process.hrtime(start)
  return parseFloat(parseHrtime('milli', end).toFixed(2))
}
