import { VehicleCard } from '../components/ev/VehicleCard'
import { GoEControls } from '../components/ev/GoEControls'
import { spacing, colors } from '../styles/theme'

export function EVChargingView() {
  const dividerStyle = { height: '1px', background: colors.glassBorder, margin: `${spacing.lg} 0` }

  return (
    <div className="stagger-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: spacing.lg }}>EV Charging</h1>
      <VehicleCard />
      <div style={dividerStyle} />
      <GoEControls />
    </div>
  )
}
