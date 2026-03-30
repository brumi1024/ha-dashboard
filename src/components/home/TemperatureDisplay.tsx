import { useMemo } from 'react'
import { useEntity, useHistory, type EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { mdiThermometer, mdiWeatherCloudy } from '@mdi/js'
import { AnimatedCounter } from '../shared/AnimatedCounter'
import { colors, spacing } from '../../styles/theme'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const INDOOR_ENTITY = 'sensor.indoor_temperature_average'
const OUTDOOR_ENTITY = 'sensor.outdoor_sensor_temperature'

function historyToPoints(history: { entityHistory: any[]; coordinates: number[][] }): [number, number][] {
  if (history.coordinates?.length > 5) {
    return history.coordinates as [number, number][]
  }
  return (history.entityHistory ?? [])
    .filter((entry: any) => entry?.s != null && !isNaN(Number(entry.s)))
    .map((entry: any) => {
      const timestamp = entry.lc ? entry.lc * 1000 : entry.lu ? entry.lu * 1000 : 0
      return [timestamp, Number(entry.s)] as [number, number]
    })
    .filter(([t]) => t > 0)
}

function formatXAxisTick(timestamp: number): string {
  const d = new Date(timestamp)
  const h = d.getHours()
  if (h === 0) return '12AM'
  if (h === 6) return '6AM'
  if (h === 12) return '12PM'
  if (h === 18) return '6PM'
  return ''
}

export function TemperatureDisplay() {
  const indoor = useEntity(INDOOR_ENTITY as EntityName)
  const outdoor = useEntity(OUTDOOR_ENTITY as EntityName)
  const indoorHistory = useHistory(INDOOR_ENTITY as EntityName, { hoursToShow: 24 })
  const outdoorHistory = useHistory(OUTDOOR_ENTITY as EntityName, { hoursToShow: 24 })

  const indoorTemp = parseFloat(indoor.state) || 0
  const outdoorTemp = parseFloat(outdoor.state) || 0

  const chartData = useMemo(() => {
    const indoorPoints = historyToPoints(indoorHistory)
    const outdoorPoints = historyToPoints(outdoorHistory)

    const timeMap = new Map<number, { indoor?: number; outdoor?: number }>()
    for (const [t, v] of indoorPoints) {
      const entry = timeMap.get(t) ?? {}
      entry.indoor = v
      timeMap.set(t, entry)
    }
    for (const [t, v] of outdoorPoints) {
      const entry = timeMap.get(t) ?? {}
      entry.outdoor = v
      timeMap.set(t, entry)
    }

    return [...timeMap.entries()]
      .sort(([a], [b]) => a - b)
      .map(([time, vals]) => ({ time, ...vals }))
  }, [indoorHistory, outdoorHistory])

  return (
    <div className="liquid-glass" style={{ padding: spacing.md, width: '100%' }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
        <span className="section-label" style={{ margin: 0 }}>TEMPERATURE · 24H</span>
        <div style={{ display: 'flex', gap: spacing.lg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <Icon path={mdiThermometer} size={0.6} color={colors.accentGreen} />
            <span style={{ fontSize: '16px', fontWeight: 700, color: colors.textPrimary }}>
              <AnimatedCounter value={indoorTemp} decimals={1} suffix="°" />
            </span>
            <span style={{ fontSize: '11px', color: colors.textMuted }}>In</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <Icon path={mdiWeatherCloudy} size={0.6} color={colors.accentBlue} />
            <span style={{ fontSize: '16px', fontWeight: 700, color: colors.textPrimary }}>
              <AnimatedCounter value={outdoorTemp} decimals={1} suffix="°" />
            </span>
            <span style={{ fontSize: '11px', color: colors.textMuted }}>Out</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 2 && (
        <div style={{ width: '100%', height: 150 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id="indoorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.accentGreen} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={colors.accentGreen} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outdoorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.accentBlue} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={colors.accentBlue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tickFormatter={formatXAxisTick}
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(10, 26, 18, 0.9)',
                  border: `1px solid ${colors.glassBorder}`,
                  borderRadius: '8px',
                  color: colors.textPrimary,
                  backdropFilter: 'blur(16px)',
                  fontSize: '12px',
                  padding: '6px 10px',
                }}
                labelFormatter={(t) => new Date(t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                formatter={(value, name) => [
                  `${Number(value).toFixed(1)}°`,
                  name === 'indoor' ? 'Indoor' : 'Outdoor',
                ]}
              />
              <Area type="monotone" dataKey="indoor" stroke={colors.accentGreen} fill="url(#indoorGrad)" strokeWidth={2} dot={false} connectNulls />
              <Area type="monotone" dataKey="outdoor" stroke={colors.accentBlue} fill="url(#outdoorGrad)" strokeWidth={2} dot={false} connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
