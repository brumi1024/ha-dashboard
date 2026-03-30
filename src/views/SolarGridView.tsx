import { BalanceHeader } from '../components/energy/BalanceHeader'
import { SolarChart } from '../components/energy/SolarChart'
import { GridSection } from '../components/energy/GridSection'
import { AmperageSection } from '../components/energy/AmperageSection'
import { NetMeteringSection } from '../components/energy/NetMeteringSection'
import { ProductionStats } from '../components/energy/ProductionStats'
import { spacing } from '../styles/theme'

export function SolarGridView() {
  return (
    <div className="stagger-in" style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", marginBottom: spacing.sm }}>Energy</h1>
      <BalanceHeader />
      <div className="liquid-glass" style={{ padding: spacing.md, overflow: 'hidden' }}>
        <SolarChart />
      </div>
      <div className="liquid-glass" style={{ padding: spacing.md }}>
        <GridSection />
      </div>
      <div className="liquid-glass" style={{ padding: spacing.md }}>
        <AmperageSection />
      </div>
      <div className="liquid-glass" style={{ padding: spacing.md }}>
        <NetMeteringSection />
      </div>
      <div className="liquid-glass" style={{ padding: spacing.md }}>
        <ProductionStats />
      </div>
    </div>
  )
}
