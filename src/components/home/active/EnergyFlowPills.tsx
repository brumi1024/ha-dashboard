import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { energyEntities } from '../../../config/rooms'
import { StatBadge } from '../../shared/StatBadge'
import { colors, spacing } from '../../../styles/theme'

export function EnergyFlowPills() {
  const gridImport = useEntity(energyEntities.gridImport as EntityName, { returnNullIfNotFound: true })
  const gridExport = useEntity(energyEntities.gridExport as EntityName, { returnNullIfNotFound: true })
  const dailySolar = useEntity(energyEntities.dailyProduction as EntityName, { returnNullIfNotFound: true })

  const importW = gridImport ? Number(gridImport.state) : 0
  const exportW = gridExport ? Number(gridExport.state) : 0
  const dailyKwh = dailySolar ? Number(dailySolar.state).toFixed(1) : '—'

  return (
    <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
      <StatBadge icon="⬇️" value={`${Math.round(importW)}W`} label="Import" color={colors.accentRed} />
      <StatBadge icon="⬆️" value={`${Math.round(exportW)}W`} label="Export" color={colors.accentGreen} />
      <StatBadge icon="☀️" value={`${dailyKwh} kWh`} label="Today" color={colors.accentAmber} />
    </div>
  )
}
