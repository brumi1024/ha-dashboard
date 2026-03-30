import { useEntity, type EntityName } from '@hakit/core'
import { evEntities } from '../../config/rooms'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { colors, spacing } from '../../styles/theme'

export function VehicleCard() {
  const battery = useEntity(evEntities.batteryLevel as EntityName, { returnNullIfNotFound: true })
  const range = useEntity(evEntities.batteryRange as EntityName, { returnNullIfNotFound: true })
  const charging = useEntity(evEntities.chargingState as EntityName, { returnNullIfNotFound: true })
  const chargeLimit = useEntity(evEntities.chargeLimit as EntityName, { returnNullIfNotFound: true })
  const chargeCurrent = useEntity(evEntities.chargeCurrent as EntityName, { returnNullIfNotFound: true })
  const sentry = useEntity(evEntities.sentryMode as EntityName, { returnNullIfNotFound: true })
  const lock = useEntity(evEntities.vehicleLock as EntityName, { returnNullIfNotFound: true })
  const cable = useEntity(evEntities.chargeCable as EntityName, { returnNullIfNotFound: true })

  const batteryPct = battery ? parseFloat(battery.state) || 0 : 0
  const rangeKm = range ? `${parseFloat(range.state).toFixed(0)}km` : '--'
  const isConnected = cable?.state === 'on'
  const chargingState = charging?.state || 'unknown'
  const limitPct = chargeLimit ? `${parseFloat(chargeLimit.state).toFixed(0)}%` : '--'
  const currentA = chargeCurrent ? `${parseFloat(chargeCurrent.state).toFixed(0)} A` : '--'

  const breakpoint = useBreakpoint()
  const gaugeSize = breakpoint === 'mobile' ? '110px' : '140px'

  const batteryColor = batteryPct < 20 ? colors.statusAlert : batteryPct < 50 ? '#f0c040' : colors.statusGood

  // SVG arc for battery gauge
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const arcLength = (batteryPct / 100) * circumference * 0.75

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", marginBottom: spacing.md }}>Tesla Raikiri</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xl }}>
        <div style={{ position: 'relative', width: gaugeSize, height: gaugeSize }}>
          <svg viewBox="0 0 140 140" style={{ transform: 'rotate(135deg)' }}>
            <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} strokeLinecap="round" />
            <circle cx="70" cy="70" r={radius} fill="none" stroke={batteryColor} strokeWidth="8" strokeDasharray={`${arcLength} ${circumference - arcLength}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease, stroke 0.5s ease' }} />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>{batteryPct}%</div>
            <div style={{ fontSize: '11px', color: colors.textSecondary }}>{rangeKm}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>{isConnected ? `Connected · ${chargingState}` : 'Disconnected'}</div>
          <div style={{ fontSize: '13px' }}>Charge limit: {limitPct}</div>
          <div style={{ fontSize: '13px' }}>Charge current: {currentA}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginTop: spacing.lg }}>
        <ToggleRow label="Sentry Mode" entityId={evEntities.sentryMode} state={sentry?.state || 'off'} />
        <div style={{ fontSize: '13px' }}>
          <span style={{ color: colors.textSecondary }}>Lock: </span>
          <span style={{ color: lock?.state === 'locked' ? colors.statusGood : colors.statusAlert }}>
            {lock?.state === 'locked' ? '🔒 Locked' : '🔓 Unlocked'}
          </span>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({ label, entityId, state }: { label: string; entityId: string; state: string }) {
  const e = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  const isOn = state === 'on'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
      <span style={{ fontSize: '13px', color: colors.textSecondary }}>{label}:</span>
      <button className="liquid-pill" onClick={() => (e as any)?.service?.toggle()} style={{
        padding: '4px 14px',
        border: 'none',
        background: isOn ? colors.statusGoodSoft : undefined,
        color: isOn ? colors.statusGood : colors.textSecondary,
        cursor: 'pointer', fontSize: '12px',
      }}>
        {isOn ? 'On' : 'Off'}
      </button>
    </div>
  )
}
