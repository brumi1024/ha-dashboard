import { useEntity, type EntityName } from '@hakit/core'
import { StatBadge } from '../shared/StatBadge'
import { colors } from '../../styles/theme'

export function TemperatureDisplay() {
  const indoor = useEntity('sensor.indoor_temperature_average' as EntityName)
  const outdoor = useEntity('sensor.outdoor_sensor_temperature' as EntityName)

  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
      <StatBadge icon="🌡" value={`${parseFloat(indoor.state).toFixed(1)}°C`} label="Indoor" color={colors.teal} />
      <StatBadge icon="🌬" value={`${parseFloat(outdoor.state).toFixed(1)}°C`} label="Outdoor" color={colors.phaseB} />
    </div>
  )
}
