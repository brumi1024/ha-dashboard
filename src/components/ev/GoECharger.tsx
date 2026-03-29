import { useEntity, type EntityName } from '@hakit/core'
import { evEntities } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

export function GoECharger() {
  const status = useEntity(evEntities.goEStatus as EntityName, { returnNullIfNotFound: true })
  const energyTotal = useEntity(evEntities.goEEnergyTotal as EntityName, { returnNullIfNotFound: true })
  const statusText = status?.state || 'Unknown'
  const totalKwh = energyTotal ? `${parseFloat(energyTotal.state).toFixed(0)} kWh total` : ''

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", marginBottom: spacing.md }}>Go-e Charger</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
        <span style={{ fontSize: '20px' }}>🔌</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>Go-e · {statusText}</div>
          {totalKwh && <div style={{ fontSize: '12px', color: colors.textSecondary }}>{totalKwh}</div>}
        </div>
      </div>
    </div>
  )
}
