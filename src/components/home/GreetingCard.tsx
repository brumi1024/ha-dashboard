import { useEntity, type EntityName } from '@hakit/core'
import { colors, spacing } from '../../styles/theme'

export function GreetingCard() {
  const person = useEntity('person.benjamin' as EntityName)
  const isHome = person.state === 'home'

  const hour = new Date().getHours()
  let greeting: string
  if (hour >= 22 || hour < 5) greeting = 'Good Night'
  else if (hour >= 18) greeting = 'Good Evening'
  else if (hour >= 12) greeting = 'Good Afternoon'
  else greeting = 'Good Morning'

  const name = person.attributes.friendly_name || 'Benjamin'

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
        <div style={{ fontSize: '13px', color: colors.textSecondary }}>{isHome ? 'Home' : 'Away'}</div>
      </div>
    </div>
  )
}
