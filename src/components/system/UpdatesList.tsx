import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiUpdate, mdiCheck } from '@mdi/js'
import { colors, spacing } from '../../styles/theme'

const trackedUpdates = [
  'update.tailscale_update',
  'update.mosquitto_broker_update',
  'update.studio_code_server_update',
  'update.matter_server_update',
  'update.advanced_ssh_web_terminal_update',
  'update.openthread_border_router_update',
  'update.get_hacs_update',
  'update.browser_mod_update',
  'update.adaptive_lighting_update',
]

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
        {trackedUpdates.map((entityId) => (
          <UpdateEntry key={entityId} entityId={entityId} />
        ))}
      </div>
    </div>
  )
}
