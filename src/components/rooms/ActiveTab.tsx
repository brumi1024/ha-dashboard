import { useEntity, type EntityName } from '@hakit/core'
import type { RoomConfig } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

interface ActiveTabProps {
  room: RoomConfig
}

export function ActiveTab({ room }: ActiveTabProps) {
  const allEntities = [...room.lights, ...room.switches, ...room.appliances.map(a => a.entity)]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
      {allEntities.map((entityId) => (
        <ActiveEntityRow key={entityId} entityId={entityId} />
      ))}
      {allEntities.length === 0 && (
        <div style={{ color: colors.textSecondary, textAlign: 'center', padding: spacing.xl }}>
          No entities configured for this room
        </div>
      )}
    </div>
  )
}

function ActiveEntityRow({ entityId }: { entityId: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  if (!entity || entity.state === 'off' || entity.state === 'unavailable') return null

  const name = entity.attributes.friendly_name || entityId.split('.').pop()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: spacing.md, background: colors.glass, borderRadius: '12px' }}>
      <span style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: colors.amberGlow,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>💡</span>
      <span style={{ color: colors.textPrimary, fontSize: '14px' }}>{name}</span>
    </div>
  )
}
