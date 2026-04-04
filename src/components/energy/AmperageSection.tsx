import { useEntity, type EntityName } from '@hakit/core'
import { energyEntities } from '../../config/rooms'
import { colors, spacing, borderRadius } from '../../styles/theme'

export function AmperageSection() {
  const phaseA = useEntity(energyEntities.phaseA as EntityName, { returnNullIfNotFound: true })
  const phaseB = useEntity(energyEntities.phaseB as EntityName, { returnNullIfNotFound: true })
  const phaseC = useEntity(energyEntities.phaseC as EntityName, { returnNullIfNotFound: true })
  const imbalance = useEntity(energyEntities.phaseImbalance as EntityName, { returnNullIfNotFound: true })
  const imbalancePct = useEntity(energyEntities.phaseImbalancePercent as EntityName, { returnNullIfNotFound: true })

  const phases = [
    { name: 'Phase A', value: phaseA ? parseFloat(phaseA.state) || 0 : 0, color: colors.phaseA },
    { name: 'Phase B', value: phaseB ? parseFloat(phaseB.state) || 0 : 0, color: colors.phaseB },
    { name: 'Phase C', value: phaseC ? parseFloat(phaseC.state) || 0 : 0, color: colors.phaseC },
  ]
  const maxPhase = Math.max(...phases.map(p => p.value), 1)
  const imbalanceW = imbalance ? parseFloat(imbalance.state) || 0 : 0
  const imbalancePctVal = imbalancePct ? parseFloat(imbalancePct.state) || 0 : 0
  const isSignificant = imbalancePctVal > 50

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: spacing.md }}>Amperage</h3>
      <div style={{ display: 'flex', gap: spacing.lg, marginBottom: spacing.md }}>
        {phases.map((phase) => (
          <div key={phase.name} style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: phase.color }} />
              <span style={{ fontSize: '13px' }}>{phase.name}</span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 500 }}>{phase.value.toFixed(0)} W</div>
            <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.04)', marginTop: spacing.xs }}>
              <div style={{
                height: '100%',
                width: `${(phase.value / maxPhase) * 100}%`,
                borderRadius: '2px',
                background: phase.color,
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
      {imbalanceW > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: spacing.sm,
          padding: `${spacing.sm} ${spacing.md}`, borderRadius: borderRadius.md,
          background: isSignificant ? colors.statusAlertSoft : colors.amberSoft,
          color: isSignificant ? colors.statusAlert : colors.amber, fontSize: '13px',
        }}>
          <span>⚠️</span>
          Imbalance: {imbalanceW.toFixed(0)} W ({imbalancePctVal.toFixed(1)}%)
          {isSignificant && ' — Significant imbalance'}
        </div>
      )}
    </div>
  )
}
