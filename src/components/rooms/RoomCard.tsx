import { Icon } from '@mdi/react'
import {
  mdiHome,
  mdiSilverwareForkKnife,
  mdiSofa,
  mdiSilverwareVariant,
  mdiBedKing,
  mdiBabyFaceOutline,
  mdiDesk,
  mdiGarage,
  mdiStairsDown,
  mdiShowerHead,
  mdiShower,
  mdiDoor,
} from '@mdi/js'
import { useNavigate } from 'react-router-dom'
import { useEntity, type EntityName } from '@hakit/core'
import type { RoomConfig } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

const iconMap: Record<string, string> = {
  'mdi:silverware-fork-knife': mdiSilverwareForkKnife,
  'mdi:sofa': mdiSofa,
  'mdi:silverware-variant': mdiSilverwareVariant,
  'mdi:bed-king': mdiBedKing,
  'mdi:baby-face-outline': mdiBabyFaceOutline,
  'mdi:desk': mdiDesk,
  'mdi:garage': mdiGarage,
  'mdi:stairs-down': mdiStairsDown,
  'mdi:shower-head': mdiShowerHead,
  'mdi:shower': mdiShower,
  'mdi:door': mdiDoor,
}

interface RoomCardProps {
  room: RoomConfig
}

export function RoomCard({ room }: RoomCardProps) {
  const navigate = useNavigate()
  const temp = useEntity(room.temperatureEntity as EntityName, { returnNullIfNotFound: true })
  const humidity = useEntity(room.humidityEntity as EntityName, { returnNullIfNotFound: true })

  const tempVal = temp ? `${parseFloat(temp.state).toFixed(1)}°C` : '--'
  const humVal = humidity ? `${parseFloat(humidity.state).toFixed(0)}%` : '--'

  return (
    <button
      className="liquid-glass-prominent"
      onClick={() => navigate(`/rooms/${room.id}`)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: spacing.lg,
        color: colors.textPrimary,
        minHeight: '160px',
        textAlign: 'left',
        overflow: 'hidden',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
      }}
    >
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>{room.name}</div>
        <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>
          {tempVal} / {humVal}
        </div>
      </div>
      <div style={{ opacity: 0.3, alignSelf: 'center', marginTop: '8px' }}>
        <Icon path={iconMap[room.icon] || mdiHome} size={2.5} />
      </div>
    </button>
  )
}
