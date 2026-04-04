import { useEntity, type EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import {
  mdiStove,
  mdiThermometer,
  mdiTarget,
  mdiDoorOpen,
  mdiDoorClosed,
  mdiStop,
  mdiPause,
  mdiPlay,
  mdiTimerSand,
  mdiLock,
  mdiLockOpen,
  mdiWifi,
  mdiWifiOff,
} from '@mdi/js'
import type { ApplianceConfig } from '../../config/rooms'
import { AnimatedCounter } from '../shared/AnimatedCounter'
import { colors, spacing, borderRadius } from '../../styles/theme'
import { formatProgramName } from '../../utils/formatters'

interface OvenPanelProps {
  appliance: ApplianceConfig
}

export function OvenPanel({ appliance }: OvenPanelProps) {
  const entities = appliance.entities ?? {}

  const power = useEntity(appliance.entity as EntityName, { returnNullIfNotFound: true })
  const door = useEntity((entities.door ?? '') as EntityName, { returnNullIfNotFound: true })
  const status = useEntity((entities.status ?? '') as EntityName, { returnNullIfNotFound: true })
  const cavityTemp = useEntity((entities.cavityTemp ?? '') as EntityName, { returnNullIfNotFound: true })
  const targetTemp = useEntity((entities.targetTemp ?? '') as EntityName, { returnNullIfNotFound: true })
  const program = useEntity((entities.program ?? '') as EntityName, { returnNullIfNotFound: true })
  const activeProgram = useEntity((entities.activeProgram ?? '') as EntityName, { returnNullIfNotFound: true })
  const progress = useEntity((entities.progress ?? '') as EntityName, { returnNullIfNotFound: true })
  const finishTime = useEntity((entities.finishTime ?? '') as EntityName, { returnNullIfNotFound: true })
  const duration = useEntity((entities.duration ?? '') as EntityName, { returnNullIfNotFound: true })
  const delayStart = useEntity((entities.delayStart ?? '') as EntityName, { returnNullIfNotFound: true })
  const alarm = useEntity((entities.alarm ?? '') as EntityName, { returnNullIfNotFound: true })
  const childLock = useEntity((entities.childLock ?? '') as EntityName, { returnNullIfNotFound: true })
  const connectivity = useEntity((entities.connectivity ?? '') as EntityName, { returnNullIfNotFound: true })
  // remoteControl entity available at entities.remoteControl if needed

  const isOn = power?.state === 'on'
  const isRunning = status?.state === 'Run' || status?.state === 'Active'
  const doorOpen = door?.state === 'Open' || door?.state === 'open'
  const isConnected = connectivity?.state === 'on'
  const progressVal = progress ? parseInt(progress.state, 10) : 0
  const currentTemp = cavityTemp ? parseFloat(cavityTemp.state) || 0 : 0
  const targetTempVal = targetTemp ? parseFloat(targetTemp.state) || 0 : 0
  const childLocked = childLock?.state === 'on'

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
  const targetTempAttrs = targetTemp?.attributes as { min?: number; max?: number; step?: number } | undefined
  const durationAttrs = duration?.attributes as { min?: number; max?: number; step?: number } | undefined

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <Icon path={mdiStove} size={1.4} color={isOn ? colors.amber : colors.textMuted} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>Oven</div>
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

      {/* Temperature display */}
      {isOn && (
        <div className="liquid-glass" style={{
          padding: spacing.md, borderRadius: borderRadius.md,
          display: 'flex', justifyContent: 'space-around', textAlign: 'center',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginBottom: spacing.xs }}>
              <Icon path={mdiThermometer} size={0.5} color={colors.statusAlert} />
              <span style={{ fontSize: '11px', color: colors.textMuted }}>Current</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 300, color: colors.textPrimary }}>
              <AnimatedCounter value={currentTemp} suffix="°" />
            </div>
          </div>
          <div style={{ width: '1px', background: colors.glassBorder }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginBottom: spacing.xs }}>
              <Icon path={mdiTarget} size={0.5} color={colors.teal} />
              <span style={{ fontSize: '11px', color: colors.textMuted }}>Target</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 300, color: colors.textPrimary }}>
              <AnimatedCounter value={targetTempVal} suffix="°" />
            </div>
          </div>
        </div>
      )}

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
        <StatusBadge
          icon={childLocked ? mdiLock : mdiLockOpen}
          label={childLocked ? 'Locked' : 'Unlocked'}
          color={childLocked ? colors.amber : colors.textSecondary}
          onClick={() => (childLock as any)?.service?.toggle?.()}
        />
      </div>

      {/* Progress bar (when running) */}
      {isRunning && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
            <span style={{ fontSize: '12px', color: colors.textSecondary }}>{currentProgram}</span>
            <span style={{ fontSize: '12px', color: colors.textPrimary, fontWeight: 600 }}>{progressVal}%</span>
          </div>
          <div style={{
            height: '6px', borderRadius: borderRadius.full,
            background: colors.glass, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${progressVal}%`,
              borderRadius: borderRadius.full,
              background: `linear-gradient(90deg, ${colors.statusAlert}, ${colors.amber})`,
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

      {/* Target temperature slider */}
      {!isRunning && targetTemp && targetTempAttrs && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
            <label style={{ fontSize: '12px', color: colors.textMuted }}>
              <Icon path={mdiTarget} size={0.5} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Target Temperature
            </label>
            <span style={{ fontSize: '12px', color: colors.textPrimary, fontWeight: 500 }}>{targetTempVal}°C</span>
          </div>
          <input
            type="range"
            min={targetTempAttrs.min ?? 30}
            max={targetTempAttrs.max ?? 300}
            step={targetTempAttrs.step ?? 5}
            value={targetTempVal}
            onChange={(e) => {
              (targetTemp as any).service.set_value({ serviceData: { value: parseFloat(e.target.value) } })
            }}
            style={{ width: '100%', accentColor: colors.statusAlert, cursor: 'pointer' }}
          />
        </div>
      )}

      {/* Duration */}
      {!isRunning && duration && durationAttrs && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
            <label style={{ fontSize: '12px', color: colors.textMuted }}>
              <Icon path={mdiTimerSand} size={0.5} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Duration
            </label>
            <span style={{ fontSize: '12px', color: colors.textPrimary, fontWeight: 500 }}>
              {parseFloat(duration.state) || 0} min
            </span>
          </div>
          <input
            type="range"
            min={durationAttrs.min ?? 0}
            max={durationAttrs.max ?? 180}
            step={durationAttrs.step ?? 1}
            value={parseFloat(duration.state) || 0}
            onChange={(e) => {
              (duration as any).service.set_value({ serviceData: { value: parseFloat(e.target.value) } })
            }}
            style={{ width: '100%', accentColor: colors.teal, cursor: 'pointer' }}
          />
        </div>
      )}

      {/* Alarm clock */}
      {alarm && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
            <label style={{ fontSize: '12px', color: colors.textMuted }}>
              <Icon path={mdiTimerSand} size={0.5} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Timer
            </label>
            <span style={{ fontSize: '12px', color: colors.textPrimary, fontWeight: 500 }}>
              {parseFloat(alarm.state) > 0 ? `${parseFloat(alarm.state)} min` : 'Off'}
            </span>
          </div>
          <input
            type="range"
            min={(alarm.attributes as any)?.min ?? 0}
            max={(alarm.attributes as any)?.max ?? 60}
            step={(alarm.attributes as any)?.step ?? 1}
            value={parseFloat(alarm.state) || 0}
            onChange={(e) => {
              (alarm as any).service.set_value({ serviceData: { value: parseFloat(e.target.value) } })
            }}
            style={{ width: '100%', accentColor: colors.amber, cursor: 'pointer' }}
          />
        </div>
      )}

      {/* Delayed start */}
      {!isRunning && delayStart && (
        <DelayStartControl entityId={entities.delayStart ?? ''} />
      )}

      {/* Control buttons when running */}
      {isRunning && (
        <div style={{ display: 'flex', gap: spacing.sm }}>
          {entities.pause && <ActionButton entityId={entities.pause} icon={mdiPause} label="Pause" color={colors.amber} />}
          {entities.resume && <ActionButton entityId={entities.resume} icon={mdiPlay} label="Resume" color={colors.statusGood} />}
          {entities.stop && <ActionButton entityId={entities.stop} icon={mdiStop} label="Stop" color={colors.statusAlert} />}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ icon, label, color, onClick }: { icon: string; label: string; color: string; onClick?: () => void }) {
  return (
    <span
      className="liquid-pill"
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: spacing.xs,
        padding: `2px ${spacing.sm}`, borderRadius: borderRadius.full,
        fontSize: '11px', color,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <Icon path={icon} size={0.55} />
      {label}
    </span>
  )
}

function ActionButton({ entityId, icon, label, color }: { entityId: string; icon: string; label: string; color: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  if (!entity) return null

  return (
    <button
      className="liquid-glass"
      onClick={() => (entity as any).service.press()}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: spacing.xs, border: 'none', cursor: 'pointer',
        padding: spacing.sm, borderRadius: borderRadius.md,
        color, fontSize: '13px', fontWeight: 600,
      }}
    >
      <Icon path={icon} size={0.7} />
      {label}
    </button>
  )
}

function DelayStartControl({ entityId }: { entityId: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  if (!entity) return null

  const current = parseFloat(entity.state) || 0
  const attrs = entity.attributes as { min?: number; max?: number; step?: number }

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
        min={attrs.min ?? 0}
        max={attrs.max ?? 24}
        step={attrs.step ?? 1}
        value={current}
        onChange={(e) => {
          (entity as any).service.set_value({ serviceData: { value: parseFloat(e.target.value) } })
        }}
        style={{ width: '100%', accentColor: colors.teal, cursor: 'pointer' }}
      />
    </div>
  )
}
