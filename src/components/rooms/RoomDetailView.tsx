import { useEntity, type EntityName } from '@hakit/core'
import type { RoomConfig } from '../../config/rooms'
import { DeviceSection } from '../shared/DeviceSection'
import { colors, spacing } from '../../styles/theme'

interface RoomDetailViewProps {
  room: RoomConfig
}

export function RoomDetailView({ room }: RoomDetailViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <DeviceSection title="Lights" entities={room.lights} />
      <DeviceSection title="Switches" entities={room.switches} />

      {room.appliances.length > 0 && (
        <div>
          <h3 className="section-label" style={{ fontSize: '13px', fontWeight: 600, color: colors.textMuted, marginBottom: spacing.md }}>Appliances</h3>
          <div style={{ display: 'flex', gap: spacing.lg, flexWrap: 'wrap', justifyContent: 'center' }}>
            {room.appliances.map((app) => (
              <ApplianceIcon key={app.entity} appliance={app} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ApplianceIcon({ appliance }: { appliance: RoomConfig['appliances'][number] }) {
  const entity = useEntity(appliance.entity as EntityName, { returnNullIfNotFound: true })

  const isActive = entity?.state === 'on' || entity?.state === 'active'
  const status = entity?.attributes?.program_phase || (isActive ? 'Active' : 'Inactive')

  const iconMap: Record<string, string> = {
    'mdi:dishwasher': '🍽',
    'mdi:stove': '🔥',
    'mdi:gas-burner': '🔥',
    'mdi:fridge': '🧊',
  }

  return (
    <button
      className="liquid-glass"
      onClick={() => (entity as any)?.service?.toggle?.()}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: spacing.xs, border: 'none',
        color: isActive ? colors.textPrimary : colors.textSecondary,
        cursor: 'pointer', padding: `${spacing.md} ${spacing.lg}`,
        borderRadius: '22px',
      }}
    >
      <span style={{ fontSize: '28px', color: isActive ? colors.statusOn : colors.textMuted }}>
        {iconMap[appliance.icon] || '🏠'}
      </span>
      <span style={{ fontSize: '12px', fontWeight: 500 }}>{appliance.name}</span>
      <span style={{ fontSize: '11px', color: colors.textSecondary }}>{status}</span>
    </button>
  )
}
