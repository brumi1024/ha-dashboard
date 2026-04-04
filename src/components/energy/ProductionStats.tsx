import { useEntity, type EntityName } from '@hakit/core'
import { energyEntities } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

export function ProductionStats() {
  const daily = useEntity(energyEntities.dailyProduction as EntityName, { returnNullIfNotFound: true })
  const monthly = useEntity(energyEntities.monthlyProduction as EntityName, { returnNullIfNotFound: true })
  const forecastToday = useEntity(energyEntities.forecastToday as EntityName, { returnNullIfNotFound: true })
  const forecastTomorrow = useEntity(energyEntities.forecastTomorrow as EntityName, { returnNullIfNotFound: true })

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: spacing.md }}>Production</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Today</div>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>{daily ? `${parseFloat(daily.state).toFixed(1)} kWh` : '--'}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Monthly</div>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>{monthly ? `${parseFloat(monthly.state).toFixed(1)} kWh` : '--'}</div>
        </div>
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: spacing.md }}>Forecast</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Today</div>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>{forecastToday ? `${parseFloat(forecastToday.state).toFixed(1)} kWh` : '--'}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Tomorrow</div>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>{forecastTomorrow ? `${parseFloat(forecastTomorrow.state).toFixed(1)} kWh` : '--'}</div>
        </div>
      </div>
    </div>
  )
}
