import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiUpdate, mdiCheck } from '@mdi/js'
import { systemEntities } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

function UpdateEntry({ entityId }: { entityId: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  if (!entity) return null

  const attrs = entity.attributes as {
    friendly_name?: string
    installed_version?: string
    latest_version?: string
  }
  const hasUpdate = entity.state === 'on'
  const name = attrs.friendly_name?.replace(' Update', '').replace(' update', '') ?? entityId

  return (
    <div
      className="liquid-glass"
      style={{
        padding: spacing.sm,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
      }}
    >
      <Icon
        path={hasUpdate ? mdiUpdate : mdiCheck}
        size={0.7}
        color={hasUpdate ? colors.accentAmber : colors.accentGreen}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', color: colors.textPrimary, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: '12px', color: colors.textMuted }}>
          {attrs.installed_version ?? '—'}
          {hasUpdate && attrs.latest_version ? ` → ${attrs.latest_version}` : ''}
        </div>
      </div>
    </div>
  )
}

export function UpdatesList() {
  return (
    <div>
      <div className="section-label" style={{ marginBottom: spacing.sm }}>ADD-ONS & INTEGRATIONS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        {systemEntities.trackedUpdates.map((entityId) => (
          <UpdateEntry key={entityId} entityId={entityId} />
        ))}
      </div>
    </div>
  )
}
