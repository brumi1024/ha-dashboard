import { useEntity, type EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import {
  mdiFridge,
  mdiThermometer,
  mdiSnowflake,
  mdiLeaf,
  mdiDoorOpen,
  mdiDoorClosed,
  mdiWifi,
  mdiWifiOff,
} from '@mdi/js'
import type { ApplianceConfig } from '../../config/rooms'
import { AnimatedCounter } from '../shared/AnimatedCounter'
import { colors, spacing, borderRadius } from '../../styles/theme'

interface FridgePanelProps {
  appliance: ApplianceConfig
}

export function FridgePanel({ appliance }: FridgePanelProps) {
  const entities = appliance.entities ?? {}

  const power = useEntity(appliance.entity as EntityName, { returnNullIfNotFound: true })
  const fridgeTemp = useEntity((entities.fridgeTemp ?? '') as EntityName, { returnNullIfNotFound: true })
  const freezerTemp = useEntity((entities.freezerTemp ?? '') as EntityName, { returnNullIfNotFound: true })
  const fridgeDoor = useEntity((entities.fridgeDoor ?? '') as EntityName, { returnNullIfNotFound: true })
  const freezerDoor = useEntity((entities.freezerDoor ?? '') as EntityName, { returnNullIfNotFound: true })
  const ecoMode = useEntity((entities.ecoMode ?? '') as EntityName, { returnNullIfNotFound: true })
  const freshMode = useEntity((entities.freshMode ?? '') as EntityName, { returnNullIfNotFound: true })
  const superCool = useEntity((entities.superCool ?? '') as EntityName, { returnNullIfNotFound: true })
  const superFreeze = useEntity((entities.superFreeze ?? '') as EntityName, { returnNullIfNotFound: true })
  const sabbathMode = useEntity((entities.sabbathMode ?? '') as EntityName, { returnNullIfNotFound: true })
  const vacationMode = useEntity((entities.vacationMode ?? '') as EntityName, { returnNullIfNotFound: true })
  const connectivity = useEntity((entities.connectivity ?? '') as EntityName, { returnNullIfNotFound: true })

  const isOn = power?.state === 'on'
  const isConnected = connectivity?.state === 'on'
  const fridgeDoorOpen = fridgeDoor?.state === 'on'
  const freezerDoorOpen = freezerDoor?.state === 'on'
  const fridgeTempVal = fridgeTemp ? parseFloat(fridgeTemp.state) || 0 : 0
  const freezerTempVal = freezerTemp ? parseFloat(freezerTemp.state) || 0 : 0

  const fridgeTempAttrs = fridgeTemp?.attributes as { min?: number; max?: number; step?: number } | undefined
  const freezerTempAttrs = freezerTemp?.attributes as { min?: number; max?: number; step?: number } | undefined

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <Icon path={mdiFridge} size={1.4} color={isOn ? colors.teal : colors.textMuted} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>Fridge Freezer</div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>
            {isOn ? 'Running' : 'Off'}
          </div>
        </div>
        <StatusBadge
          icon={isConnected ? mdiWifi : mdiWifiOff}
          label={isConnected ? 'Online' : 'Offline'}
          color={isConnected ? colors.statusGood : colors.statusAlert}
        />
      </div>

      {/* Temperature cards */}
      <div style={{ display: 'flex', gap: spacing.md }}>
        <TempCard
          label="Fridge"
          icon={mdiThermometer}
          value={fridgeTempVal}
          color={colors.teal}
          doorOpen={fridgeDoorOpen}
          attrs={fridgeTempAttrs}
          entity={fridgeTemp}
        />
        <TempCard
          label="Freezer"
          icon={mdiSnowflake}
          value={freezerTempVal}
          color={colors.accentBlue}
          doorOpen={freezerDoorOpen}
          attrs={freezerTempAttrs}
          entity={freezerTemp}
        />
      </div>

      {/* Mode toggles */}
      <div>
        <label style={{ fontSize: '12px', color: colors.textMuted, display: 'block', marginBottom: spacing.sm }}>
          Modes
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.sm }}>
          <ModeToggle entity={ecoMode} label="Eco" icon={mdiLeaf} />
          <ModeToggle entity={freshMode} label="Fresh" icon={mdiSnowflake} />
          <ModeToggle entity={superCool} label="Super Cool" icon={mdiThermometer} />
          <ModeToggle entity={superFreeze} label="Super Freeze" icon={mdiSnowflake} />
          <ModeToggle entity={sabbathMode} label="Sabbath" />
          <ModeToggle entity={vacationMode} label="Vacation" />
        </div>
      </div>
    </div>
  )
}

function TempCard({ label, icon, value, color, doorOpen, attrs, entity }: {
  label: string
  icon: string
  value: number
  color: string
  doorOpen: boolean
  attrs?: { min?: number; max?: number; step?: number }
  entity: any
}) {
  return (
    <div className="liquid-glass" style={{
      flex: 1, padding: spacing.md, borderRadius: borderRadius.md,
      display: 'flex', flexDirection: 'column', gap: spacing.sm,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <Icon path={icon} size={0.55} color={color} />
          <span style={{ fontSize: '12px', color: colors.textMuted }}>{label}</span>
        </div>
        <StatusBadge
          icon={doorOpen ? mdiDoorOpen : mdiDoorClosed}
          label={doorOpen ? 'Open' : ''}
          color={doorOpen ? colors.statusAlert : colors.textMuted}
        />
      </div>
      <div style={{ fontSize: '32px', fontWeight: 300, color: colors.textPrimary, textAlign: 'center' }}>
        <AnimatedCounter value={value} decimals={1} suffix="°" />
      </div>
      {attrs && entity && (
        <input
          type="range"
          min={attrs.min ?? 1}
          max={attrs.max ?? 9}
          step={attrs.step ?? 0.5}
          value={value}
          onChange={(e) => {
            (entity as any).service.set_value({ serviceData: { value: parseFloat(e.target.value) } })
          }}
          style={{ width: '100%', accentColor: color, cursor: 'pointer' }}
        />
      )}
    </div>
  )
}

function StatusBadge({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '2px',
      fontSize: '11px', color,
    }}>
      <Icon path={icon} size={0.45} />
      {label}
    </span>
  )
}

function ModeToggle({ entity, label, icon }: { entity: any; label: string; icon?: string }) {
  if (!entity) return null

  const isOn = entity.state === 'on'

  return (
    <button
      className="liquid-glass"
      onClick={() => (entity as any).service.toggle()}
      style={{
        border: 'none', cursor: 'pointer',
        padding: `${spacing.sm} ${spacing.xs}`,
        borderRadius: borderRadius.sm,
        fontSize: '11px', fontWeight: 500,
        color: isOn ? colors.teal : colors.textSecondary,
        textAlign: 'center',
        background: isOn ? colors.tealSoft : 'transparent',
        transition: 'all 0.2s ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
      }}
    >
      {icon && <Icon path={icon} size={0.5} />}
      {label}
    </button>
  )
}
