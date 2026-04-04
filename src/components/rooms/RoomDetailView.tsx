import { useState } from 'react'
import { useEntity, type EntityName } from '@hakit/core'
import type { RoomConfig, ApplianceConfig, SensorConfig } from '../../config/rooms'
import { DeviceSection } from '../shared/DeviceSection'
import { RoomMediaCard } from '../shared/RoomMediaCard'
import { SensorBadge } from '../shared/SensorBadge'
import { SensorHistorySheet } from '../shared/SensorHistorySheet'
import { ApplianceSheet } from '../appliances/ApplianceSheet'
import { colors, spacing } from '../../styles/theme'

interface RoomDetailViewProps {
  room: RoomConfig
}

export function RoomDetailView({ room }: RoomDetailViewProps) {
  const [selectedSensor, setSelectedSensor] = useState<SensorConfig | null>(null)
  const [selectedAppliance, setSelectedAppliance] = useState<ApplianceConfig | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <DeviceSection title="Lights" entities={room.lights} />
      <DeviceSection title="Switches" entities={room.switches} />

      {room.appliances.length > 0 && (
        <div>
          <h3 className="section-label" style={{ fontSize: '13px', fontWeight: 600, color: colors.textMuted, marginBottom: spacing.md }}>APPLIANCES</h3>
          <div style={{ display: 'flex', gap: spacing.lg, flexWrap: 'wrap', justifyContent: 'center' }}>
            {room.appliances.map((app) => (
              <ApplianceIcon key={app.entity} appliance={app} onTap={() => setSelectedAppliance(app)} />
            ))}
          </div>
        </div>
      )}

      {room.media.length > 0 && (
        <div>
          <h3 className="section-label" style={{ fontSize: '13px', fontWeight: 600, color: colors.textMuted, marginBottom: spacing.md }}>MEDIA</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {room.media.map((entityId) => (
              <RoomMediaCard key={entityId} entityId={entityId} />
            ))}
          </div>
        </div>
      )}

      {room.sensors.length > 0 && (
        <div>
          <h3 className="section-label" style={{ fontSize: '13px', fontWeight: 600, color: colors.textMuted, marginBottom: spacing.md }}>SENSORS</h3>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
            {room.sensors.map((sensor) => (
              <SensorBadge key={sensor.entity} sensor={sensor} onTap={() => setSelectedSensor(sensor)} />
            ))}
          </div>
        </div>
      )}

      {selectedSensor && (
        <SensorHistorySheet
          isOpen={!!selectedSensor}
          onClose={() => setSelectedSensor(null)}
          sensor={selectedSensor}
        />
      )}

      <ApplianceSheet
        isOpen={!!selectedAppliance}
        onClose={() => setSelectedAppliance(null)}
        appliance={selectedAppliance}
      />
    </div>
  )
}

function ApplianceIcon({ appliance, onTap }: { appliance: ApplianceConfig; onTap: () => void }) {
  const entity = useEntity(appliance.entity as EntityName, { returnNullIfNotFound: true })

  const isActive = entity?.state === 'on' || entity?.state === 'active'
  const status = entity?.attributes?.program_phase || (isActive ? 'Active' : 'Inactive')

  const iconMap: Record<string, string> = {
    'mdi:dishwasher': '🍽',
    'mdi:stove': '🔥',
    'mdi:gas-burner': '🔥',
    'mdi:fridge': '🧊',
    'mdi:printer-3d': '🖨',
  }

  return (
    <button
      className="liquid-glass"
      onClick={onTap}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: spacing.xs, border: 'none',
        color: isActive ? colors.textPrimary : colors.textSecondary,
        cursor: 'pointer', padding: `${spacing.md} ${spacing.lg}`,
        borderRadius: '22px',
      }}
    >
      <span style={{ fontSize: '28px', color: isActive ? colors.statusOn : colors.textMuted }}>
        {iconMap[appliance.icon] || '🏠'}
      </span>
      <span style={{ fontSize: '12px', fontWeight: 500 }}>{appliance.name}</span>
      <span style={{ fontSize: '11px', color: colors.textSecondary }}>{status}</span>
    </button>
  )
}
