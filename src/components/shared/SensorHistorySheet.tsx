import { useState, useMemo } from 'react'
import { useEntity, useHistory, type EntityName } from '@hakit/core'
import { Icon } from '@mdi/react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { SensorConfig } from '../../config/rooms'
import { BottomSheet } from './BottomSheet'
import { AnimatedCounter } from './AnimatedCounter'
import { colors, spacing, borderRadius } from '../../styles/theme'
import { getMdiPath } from '../../utils/formatters'

interface SensorHistorySheetProps {
  isOpen: boolean
  onClose: () => void
  sensor: SensorConfig
}

const TIME_RANGES = [
  { label: '6h', hours: 6 },
  { label: '24h', hours: 24 },
  { label: '7d', hours: 168 },
] as const

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

function formatTimeLabel(timestamp: number, hoursToShow: number): string {
  const d = new Date(timestamp)
  if (hoursToShow <= 24) {
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
  return d.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric' })
}

function SensorHistoryContent({ sensor }: { sensor: SensorConfig }) {
  const [hoursToShow, setHoursToShow] = useState(24)
  const entity = useEntity(sensor.entity as EntityName, { returnNullIfNotFound: true })
  const history = useHistory(sensor.entity as EntityName, { hoursToShow })

  const currentValue = entity ? parseFloat(entity.state) : null
  const unit = (entity?.attributes as Record<string, unknown>)?.unit_of_measurement as string | undefined ?? sensor.unit ?? ''
  const iconPath = getMdiPath(sensor.icon)
  const isNumeric = currentValue !== null && !isNaN(currentValue)

  const chartData = useMemo(() => {
    const points = historyToPoints(history as any)
    return points.map(([time, value]) => ({ time, value }))
  }, [history])

  const gradientId = `sensorGrad-${sensor.entity.replace(/\./g, '-')}`

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
        {iconPath && <Icon path={iconPath} size={0.8} color={colors.teal} />}
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: colors.textPrimary }}>{sensor.name}</h3>
      </div>

      {/* Current value */}
      <div style={{ marginBottom: spacing.lg }}>
        <div style={{ fontSize: '42px', fontWeight: 300, color: colors.textPrimary }}>
          {isNumeric ? (
            <AnimatedCounter value={currentValue} decimals={currentValue % 1 !== 0 ? 1 : 0} suffix={unit ? ` ${unit}` : ''} />
          ) : (
            <span>{entity?.state ?? '—'}{unit ? ` ${unit}` : ''}</span>
          )}
        </div>
      </div>

      {/* Time range pills */}
      <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.lg }}>
        {TIME_RANGES.map((range) => (
          <button
            key={range.label}
            className={hoursToShow === range.hours ? 'liquid-pill liquid-pill-active' : 'liquid-pill'}
            onClick={() => setHoursToShow(range.hours)}
            style={{
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.full,
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: hoursToShow === range.hours ? colors.textPrimary : colors.textSecondary,
              background: hoursToShow === range.hours ? colors.glassActive : colors.glass,
            }}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 2 && (
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.teal} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tickFormatter={(t) => formatTimeLabel(t, hoursToShow)}
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
                formatter={(value) => [`${Number(value).toFixed(1)}${unit ? ` ${unit}` : ''}`, sensor.name]}
              />
              <Area type="monotone" dataKey="value" stroke={colors.teal} fill={`url(#${gradientId})`} strokeWidth={2} dot={false} connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export function SensorHistorySheet({ isOpen, onClose, sensor }: SensorHistorySheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {isOpen && <SensorHistoryContent sensor={sensor} />}
    </BottomSheet>
  )
}
