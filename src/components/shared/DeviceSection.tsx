import { colors, spacing } from '../../styles/theme'
import { DeviceCard } from './DeviceCard'

interface DeviceSectionProps {
  title: string
  entities: string[]
}

export function DeviceSection({ title, entities }: DeviceSectionProps) {
  if (entities.length === 0) return null

  return (
    <div style={{ marginBottom: spacing.lg }}>
      <h3 className="section-label" style={{
        fontSize: '13px',
        fontWeight: 600,
        color: colors.textMuted,
        marginBottom: spacing.md,
      }}>
        {title}
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: spacing.sm,
      }}>
        {entities.map((entity) => (
          <DeviceCard key={entity} entity={entity} />
        ))}
      </div>
    </div>
  )
}
