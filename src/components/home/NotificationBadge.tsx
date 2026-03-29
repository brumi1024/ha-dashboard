import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { homeEntities } from '../../config/rooms'
import { Icon } from '@mdi/react'
import { mdiBellOutline } from '@mdi/js'
import { colors, spacing } from '../../styles/theme'

export function NotificationBadge() {
  const countEntity = useEntity(homeEntities.notificationCount as EntityName, { returnNullIfNotFound: true })
  const count = countEntity ? Number(countEntity.state) : 0

  if (count === 0) return null

  return (
    <div
      className="liquid-pill"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.xs,
        padding: `${spacing.xs} ${spacing.sm}`,
        cursor: 'pointer',
      }}
    >
      <Icon path={mdiBellOutline} size={0.7} color={colors.accentAmber} />
      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.accentAmber }}>
        {count}
      </span>
    </div>
  )
}
