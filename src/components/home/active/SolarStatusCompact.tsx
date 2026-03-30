import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiWhiteBalanceSunny, mdiHome, mdiArrowRight } from '@mdi/js'
import { energyEntities } from '../../../config/rooms'
import { AnimatedCounter } from '../../shared/AnimatedCounter'
import { colors, spacing } from '../../../styles/theme'

const flowColors: Record<string, string> = {
  Producing: colors.accentGreen,
  Consuming: colors.accentAmber,
  Balanced: colors.accentBlue,
}

export function SolarStatusCompact() {
  const solar = useEntity(energyEntities.solarPower as EntityName, { returnNullIfNotFound: true })
  const home = useEntity(energyEntities.homePower as EntityName, { returnNullIfNotFound: true })
  const flow = useEntity(energyEntities.energyFlowDirection as EntityName, { returnNullIfNotFound: true })

  const solarW = solar ? Number(solar.state) : 0
  const homeW = home ? Number(home.state) : 0
  const flowState = flow?.state ?? 'Balanced'
  const flowColor = flowColors[flowState] ?? colors.textSecondary

  return (
    <div className="liquid-glass" style={{ padding: spacing.md }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <Icon path={mdiWhiteBalanceSunny} size={0.8} color={colors.accentAmber} />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
              <AnimatedCounter value={solarW} suffix="W" />
            </div>
            <div style={{ fontSize: '11px', color: colors.textMuted }}>Solar</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <Icon path={mdiArrowRight} size={0.6} color={flowColor} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: flowColor }}>{flowState}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
              <AnimatedCounter value={homeW} suffix="W" />
            </div>
            <div style={{ fontSize: '11px', color: colors.textMuted }}>Home</div>
          </div>
          <Icon path={mdiHome} size={0.8} color={colors.accentBlue} />
        </div>
      </div>
    </div>
  )
}
