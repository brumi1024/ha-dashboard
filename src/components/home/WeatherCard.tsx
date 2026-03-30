import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import {
  mdiWeatherSunny,
  mdiWeatherCloudy,
  mdiWeatherPartlyCloudy,
  mdiWeatherRainy,
  mdiWeatherSnowy,
  mdiWeatherLightningRainy,
  mdiWeatherFog,
  mdiWeatherNight,
  mdiWeatherWindy,
  mdiWeatherHail,
  mdiWater,
  mdiArrowUp,
  mdiArrowDown,
} from '@mdi/js'
import { weatherEntity } from '../../config/rooms'
import { useForecast } from '../../hooks/useForecast'
import { colors, spacing } from '../../styles/theme'

export const conditionIcons: Record<string, string> = {
  'sunny': mdiWeatherSunny,
  'clear-night': mdiWeatherNight,
  'cloudy': mdiWeatherCloudy,
  'partlycloudy': mdiWeatherPartlyCloudy,
  'rainy': mdiWeatherRainy,
  'pouring': mdiWeatherRainy,
  'snowy': mdiWeatherSnowy,
  'snowy-rainy': mdiWeatherSnowy,
  'lightning': mdiWeatherLightningRainy,
  'lightning-rainy': mdiWeatherLightningRainy,
  'fog': mdiWeatherFog,
  'windy': mdiWeatherWindy,
  'windy-variant': mdiWeatherWindy,
  'hail': mdiWeatherHail,
  'exceptional': mdiWeatherCloudy,
}

export function formatCondition(condition: string): string {
  return condition.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

interface WeatherCardProps {
  onClick?: () => void
}

export function WeatherCard({ onClick }: WeatherCardProps) {
  const weather = useEntity(weatherEntity as EntityName)
  const { daily, hourly } = useForecast()
  const temp = weather.attributes.temperature ?? 0
  const condition = weather.state
  const feelsLike = (weather.attributes as { apparent_temperature?: number }).apparent_temperature
  const windSpeed = (weather.attributes as { wind_speed?: number }).wind_speed
  const humidity = (weather.attributes as { humidity?: number }).humidity
  const todayHigh = daily[0]?.temperature
  const todayLow = daily[0]?.templow

  const iconPath = conditionIcons[condition] || mdiWeatherCloudy

  // Use hourly for pills (next 6 hours)
  const forecastPills = hourly.slice(0, 6)

  return (
    <div
      className="liquid-glass"
      onClick={onClick}
      style={{
        width: '100%',
        padding: `${spacing.md} ${spacing.lg}`,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
        cursor: onClick ? 'pointer' : undefined,
      }}
    >
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <Icon path={iconPath} size={1.8} color={colors.accentAmber} style={{ flexShrink: 0 }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing.sm }}>
          <span style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.03em', color: colors.textPrimary }}>
            {Math.round(temp)}°
          </span>
          <span style={{ fontSize: '14px', color: colors.textSecondary, fontWeight: 500 }}>
            {formatCondition(condition)}
          </span>
        </div>
      </div>

      {/* Secondary info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.md, fontSize: '12px', color: colors.textMuted, paddingLeft: '2px' }}>
        {todayHigh != null && todayLow != null && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Icon path={mdiArrowUp} size={0.45} color={colors.accentRed} />
            {Math.round(todayHigh)}°
            <Icon path={mdiArrowDown} size={0.45} color={colors.accentBlue} />
            {Math.round(todayLow)}°
          </span>
        )}
        {feelsLike != null && <span>Feels {Math.round(feelsLike)}°</span>}
        {windSpeed != null && <span>Wind {Math.round(windSpeed)} km/h</span>}
        {humidity != null && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Icon path={mdiWater} size={0.4} color={colors.accentBlue} />
            {humidity}%
          </span>
        )}
      </div>

      {/* Hourly forecast pills */}
      {forecastPills.length > 0 && (
        <div
          className="hide-scrollbar"
          style={{
            display: 'flex', gap: spacing.xs,
            overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
            marginTop: spacing.xs,
            marginLeft: `-${spacing.sm}`, marginRight: `-${spacing.sm}`,
            paddingLeft: spacing.sm, paddingRight: spacing.sm,
          }}
        >
          {forecastPills.map((item) => {
            const d = new Date(item.datetime)
            const label = d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
            return (
              <div
                key={item.datetime}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '2px', padding: `${spacing.xs} ${spacing.sm}`,
                  flexShrink: 0, minWidth: '44px',
                  borderRadius: '12px', background: 'rgba(255,255,255,0.04)',
                }}
              >
                <span style={{ fontSize: '10px', color: colors.textMuted, whiteSpace: 'nowrap' }}>{label}</span>
                <Icon path={conditionIcons[item.condition] || mdiWeatherCloudy} size={0.55} color={colors.textSecondary} />
                <span style={{ fontSize: '12px', color: colors.textPrimary, fontWeight: 600 }}>{Math.round(item.temperature)}°</span>
              </div>
            )
          })}
        </div>
      )}

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  )
}
