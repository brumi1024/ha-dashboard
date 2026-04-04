import { useEntity, type EntityName } from '@hakit/core'
import { colors, spacing, borderRadius } from '../../styles/theme'

export function SunArc() {
  const sun = useEntity('sun.sun' as EntityName, { returnNullIfNotFound: true })

  if (!sun) return null

  const attrs = sun.attributes as {
    elevation: number
    rising: boolean
    next_rising: string
    next_setting: string
  }

  const elevation = attrs.elevation ?? 0
  const isAboveHorizon = elevation > 0
  const nextRising = attrs.next_rising
  const nextSetting = attrs.next_setting

  const sunriseStr = nextRising
    ? new Date(nextRising).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '--'
  const sunsetStr = nextSetting
    ? new Date(nextSetting).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '--'

  // Map elevation to arc parameter t (0=horizon left, 0.5=peak, 1=horizon right)
  // Use rising/setting to determine which half of the arc we're on
  // elevation ranges roughly -10 to 60; map 0..60 to the arc
  const elevNorm = Math.max(0, Math.min(1, elevation / 55))
  // When rising, t goes from 0 to 0.5; when setting, from 0.5 to 1
  const t = isAboveHorizon
    ? attrs.rising ? elevNorm * 0.5 : 1 - elevNorm * 0.5
    : attrs.rising ? 0 : 1

  // Quadratic bezier: P0=(40,170) P1=(200,-20) P2=(360,170)
  const p0x = 40, p0y = 170
  const p1x = 200, p1y = -20
  const p2x = 360, p2y = 170

  const sunX = (1 - t) * (1 - t) * p0x + 2 * (1 - t) * t * p1x + t * t * p2x
  const sunY = (1 - t) * (1 - t) * p0y + 2 * (1 - t) * t * p1y + t * t * p2y

  // Below horizon: place sun slightly below the horizon line
  const belowX = attrs.rising ? 60 : 340
  const belowY = 185

  const dotX = isAboveHorizon ? sunX : belowX
  const dotY = isAboveHorizon ? sunY : belowY
  const dotOpacity = isAboveHorizon ? 1 : 0.3

  return (
    <div
      className="liquid-glass"
      style={{
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        height: '180px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Status text */}
      <div style={{
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        marginBottom: spacing.xs,
      }}>
        <div style={{
          fontSize: '12px',
          color: isAboveHorizon ? colors.solarYellow : colors.textMuted,
          fontWeight: 500,
        }}>
          {isAboveHorizon ? 'Above Horizon' : 'Below Horizon'}
        </div>
        <div style={{
          fontSize: '11px',
          color: colors.textSecondary,
          marginTop: '2px',
        }}>
          {elevation.toFixed(1)}°
        </div>
      </div>

      <svg
        viewBox="0 0 400 200"
        style={{ width: '100%', height: '120px', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Sun glow filter */}
          <filter id="sun-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Warm radial glow behind sun */}
          <radialGradient id="sun-radial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.solarYellow} stopOpacity={isAboveHorizon ? 0.4 : 0} />
            <stop offset="100%" stopColor={colors.solarYellow} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Arc path — sun's trajectory */}
        <path
          d={`M ${p0x} ${p0y} Q ${p1x} ${p1y} ${p2x} ${p2y}`}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Traveled arc portion (golden) */}
        {isAboveHorizon && (
          <path
            d={`M ${p0x} ${p0y} Q ${p1x} ${p1y} ${p2x} ${p2y}`}
            fill="none"
            stroke={colors.solarYellow}
            strokeWidth={2}
            strokeLinecap="round"
            strokeOpacity={0.25}
            strokeDasharray={`${t * 500} 500`}
          />
        )}

        {/* Horizon line */}
        <line
          x1={20} y1={170} x2={380} y2={170}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
          strokeDasharray="6 4"
        />

        {/* Warm glow behind sun */}
        {isAboveHorizon && (
          <circle
            cx={dotX}
            cy={dotY}
            r={28}
            fill="url(#sun-radial)"
          />
        )}

        {/* Sun dot */}
        <circle
          cx={dotX}
          cy={dotY}
          r={6}
          fill={colors.solarYellow}
          opacity={dotOpacity}
          filter={isAboveHorizon ? 'url(#sun-glow)' : undefined}
        />

        {/* Sunrise label */}
        <text
          x={40}
          y={195}
          textAnchor="start"
          fill={colors.textSecondary}
          fontSize={11}
        >
          {sunriseStr}
        </text>

        {/* Sunset label */}
        <text
          x={360}
          y={195}
          textAnchor="end"
          fill={colors.textSecondary}
          fontSize={11}
        >
          {sunsetStr}
        </text>
      </svg>
    </div>
  )
}
