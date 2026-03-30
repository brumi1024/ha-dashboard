import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiPrinter3d } from '@mdi/js'
import { printerEntities } from '../../../config/rooms'
import { colors, spacing } from '../../../styles/theme'

export function PrinterStatus() {
  const status = useEntity(printerEntities.status as EntityName, { returnNullIfNotFound: true })
  const progress = useEntity(printerEntities.printProgress as EntityName, { returnNullIfNotFound: true })

  if (!status || status.state === 'Offline') return null

  const isPrinting = status.state === 'Printing'
  const progressPct = progress ? Number(progress.state) : 0

  return (
    <div className="liquid-glass" style={{ padding: spacing.md, display: 'flex', alignItems: 'center', gap: spacing.sm }}>
      <Icon path={mdiPrinter3d} size={1} color={isPrinting ? colors.accentGreen : colors.textSecondary} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary }}>
          3D Printer · {status.state}
        </div>
        {isPrinting && (
          <>
            <div style={{
              height: '6px', borderRadius: '3px', marginTop: spacing.xs,
              background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
            }}>
              <div style={{
                width: `${progressPct}%`, height: '100%', borderRadius: '3px',
                background: colors.accentGreen, transition: 'width 1s ease',
              }} />
            </div>
            <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>
              {progressPct}% complete
            </div>
          </>
        )}
      </div>
    </div>
  )
}
