import { useEntity, type EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import type { SensorConfig } from '../../config/rooms'
import { colors, spacing, borderRadius } from '../../styles/theme'
import { getMdiPath } from '../../utils/formatters'

interface SensorBadgeProps {
  sensor: SensorConfig
  onTap: () => void
}

export function SensorBadge({ sensor, onTap }: SensorBadgeProps) {
  const entity = useEntity(sensor.entity as EntityName, { returnNullIfNotFound: true })

  const value = entity ? entity.state : '—'
  const unit = (entity?.attributes as Record<string, unknown>)?.unit_of_measurement as string | undefined ?? sensor.unit ?? ''
  const iconPath = getMdiPath(sensor.icon)

  return (
    <button
      className="liquid-pill"
      onClick={onTap}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        padding: `${spacing.xs} ${spacing.md}`,
        borderRadius: borderRadius.full,
        background: colors.glass,
        cursor: 'pointer',
        border: 'none',
        color: colors.textPrimary,
        fontSize: '13px',
        transition: 'background 0.2s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = colors.glassHover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = colors.glass)}
    >
      {iconPath && <Icon path={iconPath} size={0.6} color={colors.teal} />}
      <span style={{ fontWeight: 500 }}>{value}{unit ? ` ${unit}` : ''}</span>
      <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{sensor.name}</span>
    </button>
  )
}
