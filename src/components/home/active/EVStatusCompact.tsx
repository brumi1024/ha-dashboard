import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiCarElectric, mdiFlash } from '@mdi/js'
import { evEntities, goEEntities } from '../../../config/rooms'
import { AnimatedCounter } from '../../shared/AnimatedCounter'
import { colors, spacing } from '../../../styles/theme'

export function EVStatusCompact() {
  const battery = useEntity(evEntities.batteryLevel as EntityName, { returnNullIfNotFound: true })
  const charging = useEntity(evEntities.chargingState as EntityName, { returnNullIfNotFound: true })
  const chargerPower = useEntity(goEEntities.powerTotal as EntityName, { returnNullIfNotFound: true })

  if (!battery) return null

  const batteryPct = Number(battery.state)
  const isCharging = charging?.state === 'charging'
  const power = chargerPower ? Number(chargerPower.state) : 0

  const barColor = batteryPct > 50 ? colors.accentGreen
    : batteryPct > 20 ? colors.accentAmber
    : colors.accentRed

  return (
    <div className="liquid-glass" style={{ padding: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
      <Icon path={mdiCarElectric} size={1} color={isCharging ? colors.accentGreen : colors.textSecondary} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: colors.textPrimary }}>
            {batteryPct}%
          </span>
          <div style={{
            flex: 1, height: '6px', borderRadius: '3px',
            background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
          }}>
            <div style={{
              width: `${batteryPct}%`, height: '100%', borderRadius: '3px',
              background: barColor, transition: 'width 1s ease',
            }} />
          </div>
        </div>
        <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>
          {isCharging ? 'Charging' : charging?.state ?? 'Unknown'}
          {isCharging && power > 0 && (
            <span style={{ color: colors.accentGreen }}>
              {' · '}<AnimatedCounter value={power} suffix="W" />
            </span>
          )}
        </div>
      </div>
      {isCharging && <Icon path={mdiFlash} size={0.6} color={colors.accentGreen} />}
    </div>
  )
}
