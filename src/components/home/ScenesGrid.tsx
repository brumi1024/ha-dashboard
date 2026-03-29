import { useEntity, useService, type EntityName } from '@hakit/core'
import { sceneActions } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

export function ScenesGrid() {
  const scriptService = useService('script' as any)

  return (
    <div>
      <h3 className="section-label" style={{ fontSize: '13px', fontWeight: 600, color: colors.textMuted, marginBottom: spacing.md }}>Scenes</h3>
      <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center' }}>
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

  const iconMap: Record<string, string> = {
    'mdi:weather-sunset-up': '🌅',
    'mdi:weather-night': '🌙',
    'mdi:home-export-outline': '🏠',
    'mdi:home-heart': '❤️',
    'mdi:lightbulb-off': '💡',
    'mdi:water-boiler': '🔥',
  }

  return (
    <button
      className="liquid-pill"
      onClick={handleClick}
      style={{
        display: 'flex', alignItems: 'center', gap: spacing.sm,
        padding: '8px 18px',
        border: 'none',
        background: isActive ? colors.amberSoft : undefined,
        color: isActive ? colors.amber : colors.textPrimary,
        cursor: 'pointer', fontSize: '13px',
      }}
    >
      <span>{iconMap[scene.icon] || '🎬'}</span>
      {scene.name}
    </button>
  )
}
