import { useCallback, useMemo } from 'react'
import { useEntity, useHass, type EntityName } from '@hakit/core'
import { callService as wsCallService } from 'home-assistant-js-websocket'
import { Icon } from '@mdi/react'
import {
  mdiPlay,
  mdiPause,
  mdiSkipNext,
  mdiSkipPrevious,
  mdiVolumeHigh,
  mdiVolumeLow,
  mdiVolumeMute,
  mdiPower,
  mdiMusic,
  mdiTelevision,
  mdiSpeaker,
  mdiCheck,
} from '@mdi/js'
import { BottomSheet } from './BottomSheet'
import { colors, spacing, borderRadius } from '../../styles/theme'

interface MediaPlayerSheetProps {
  isOpen: boolean
  onClose: () => void
  entityId: string
}

interface MediaAttributes {
  friendly_name?: string
  media_title?: string
  media_artist?: string
  media_album_name?: string
  entity_picture?: string
  volume_level?: number
  is_volume_muted?: boolean
  device_class?: string
  source?: string
  source_list?: string[]
  app_name?: string
}

function getPlayerIcon(attrs: MediaAttributes): string {
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

export function MediaPlayerSheet({ isOpen, onClose, entityId }: MediaPlayerSheetProps) {
  const entity = useEntity(entityId as EntityName, { returnNullIfNotFound: true })
  const { connection, hassUrl } = useHass()

  const callService = useCallback((service: string, data?: Record<string, unknown>) => {
    if (!connection) return
    wsCallService(connection, 'media_player', service, data, { entity_id: entityId })
      .catch(() => {})
  }, [connection, entityId])

  if (!entity) return null

  const attrs = entity.attributes as MediaAttributes
  const isPlaying = entity.state === 'playing'
  const isOff = entity.state === 'off' || entity.state === 'unavailable'

  const displayName = attrs.friendly_name || entityId.replace('media_player.', '')
  const title = attrs.media_title || attrs.app_name || attrs.source || entity.state
  const subtitle = attrs.media_artist
  const album = attrs.media_album_name
  const playerIcon = getPlayerIcon(attrs)

  const volume = attrs.volume_level ?? 0
  const isMuted = attrs.is_volume_muted ?? false
  const effectiveVolume = isMuted ? 0 : volume

  const currentSource = attrs.source
  const sourceList = attrs.source_list || []

  const thumbnailUrl = useMemo(() => {
    const pic = attrs.entity_picture
    if (!pic) return null
    if (pic.startsWith('http')) return pic
    const base = (hassUrl ?? '').replace(/\/$/, '')
    return base ? `${base}${pic}` : null
  }, [attrs.entity_picture, hassUrl])

  const controlBtnStyle: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer',
    color: colors.textPrimary, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: 0,
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} maxHeight="80vh">
      <div style={{ padding: `0 ${spacing.sm}` }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: spacing.lg,
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: 600, color: colors.textPrimary }}>
            {displayName}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
              width: '28px', height: '28px', color: colors.textSecondary,
              cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            &times;
          </button>
        </div>

        {/* Album Art */}
        <div style={{
          width: '100%', aspectRatio: '1', borderRadius: borderRadius.lg,
          overflow: 'hidden', background: 'rgba(255,255,255,0.04)',
          marginBottom: spacing.lg, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Icon path={playerIcon} size={3} color={colors.textMuted} />
          )}
        </div>

        {/* Track Info */}
        <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
          <div style={{
            fontSize: '18px', fontWeight: 700, color: colors.textPrimary,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: '14px', color: colors.textSecondary, marginTop: '2px' }}>
              {subtitle}
            </div>
          )}
          {album && (
            <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>
              {album}
            </div>
          )}
        </div>

        {/* Playback Controls */}
        {!isOff && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: spacing.xl, marginBottom: spacing.lg,
          }}>
            <button onClick={() => callService('media_previous_track')} style={controlBtnStyle}>
              <Icon path={mdiSkipPrevious} size={1.2} />
            </button>
            <button
              onClick={() => callService('media_play_pause')}
              style={{
                ...controlBtnStyle,
                background: 'rgba(255,255,255,0.95)', color: '#000',
                width: 56, height: 56, borderRadius: '50%',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}
            >
              <Icon path={isPlaying ? mdiPause : mdiPlay} size={1.3} />
            </button>
            <button onClick={() => callService('media_next_track')} style={controlBtnStyle}>
              <Icon path={mdiSkipNext} size={1.2} />
            </button>
          </div>
        )}

        {/* Volume */}
        {!isOff && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: spacing.sm,
            padding: '10px 12px', borderRadius: borderRadius.md,
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.06)',
            marginBottom: spacing.lg,
          }}>
            <button
              onClick={() => callService('volume_mute', { is_volume_muted: !isMuted })}
              style={{ ...controlBtnStyle, padding: 4 }}
            >
              <Icon path={volumeIcon(volume, isMuted)} size={0.75} />
            </button>
            <input
              type="range"
              className="media-volume"
              min={0} max={1} step={0.02}
              value={effectiveVolume}
              onChange={(e) => callService('volume_set', { volume_level: parseFloat(e.target.value) })}
              style={{
                flex: 1, appearance: 'none', height: 5, borderRadius: 3,
                background: `linear-gradient(to right, ${colors.textPrimary} ${effectiveVolume * 100}%, rgba(255,255,255,0.1) ${effectiveVolume * 100}%)`,
                outline: 'none', cursor: 'pointer',
              }}
            />
            <button
              onClick={() => callService('turn_off')}
              style={{ ...controlBtnStyle, padding: 4 }}
            >
              <Icon path={mdiPower} size={0.75} />
            </button>
          </div>
        )}

        {/* Source Selector */}
        {sourceList.length > 0 && !isOff && (
          <div>
            <div style={{
              fontSize: '13px', fontWeight: 600, color: colors.textMuted,
              marginBottom: spacing.sm,
            }}>
              Source
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: spacing.xs,
            }}>
              {sourceList.map((source) => {
                const isActive = source === currentSource
                return (
                  <button
                    key={source}
                    onClick={() => callService('select_source', { source })}
                    className={`liquid-pill ${isActive ? 'liquid-pill-active' : ''}`}
                    style={{
                      border: 'none',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: isActive ? colors.textPrimary : colors.textSecondary,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                    }}
                  >
                    {isActive && <Icon path={mdiCheck} size={0.45} color={colors.statusGood} />}
                    {source}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  )
}
