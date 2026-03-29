import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { homeEntities } from '../../config/rooms'
import { Icon } from '@mdi/react'
import { mdiHome, mdiHomeExportOutline, mdiAccountGroup } from '@mdi/js'
import { colors, spacing } from '../../styles/theme'

const modeConfig: Record<string, { icon: string; color: string }> = {
  Home: { icon: mdiHome, color: colors.accentGreen },
  Away: { icon: mdiHomeExportOutline, color: colors.accentAmber },
  Guest: { icon: mdiAccountGroup, color: colors.accentBlue },
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
      <div style={{ display: 'flex', gap: spacing.sm }}>
        {options.map((mode) => {
          const config = modeConfig[mode] ?? { icon: mdiHome, color: colors.textSecondary }
          const isActive = currentMode === mode
          return (
            <button
              key={mode}
              className={isActive ? 'liquid-pill liquid-pill-active' : 'liquid-pill'}
              onClick={() => handleModeChange(mode)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.xs,
                padding: `${spacing.sm} ${spacing.md}`,
                border: 'none',
                cursor: 'pointer',
                color: isActive ? config.color : colors.textSecondary,
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: 600,
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
