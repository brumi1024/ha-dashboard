import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiServerNetwork, mdiUpdate, mdiBellOutline } from '@mdi/js'
import { homeEntities } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

export function SystemHealth() {
  const notifCount = useEntity(homeEntities.notificationCount as EntityName, { returnNullIfNotFound: true })
  const haCore = useEntity('update.home_assistant_core_update' as EntityName, { returnNullIfNotFound: true })
  const haOS = useEntity('update.home_assistant_operating_system_update' as EntityName, { returnNullIfNotFound: true })
  const supervisor = useEntity('update.home_assistant_supervisor_update' as EntityName, { returnNullIfNotFound: true })

  const coreVersion = (haCore?.attributes as { installed_version?: string })?.installed_version ?? '—'
  const osVersion = (haOS?.attributes as { installed_version?: string })?.installed_version ?? '—'
  const supVersion = (supervisor?.attributes as { installed_version?: string })?.installed_version ?? '—'

  const coreUpdateAvailable = haCore?.state === 'on'
  const osUpdateAvailable = haOS?.state === 'on'
  const supUpdateAvailable = supervisor?.state === 'on'

  return (
    <div className="liquid-glass" style={{ padding: spacing.md }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
        <Icon path={mdiServerNetwork} size={1} color={colors.accentBlue} />
        <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>Home Assistant</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: colors.textSecondary }}>Core</span>
          <span style={{ fontSize: '14px', color: coreUpdateAvailable ? colors.accentAmber : colors.textPrimary, fontWeight: 500 }}>
            {coreVersion} {coreUpdateAvailable ? '(update available)' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: colors.textSecondary }}>OS</span>
          <span style={{ fontSize: '14px', color: osUpdateAvailable ? colors.accentAmber : colors.textPrimary, fontWeight: 500 }}>
            {osVersion} {osUpdateAvailable ? '(update available)' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: colors.textSecondary }}>Supervisor</span>
          <span style={{ fontSize: '14px', color: supUpdateAvailable ? colors.accentAmber : colors.textPrimary, fontWeight: 500 }}>
            {supVersion} {supUpdateAvailable ? '(update available)' : ''}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.md }}>
        <div className="liquid-pill" style={{ flex: 1, padding: spacing.sm, textAlign: 'center' }}>
          <Icon path={mdiUpdate} size={0.6} color={colors.textSecondary} />
          <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>Updates</div>
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
