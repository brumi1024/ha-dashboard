import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { homeEntities } from '../../config/rooms'
import { Icon } from '@mdi/react'
import { mdiHome, mdiHomeExportOutline, mdiAccountGroup, mdiWeatherNight, mdiBeach } from '@mdi/js'
import { colors, spacing, borderRadius } from '../../styles/theme'

const modeConfig: Record<string, { icon: string; color: string }> = {
  Home: { icon: mdiHome, color: colors.accentGreen },
  Away: { icon: mdiHomeExportOutline, color: colors.accentAmber },
  Night: { icon: mdiWeatherNight, color: colors.teal },
  Guest: { icon: mdiAccountGroup, color: colors.accentBlue },
  Vacation: { icon: mdiBeach, color: colors.accentAmber },
}

export function ModesSection() {
  const modeEntity = useEntity(homeEntities.homeMode as EntityName, { returnNullIfNotFound: true })

  if (!modeEntity) return null

  const currentMode = modeEntity.state as string
  const options: string[] = (modeEntity.attributes as { options?: string[] }).options ?? ['Home', 'Away', 'Guest']

  const handleModeChange = (mode: string) => {
    ;(modeEntity as any).service.select_option({ serviceData: { option: mode } })
  }

  return (
    <div>
      <div className="section-label" style={{ marginBottom: spacing.sm }}>MODE</div>
      <div
        className="liquid-glass"
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'none' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none' }}
        style={{
          display: 'flex',
          gap: '2px',
          padding: '4px',
          borderRadius: borderRadius.full,
        }}
      >
        {options.map((mode) => {
          const config = modeConfig[mode] ?? { icon: mdiHome, color: colors.textSecondary }
          const isActive = currentMode === mode
          return (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.xs,
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: borderRadius.full,
                border: 'none',
                background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                cursor: 'pointer',
                color: isActive ? config.color : colors.textSecondary,
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            >
              <Icon path={config.icon} size={0.7} color={isActive ? config.color : colors.textSecondary} />
              {mode}
            </button>
          )
        })}
      </div>
    </div>
  )
}
