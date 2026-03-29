import { useEntity, useHistory, type EntityName } from '@hakit/core'
import { energyEntities } from '../../config/rooms'
import { AnimatedCounter } from '../shared/AnimatedCounter'
import { StatBadge } from '../shared/StatBadge'
import { colors, spacing } from '../../styles/theme'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function SolarChart() {
  const solar = useEntity(energyEntities.solarPower as EntityName, { returnNullIfNotFound: true })
  const selfUse = useEntity(energyEntities.selfConsumption as EntityName, { returnNullIfNotFound: true })
  const coverage = useEntity(energyEntities.coverage as EntityName, { returnNullIfNotFound: true })
  const solarHistory = useHistory(energyEntities.solarPower as EntityName, { hoursToShow: 24 })

  const solarW = solar ? parseFloat(solar.state) || 0 : 0
  const selfUseVal = selfUse ? `${parseFloat(selfUse.state).toFixed(1)}%` : '--'
  const coverageVal = coverage ? `${parseFloat(coverage.state).toFixed(1)}%` : '--'

  const chartData = solarHistory.coordinates?.map(([x, y]) => ({ time: x, actual: Math.max(0, y) })) || []

  return (
    <div>
      <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', marginBottom: spacing.lg }}>
        <StatBadge icon="☀️" value={`${solarW}W`} label="Producing" color={colors.solarYellow} />
        <StatBadge icon="🏠" value={selfUseVal} label="Self Use" color={colors.statusGood} />
        <StatBadge icon="🔋" value={coverageVal} label="Coverage" color={colors.statusGood} />
      </div>
      <div style={{ marginBottom: spacing.md }}>
        <h3 className="section-label" style={{ fontSize: '13px', fontWeight: 600, color: colors.textMuted, marginBottom: spacing.xs }}>Actual</h3>
        <div style={{ fontSize: '32px', fontWeight: 300 }}><AnimatedCounter value={solarW} suffix=" W" /></div>
      </div>
      {chartData.length > 0 && (
        <div style={{ width: '100%', height: 200, marginBottom: spacing.lg }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.solarYellow} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.solarYellow} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: 'rgba(10, 26, 18, 0.9)', border: `1px solid ${colors.glassBorder}`, borderRadius: '8px', color: colors.textPrimary, backdropFilter: 'blur(16px)' }}
                formatter={(value) => [`${Number(value).toFixed(0)} W`, 'Solar']}
              />
              <Area type="monotone" dataKey="actual" stroke={colors.solarYellow} fill="url(#solarGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
