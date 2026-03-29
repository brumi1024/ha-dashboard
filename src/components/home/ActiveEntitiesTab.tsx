import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { rooms, securityEntities, homeEntities } from '../../config/rooms'
import { Icon } from '@mdi/react'
import {
  mdiLightbulbOn,
  mdiLightbulbOutline,
  mdiGarage,
  mdiLockOpen,
} from '@mdi/js'
import { colors, spacing } from '../../styles/theme'

function LightStatus({ entityId, roomName }: { entityId: string; roomName: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  if (!entity || entity.state !== 'on') return null
  const name = (entity.attributes as { friendly_name?: string }).friendly_name ?? entityId
  return (
    <div className="liquid-glass" style={{ padding: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
      <Icon path={mdiLightbulbOn} size={0.8} color={colors.accentAmber} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', color: colors.textPrimary, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: '12px', color: colors.textMuted }}>{roomName}</div>
      </div>
      <button
        onClick={() => (entity as any).service.toggle()}
        style={{
          background: 'none',
          border: `1px solid ${colors.textMuted}`,
          borderRadius: '8px',
          color: colors.textSecondary,
          padding: `${spacing.xs} ${spacing.sm}`,
          cursor: 'pointer',
          fontSize: '12px',
          fontFamily: 'inherit',
        }}
      >
        Turn off
      </button>
    </div>
  )
}

function SecurityEntityStatus({ entityId, icon, label }: { entityId: string; icon: string; label: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  if (!entity) return null
  const isOpen = entity.state === 'open' || entity.state === 'unlocked'
  if (!isOpen) return null
  return (
    <div className="liquid-glass" style={{ padding: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
      <Icon path={icon} size={0.8} color={colors.accentRed} />
      <div style={{ fontSize: '14px', color: colors.textPrimary, fontWeight: 500 }}>{label}</div>
      <div style={{ marginLeft: 'auto', fontSize: '13px', color: colors.accentRed, fontWeight: 600 }}>
        {entity.state}
      </div>
    </div>
  )
}

function ActiveLightCount() {
  const entity = useEntity(homeEntities.activeLightsCount as EntityName, { returnNullIfNotFound: true })
  const count = entity ? Number(entity.state) : 0
  return (
    <div className="liquid-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs, padding: `${spacing.xs} ${spacing.sm}` }}>
      <Icon path={count > 0 ? mdiLightbulbOn : mdiLightbulbOutline} size={0.7} color={count > 0 ? colors.accentAmber : colors.textMuted} />
      <span style={{ fontSize: '13px', fontWeight: 600, color: count > 0 ? colors.accentAmber : colors.textMuted }}>
        {count} light{count !== 1 ? 's' : ''} on
      </span>
    </div>
  )
}

export function ActiveEntitiesTab() {
  const allLightEntities: { entityId: string; roomName: string }[] = []
  for (const room of rooms) {
    for (const lightId of room.lights) {
      allLightEntities.push({ entityId: lightId, roomName: room.name })
    }
    for (const switchId of room.switches) {
      allLightEntities.push({ entityId: switchId, roomName: room.name })
    }
  }

  return (
    <div className="stagger-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, width: '100%', maxWidth: '600px' }}>
      <ActiveLightCount />

      <div className="section-label" style={{ marginTop: spacing.md }}>SECURITY</div>
      <SecurityEntityStatus entityId={securityEntities.frontDoorLock} icon={mdiLockOpen} label="Front Door" />
      <SecurityEntityStatus entityId={securityEntities.rightGarageDoor} icon={mdiGarage} label="Right Garage" />
      <SecurityEntityStatus entityId={securityEntities.garageDoor} icon={mdiGarage} label="Left Garage" />

      <div className="section-label" style={{ marginTop: spacing.md }}>ACTIVE LIGHTS</div>
      {allLightEntities.map(({ entityId, roomName }) => (
        <LightStatus key={entityId} entityId={entityId} roomName={roomName} />
      ))}
    </div>
  )
}
