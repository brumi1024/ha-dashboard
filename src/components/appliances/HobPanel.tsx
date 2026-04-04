import { useEntity, type EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import {
  mdiGasBurner,
  mdiLock,
  mdiLockOpen,
  mdiTimerSand,
  mdiWifi,
  mdiWifiOff,
} from '@mdi/js'
import type { ApplianceConfig } from '../../config/rooms'
import { colors, spacing, borderRadius } from '../../styles/theme'

interface HobPanelProps {
  appliance: ApplianceConfig
}

export function HobPanel({ appliance }: HobPanelProps) {
  const entities = appliance.entities ?? {}

  const power = useEntity(appliance.entity as EntityName, { returnNullIfNotFound: true })
  const status = useEntity((entities.status ?? '') as EntityName, { returnNullIfNotFound: true })
  const childLock = useEntity((entities.childLock ?? '') as EntityName, { returnNullIfNotFound: true })
  const alarm = useEntity((entities.alarm ?? '') as EntityName, { returnNullIfNotFound: true })
  const connectivity = useEntity((entities.connectivity ?? '') as EntityName, { returnNullIfNotFound: true })

  const isOn = power?.state === 'on'
  const isConnected = connectivity?.state === 'on'
  const childLocked = childLock?.state === 'on'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <Icon path={mdiGasBurner} size={1.4} color={isOn ? colors.amber : colors.textMuted} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>Hob</div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>
            {status?.state ?? (isOn ? 'Active' : 'Off')}
          </div>
        </div>
        <button
          className="liquid-pill"
          onClick={() => (power as any)?.service?.toggle?.()}
          style={{
            border: 'none', cursor: 'pointer',
            padding: `${spacing.xs} ${spacing.md}`,
            borderRadius: borderRadius.full,
            color: isOn ? colors.amber : colors.textSecondary,
            fontSize: '13px', fontWeight: 600,
          }}
        >
          {isOn ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Status badges */}
      <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
        <StatusBadge
          icon={isConnected ? mdiWifi : mdiWifiOff}
          label={isConnected ? 'Connected' : 'Offline'}
          color={isConnected ? colors.statusGood : colors.statusAlert}
        />
        <StatusBadge
          icon={childLocked ? mdiLock : mdiLockOpen}
          label={childLocked ? 'Child Lock On' : 'Child Lock Off'}
          color={childLocked ? colors.amber : colors.textSecondary}
          onClick={() => (childLock as any)?.service?.toggle?.()}
        />
      </div>

      {/* Alarm clock / Timer */}
      {alarm && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
            <label style={{ fontSize: '12px', color: colors.textMuted }}>
              <Icon path={mdiTimerSand} size={0.5} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Timer
            </label>
            <span style={{ fontSize: '12px', color: colors.textPrimary, fontWeight: 500 }}>
              {parseFloat(alarm.state) > 0 ? `${parseFloat(alarm.state)} min` : 'Off'}
            </span>
          </div>
          <input
            type="range"
            min={(alarm.attributes as any)?.min ?? 0}
            max={(alarm.attributes as any)?.max ?? 60}
            step={(alarm.attributes as any)?.step ?? 1}
            value={parseFloat(alarm.state) || 0}
            onChange={(e) => {
              (alarm as any).service.set_value({ serviceData: { value: parseFloat(e.target.value) } })
            }}
            style={{ width: '100%', accentColor: colors.amber, cursor: 'pointer' }}
          />
        </div>
      )}
    </div>
  )
}

function StatusBadge({ icon, label, color, onClick }: { icon: string; label: string; color: string; onClick?: () => void }) {
  return (
    <span
      className="liquid-pill"
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: spacing.xs,
        padding: `2px ${spacing.sm}`, borderRadius: borderRadius.full,
        fontSize: '11px', color,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <Icon path={icon} size={0.55} />
      {label}
    </span>
  )
}
