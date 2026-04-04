import * as mdiIcons from '@mdi/js'

/**
 * Convert an MDI icon name (e.g. "mdi:molecule-co2") to the @mdi/js export path.
 */
export function getMdiPath(mdiName: string): string | undefined {
  const camel = mdiName
    .replace(/^mdi:/, '')
    .split('-')
    .map((s, i) => (i === 0 ? 'mdi' : '') + s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
  return (mdiIcons as Record<string, string>)[camel]
}

/**
 * Format HA weather condition strings to human-readable text.
 * e.g. "partlycloudy" → "Partly Cloudy", "clear-night" → "Clear Night"
 */
export function formatWeatherCondition(condition: string): string {
  const special: Record<string, string> = {
    'lightning-rainy': 'Thunderstorm',
    'partlycloudy': 'Partly Cloudy',
  }
  if (special[condition]) return special[condition]
  return condition
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * Format raw appliance program names to human-readable text.
 * e.g. "dishcare_dishwasher_program_eco_50" → "Eco 50"
 */
export function formatProgramName(raw: string): string {
  if (!raw || raw === '—' || raw === 'unknown') return raw

  const prefixes = [
    'dishcare_dishwasher_program_',
    'cooking_oven_program_',
    'cooking_common_program_',
    'laundrycare_washer_program_',
  ]

  let cleaned = raw
  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.slice(prefix.length)
      break
    }
  }

  return cleaned
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
