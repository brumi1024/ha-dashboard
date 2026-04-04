import { useEntity, type EntityName } from '@hakit/core'
import { energyEntities } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

export function NetMeteringSection() {
  const status = useEntity(energyEntities.netMeteringStatus as EntityName, { returnNullIfNotFound: true })
  const balance = useEntity(energyEntities.netMeteringBalance as EntityName, { returnNullIfNotFound: true })
  const totalImport = useEntity(energyEntities.netMeteringImport as EntityName, { returnNullIfNotFound: true })
  const totalExport = useEntity(energyEntities.netMeteringExport as EntityName, { returnNullIfNotFound: true })
  const monthlyGrid = useEntity(energyEntities.monthlyGridConsumption as EntityName, { returnNullIfNotFound: true })
  const monthlyExport = useEntity(energyEntities.monthlyGridExport as EntityName, { returnNullIfNotFound: true })
  const lifetime = useEntity(energyEntities.lifetimeProduction as EntityName, { returnNullIfNotFound: true })

  const statusVal = status?.state || '--'
  const balanceVal = balance ? `${parseFloat(balance.state).toFixed(1)} kWh` : '--'
  const isDeficit = statusVal.toLowerCase().includes('deficit')

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: spacing.md }}>Net Metering</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md, color: isDeficit ? colors.statusAlert : colors.statusGood }}>
        <span>{isDeficit ? '🔴' : '🟢'}</span>
        <span style={{ fontWeight: 500 }}>{statusVal} ({balanceVal})</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Total Import</div>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>{totalImport ? `${parseFloat(totalImport.state).toFixed(1)} kWh` : '--'}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Total Export</div>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>{totalExport ? `${parseFloat(totalExport.state).toFixed(1)} kWh` : '--'}</div>
        </div>
      </div>
      <h4 className="section-label" style={{ fontSize: '13px', fontWeight: 600, color: colors.textMuted, marginBottom: spacing.sm }}>Monthly</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.md }}>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Grid Used</div>
          <div style={{ fontSize: '14px' }}>{monthlyGrid ? `${parseFloat(monthlyGrid.state).toFixed(1)} kWh` : '--'}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Grid Export</div>
          <div style={{ fontSize: '14px' }}>{monthlyExport ? `${parseFloat(monthlyExport.state).toFixed(1)} kWh` : '--'}</div>
        </div>
      </div>
      {lifetime && (
        <div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>Lifetime Solar Production</div>
          <div style={{ fontSize: '14px' }}>{parseFloat(lifetime.state).toFixed(1)} kWh</div>
        </div>
      )}
    </div>
  )
}
