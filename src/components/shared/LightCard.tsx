import { useState } from 'react'
import { Icon } from '@mdi/react'
import { mdiLightbulb, mdiLightbulbOff } from '@mdi/js'
import { useEntity, type EntityName } from '@hakit/core'
import { colors, borderRadius, spacing } from '../../styles/theme'
import { ColorPickerSheet } from './ColorPickerSheet'

interface LightCardProps {
  entity: string
  name?: string
}

type ColorMode = 'onoff' | 'brightness' | 'color_temp' | 'xy' | 'hs' | 'rgb' | 'rgbw' | 'rgbww' | 'white'

export function LightCard({ entity, name }: LightCardProps) {
  const light = useEntity(entity as EntityName)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  const isOn = light.state === 'on'
  const displayName = name || light.attributes.friendly_name || entity.split('.').pop()

  const attrs = light.attributes as {
    supported_color_modes?: ColorMode[]
    brightness?: number
    rgb_color?: [number, number, number]
  }

  const colorModes = attrs.supported_color_modes || []
  const hasBrightness = colorModes.some(m => m !== 'onoff')
  const hasColor = colorModes.some(m => ['color_temp', 'xy', 'hs', 'rgb', 'rgbw', 'rgbww'].includes(m))

  const brightness = attrs.brightness ?? 0
  const brightnessPercent = Math.round((brightness / 255) * 100)
  const rgbColor = attrs.rgb_color

  const statusText = !isOn
    ? 'Off'
    : hasBrightness
      ? `${brightnessPercent}%`
      : 'On'

  const colorDotColor = rgbColor
    ? `rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`
    : '#FFD0A0'

  return (
    <>
      <div
        className="liquid-glass"
        style={{
          padding: `${spacing.md} ${spacing.lg}`,
          borderRadius: borderRadius.lg,
          background: isOn ? colors.amberSoft : undefined,
          width: '100%',
        }}
      >
        <div
          onClick={() => (light as any).service.toggle()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            color: isOn ? colors.amber : colors.textSecondary,
            fontSize: '14px',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <span style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: isOn ? colors.amberGlow : 'rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.3s ease',
          }}>
            <Icon path={isOn ? mdiLightbulb : mdiLightbulbOff} size={0.8} color={isOn ? colors.amber : colors.textMuted} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, color: colors.textPrimary }}>{displayName}</div>
            <div style={{ fontSize: '12px', color: colors.textSecondary }}>{statusText}</div>
          </div>
          {hasColor && isOn && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setColorPickerOpen(true)
              }}
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: colorDotColor,
                border: '2px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: `0 0 8px ${colorDotColor}`,
                transition: 'box-shadow 0.3s ease',
              }}
              aria-label="Pick color"
            />
          )}
        </div>

        {hasBrightness && isOn && (
          <div style={{ marginTop: spacing.sm, paddingLeft: '52px' }}>
            <input
              type="range"
              className="light-brightness"
              min={1}
              max={255}
              value={brightness}
              onChange={(e) => {
                const value = Number(e.target.value);
                (light as any).service.turn_on({ serviceData: { brightness: value } })
              }}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>

      {hasColor && (
        <ColorPickerSheet
          isOpen={colorPickerOpen}
          onClose={() => setColorPickerOpen(false)}
          entityId={entity}
        />
      )}
    </>
  )
}
