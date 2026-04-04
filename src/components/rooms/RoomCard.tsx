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
  mdiHammerWrench,
} from '@mdi/js'
import { useNavigate } from 'react-router-dom'
import { useEntity, useHass, type EntityName } from '@hakit/core'
import type { RoomConfig } from '../../config/rooms'
import { colors, spacing, borderRadius } from '../../styles/theme'

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
  'mdi:hammer-wrench': mdiHammerWrench,
}

interface RoomCardProps {
  room: RoomConfig
}

function SensorValue({ entityId, unit }: { entityId: string; unit?: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  if (!entity) return null
  const val = parseFloat(entity.state)
  const display = isNaN(val) ? entity.state : val.toFixed(0)
  return <>{display}{unit ? ` ${unit}` : ''}</>
}

export function RoomCard({ room }: RoomCardProps) {
  const navigate = useNavigate()
  const temp = useEntity(room.temperatureEntity as EntityName, { returnNullIfNotFound: true })
  const humidity = useEntity(room.humidityEntity as EntityName, { returnNullIfNotFound: true })

  const tempVal = temp ? `${parseFloat(temp.state).toFixed(1)}°C` : '--'
  const humVal = humidity ? `${parseFloat(humidity.state).toFixed(0)}%` : '--'

  const allDeviceEntities = [...room.lights, ...room.switches]
  const hasDevices = allDeviceEntities.length + room.appliances.length + room.media.length > 0
  const hasSensors = room.sensors.length > 0

  // Sensor-only or minimal compact card
  if (!hasDevices) {
    return (
      <div
        className="liquid-glass"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
          padding: `${spacing.sm} ${spacing.lg}`,
          color: colors.textPrimary,
          alignSelf: 'start',
        }}
      >
        <div style={{ opacity: 0.4, flexShrink: 0 }}>
          <Icon path={iconMap[room.icon] || mdiHome} size={0.9} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>{room.name}</div>
          <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>
            {tempVal} / {humVal}
          </div>
        </div>
        {hasSensors && (
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {room.sensors.map((sensor) => (
              <span
                key={sensor.entity}
                className="liquid-pill"
                style={{
                  fontSize: '11px',
                  padding: `2px ${spacing.sm}`,
                  borderRadius: borderRadius.full,
                  color: colors.textSecondary,
                  whiteSpace: 'nowrap',
                }}
                title={sensor.name}
              >
                <SensorValue entityId={sensor.entity} unit={sensor.unit} />
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Full card with devices
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
      }}
    >
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>{room.name}</div>
        <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>
          {tempVal} / {humVal}
        </div>
        <ActiveDeviceBadge entities={allDeviceEntities} />
      </div>
      <div style={{ opacity: 0.3, alignSelf: 'center', marginTop: '8px' }}>
        <Icon path={iconMap[room.icon] || mdiHome} size={2.5} />
      </div>
    </button>
  )
}

function ActiveDeviceBadge({ entities }: { entities: string[] }) {
  const hass = useHass()
  const allEntities = hass.entities as Record<string, { state: string } | undefined>

  const activeCount = entities.filter(id => allEntities[id]?.state === 'on').length
  if (activeCount === 0) return null

  return (
    <div style={{
      fontSize: '11px',
      color: colors.amber,
      marginTop: spacing.xs,
      fontWeight: 500,
    }}>
      {activeCount} {activeCount === 1 ? 'light' : 'lights'} on
    </div>
  )
}
