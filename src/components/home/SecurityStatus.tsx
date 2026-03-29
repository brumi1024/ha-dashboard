import { Icon } from '@mdi/react'
import { mdiLock, mdiLockOpen, mdiGarage, mdiGarageOpen } from '@mdi/js'
import { useEntity, type EntityName } from '@hakit/core'
import { securityEntities } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

export function SecurityStatus() {
  const lock = useEntity(securityEntities.frontDoorLock as EntityName)
  const rightGarage = useEntity(securityEntities.rightGarageDoor as EntityName)
  const garage = useEntity(securityEntities.garageDoor as EntityName)

  const isLocked = lock.state === 'locked'
  const rightClosed = rightGarage.state === 'closed'
  const leftClosed = garage.state === 'closed'

  return (
    <div>
      <h3 className="section-label" style={{ fontSize: '13px', fontWeight: 600, color: colors.textMuted, marginBottom: spacing.md }}>Security</h3>
      <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center' }}>
        <SecurityChip icon={isLocked ? mdiLock : mdiLockOpen} label={isLocked ? 'Locked' : 'Unlocked'} ok={isLocked} />
        <SecurityChip icon={rightClosed ? mdiGarage : mdiGarageOpen} label={`R: ${rightClosed ? 'Closed' : 'Open'}`} ok={rightClosed} />
        <SecurityChip icon={leftClosed ? mdiGarage : mdiGarageOpen} label={`L: ${leftClosed ? 'Closed' : 'Open'}`} ok={leftClosed} />
      </div>
    </div>
  )
}

function SecurityChip({ icon, label, ok }: { icon: string; label: string; ok: boolean }) {
  return (
    <div className="liquid-pill" style={{
      display: 'flex', alignItems: 'center', gap: spacing.sm,
      padding: '6px 14px', borderRadius: '9999px',
      background: ok ? colors.statusGoodSoft : colors.statusAlertSoft,
      color: ok ? colors.statusGood : colors.statusAlert, fontSize: '13px',
    }}>
      <Icon path={icon} size={0.7} />
      <span>{label}</span>
    </div>
  )
}
