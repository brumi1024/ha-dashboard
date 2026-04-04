import { useEntity, type EntityName } from '@hakit/core'
import { energyEntities } from '../../config/rooms'
import { AnimatedCounter } from '../shared/AnimatedCounter'
import { colors, spacing } from '../../styles/theme'

export function BalanceHeader() {
  const direction = useEntity(energyEntities.energyFlowDirection as EntityName, { returnNullIfNotFound: true })
  const solar = useEntity(energyEntities.solarPower as EntityName, { returnNullIfNotFound: true })
  const home = useEntity(energyEntities.homePower as EntityName, { returnNullIfNotFound: true })
  const solarW = solar ? parseFloat(solar.state) || 0 : 0
  const homeW = home ? parseFloat(home.state) || 0 : 0
  const status = direction?.state || 'Balanced'

  return (
    <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, justifyContent: 'center' }}>
        <span style={{ fontSize: '20px' }}>⚡</span>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 600 }}>{status}</div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>
            Solar <AnimatedCounter value={solarW} suffix="W" /> · Home <AnimatedCounter value={homeW} suffix="W" />
          </div>
        </div>
      </div>
    </div>
  )
}
