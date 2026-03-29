import { BalanceHeader } from '../components/energy/BalanceHeader'
import { SolarChart } from '../components/energy/SolarChart'
import { GridSection } from '../components/energy/GridSection'
import { AmperageSection } from '../components/energy/AmperageSection'
import { NetMeteringSection } from '../components/energy/NetMeteringSection'
import { ProductionStats } from '../components/energy/ProductionStats'
import { spacing, colors } from '../styles/theme'

export function SolarGridView() {
  const dividerStyle = { height: '1px', background: colors.glassBorder, margin: `${spacing.lg} 0` }

  return (
    <div className="stagger-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", marginBottom: spacing.lg }}>Energy</h1>
      <BalanceHeader />
      <SolarChart />
      <div style={dividerStyle} />
      <GridSection />
      <div style={dividerStyle} />
      <AmperageSection />
      <div style={dividerStyle} />
      <NetMeteringSection />
      <div style={dividerStyle} />
      <ProductionStats />
    </div>
  )
}
