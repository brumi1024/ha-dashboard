import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiServerNetwork, mdiUpdate, mdiBellOutline } from '@mdi/js'
import { homeEntities, systemEntities } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

function VersionRow({ label, version, hasUpdate }: { label: string; version: string; hasUpdate: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '14px', color: colors.textSecondary }}>{label}</span>
      <span style={{ fontSize: '14px', color: hasUpdate ? colors.accentAmber : colors.textPrimary, fontWeight: 500 }}>
        {version}{hasUpdate ? ' (update available)' : ''}
      </span>
    </div>
  )
}

export function SystemHealth() {
  const notifCount = useEntity(homeEntities.notificationCount as EntityName, { returnNullIfNotFound: true })
  const haCore = useEntity(systemEntities.coreUpdate as EntityName, { returnNullIfNotFound: true })
  const haOS = useEntity(systemEntities.osUpdate as EntityName, { returnNullIfNotFound: true })
  const supervisor = useEntity(systemEntities.supervisorUpdate as EntityName, { returnNullIfNotFound: true })

  const rows = [
    { label: 'Core', entity: haCore },
    { label: 'OS', entity: haOS },
    { label: 'Supervisor', entity: supervisor },
  ]

  const updateCount = rows.filter(r => r.entity?.state === 'on').length

  return (
    <div className="liquid-glass" style={{ padding: spacing.md }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
        <Icon path={mdiServerNetwork} size={1} color={colors.accentBlue} />
        <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>Home Assistant</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {rows.map(({ label, entity }) => (
          <VersionRow
            key={label}
            label={label}
            version={(entity?.attributes as { installed_version?: string })?.installed_version ?? '—'}
            hasUpdate={entity?.state === 'on'}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.md }}>
        <div className="liquid-pill" style={{ flex: 1, padding: spacing.sm, textAlign: 'center' }}>
          <Icon path={mdiUpdate} size={0.6} color={updateCount > 0 ? colors.accentAmber : colors.textSecondary} />
          <div style={{ fontSize: '14px', fontWeight: 600, color: updateCount > 0 ? colors.accentAmber : colors.textPrimary }}>
            {updateCount}
          </div>
          <div style={{ fontSize: '12px', color: colors.textMuted }}>Updates</div>
        </div>
        <div className="liquid-pill" style={{ flex: 1, padding: spacing.sm, textAlign: 'center' }}>
          <Icon path={mdiBellOutline} size={0.6} color={colors.textSecondary} />
          <div style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary }}>
            {notifCount ? notifCount.state : '0'}
          </div>
          <div style={{ fontSize: '12px', color: colors.textMuted }}>Notifications</div>
        </div>
      </div>
    </div>
  )
}
