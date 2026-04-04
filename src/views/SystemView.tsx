import { SystemHealth } from '../components/system/SystemHealth'
import { UpdatesList } from '../components/system/UpdatesList'
import { spacing } from '../styles/theme'

export function SystemView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl, alignItems: 'center' }}>
      <div className="page-title">System</div>
      <div className="stagger-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%', maxWidth: '600px' }}>
        <SystemHealth />
        <UpdatesList />
      </div>
    </div>
  )
}
