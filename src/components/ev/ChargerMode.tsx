import { useEntity, type EntityName } from '@hakit/core'
import { colors, borderRadius, spacing } from '../../styles/theme'

export function ChargerMode() {
  const chargerMode = useEntity('select.ev_charger_mode' as EntityName, { returnNullIfNotFound: true })

  if (!chargerMode) {
    return (
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 500, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", marginBottom: spacing.md }}>Charger Mode</h3>
        <p style={{ fontSize: '13px', color: colors.textSecondary }}>Charger mode entity not found. Check entity ID configuration.</p>
      </div>
    )
  }

  const options = (chargerMode.attributes.options as string[]) || ['Solar + Grid', 'Solar Only', 'Grid Only']
  const currentMode = chargerMode.state

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 500, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", marginBottom: spacing.md }}>Charger Mode</h3>
      <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: spacing.sm }}>EV Charger Mode</div>
      <select className="liquid-glass" value={currentMode} onChange={(e) => (chargerMode as any).service.select_option({ option: e.target.value })} style={{
        width: '100%', padding: `${spacing.sm} ${spacing.md}`,
        borderRadius: borderRadius.md, border: 'none',
        color: colors.textPrimary, fontSize: '14px', cursor: 'pointer',
        WebkitAppearance: 'none', appearance: 'none',
      }}>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}
