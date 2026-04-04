import { Icon } from '@mdi/react'
import { mdiLightbulb, mdiLightbulbOff } from '@mdi/js'
import { useEntity, type EntityName } from '@hakit/core'
import { colors, borderRadius, spacing } from '../../styles/theme'

interface DeviceCardProps {
  entity: string
  name?: string
}

export function DeviceCard({ entity, name }: DeviceCardProps) {
  const device = useEntity(entity as EntityName)
  const isOn = device.state === 'on'
  const displayName = name || device.attributes.friendly_name || entity.split('.').pop()

  return (
    <button
      className="liquid-glass"
      onClick={() => (device as any).service.toggle()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        padding: `${spacing.md} ${spacing.lg}`,
        borderRadius: borderRadius.lg,
        border: 'none',
        background: isOn ? colors.amberSoft : undefined,
        color: isOn ? colors.amber : colors.textSecondary,
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        fontSize: '14px',
      }}
    >
      <span style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: isOn ? colors.amberGlow : 'rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.3s ease',
      }}>
        <Icon path={isOn ? mdiLightbulb : mdiLightbulbOff} size={0.8} color={isOn ? colors.amber : colors.textMuted} />
      </span>
      <div>
        <div style={{ fontWeight: 500, color: colors.textPrimary }}>{displayName}</div>
        <div style={{ fontSize: '12px', color: colors.textSecondary }}>{isOn ? 'On' : 'Off'}</div>
      </div>
    </button>
  )
}
