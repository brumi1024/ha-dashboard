import { colors, borderRadius, spacing } from '../../styles/theme'

interface StatBadgeProps {
  icon: string
  value: string
  label?: string
  color?: string
  onClick?: () => void
}

export function StatBadge({ icon, value, label, color, onClick }: StatBadgeProps) {
  return (
    <div
      className="liquid-pill"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        padding: `${spacing.xs} ${spacing.md}`,
        borderRadius: borderRadius.full,
        background: colors.glass,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.2s ease',
        fontSize: '13px',
      }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.background = colors.glassHover)}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.background = colors.glass)}
    >
      <span style={{ color: color || colors.textSecondary }}>{icon}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
      {label && <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{label}</span>}
    </div>
  )
}
