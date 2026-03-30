import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { goEEntities, evChargerEntities } from '../../config/rooms'
import { Icon } from '@mdi/react'
import {
  mdiEvStation,
  mdiFlash,
  mdiThermometer,
  mdiCarElectric,
  mdiPowerPlug,
  mdiTimer,
  mdiSolarPower,
} from '@mdi/js'
import { colors, spacing } from '../../styles/theme'
import { AnimatedCounter } from '../shared/AnimatedCounter'

const chargerModeIcons: Record<string, string> = {
  Off: mdiPowerPlug,
  Solar: mdiSolarPower,
  'Solar+Grid': mdiFlash,
  Grid: mdiFlash,
}

function ChargerModeSelector() {
  const modeEntity = useEntity(evChargerEntities.mode as EntityName, { returnNullIfNotFound: true })
  const targetAmps = useEntity(evChargerEntities.targetAmps as EntityName, { returnNullIfNotFound: true })

  if (!modeEntity) return null

  const currentMode = modeEntity.state as string
  const options: string[] = (modeEntity.attributes as { options?: string[] }).options ?? ['Off', 'Solar', 'Solar+Grid', 'Grid']

  const handleModeChange = (mode: string) => {
    ;(modeEntity as any).service.select_option({ serviceData: { option: mode } })
  }

  return (
    <div className="liquid-glass" style={{ padding: spacing.md }}>
      <div className="section-label" style={{ marginBottom: spacing.sm }}>CHARGER MODE</div>
      <div style={{ display: 'flex', gap: spacing.xs, marginBottom: spacing.md }}>
        {options.map((mode) => {
          const isActive = currentMode === mode
          return (
            <button
              key={mode}
              className={isActive ? 'liquid-pill liquid-pill-active' : 'liquid-pill'}
              onClick={() => handleModeChange(mode)}
              style={{
                flex: 1,
                padding: `${spacing.sm} ${spacing.xs}`,
                border: 'none',
                cursor: 'pointer',
                color: isActive ? colors.accentGreen : colors.textSecondary,
                fontFamily: 'inherit',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon path={chargerModeIcons[mode] ?? mdiPowerPlug} size={0.7} color={isActive ? colors.accentGreen : colors.textSecondary} />
              {mode}
            </button>
          )
        })}
      </div>
      {targetAmps && (
        <div style={{ fontSize: '13px', color: colors.textMuted, textAlign: 'center' }}>
          Target: {targetAmps.state}A
        </div>
      )}
    </div>
  )
}

function GoEStatus() {
  const carState = useEntity(goEEntities.carState as EntityName, { returnNullIfNotFound: true })
  const carConnected = useEntity(goEEntities.carConnected as EntityName, { returnNullIfNotFound: true })
  const powerTotal = useEntity(goEEntities.powerTotal as EntityName, { returnNullIfNotFound: true })
  const energyTotal = useEntity(goEEntities.energyTotal as EntityName, { returnNullIfNotFound: true })
  const chargingDuration = useEntity(goEEntities.chargingDuration as EntityName, { returnNullIfNotFound: true })
  const temp1 = useEntity(goEEntities.tempSensor1 as EntityName, { returnNullIfNotFound: true })

  const isConnected = carConnected?.state === 'on'
  const power = powerTotal ? Number(powerTotal.state) : 0

  return (
    <div className="liquid-glass" style={{ padding: spacing.md }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
        <Icon path={mdiEvStation} size={1} color={isConnected ? colors.accentGreen : colors.textMuted} />
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary }}>Go-e Charger</div>
          <div style={{ fontSize: '13px', color: isConnected ? colors.accentGreen : colors.textMuted }}>
            {carState?.state ?? 'Unknown'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
        <div className="liquid-pill" style={{ padding: spacing.sm, textAlign: 'center' }}>
          <Icon path={mdiFlash} size={0.6} color={power > 0 ? colors.accentGreen : colors.textMuted} />
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
            <AnimatedCounter value={power} /> W
          </div>
          <div style={{ fontSize: '11px', color: colors.textMuted }}>Power</div>
        </div>
        <div className="liquid-pill" style={{ padding: spacing.sm, textAlign: 'center' }}>
          <Icon path={mdiCarElectric} size={0.6} color={colors.textSecondary} />
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
            {energyTotal ? Number(energyTotal.state).toFixed(1) : '—'} kWh
          </div>
          <div style={{ fontSize: '11px', color: colors.textMuted }}>Total Energy</div>
        </div>
        <div className="liquid-pill" style={{ padding: spacing.sm, textAlign: 'center' }}>
          <Icon path={mdiTimer} size={0.6} color={colors.textSecondary} />
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
            {chargingDuration?.state ?? '—'}s
          </div>
          <div style={{ fontSize: '11px', color: colors.textMuted }}>Duration</div>
        </div>
        <div className="liquid-pill" style={{ padding: spacing.sm, textAlign: 'center' }}>
          <Icon path={mdiThermometer} size={0.6} color={colors.textSecondary} />
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
            {temp1 ? Number(temp1.state).toFixed(1) : '—'}°C
          </div>
          <div style={{ fontSize: '11px', color: colors.textMuted }}>Charger Temp</div>
        </div>
      </div>
    </div>
  )
}

export function GoEControls() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <ChargerModeSelector />
      <GoEStatus />
    </div>
  )
}
