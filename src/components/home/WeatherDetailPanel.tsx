import { useState } from 'react'
import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { BottomSheet } from '../shared/BottomSheet'
import { Icon } from '@mdi/react'
import {
  mdiWeatherCloudy, mdiClose, mdiWeatherRainy,
  mdiWeatherWindy, mdiWhiteBalanceSunny,
} from '@mdi/js'
import {
  AreaChart, Area, Bar, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart,
  CartesianGrid,
} from 'recharts'
import { weatherEntity } from '../../config/rooms'
import { useForecast, type ForecastItem } from '../../hooks/useForecast'
import { conditionIcons } from './WeatherCard'
import { colors, spacing } from '../../styles/theme'

interface WeatherDetailPanelProps {
  isOpen: boolean
  onClose: () => void
}

const tabs = [
  { id: 'forecast', label: 'Forecast', icon: mdiWeatherCloudy },
  { id: 'rainfall', label: 'Rainfall', icon: mdiWeatherRainy },
  { id: 'wind', label: 'Wind', icon: mdiWeatherWindy },
  { id: 'uv', label: 'UV', icon: mdiWhiteBalanceSunny },
]

const tooltipStyle = {
  background: 'rgba(10, 26, 18, 0.9)',
  border: `1px solid ${colors.glassBorder}`,
  borderRadius: '8px',
  color: colors.textPrimary,
  fontSize: '12px',
  padding: '6px 10px',
}

function formatHour(datetime: string): string {
  return new Date(datetime).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
}

function formatDay(datetime: string): string {
  const d = new Date(datetime)
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}

/* ─── Forecast Tab ─── */
function ForecastTab({ daily, hourly }: { daily: ForecastItem[]; hourly: ForecastItem[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      {/* Daily forecast */}
      <div>
        <div className="section-label">DAILY</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          {daily.slice(0, 6).map((item) => (
            <div key={item.datetime} style={{
              display: 'flex', alignItems: 'center', gap: spacing.sm,
              padding: `${spacing.xs} 0`,
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ width: '40px', fontSize: '13px', color: colors.textSecondary }}>
                {formatDay(item.datetime)}
              </span>
              <Icon path={conditionIcons[item.condition] || mdiWeatherCloudy} size={0.65} color={colors.textSecondary} />
              <span style={{ flex: 1, fontSize: '13px', color: colors.textMuted }}>
                {item.precipitation > 0 ? `${item.precipitation}mm` : ''}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary, width: '32px', textAlign: 'right' }}>
                {Math.round(item.temperature)}°
              </span>
              <span style={{ fontSize: '12px', color: colors.textMuted, width: '28px', textAlign: 'right' }}>
                {item.templow != null ? `${Math.round(item.templow)}°` : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly chart */}
      {hourly.length > 0 && (
        <div>
          <div className="section-label">HOURLY</div>
          <div
            className="hide-scrollbar"
            style={{
              display: 'flex', gap: spacing.xs,
              overflowX: 'auto', scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {hourly.slice(0, 24).map((item) => (
              <div key={item.datetime} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '3px', padding: `${spacing.xs} ${spacing.sm}`,
                flexShrink: 0, minWidth: '42px',
              }}>
                <span style={{ fontSize: '10px', color: colors.textMuted }}>{formatHour(item.datetime)}</span>
                <Icon path={conditionIcons[item.condition] || mdiWeatherCloudy} size={0.5} color={colors.textSecondary} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: colors.textPrimary }}>{Math.round(item.temperature)}°</span>
                <span style={{ fontSize: '9px', color: colors.textMuted }}>
                  {item.precipitation > 0 ? `${item.precipitation}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Rainfall Tab ─── */
function RainfallTab({ hourly }: { hourly: ForecastItem[] }) {
  const chartData = hourly.slice(0, 24).map((item) => ({
    time: formatHour(item.datetime),
    rain: item.precipitation,
    temp: item.temperature,
  }))

  const totalRain = hourly.slice(0, 24).reduce((sum, h) => sum + h.precipitation, 0)
  const peakRain = Math.max(...hourly.slice(0, 24).map(h => h.precipitation), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>Rainfall & Temperature</div>
        <div style={{ fontSize: '13px', color: colors.textMuted }}>
          {totalRain.toFixed(1)}mm total, {peakRain.toFixed(1)}mm peak
        </div>
      </div>

      {chartData.length > 0 && (
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis yAxisId="rain" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="temp" orientation="right" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar yAxisId="rain" dataKey="rain" fill="rgba(100, 150, 255, 0.5)" radius={[2, 2, 0, 0]} name="Rain (mm)" />
              <Line yAxisId="temp" type="monotone" dataKey="temp" stroke={colors.accentRed} strokeWidth={2} dot={false} name="Temp (°C)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

/* ─── Wind Tab ─── */
function WindTab({ hourly }: { hourly: ForecastItem[] }) {
  const weather = useEntity(weatherEntity as EntityName)
  const currentSpeed = (weather.attributes as { wind_speed?: number }).wind_speed ?? 0
  const currentBearing = (weather.attributes as { wind_bearing?: number }).wind_bearing ?? 0

  const chartData = hourly.slice(0, 24).map((item) => ({
    time: formatHour(item.datetime),
    speed: item.wind_speed,
    direction: item.wind_bearing,
  }))

  const peakSpeed = Math.max(...hourly.slice(0, 24).map(h => h.wind_speed), 0)
  const windDesc = currentSpeed < 10 ? 'Calm' : currentSpeed < 20 ? 'Light breeze' : currentSpeed < 30 ? 'Breezy' : 'Windy'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>Wind Speed & Direction</div>
        <div style={{ fontSize: '13px', color: colors.textMuted }}>
          {windDesc} ({Math.round(peakSpeed)} km/h peak)
        </div>
      </div>

      {chartData.length > 0 && (
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis yAxisId="speed" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="dir" orientation="right" domain={[0, 360]} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area yAxisId="speed" type="monotone" dataKey="speed" stroke={colors.accentBlue} fill="rgba(100, 210, 255, 0.15)" strokeWidth={2} name="Speed (km/h)" />
              <Line yAxisId="dir" type="monotone" dataKey="direction" stroke={colors.accentAmber} strokeWidth={1.5} dot={false} strokeDasharray="4 4" name="Direction (°)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ display: 'flex', gap: spacing.md, fontSize: '13px' }}>
        <div>
          <div style={{ color: colors.textMuted }}>Current</div>
          <div style={{ color: colors.textPrimary, fontWeight: 600 }}>{Math.round(currentSpeed)} km/h</div>
        </div>
        <div>
          <div style={{ color: colors.textMuted }}>Direction</div>
          <div style={{ color: colors.textPrimary, fontWeight: 600 }}>{Math.round(currentBearing)}°</div>
        </div>
      </div>
    </div>
  )
}

/* ─── UV Tab ─── */
function UVTab({ hourly }: { hourly: ForecastItem[] }) {
  const weather = useEntity(weatherEntity as EntityName)
  const currentUV = (weather.attributes as { uv_index?: number }).uv_index ?? 0

  const chartData = hourly.slice(0, 24)
    .filter(h => h.uv_index != null)
    .map((item) => ({
      time: formatHour(item.datetime),
      uv: item.uv_index ?? 0,
    }))

  const uvDesc = currentUV <= 2 ? 'Low' : currentUV <= 5 ? 'Moderate' : currentUV <= 7 ? 'High' : 'Very High'
  const uvColor = currentUV <= 2 ? colors.accentGreen : currentUV <= 5 ? colors.accentAmber : colors.accentRed

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      <div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>UV Index</div>
        <div style={{ fontSize: '13px', color: colors.textMuted }}>
          {uvDesc} (UV {currentUV.toFixed(1)})
        </div>
      </div>

      {chartData.length > 0 && (
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="uv" stroke={uvColor} fill={`${uvColor}33`} strokeWidth={2} name="UV Index" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{
        display: 'flex', alignItems: 'center', gap: spacing.sm,
        padding: spacing.sm, borderRadius: '12px',
        background: `${uvColor}15`,
      }}>
        <Icon path={mdiWhiteBalanceSunny} size={0.8} color={uvColor} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary }}>UV: {currentUV.toFixed(1)}</div>
          <div style={{ fontSize: '12px', color: colors.textMuted }}>{uvDesc}</div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Panel ─── */
function WeatherDetailContent({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('forecast')
  const { daily, hourly } = useForecast()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>Weather</div>
        <div onClick={onClose} style={{ cursor: 'pointer', padding: spacing.xs }}>
          <Icon path={mdiClose} size={0.9} color={colors.textSecondary} />
        </div>
      </div>

      {/* Tab pills */}
      <div className="hide-scrollbar" style={{ display: 'flex', gap: spacing.xs, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'liquid-pill liquid-pill-active' : 'liquid-pill'}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: spacing.xs,
              padding: `${spacing.xs} ${spacing.md}`,
              border: 'none', cursor: 'pointer',
              color: activeTab === tab.id ? colors.textPrimary : colors.textMuted,
              fontFamily: 'inherit', fontSize: '13px', fontWeight: 500,
              flexShrink: 0,
            }}
          >
            <Icon path={tab.icon} size={0.6} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'forecast' && <ForecastTab daily={daily} hourly={hourly} />}
      {activeTab === 'rainfall' && <RainfallTab hourly={hourly} />}
      {activeTab === 'wind' && <WindTab hourly={hourly} />}
      {activeTab === 'uv' && <UVTab hourly={hourly} />}
    </div>
  )
}

export function WeatherDetailPanel({ isOpen, onClose }: WeatherDetailPanelProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} maxHeight="80vh">
      <WeatherDetailContent onClose={onClose} />
    </BottomSheet>
  )
}
