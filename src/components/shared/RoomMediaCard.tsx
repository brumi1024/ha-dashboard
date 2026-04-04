import { useState, useCallback } from 'react'
import { useEntity, useHass, type EntityName } from '@hakit/core'
import { callService as wsCallService } from 'home-assistant-js-websocket'
import { Icon } from '@mdi/react'
import {
  mdiPlay,
  mdiPause,
  mdiPower,
  mdiVolumeHigh,
  mdiVolumeLow,
  mdiVolumeMute,
  mdiMusic,
  mdiTelevision,
  mdiSpeaker,
} from '@mdi/js'
import { colors, borderRadius, spacing } from '../../styles/theme'
import { MediaPlayerSheet } from './MediaPlayerSheet'

interface RoomMediaCardProps {
  entityId: string
}

interface MediaAttributes {
  friendly_name?: string
  media_title?: string
  media_artist?: string
  entity_picture?: string
  volume_level?: number
  is_volume_muted?: boolean
  device_class?: string
  source?: string
  app_name?: string
}

function getSourceIcon(attrs: MediaAttributes): string {
  const dc = attrs.device_class
  const name = (attrs.friendly_name || '').toLowerCase()
  if (dc === 'tv' || name.includes('tv')) return mdiTelevision
  if (dc === 'speaker' || name.includes('sonos') || name.includes('speaker')) return mdiSpeaker
  return mdiMusic
}

function volumeIcon(level: number, muted: boolean): string {
  if (muted || level === 0) return mdiVolumeMute
  if (level < 0.4) return mdiVolumeLow
  return mdiVolumeHigh
}

export function RoomMediaCard({ entityId }: RoomMediaCardProps) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  const { connection } = useHass()
  const [sheetOpen, setSheetOpen] = useState(false)

  const callService = useCallback((service: string, data?: Record<string, unknown>) => {
    if (!connection) return
    wsCallService(connection, 'media_player', service, data, { entity_id: entityId })
      .catch(() => {})
  }, [connection, entityId])

  if (!entity) return null

  const attrs = entity.attributes as MediaAttributes
  const isOff = entity.state === 'off' || entity.state === 'unavailable' || entity.state === 'unknown'
  const isPlaying = entity.state === 'playing'
  const isPaused = entity.state === 'paused'
  const isActive = isPlaying || isPaused

  const displayName = attrs.friendly_name || entityId.replace('media_player.', '')
  const sourceIcon = getSourceIcon(attrs)

  const title = attrs.media_title || attrs.app_name || attrs.source || (isOff ? 'Off' : entity.state)
  const subtitle = attrs.media_artist

  const volume = attrs.volume_level ?? 0
  const isMuted = attrs.is_volume_muted ?? false
  const effectiveVolume = isMuted ? 0 : volume

  return (
    <>
      <div
        className="liquid-glass"
        style={{
          padding: `${spacing.md} ${spacing.lg}`,
          borderRadius: borderRadius.lg,
          width: '100%',
          background: isActive ? 'rgba(255, 255, 255, 0.12)' : undefined,
        }}
      >
        {/* Top row: icon + info + play/pause + power */}
        <div
          onClick={() => !isOff && setSheetOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            cursor: isOff ? 'default' : 'pointer',
            fontSize: '14px',
          }}
        >
          <span style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.3s ease',
          }}>
            <Icon path={sourceIcon} size={0.8} color={isActive ? colors.textPrimary : colors.textMuted} />
          </span>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 500, color: colors.textPrimary,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {displayName}
            </div>
            <div style={{
              fontSize: '12px', color: colors.textSecondary,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {subtitle ? `${title} — ${subtitle}` : title}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, flexShrink: 0 }}>
            {isActive && (
              <button
                onClick={(e) => { e.stopPropagation(); callService('media_play_pause') }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: colors.textPrimary,
                }}
              >
                <Icon path={isPlaying ? mdiPause : mdiPlay} size={0.75} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                callService(isOff ? 'turn_on' : 'turn_off')
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isOff ? colors.textMuted : colors.textSecondary,
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon path={mdiPower} size={0.7} />
            </button>
          </div>
        </div>

        {/* Volume slider */}
        {!isOff && (
          <div style={{
            marginTop: spacing.sm,
            paddingLeft: '52px',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            <Icon
              path={volumeIcon(volume, isMuted)}
              size={0.55}
              color={colors.textMuted}
              style={{ flexShrink: 0 }}
            />
            <input
              type="range"
              className="media-volume"
              min={0}
              max={1}
              step={0.02}
              value={effectiveVolume}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => callService('volume_set', { volume_level: parseFloat(e.target.value) })}
              style={{
                flex: 1,
                appearance: 'none',
                height: 4,
                borderRadius: 2,
                background: `linear-gradient(to right, ${colors.textPrimary} ${effectiveVolume * 100}%, rgba(255,255,255,0.1) ${effectiveVolume * 100}%)`,
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </div>
        )}
      </div>

      <MediaPlayerSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        entityId={entityId}
      />
    </>
  )
}
