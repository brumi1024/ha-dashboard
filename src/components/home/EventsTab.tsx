import { useMemo } from 'react'
import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { calendarEntities, calendarNames } from '../../config/rooms'
import { Icon } from '@mdi/react'
import { mdiCalendar, mdiCalendarStar, mdiBriefcase, mdiCake, mdiCalendarHeart } from '@mdi/js'
import { colors, spacing } from '../../styles/theme'

const calendarIcons: Record<typeof calendarEntities[number], string> = {
  'calendar.benjamin_s_calendar': mdiCalendar,
  'calendar.birthdays': mdiCake,
  'calendar.privat': mdiCalendarHeart,
  'calendar.bteke_cloudera_com': mdiBriefcase,
  'calendar.holidays_in_hungary': mdiCalendarStar,
  'calendar.mvm_next': mdiCalendar,
}

function CalendarEntry({ entityId }: { entityId: typeof calendarEntities[number] }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })

  if (!entity) return null

  const attrs = entity.attributes as {
    friendly_name?: string
    message?: string
    description?: string
    start_time?: string
    end_time?: string
    all_day?: boolean
  }

  const isActive = entity.state === 'on'
  const icon = calendarIcons[entityId]
  const name = calendarNames[entityId]

  const formattedTime = useMemo(() => {
    if (!attrs.start_time) return null
    return new Date(attrs.start_time).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }, [attrs.start_time])

  return (
    <div
      className="liquid-glass"
      style={{
        padding: spacing.md,
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing.sm,
      }}
    >
      <Icon
        path={icon}
        size={0.8}
        color={isActive ? colors.accentBlue : colors.textMuted}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '2px' }}>
          {name}
        </div>
        {isActive && attrs.message ? (
          <div style={{ fontSize: '15px', color: colors.textPrimary, fontWeight: 500 }}>
            {attrs.message}
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: colors.textMuted }}>
            No upcoming events
          </div>
        )}
        {isActive && formattedTime && (
          <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>
            {formattedTime}
          </div>
        )}
      </div>
    </div>
  )
}

export function EventsTab() {
  return (
    <div className="stagger-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, width: '100%', maxWidth: '600px' }}>
      <div className="section-label">UPCOMING EVENTS</div>
      {calendarEntities.map((entityId) => (
        <CalendarEntry key={entityId} entityId={entityId} />
      ))}
    </div>
  )
}
