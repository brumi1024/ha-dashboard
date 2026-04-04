import { useEntity, type EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiDishwasher, mdiDoorOpen, mdiDoorClosed, mdiStop, mdiTimerSand, mdiWifi, mdiWifiOff } from '@mdi/js'
import type { ApplianceConfig } from '../../config/rooms'
import { colors, spacing, borderRadius } from '../../styles/theme'
import { formatProgramName } from '../../utils/formatters'

interface DishwasherPanelProps {
  appliance: ApplianceConfig
}

export function DishwasherPanel({ appliance }: DishwasherPanelProps) {
  const entities = appliance.entities ?? {}

  const power = useEntity(appliance.entity as EntityName, { returnNullIfNotFound: true })
  const door = useEntity((entities.door ?? '') as EntityName, { returnNullIfNotFound: true })
  const status = useEntity((entities.status ?? '') as EntityName, { returnNullIfNotFound: true })
  const program = useEntity((entities.program ?? '') as EntityName, { returnNullIfNotFound: true })
  const activeProgram = useEntity((entities.activeProgram ?? '') as EntityName, { returnNullIfNotFound: true })
  const progress = useEntity((entities.progress ?? '') as EntityName, { returnNullIfNotFound: true })
  const finishTime = useEntity((entities.finishTime ?? '') as EntityName, { returnNullIfNotFound: true })
  const delayStart = useEntity((entities.delayStart ?? '') as EntityName, { returnNullIfNotFound: true })
  const remoteControl = useEntity((entities.remoteControl ?? '') as EntityName, { returnNullIfNotFound: true })
  const connectivity = useEntity((entities.connectivity ?? '') as EntityName, { returnNullIfNotFound: true })

  const isOn = power?.state === 'on'
  const isRunning = status?.state === 'Run' || status?.state === 'Active'
  const doorOpen = door?.state === 'Open' || door?.state === 'open'
  const isConnected = connectivity?.state === 'on'
  const isRemoteReady = remoteControl?.state === 'on'
  const progressVal = progress ? parseInt(progress.state, 10) : 0
  const rawProgram = activeProgram?.state && activeProgram.state !== 'unknown'
    ? activeProgram.state
    : program?.state ?? '—'
  const currentProgram = formatProgramName(rawProgram)
  const finishTimeStr = (() => {
    if (!finishTime?.state || finishTime.state === 'unknown' || finishTime.state === 'unavailable') return null
    const d = new Date(finishTime.state)
    if (isNaN(d.getTime())) return null
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })()

  const programOptions = (program?.attributes as { options?: string[] })?.options ?? []

  const optionEntities = {
    intensive: entities.intensive ?? '',
    varioSpeed: entities.varioSpeed ?? '',
    halfLoad: entities.halfLoad ?? '',
    extraDry: entities.extraDry ?? '',
    hygiene: entities.hygiene ?? '',
    silence: entities.silence ?? '',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <Icon path={mdiDishwasher} size={1.4} color={isOn ? colors.amber : colors.textMuted} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>Dishwasher</div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>
            {status?.state ?? 'Unknown'}
            {finishTimeStr && ` — done at ${finishTimeStr}`}
          </div>
        </div>
        <button
          className="liquid-pill"
          onClick={() => (power as any)?.service?.toggle?.()}
          style={{
            border: 'none', cursor: 'pointer',
            padding: `${spacing.xs} ${spacing.md}`,
            borderRadius: borderRadius.full,
            color: isOn ? colors.amber : colors.textSecondary,
            fontSize: '13px', fontWeight: 600,
          }}
        >
          {isOn ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Status badges */}
      <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
        <StatusBadge
          icon={doorOpen ? mdiDoorOpen : mdiDoorClosed}
          label={doorOpen ? 'Open' : 'Closed'}
          color={doorOpen ? colors.amber : colors.textSecondary}
        />
        <StatusBadge
          icon={isConnected ? mdiWifi : mdiWifiOff}
          label={isConnected ? 'Connected' : 'Offline'}
          color={isConnected ? colors.statusGood : colors.statusAlert}
        />
        {isRemoteReady && (
          <StatusBadge icon={mdiWifi} label="Remote Ready" color={colors.teal} />
        )}
      </div>

      {/* Progress bar (when running) */}
      {isRunning && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
            <span style={{ fontSize: '12px', color: colors.textSecondary }}>
              {currentProgram}
            </span>
            <span style={{ fontSize: '12px', color: colors.textPrimary, fontWeight: 600 }}>
              {progressVal}%
            </span>
          </div>
          <div style={{
            height: '6px', borderRadius: borderRadius.full,
            background: colors.glass, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${progressVal}%`,
              borderRadius: borderRadius.full,
              background: `linear-gradient(90deg, ${colors.teal}, ${colors.amber})`,
              transition: 'width 1s ease',
            }} />
          </div>
        </div>
      )}

      {/* Program selector */}
      {!isRunning && programOptions.length > 0 && (
        <div>
          <label style={{ fontSize: '12px', color: colors.textMuted, display: 'block', marginBottom: spacing.xs }}>
            Program
          </label>
          <select
            className="liquid-glass"
            value={program?.state ?? ''}
            onChange={(e) => {
              (program as any)?.service?.select_option?.({ serviceData: { option: e.target.value } })
            }}
            style={{
              width: '100%', padding: `${spacing.sm} ${spacing.md}`,
              borderRadius: borderRadius.md, border: 'none',
              color: colors.textPrimary, fontSize: '14px',
              background: colors.glass, cursor: 'pointer',
              appearance: 'none',
            }}
          >
            {programOptions.map((opt: string) => (
              <option key={opt} value={opt} style={{ background: '#1a1a1a' }}>{formatProgramName(opt)}</option>
            ))}
          </select>
        </div>
      )}

      {/* Option toggles */}
      {!isRunning && (
        <div>
          <label style={{ fontSize: '12px', color: colors.textMuted, display: 'block', marginBottom: spacing.sm }}>
            Options
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.sm }}>
            <OptionToggle entityId={optionEntities.intensive} label="Intensive" />
            <OptionToggle entityId={optionEntities.varioSpeed} label="VarioSpeed" />
            <OptionToggle entityId={optionEntities.halfLoad} label="Half Load" />
            <OptionToggle entityId={optionEntities.extraDry} label="Extra Dry" />
            <OptionToggle entityId={optionEntities.hygiene} label="Hygiene" />
            <OptionToggle entityId={optionEntities.silence} label="Silence" />
          </div>
        </div>
      )}

      {/* Delayed start */}
      {!isRunning && delayStart && (
        <DelayStartControl entityId={entities.delayStart ?? ''} />
      )}

      {/* Stop button */}
      {isRunning && entities.stop && (
        <StopButton entityId={entities.stop} />
      )}
    </div>
  )
}

function StatusBadge({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <span
      className="liquid-pill"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: spacing.xs,
        padding: `2px ${spacing.sm}`, borderRadius: borderRadius.full,
        fontSize: '11px', color,
      }}
    >
      <Icon path={icon} size={0.55} />
      {label}
    </span>
  )
}

function OptionToggle({ entityId, label }: { entityId: string; label: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
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
        color: isOn ? colors.amber : colors.textSecondary,
        textAlign: 'center',
        background: isOn ? colors.amberSoft : 'transparent',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  )
}

function DelayStartControl({ entityId }: { entityId: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  if (!entity) return null

  const current = parseFloat(entity.state) || 0
  const attrs = entity.attributes as { min?: number; max?: number; step?: number }
  const min = attrs.min ?? 0
  const max = attrs.max ?? 24
  const step = attrs.step ?? 1

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
        <label style={{ fontSize: '12px', color: colors.textMuted }}>
          <Icon path={mdiTimerSand} size={0.5} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
          Delay Start
        </label>
        <span style={{ fontSize: '12px', color: colors.textPrimary, fontWeight: 500 }}>
          {current > 0 ? `${current}h` : 'Off'}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => {
          (entity as any).service.set_value({ serviceData: { value: parseFloat(e.target.value) } })
        }}
        style={{
          width: '100%', accentColor: colors.teal,
          cursor: 'pointer',
        }}
      />
    </div>
  )
}

function StopButton({ entityId }: { entityId: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  if (!entity) return null

  return (
    <button
      className="liquid-glass"
      onClick={() => (entity as any).service.press()}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: spacing.sm, border: 'none', cursor: 'pointer',
        padding: spacing.md, borderRadius: borderRadius.md,
        color: colors.statusAlert, fontSize: '14px', fontWeight: 600,
        width: '100%',
      }}
    >
      <Icon path={mdiStop} size={0.8} />
      Stop Program
    </button>
  )
}
