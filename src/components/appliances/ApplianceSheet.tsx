import { BottomSheet } from '../shared/BottomSheet'
import { DishwasherPanel } from './DishwasherPanel'
import { OvenPanel } from './OvenPanel'
import { FridgePanel } from './FridgePanel'
import { HobPanel } from './HobPanel'
import { PrinterPanel } from './PrinterPanel'
import type { ApplianceConfig } from '../../config/rooms'
import { colors, spacing } from '../../styles/theme'

interface ApplianceSheetProps {
  isOpen: boolean
  onClose: () => void
  appliance: ApplianceConfig | null
}

export function ApplianceSheet({ isOpen, onClose, appliance }: ApplianceSheetProps) {
  if (!appliance) return null

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div style={{ marginBottom: spacing.md, textAlign: 'center' }}>
        <div style={{
          width: '36px', height: '4px', borderRadius: '2px',
          background: colors.textMuted, margin: '0 auto',
        }} />
      </div>
      <AppliancePanelRouter appliance={appliance} />
    </BottomSheet>
  )
}

function AppliancePanelRouter({ appliance }: { appliance: ApplianceConfig }) {
  switch (appliance.type) {
    case 'dishwasher':
      return <DishwasherPanel appliance={appliance} />
    case 'oven':
      return <OvenPanel appliance={appliance} />
    case 'fridge':
      return <FridgePanel appliance={appliance} />
    case 'hob':
      return <HobPanel appliance={appliance} />
    case 'printer':
      return <PrinterPanel appliance={appliance} />
    default:
      return <GenericApplianceInfo appliance={appliance} />
  }
}

function GenericApplianceInfo({ appliance }: { appliance: ApplianceConfig }) {
  return (
    <div style={{ textAlign: 'center', padding: spacing.lg, color: colors.textSecondary }}>
      <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary, marginBottom: spacing.sm }}>
        {appliance.name}
      </div>
      <div style={{ fontSize: '13px' }}>
        Detailed controls coming soon.
      </div>
    </div>
  )
}
