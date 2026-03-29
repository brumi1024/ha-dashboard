import { useEntity, useHistory, type EntityName } from '@hakit/core'
import { energyEntities } from '../../config/rooms'
import { AnimatedCounter } from '../shared/AnimatedCounter'
import { colors, spacing } from '../../styles/theme'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function GridSection() {
  const gridImport = useEntity(energyEntities.gridImport as EntityName, { returnNullIfNotFound: true })
  const gridExport = useEntity(energyEntities.gridExport as EntityName, { returnNullIfNotFound: true })
  const importHistory = useHistory(energyEntities.gridImport as EntityName, { hoursToShow: 24 })

  const importW = gridImport ? parseFloat(gridImport.state) || 0 : 0
  const exportW = gridExport ? parseFloat(gridExport.state) || 0 : 0
  const chartData = importHistory.coordinates?.map(([x, y]) => ({ time: x, import: Math.max(0, y) })) || []

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", marginBottom: spacing.md }}>Grid</h3>
      <div style={{ display: 'flex', gap: spacing.lg, marginBottom: spacing.lg }}>
        <div>
          <div style={{ fontSize: '12px', color: colors.gridImport, marginBottom: spacing.xs }}>Import</div>
          <div style={{ fontSize: '18px', fontWeight: 500 }}><AnimatedCounter value={importW} suffix=" W" /></div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: colors.gridExport, marginBottom: spacing.xs }}>Export</div>
          <div style={{ fontSize: '18px', fontWeight: 500 }}><AnimatedCounter value={exportW} suffix=" W" /></div>
        </div>
      </div>
      {chartData.length > 0 && (
        <div>
          <h4 className="section-label" style={{ fontSize: '13px', fontWeight: 600, color: colors.textMuted, marginBottom: spacing.sm }}>Grid Power (24h)</h4>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'rgba(10, 26, 18, 0.9)', border: `1px solid ${colors.glassBorder}`, borderRadius: '8px', color: colors.textPrimary, backdropFilter: 'blur(16px)' }}
                  formatter={(value) => [`${Number(value).toFixed(0)} W`, 'Import']}
                />
                <Area type="monotone" dataKey="import" stroke={colors.gridImport} fill="rgba(224, 80, 80, 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
