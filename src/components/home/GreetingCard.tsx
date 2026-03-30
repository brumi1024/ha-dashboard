import { useEntity, type EntityName } from '@hakit/core'
import { colors, spacing } from '../../styles/theme'

interface GreetingCardProps {
  now: Date
}

export function GreetingCard({ now = new Date() }: GreetingCardProps) {
  const person = useEntity('person.benjamin' as EntityName)
  const isHome = person.state === 'home'

  const hour = now.getHours()
  let greeting: string
  if (hour >= 22 || hour < 5) greeting = 'Good Night'
  else if (hour >= 18) greeting = 'Good Evening'
  else if (hour >= 12) greeting = 'Good Afternoon'
  else greeting = 'Good Morning'

  const name = person.attributes.friendly_name || 'Benjamin'

  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const subtitle = `${isHome ? 'Home' : 'Away'} \u00B7 ${dateStr} - ${timeStr}`

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: `${spacing.md} 0` }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%', background: colors.glass,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', overflow: 'hidden',
      }}>
        {person.attributes.entity_picture
          ? <img src={person.attributes.entity_picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : '👤'
        }
      </div>
      <div>
        <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>{greeting}, {name}!</div>
        <div style={{ fontSize: '13px', color: colors.textSecondary }}>{subtitle}</div>
      </div>
    </div>
  )
}
