import { useState, useRef, useCallback } from 'react'
import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiLock, mdiLockOpen, mdiGarage, mdiGarageOpen } from '@mdi/js'
import { securityEntities } from '../../config/rooms'
import { colors, spacing, borderRadius } from '../../styles/theme'

const HOLD_DURATION = 600

function SecurityCard({ entityId, type, label }: { entityId: string; type: 'lock' | 'cover'; label: string }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  const [holding, setHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef<number>(0)

  const isSecure = type === 'lock'
    ? entity?.state === 'locked'
    : entity?.state === 'closed'

  const icon = type === 'lock'
    ? (isSecure ? mdiLock : mdiLockOpen)
    : (isSecure ? mdiGarage : mdiGarageOpen)

  const stateText = type === 'lock'
    ? (isSecure ? 'Locked' : 'Unlocked')
    : (isSecure ? 'Closed' : 'Open')

  const actionLabel = type === 'lock'
    ? (isSecure ? 'Hold to unlock' : 'Hold to lock')
    : (isSecure ? 'Hold to open' : 'Hold to close')

  const triggerAction = useCallback(() => {
    if (!entity) return
    if (type === 'lock') {
      if (isSecure) {
        (entity as any).service.unlock()
      } else {
        (entity as any).service.lock()
      }
    } else {
      if (isSecure) {
        (entity as any).service.open_cover()
      } else {
        (entity as any).service.close_cover()
      }
    }
  }, [entity, type, isSecure])

  const cancelHold = useCallback(() => {
    setHolding(false)
    setProgress(0)
    if (progressRef.current) cancelAnimationFrame(progressRef.current)
  }, [])

  const startHold = useCallback(() => {
    setHolding(true)
    setProgress(0)
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(elapsed / HOLD_DURATION, 1)
      setProgress(pct)
      if (pct >= 1) {
        triggerAction()
        cancelHold()
      } else {
        progressRef.current = requestAnimationFrame(animate)
      }
    }
    progressRef.current = requestAnimationFrame(animate)
  }, [triggerAction, cancelHold])

  if (!entity) return null

  const iconColor = isSecure ? colors.accentGreen : colors.accentRed
  const bgTint = isSecure ? colors.statusGoodSoft : colors.statusAlertSoft

  return (
    <div
      className="liquid-glass"
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      style={{
        position: 'relative',
        overflow: 'hidden',
        minWidth: 0,
        padding: spacing.md,
        background: bgTint,
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing.sm,
        transition: 'background 0.2s ease',
      }}
    >
      {/* Progress fill */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${progress * 100}%`,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: borderRadius.md,
          transition: holding ? 'none' : 'height 0.15s ease-out',
          pointerEvents: 'none',
        }}
      />

      <Icon path={icon} size={1.2} color={iconColor} />
      <div style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary }}>
        {label}
      </div>
      <div style={{ fontSize: '13px', color: isSecure ? colors.accentGreen : colors.accentRed, fontWeight: 500 }}>
        {stateText}
      </div>
      <div style={{ fontSize: '11px', color: colors.textMuted }}>
        {actionLabel}
      </div>
    </div>
  )
}

export function SecurityControls() {
  return (
    <div>
      <div className="section-label" style={{ marginBottom: spacing.sm }}>SECURITY</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.sm }}>
        <SecurityCard entityId={securityEntities.frontDoorLock} type="lock" label="Front Door" />
        <SecurityCard entityId={securityEntities.rightGarageDoor} type="cover" label="Right Garage" />
        <SecurityCard entityId={securityEntities.garageDoor} type="cover" label="Left Garage" />
      </div>
    </div>
  )
}
