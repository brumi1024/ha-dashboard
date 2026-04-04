import { useEntity, type EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import {
  mdiWeatherSunny,
  mdiCarElectric,
  mdiBatteryCharging,
  mdiBattery,
  mdiSolarPower,
  mdiServer,
  mdiAccountMultiple,
  mdiThermometer,
  mdiLock,
  mdiLockOpen,
  mdiMapMarker,
  mdiEye,
  mdiWeatherWindyVariant,
  mdiWaterPercent,
  mdiFlash,
} from '@mdi/js'
import { AreaChart, Area, XAxis, ResponsiveContainer } from 'recharts'
import { weatherEntity, energyEntities, evEntities, glanceEntities } from '../config/rooms'
import { conditionIcons } from '../components/home/WeatherCard'
import { SunArc } from '../components/glance/SunArc'
import { useForecast } from '../hooks/useForecast'
import { colors, spacing, borderRadius } from '../styles/theme'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { formatWeatherCondition } from '../utils/formatters'

// ─── Hourly Weather Forecast with Recharts ───────────────

function HourlyForecast() {
  const weather = useEntity(weatherEntity as EntityName, { returnNullIfNotFound: true })
  const { hourly } = useForecast()

  if (!weather) return null

  const attrs = weather.attributes as {
    temperature?: number
    humidity?: number
    wind_speed?: number
  }

  const chartData = hourly.slice(0, 24).map(h => ({
    time: new Date(h.datetime).toLocaleTimeString('en-US', { hour: 'numeric' }),
    temp: Math.round(h.temperature),
  }))

  const currentTemp = attrs.temperature
  const currentHumidity = attrs.humidity
  const windSpeed = attrs.wind_speed

  return (
    <div className="liquid-glass" style={{
      padding: spacing.lg, borderRadius: borderRadius.lg,
    }}>
      {/* Current weather header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
        <Icon path={conditionIcons[weather.state] || mdiWeatherSunny} size={1.4} color={colors.amber} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: colors.textPrimary }}>
            {currentTemp != null ? `${Math.round(currentTemp)}°` : '--'}
          </div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>
            {formatWeatherCondition(weather.state)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: spacing.md }}>
          {currentHumidity != null && (
            <div style={{ textAlign: 'center' }}>
              <Icon path={mdiWaterPercent} size={0.55} color={colors.teal} />
              <div style={{ fontSize: '13px', color: colors.textSecondary }}>{currentHumidity}%</div>
            </div>
          )}
          {windSpeed != null && (
            <div style={{ textAlign: 'center' }}>
              <Icon path={mdiWeatherWindyVariant} size={0.55} color={colors.textMuted} />
              <div style={{ fontSize: '13px', color: colors.textSecondary }}>{Math.round(windSpeed)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Recharts area chart */}
      {chartData.length > 0 && (
        <div style={{ width: '100%', height: '120px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.teal} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors.teal} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.textMuted, fontSize: 10 }}
                interval={3}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke={colors.teal}
                strokeWidth={2}
                fill="url(#tempGradient)"
                dot={false}
                activeDot={{ r: 4, fill: colors.teal, stroke: colors.textPrimary, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

// ─── Family Presence ─────────────────────────────────────

function FamilyPresence() {
  const benjamin = useEntity(glanceEntities.personBenjamin as EntityName, { returnNullIfNotFound: true })
  const dia = useEntity(glanceEntities.personDia as EntityName, { returnNullIfNotFound: true })

  const people = [
    { entity: benjamin, name: 'Benjamin', initial: 'B' },
    { entity: dia, name: 'Dia', initial: 'D' },
  ].filter(p => p.entity != null)

  if (people.length === 0) return null

  return (
    <div className="liquid-glass" style={{
      padding: spacing.lg, borderRadius: borderRadius.lg,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: spacing.sm,
        marginBottom: spacing.md,
      }}>
        <Icon path={mdiAccountMultiple} size={0.7} color={colors.textSecondary} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: colors.textMuted }}>Family</span>
      </div>
      <div style={{ display: 'flex', gap: spacing.lg, justifyContent: 'center' }}>
        {people.map(({ entity, name, initial }) => {
          const isHome = entity!.state === 'home'
          return (
            <div key={name} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: isHome ? colors.statusGoodSoft : 'rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2.5px solid ${isHome ? colors.statusGood : 'rgba(255,255,255,0.1)'}`,
                  fontSize: '18px', fontWeight: 600,
                  color: isHome ? colors.textPrimary : colors.textMuted,
                }}>
                  {initial}
                </div>
                {/* Status dot */}
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: isHome ? colors.statusGood : colors.statusAlert,
                  border: '2px solid rgba(0,0,0,0.4)',
                  boxShadow: `0 0 6px ${isHome ? colors.statusGood : colors.statusAlert}`,
                }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: colors.textPrimary }}>{name}</span>
              <span style={{
                fontSize: '10px',
                color: isHome ? colors.statusGood : colors.textMuted,
                fontWeight: 600,
                textTransform: 'capitalize',
              }}>
                {isHome ? 'Home' : entity!.state}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Tesla Status ────────────────────────────────────────

function TeslaStatus() {
  const battery = useEntity(evEntities.batteryLevel as EntityName, { returnNullIfNotFound: true })
  const range = useEntity(evEntities.batteryRange as EntityName, { returnNullIfNotFound: true })
  const charging = useEntity(evEntities.chargingState as EntityName, { returnNullIfNotFound: true })
  const vehicleLock = useEntity(evEntities.vehicleLock as EntityName, { returnNullIfNotFound: true })
  const location = useEntity(evEntities.location as EntityName, { returnNullIfNotFound: true })
  const insideTemp = useEntity(glanceEntities.insideTemp as EntityName, { returnNullIfNotFound: true })
  const outsideTemp = useEntity(glanceEntities.outsideTemp as EntityName, { returnNullIfNotFound: true })

  if (!battery) return null

  const batteryLevel = parseFloat(battery.state) || 0
  const rangeKm = range ? Math.round(parseFloat(range.state)) : null
  const isCharging = charging?.state === 'Charging' || charging?.state === 'charging'
  const isLocked = vehicleLock?.state === 'locked'
  const locationState = location?.state || 'unknown'
  const insideTempVal = insideTemp ? parseFloat(insideTemp.state) : null
  const outsideTempVal = outsideTemp ? parseFloat(outsideTemp.state) : null

  return (
    <div className="liquid-glass" style={{
      padding: spacing.lg, borderRadius: borderRadius.lg,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
        <Icon path={mdiCarElectric} size={1.2} color={colors.teal} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: colors.textPrimary }}>Tesla Raikiri</div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>
            {isCharging ? 'Charging' : charging?.state || 'Idle'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: colors.textPrimary }}>
            <Icon
              path={isCharging ? mdiBatteryCharging : mdiBattery}
              size={0.7}
              color={batteryLevel > 20 ? colors.statusGood : colors.statusAlert}
              style={{ verticalAlign: 'middle' }}
            />
            {' '}{batteryLevel}%
          </div>
          {rangeKm != null && (
            <div style={{ fontSize: '11px', color: colors.textMuted }}>{rangeKm} km range</div>
          )}
        </div>
      </div>

      {/* Battery bar */}
      <div style={{
        height: '6px', borderRadius: borderRadius.full,
        background: colors.glass, overflow: 'hidden',
        marginBottom: spacing.md,
      }}>
        <div style={{
          height: '100%', width: `${batteryLevel}%`,
          borderRadius: borderRadius.full,
          background: isCharging
            ? `linear-gradient(90deg, ${colors.teal}, ${colors.statusGood})`
            : batteryLevel > 20 ? colors.statusGood : colors.statusAlert,
          transition: 'width 1s ease',
        }} />
      </div>

      {/* Status badges */}
      <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
        <span className="liquid-pill" style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '3px 10px', fontSize: '11px', fontWeight: 500,
          color: isLocked ? colors.statusGood : colors.statusAlert,
        }}>
          <Icon path={isLocked ? mdiLock : mdiLockOpen} size={0.45} />
          {isLocked ? 'Locked' : 'Unlocked'}
        </span>
        <span className="liquid-pill" style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '3px 10px', fontSize: '11px', fontWeight: 500,
          color: locationState === 'home' ? colors.statusGood : colors.textSecondary,
        }}>
          <Icon path={mdiMapMarker} size={0.45} />
          {locationState === 'home' ? 'Home' : locationState}
        </span>
        {insideTempVal != null && (
          <span className="liquid-pill" style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '3px 10px', fontSize: '11px', color: colors.textSecondary,
          }}>
            <Icon path={mdiThermometer} size={0.45} />
            {Math.round(insideTempVal)}° in
          </span>
        )}
        {outsideTempVal != null && (
          <span className="liquid-pill" style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '3px 10px', fontSize: '11px', color: colors.textSecondary,
          }}>
            <Icon path={mdiThermometer} size={0.45} />
            {Math.round(outsideTempVal)}° out
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Solar Forecast ──────────────────────────────────────

function SolarForecast() {
  const solarPower = useEntity(energyEntities.solarPower as EntityName, { returnNullIfNotFound: true })
  const dailyProd = useEntity(energyEntities.dailyProduction as EntityName, { returnNullIfNotFound: true })
  const forecastToday = useEntity(energyEntities.forecastToday as EntityName, { returnNullIfNotFound: true })
  const forecastTomorrow = useEntity(energyEntities.forecastTomorrow as EntityName, { returnNullIfNotFound: true })
  const forecastRemaining = useEntity(energyEntities.forecastTodayRemaining as EntityName, { returnNullIfNotFound: true })

  if (!solarPower) return null

  const solar = parseFloat(solarPower.state) || 0
  const daily = dailyProd ? parseFloat(dailyProd.state) || 0 : 0
  const todayForecast = forecastToday ? parseFloat(forecastToday.state) || 0 : 0
  const tomorrowForecast = forecastTomorrow ? parseFloat(forecastTomorrow.state) || 0 : 0
  const remaining = forecastRemaining ? parseFloat(forecastRemaining.state) || 0 : 0

  return (
    <div className="liquid-glass" style={{
      padding: spacing.lg, borderRadius: borderRadius.lg,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
        <Icon path={mdiSolarPower} size={1} color={colors.solarYellow} />
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: colors.textPrimary }}>Solar</div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>
            {solar >= 1000 ? `${(solar / 1000).toFixed(1)} kW` : `${Math.round(solar)} W`} now
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.sm,
        textAlign: 'center',
      }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: colors.solarYellow }}>
            {daily.toFixed(1)}
          </div>
          <div style={{ fontSize: '10px', color: colors.textMuted }}>kWh today</div>
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: colors.textPrimary }}>
            {todayForecast > 0 ? todayForecast.toFixed(1) : '--'}
          </div>
          <div style={{ fontSize: '10px', color: colors.textMuted }}>forecast</div>
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: colors.textSecondary }}>
            {tomorrowForecast > 0 ? tomorrowForecast.toFixed(1) : '--'}
          </div>
          <div style={{ fontSize: '10px', color: colors.textMuted }}>tomorrow</div>
        </div>
      </div>

      {remaining > 0 && (
        <div style={{
          marginTop: spacing.sm, fontSize: '11px', color: colors.textMuted, textAlign: 'center',
        }}>
          {remaining.toFixed(1)} kWh remaining today
        </div>
      )}
    </div>
  )
}

// ─── Server Status ───────────────────────────────────────

function ServerStatus() {
  const serverPower = useEntity(glanceEntities.serverPower as EntityName, { returnNullIfNotFound: true })

  const power = serverPower ? parseFloat(serverPower.state) || 0 : 0
  const isOnline = serverPower != null && serverPower.state !== 'unavailable'

  return (
    <div className="liquid-glass" style={{
      padding: spacing.lg, borderRadius: borderRadius.lg,
      display: 'flex', alignItems: 'center', gap: spacing.md,
    }}>
      <Icon
        path={mdiServer}
        size={1}
        color={isOnline ? colors.statusGood : colors.statusAlert}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary }}>Server</div>
        <div style={{ fontSize: '12px', color: isOnline ? colors.statusGood : colors.statusAlert }}>
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>
          <Icon path={mdiFlash} size={0.5} color={colors.solarYellow} style={{ verticalAlign: 'middle' }} />
          {' '}{Math.round(power)} W
        </div>
      </div>
      <div style={{
        width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
        background: isOnline ? colors.statusGood : colors.statusAlert,
        boxShadow: `0 0 8px ${isOnline ? colors.statusGood : colors.statusAlert}`,
      }} />
    </div>
  )
}

// ─── Glance View ─────────────────────────────────────────

export function GlanceView() {
  const breakpoint = useBreakpoint()
  const isDesktop = breakpoint === 'desktop'

  return (
    <div className="stagger-in" style={{
      display: 'flex', flexDirection: 'column', gap: spacing.md,
      maxWidth: isDesktop ? '1100px' : '600px', margin: '0 auto',
    }}>
      <h1 className="page-title" style={{ marginBottom: spacing.sm }}>
        <Icon path={mdiEye} size={0.9} style={{ verticalAlign: 'middle', marginRight: spacing.sm }} />
        At a Glance
      </h1>

      {/* Sun Arc — hero, full width */}
      <SunArc />

      {/* Family Presence */}
      <FamilyPresence />

      {/* Hourly Forecast — full width */}
      <HourlyForecast />

      {/* Tesla + Solar side by side on desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
        gap: spacing.md,
      }}>
        <TeslaStatus />
        <SolarForecast />
      </div>

      {/* Server Status */}
      <ServerStatus />
    </div>
  )
}
