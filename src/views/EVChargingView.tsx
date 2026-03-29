import { VehicleCard } from '../components/ev/VehicleCard'
import { ChargerMode } from '../components/ev/ChargerMode'
import { GoECharger } from '../components/ev/GoECharger'
import { spacing, colors } from '../styles/theme'

export function EVChargingView() {
  const dividerStyle = { height: '1px', background: colors.glassBorder, margin: `${spacing.lg} 0` }

  return (
    <div className="stagger-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", marginBottom: spacing.lg }}>EV Charging</h1>
      <VehicleCard />
      <div style={dividerStyle} />
      <ChargerMode />
      <div style={dividerStyle} />
      <GoECharger />
    </div>
  )
}
