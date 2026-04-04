import { useEntity, type EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiPrinter3d, mdiProgressClock } from '@mdi/js'
import type { ApplianceConfig } from '../../config/rooms'
import { colors, spacing, borderRadius } from '../../styles/theme'

interface PrinterPanelProps {
  appliance: ApplianceConfig
}

export function PrinterPanel({ appliance }: PrinterPanelProps) {
  const entities = appliance.entities ?? {}

  const status = useEntity((entities.status ?? appliance.entity) as EntityName, { returnNullIfNotFound: true })
  const progress = useEntity((entities.progress ?? '') as EntityName, { returnNullIfNotFound: true })
  const camera = useEntity((entities.camera ?? '') as EntityName, { returnNullIfNotFound: true })

  const statusVal = status?.state ?? 'Unknown'
  const statusOptions = (status?.attributes as { options?: string[] })?.options ?? []
  const progressVal: number = progress ? parseFloat(progress.state) || 0 : 0
  const isPrinting = Boolean(statusVal.toLowerCase() === 'printing' || progressVal > 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <Icon path={mdiPrinter3d} size={1.4} color={isPrinting ? colors.teal : colors.textMuted} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>3D Printer</div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>{statusVal}</div>
        </div>
      </div>

      {/* Progress bar (when printing) */}
      {isPrinting ? <ProgressBar value={progressVal} /> : null}

      {/* Status selector */}
      {statusOptions.length > 0 ? (
        <div>
          <label style={{ fontSize: '12px', color: colors.textMuted, display: 'block', marginBottom: spacing.xs }}>
            Status
          </label>
          <select
            className="liquid-glass"
            value={statusVal}
            onChange={(e) => {
              (status as any)?.service?.select_option?.({ serviceData: { option: e.target.value } })
            }}
            style={{
              width: '100%', padding: `${spacing.sm} ${spacing.md}`,
              borderRadius: borderRadius.md, border: 'none',
              color: colors.textPrimary, fontSize: '14px',
              background: colors.glass, cursor: 'pointer',
              appearance: 'none',
            }}
          >
            {statusOptions.map((opt: string) => (
              <option key={opt} value={opt} style={{ background: '#1a1a1a' }}>{opt}</option>
            ))}
          </select>
        </div>
      ) : null}

      {/* Camera feed */}
      {camera && (camera.attributes as Record<string, unknown>)?.entity_picture ? (
        <div>
          <label style={{ fontSize: '12px', color: colors.textMuted, display: 'block', marginBottom: spacing.xs }}>
            Camera
          </label>
          <img
            src={`${import.meta.env.VITE_HA_URL}${(camera.attributes as Record<string, unknown>).entity_picture}`}
            alt="3D Printer Camera"
            style={{
              width: '100%', borderRadius: borderRadius.md,
              border: `1px solid ${colors.glassBorder}`,
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs }}>
        <span style={{ fontSize: '12px', color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <Icon path={mdiProgressClock} size={0.5} />
          Print Progress
        </span>
        <span style={{ fontSize: '14px', color: colors.textPrimary, fontWeight: 600 }}>{value.toFixed(0)}%</span>
      </div>
      <div style={{
        height: '8px', borderRadius: borderRadius.full,
        background: colors.glass, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${value}%`,
          borderRadius: borderRadius.full,
          background: `linear-gradient(90deg, ${colors.teal}, ${colors.statusGood})`,
          transition: 'width 1s ease',
        }} />
      </div>
    </div>
  )
}
