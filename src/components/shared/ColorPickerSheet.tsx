import { useEntity, type EntityName } from '@hakit/core'
import { BottomSheet } from './BottomSheet'
import { colors, spacing, borderRadius } from '../../styles/theme'

interface ColorPickerSheetProps {
  isOpen: boolean
  onClose: () => void
  entityId: string
}

type ColorMode = 'onoff' | 'brightness' | 'color_temp' | 'xy' | 'hs' | 'rgb' | 'rgbw' | 'rgbww' | 'white'

const COLOR_PRESETS: { name: string; rgb: [number, number, number] }[] = [
  { name: 'Warm White', rgb: [255, 208, 160] },
  { name: 'Daylight', rgb: [255, 245, 228] },
  { name: 'Cool White', rgb: [200, 220, 255] },
  { name: 'Red', rgb: [255, 0, 0] },
  { name: 'Orange', rgb: [255, 140, 0] },
  { name: 'Yellow', rgb: [255, 220, 0] },
  { name: 'Green', rgb: [0, 200, 0] },
  { name: 'Teal', rgb: [0, 200, 200] },
  { name: 'Blue', rgb: [0, 100, 255] },
  { name: 'Purple', rgb: [140, 0, 255] },
  { name: 'Pink', rgb: [255, 0, 150] },
  { name: 'Lavender', rgb: [180, 130, 255] },
]

export function ColorPickerSheet({ isOpen, onClose, entityId }: ColorPickerSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} maxHeight="60vh">
      {isOpen && <ColorPickerContent entityId={entityId} onClose={onClose} />}
    </BottomSheet>
  )
}

function ColorPickerContent({ entityId, onClose }: { entityId: string; onClose: () => void }) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })

  if (!entity) return null

  const attrs = entity.attributes as {
    supported_color_modes?: ColorMode[]
    color_temp_kelvin?: number
    min_color_temp_kelvin?: number
    max_color_temp_kelvin?: number
    rgb_color?: [number, number, number]
  }

  const colorModes = attrs.supported_color_modes || []
  const hasColorTemp = colorModes.includes('color_temp')
  const hasRgb = colorModes.some(m => ['xy', 'hs', 'rgb', 'rgbw', 'rgbww'].includes(m))

  const minKelvin = attrs.min_color_temp_kelvin ?? 2200
  const maxKelvin = attrs.max_color_temp_kelvin ?? 6500
  const currentKelvin = attrs.color_temp_kelvin ?? Math.round((minKelvin + maxKelvin) / 2)
  const currentRgb = attrs.rgb_color

  const displayName = entity.attributes.friendly_name || entityId.split('.').pop()

  return (
      <div style={{ padding: `0 ${spacing.sm}` }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.lg,
        }}>
          <h3 style={{
            fontSize: '17px',
            fontWeight: 600,
            color: colors.textPrimary,
          }}>
            {displayName}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              color: colors.textSecondary,
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            &times;
          </button>
        </div>

        {/* Color Temperature */}
        {hasColorTemp && (
          <div style={{ marginBottom: spacing.lg }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: colors.textMuted,
              marginBottom: spacing.sm,
            }}>
              Color Temperature
            </div>
            <div style={{
              height: '32px',
              borderRadius: borderRadius.full,
              background: 'linear-gradient(to right, #FF8A2B, #FFD4A0, #FFFFFF, #C4D4FF, #80A4FF)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <input
                type="range"
                className="color-temp-slider"
                min={minKelvin}
                max={maxKelvin}
                value={currentKelvin}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  (entity as any).service.turn_on({ serviceData: { color_temp_kelvin: value } })
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                  margin: 0,
                }}
              />
              {/* Thumb indicator */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: `${((currentKelvin - minKelvin) / (maxKelvin - minKelvin)) * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)',
                pointerEvents: 'none',
              }} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: spacing.xs,
              fontSize: '11px',
              color: colors.textMuted,
            }}>
              <span>Warm</span>
              <span>{currentKelvin}K</span>
              <span>Cool</span>
            </div>
          </div>
        )}

        {/* RGB Color Presets */}
        {hasRgb && (
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: colors.textMuted,
              marginBottom: spacing.sm,
            }}>
              Color
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: spacing.sm,
            }}>
              {COLOR_PRESETS.map((preset) => {
                const isActive = currentRgb &&
                  Math.abs(currentRgb[0] - preset.rgb[0]) < 20 &&
                  Math.abs(currentRgb[1] - preset.rgb[1]) < 20 &&
                  Math.abs(currentRgb[2] - preset.rgb[2]) < 20

                return (
                  <button
                    key={preset.name}
                    onClick={() => {
                      (entity as any).service.turn_on({ serviceData: { rgb_color: preset.rgb } })
                    }}
                    title={preset.name}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '50%',
                      background: `rgb(${preset.rgb[0]}, ${preset.rgb[1]}, ${preset.rgb[2]})`,
                      border: isActive ? '2px solid white' : '2px solid transparent',
                      cursor: 'pointer',
                      boxShadow: isActive
                        ? `0 0 12px rgb(${preset.rgb[0]}, ${preset.rgb[1]}, ${preset.rgb[2]})`
                        : 'none',
                      transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                    }}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
  )
}
