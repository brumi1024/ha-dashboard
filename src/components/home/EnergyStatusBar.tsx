import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiWhiteBalanceSunny, mdiTransmissionTower, mdiArrowDown, mdiArrowUp } from '@mdi/js'
import { energyEntities } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

export function EnergyStatusBar() {
  const solar = useEntity(energyEntities.solarPower as EntityName, { returnNullIfNotFound: true })
  const gridImport = useEntity(energyEntities.gridImport as EntityName, { returnNullIfNotFound: true })
  const gridExport = useEntity(energyEntities.gridExport as EntityName, { returnNullIfNotFound: true })

  const solarW = solar ? Math.round(Number(solar.state)) : 0
  const importW = gridImport ? Math.round(Number(gridImport.state)) : 0
  const exportW = gridExport ? Math.round(Number(gridExport.state)) : 0

  const isExporting = exportW > importW

  return (
    <div className="liquid-glass" style={{
      padding: `${spacing.sm} ${spacing.md}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      width: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
        <Icon path={mdiWhiteBalanceSunny} size={0.6} color={colors.accentAmber} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary }}>{solarW}W</span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: spacing.xs,
        fontSize: '11px', color: isExporting ? colors.accentGreen : colors.accentRed,
        fontWeight: 500,
      }}>
        <Icon path={mdiTransmissionTower} size={0.5} color={colors.textMuted} />
        <Icon path={isExporting ? mdiArrowUp : mdiArrowDown} size={0.4} />
        <span>{isExporting ? `${exportW}W` : `${importW}W`}</span>
      </div>
    </div>
  )
}
