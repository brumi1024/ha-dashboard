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

  if (!isActive) return null

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
        color={colors.accentBlue}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '2px' }}>
          {name}
        </div>
        <div style={{ fontSize: '15px', color: colors.textPrimary, fontWeight: 500 }}>
          {attrs.message}
        </div>
        {formattedTime && (
          <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>
            {formattedTime}
          </div>
        )}
      </div>
    </div>
  )
}

function NoEventsMessage() {
  const states = calendarEntities.map((id) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEntity(id as EntityName, { returnNullIfNotFound: true })
  )
  const anyActive = states.some((e) => e?.state === 'on')
  if (anyActive) return null

  return (
    <div className="liquid-glass" style={{
      padding: `${spacing.lg} ${spacing.md}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing.sm,
      textAlign: 'center',
    }}>
      <Icon path={mdiCalendar} size={1.5} color={colors.textMuted} />
      <div style={{ fontSize: '15px', color: colors.textSecondary }}>No upcoming events</div>
      <div style={{ fontSize: '12px', color: colors.textMuted }}>Your calendars are clear</div>
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
      <NoEventsMessage />
    </div>
  )
}
