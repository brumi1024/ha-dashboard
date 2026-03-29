import { useEntity, type EntityName } from '@hakit/core'
import { StatBadge } from '../shared/StatBadge'

export function WeatherBadge() {
  const weather = useEntity('weather.forecast_home' as EntityName)
  const temp = weather.attributes.temperature
  const condition = weather.state
  const tempHigh = weather.attributes.forecast?.[0]?.temperature
  const tempLow = weather.attributes.forecast?.[0]?.templow

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <StatBadge
        icon="🌤"
        value={`${temp}°C, ${condition.charAt(0).toUpperCase() + condition.slice(1)}`}
      />
      {tempHigh != null && tempLow != null && (
        <StatBadge icon="📊" value={`${tempHigh}° Hi / ${tempLow}° Lo`} />
      )}
    </div>
  )
}
