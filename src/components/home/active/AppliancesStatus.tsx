import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiPowerPlug } from '@mdi/js'
import { rooms } from '../../../config/rooms'
import { colors, spacing } from '../../../styles/theme'

const allAppliances = rooms.flatMap(room =>
  room.appliances.map(app => ({ ...app, roomName: room.name }))
)

const activeStates = new Set(['on', 'playing', 'paused', 'run', 'ready', 'finished'])

function ApplianceCard({ entity, name, roomName }: { entity: string; name: string; roomName: string }) {
  const e = useEntity(entity as EntityName, { returnNullIfNotFound: true })
  if (!e || !activeStates.has(e.state)) return null

  return (
    <div className="liquid-glass" style={{
      padding: spacing.sm, display: 'flex', alignItems: 'center', gap: spacing.sm,
    }}>
      <Icon path={mdiPowerPlug} size={0.7} color={colors.accentAmber} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', color: colors.textPrimary, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: '12px', color: colors.textMuted }}>
          {roomName} · {e.state}
        </div>
      </div>
    </div>
  )
}

export function AppliancesStatus() {
  return (
    <>
      {allAppliances.map(({ entity, name, roomName }) => (
        <ApplianceCard key={entity} entity={entity} name={name} roomName={roomName} />
      ))}
    </>
  )
}
