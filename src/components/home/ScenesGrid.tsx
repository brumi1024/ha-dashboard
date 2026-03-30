import { useEntity, useService, type EntityName } from '@hakit/core'
import { sceneActions } from '../../config/rooms'
import { Icon } from '@mdi/react'
import {
  mdiWeatherSunsetUp,
  mdiWeatherNight,
  mdiHomeExportOutline,
  mdiHomeHeart,
  mdiLightbulbOff,
  mdiWaterBoiler,
} from '@mdi/js'
import { motion } from 'framer-motion'
import { colors, spacing } from '../../styles/theme'

const sceneIcons: Record<string, string> = {
  'mdi:weather-sunset-up': mdiWeatherSunsetUp,
  'mdi:weather-night': mdiWeatherNight,
  'mdi:home-export-outline': mdiHomeExportOutline,
  'mdi:home-heart': mdiHomeHeart,
  'mdi:lightbulb-off': mdiLightbulbOff,
  'mdi:water-boiler': mdiWaterBoiler,
}

export function ScenesGrid() {
  const scriptService = useService('script' as any)

  return (
    <div>
      <div className="section-label" style={{ marginBottom: spacing.sm }}>SCENES</div>
      <div
        className="hide-scrollbar"
        style={{
          display: 'flex',
          gap: spacing.sm,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          paddingBottom: spacing.xs,
        }}
      >
        {sceneActions.map((scene) => (
          <SceneButton key={scene.id} scene={scene} scriptService={scriptService} />
        ))}
      </div>
    </div>
  )
}

function SceneButton({ scene, scriptService }: { scene: typeof sceneActions[number]; scriptService: any }) {
  const entity = useEntity(scene.entity as EntityName, { returnNullIfNotFound: true })
  const isActive = entity?.state === 'on'

  const handleClick = () => {
    if ('isToggle' in scene && scene.isToggle) {
      (entity as any)?.service?.toggle()
    } else {
      scriptService.turn_on({ target: { entity_id: scene.entity } })
    }
  }

  const iconPath = sceneIcons[scene.icon]

  return (
    <motion.button
      className="liquid-glass"
      onClick={handleClick}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        minWidth: '80px',
        padding: `${spacing.md} ${spacing.sm}`,
        border: 'none',
        background: isActive ? colors.amberSoft : undefined,
        color: isActive ? colors.amber : colors.textPrimary,
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: 500,
        fontFamily: 'inherit',
        flexShrink: 0,
      }}
    >
      {iconPath ? (
        <Icon path={iconPath} size={1} color={isActive ? colors.amber : colors.textSecondary} />
      ) : (
        <span style={{ fontSize: '24px' }}>🎬</span>
      )}
      {scene.name}
    </motion.button>
  )
}
