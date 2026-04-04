import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { useHass } from '@hakit/core'
import { callService as wsCallService } from 'home-assistant-js-websocket'
import type { HassEntity } from 'home-assistant-js-websocket'
import { Icon } from '@mdi/react'
import {
  mdiPause,
  mdiPlay,
  mdiSkipNext,
  mdiSkipPrevious,
  mdiChevronDown,
  mdiVolumeHigh,
  mdiVolumeMute,
  mdiVolumeLow,
  mdiPower,
  mdiMusic,
  mdiTelevision,
  mdiSpeaker,
  mdiApple,
  mdiCheck,
  mdiSetTopBox,
} from '@mdi/js'
import { AnimatePresence, motion } from 'framer-motion'
import { excludedMediaPlayerPatterns } from '../../config/rooms'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { colors, borderRadius } from '../../styles/theme'

// ─── Types ────────────────────────────────────────────────

interface MediaAttributes {
  media_title?: string
  media_artist?: string
  media_series_title?: string
  media_season?: number
  media_episode?: number
  media_duration?: number
  media_position?: number
  media_position_updated_at?: string
  entity_picture?: string
  volume_level?: number
  is_volume_muted?: boolean
  friendly_name?: string
  media_content_type?: string
  source?: string
  app_name?: string
  device_class?: string
}

interface ActivePlayer {
  entityId: string
  entity: HassEntity
  attrs: MediaAttributes
  label: string
  icon: string
  priority: number
}

// ─── Constants & Helpers ──────────────────────────────────

const ACTIVE_STATES = new Set(['playing', 'paused', 'on', 'idle', 'buffering'])
const EXCLUDED_STATES = new Set(['unavailable', 'unknown', 'off', 'standby'])

const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 500, damping: 35, mass: 0.8 }
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 350, damping: 32 }

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function buildThumbnailUrl(picturePath: string | undefined, hassUrl: string): string | null {
  if (!picturePath || !hassUrl) return null
  const base = hassUrl.replace(/\/$/, '')
  return picturePath.startsWith('http') ? picturePath : `${base}${picturePath}`
}

function classifyPlayer(entityId: string, attrs: MediaAttributes): { icon: string; priority: number } {
  const dc = attrs.device_class
  const id = entityId.toLowerCase()
  const name = (attrs.friendly_name || '').toLowerCase()

  if (id.includes('plex')) return { icon: mdiMusic, priority: 90 }
  if (id.includes('apple_tv') || name.includes('apple tv'))
    return { icon: mdiApple, priority: 80 }
  if (dc === 'tv') return { icon: mdiTelevision, priority: 40 }
  if (dc === 'speaker') return { icon: mdiSpeaker, priority: 30 }
  if (dc === 'receiver') return { icon: mdiSetTopBox, priority: 50 }
  if (name.includes('sonos') || name.includes('speaker') || name.includes('homepod'))
    return { icon: mdiSpeaker, priority: 30 }
  if (name.includes('tv') || name.includes('shield') || name.includes('chromecast'))
    return { icon: mdiTelevision, priority: 40 }
  if (name.includes('receiver') || name.includes('avr'))
    return { icon: mdiSetTopBox, priority: 50 }

  return { icon: mdiMusic, priority: 20 }
}

function scorePlayer(p: ActivePlayer): number {
  let score = p.priority
  if (p.entity.state === 'playing') score += 100
  else if (p.entity.state === 'paused') score += 50
  if (p.attrs.media_title && p.attrs.media_title !== 'TV') score += 40
  if (p.attrs.entity_picture) score += 20
  if (p.attrs.media_series_title || p.attrs.media_artist) score += 10
  if (p.attrs.media_duration) score += 10
  if (p.attrs.source === 'TV' && p.attrs.media_title === 'TV') score -= 60
  return score
}

function getDisplayInfo(attrs: MediaAttributes, hassUrl: string) {
  let title: string
  if (attrs.media_season != null && attrs.media_episode != null && attrs.media_title) {
    title = `S${attrs.media_season} · E${attrs.media_episode}: ${attrs.media_title}`
  } else if (attrs.media_title && attrs.media_title !== 'TV') {
    title = attrs.media_title
  } else {
    title = attrs.app_name || attrs.source || attrs.friendly_name || 'Unknown'
  }

  let subtitle: string
  if (attrs.media_series_title) {
    subtitle = attrs.media_artist
      ? `${attrs.media_artist} · ${attrs.media_series_title}`
      : attrs.media_series_title
  } else if (attrs.media_artist) {
    subtitle = attrs.media_artist
  } else if (attrs.app_name && attrs.media_title) {
    subtitle = attrs.app_name
  } else {
    subtitle = attrs.friendly_name || ''
  }

  return {
    title,
    subtitle,
    thumbnailUrl: buildThumbnailUrl(attrs.entity_picture, hassUrl),
    duration: attrs.media_duration ?? 0,
    mediaPosition: attrs.media_position,
    mediaPositionUpdatedAt: attrs.media_position_updated_at,
    isVideo: ['video', 'tvshow', 'movie'].includes(attrs.media_content_type || ''),
  }
}

// ─── Position hook ────────────────────────────────────────

function useMediaPosition(
  mediaPosition: number | undefined,
  positionUpdatedAt: string | undefined,
  duration: number,
  isPlaying: boolean,
) {
  const [position, setPosition] = useState(mediaPosition ?? 0)
  const rafRef = useRef<number>(undefined)

  useEffect(() => {
    if (!isPlaying || mediaPosition == null || duration === 0) {
      setPosition(mediaPosition ?? 0)
      return
    }
    const updatedAt = positionUpdatedAt
      ? new Date(positionUpdatedAt).getTime()
      : Date.now()

    const tick = () => {
      const now = Date.now()
      const newPos = (mediaPosition ?? 0) + (now - updatedAt) / 1000
      setPosition(Math.min(newPos, duration || Infinity))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [mediaPosition, positionUpdatedAt, duration, isPlaying])

  return position
}

function volumeIcon(level: number, muted: boolean) {
  if (muted || level === 0) return mdiVolumeMute
  if (level < 0.4) return mdiVolumeLow
  return mdiVolumeHigh
}

// ─── Shared styles ────────────────────────────────────────

const controlBtnStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', color: colors.textPrimary,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
}

const closeBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%',
  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: colors.textPrimary,
  backdropFilter: 'blur(10px)',
}

// ─── Component ────────────────────────────────────────────

export function MediaPlayerBar() {
  const breakpoint = useBreakpoint()
  const hass = useHass()
  const connection = hass.connection
  const hassUrl = hass.hassUrl ?? ''
  const allEntities = hass.entities
  const [expanded, setExpanded] = useState(false)
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null)
  const [showPlayerPicker, setShowPlayerPicker] = useState(false)

  // Extract media_player entities once (avoids double full-object scan)
  const mediaPlayers = useMemo(() => {
    if (!allEntities) return []
    return Object.values(allEntities).filter((e): e is HassEntity => {
      if (!e.entity_id.startsWith('media_player.')) return false
      const id = e.entity_id.toLowerCase()
      return !excludedMediaPlayerPatterns.some(p => id.includes(p))
    })
  }, [allEntities])

  const activePlayers: ActivePlayer[] = useMemo(() => {
    return mediaPlayers
      .filter(e => !EXCLUDED_STATES.has(e.state) && ACTIVE_STATES.has(e.state))
      .map(e => {
        const attrs = e.attributes as MediaAttributes
        const { icon, priority } = classifyPlayer(e.entity_id, attrs)
        return {
          entityId: e.entity_id, entity: e, attrs, icon, priority,
          label: attrs.friendly_name || e.entity_id.replace('media_player.', ''),
        }
      })
      .sort((a, b) => scorePlayer(b) - scorePlayer(a))
  }, [mediaPlayers])

  // Find active speaker for volume routing
  const speakerEntity = useMemo(() => {
    const speakers = mediaPlayers.filter(e => {
      const attrs = e.attributes as MediaAttributes
      return attrs.device_class === 'speaker'
        && attrs.volume_level != null
        && ['playing', 'paused', 'idle'].includes(e.state)
    })
    return speakers.find(e => e.state === 'playing')
      ?? speakers.find(e => e.state === 'paused')
      ?? speakers[0]
      ?? null
  }, [mediaPlayers])

  const speakerAttrs = (speakerEntity?.attributes ?? {}) as MediaAttributes
  const volume = speakerAttrs.volume_level ?? 0
  const isMuted = speakerAttrs.is_volume_muted ?? false

  // Auto-select best player, respect manual selection
  const activePlayer = useMemo(() => {
    if (selectedEntityId) {
      const sel = activePlayers.find(p => p.entityId === selectedEntityId)
      if (sel) return sel
    }
    return activePlayers[0] ?? null
  }, [activePlayers, selectedEntityId])

  const isPlaying = activePlayer?.entity.state === 'playing'
  const display = activePlayer ? getDisplayInfo(activePlayer.attrs, hassUrl) : null

  const position = useMediaPosition(
    display?.mediaPosition, display?.mediaPositionUpdatedAt,
    display?.duration ?? 0, isPlaying ?? false,
  )
  const progress = display && display.duration > 0 ? (position / display.duration) * 100 : 0

  // Playback commands go to the active player
  const callMediaService = useCallback((service: string, data?: Record<string, unknown>) => {
    if (!activePlayer || !connection) return
    wsCallService(connection, 'media_player', service, data, { entity_id: activePlayer.entityId })
      .catch(() => {})
  }, [activePlayer, connection])

  // Volume commands go to the speaker entity
  const callVolumeService = useCallback((service: string, data?: Record<string, unknown>) => {
    const target = speakerEntity?.entity_id ?? activePlayer?.entityId
    if (!target || !connection) return
    wsCallService(connection, 'media_player', service, data, { entity_id: target })
      .catch(() => {})
  }, [speakerEntity, activePlayer, connection])

  useEffect(() => {
    if (!activePlayer) { setExpanded(false); setShowPlayerPicker(false) }
  }, [activePlayer])

  useEffect(() => {
    if (selectedEntityId && !activePlayers.find(p => p.entityId === selectedEntityId))
      setSelectedEntityId(null)
  }, [activePlayers, selectedEntityId])

  useEffect(() => {
    if (expanded && breakpoint !== 'desktop') {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [expanded, breakpoint])

  if (!activePlayer || !display) return null

  const { title, subtitle, thumbnailUrl, isVideo, duration } = display
  const isDesktop = breakpoint === 'desktop'
  const effectiveVolume = isMuted ? 0 : volume

  return (
    <>
      {/* ── Mini Bar ─────────────────────────────────── */}
      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={SPRING_SNAPPY}
            style={{
              position: 'fixed',
              bottom: !isDesktop ? '64px' : '12px',
              left: isDesktop ? '80px' : '8px',
              right: '8px',
              maxWidth: isDesktop ? 480 : undefined,
              margin: isDesktop ? '0 auto' : undefined,
              zIndex: 101,
            }}
          >
            <motion.div
              className="liquid-glass-prominent"
              onClick={() => setExpanded(true)}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.985 }}
              transition={SPRING_SNAPPY}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '8px 14px 8px 8px',
                cursor: 'pointer', overflow: 'hidden',
              }}
            >
              {/* Thumbnail */}
              <motion.div
                layoutId="media-thumbnail"
                style={{
                  width: 48, height: 48, borderRadius: '12px', overflow: 'hidden',
                  flexShrink: 0, background: 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Icon path={activePlayer.icon} size={1} color={colors.textMuted} />
                )}
              </motion.div>

              {/* Title & Subtitle */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '14px', fontWeight: 600, color: colors.textPrimary,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {title}
                </div>
                {subtitle && (
                  <div style={{
                    fontSize: '12px', color: colors.textSecondary,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {subtitle}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); callMediaService('media_play_pause') }}
                  style={{
                    background: colors.glassBorderLight, border: 'none', borderRadius: '50%',
                    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: colors.textPrimary,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Icon path={isPlaying ? mdiPause : mdiPlay} size={0.9} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => { e.stopPropagation(); callMediaService('media_next_track') }}
                  style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: colors.textPrimary }}
                >
                  <Icon path={mdiSkipNext} size={0.9} />
                </motion.button>
              </div>
            </motion.div>

            {/* Progress line */}
            {duration > 0 && (
              <div style={{
                position: 'absolute', bottom: 2, left: 20, right: 20,
                height: 3, borderRadius: 2, background: colors.glass, overflow: 'hidden',
              }}>
                <motion.div
                  style={{
                    height: '100%', background: colors.textPrimary, borderRadius: 2,
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Expanded View ────────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => { setExpanded(false); setShowPlayerPicker(false) }}
              style={{
                position: 'fixed', inset: 0, zIndex: 199,
                background: isDesktop ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(30px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(30px) saturate(1.4)',
              }}
            />

            <motion.div
              initial={isDesktop ? { y: 60, opacity: 0, scale: 0.92 } : { y: '100%' }}
              animate={isDesktop ? { y: 0, opacity: 1, scale: 1 } : { y: 0 }}
              exit={isDesktop ? { y: 60, opacity: 0, scale: 0.92 } : { y: '100%' }}
              transition={SPRING_SMOOTH}
              style={isDesktop ? {
                position: 'fixed', bottom: 24, left: '80px', right: 0,
                width: 420, margin: '0 auto', zIndex: 200,
                background: 'rgba(20, 20, 20, 0.85)',
                backdropFilter: 'blur(80px) saturate(2)',
                WebkitBackdropFilter: 'blur(80px) saturate(2)',
                borderRadius: borderRadius.xl,
                border: '0.5px solid rgba(255,255,255,0.12)',
                borderTopColor: 'rgba(255,255,255,0.2)',
                borderBottomColor: 'rgba(0,0,0,0.2)',
                boxShadow: `
                  0 0.5px 0 0 rgba(255,255,255,0.15) inset,
                  0 -0.5px 0 0 rgba(0,0,0,0.15) inset,
                  0 32px 80px rgba(0,0,0,0.55),
                  0 8px 24px rgba(0,0,0,0.3)
                `,
                overflow: 'hidden',
              } : {
                position: 'fixed', inset: 0, zIndex: 200,
                background: 'rgba(10, 10, 10, 0.92)',
                backdropFilter: 'blur(80px) saturate(2)',
                WebkitBackdropFilter: 'blur(80px) saturate(2)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: isDesktop ? '20px 20px 24px' : '56px 28px 40px',
                flex: isDesktop ? undefined : 1,
                justifyContent: isDesktop ? undefined : 'center',
                overflowY: 'auto',
              }}>
                {/* Header */}
                <div style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginBottom: isDesktop ? 16 : 28,
                }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setExpanded(false); setShowPlayerPicker(false) }}
                    style={closeBtnStyle}
                  >
                    <Icon path={mdiChevronDown} size={0.9} />
                  </motion.button>

                  <motion.button
                    whileHover={activePlayers.length > 1 ? { scale: 1.04 } : undefined}
                    whileTap={activePlayers.length > 1 ? { scale: 0.96 } : undefined}
                    onClick={() => activePlayers.length > 1 && setShowPlayerPicker(!showPlayerPicker)}
                    className="liquid-pill"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                      cursor: activePlayers.length > 1 ? 'pointer' : 'default',
                      color: colors.textSecondary, fontSize: '11px', fontWeight: 600,
                      letterSpacing: '0.5px', textTransform: 'uppercase',
                    }}
                  >
                    <Icon path={activePlayer.icon} size={0.5} />
                    {activePlayer.label}
                    {activePlayers.length > 1 && (
                      <span style={{
                        background: colors.glassBorderLight, borderRadius: '6px',
                        padding: '1px 5px', fontSize: '10px', marginLeft: 2,
                      }}>
                        {activePlayers.length}
                      </span>
                    )}
                  </motion.button>

                  <div style={{ width: 32 }} />
                </div>

                {/* Player Picker */}
                <AnimatePresence>
                  {showPlayerPicker && activePlayers.length > 1 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ width: '100%', overflow: 'hidden', marginBottom: isDesktop ? 12 : 16 }}
                    >
                      <div style={{
                        display: 'flex', flexDirection: 'column', gap: 2,
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: '14px', padding: 4,
                        border: '0.5px solid rgba(255,255,255,0.06)',
                      }}>
                        {activePlayers.map((p, i) => {
                          const isSelected = p.entityId === activePlayer.entityId
                          const pTitle = p.attrs.media_title && p.attrs.media_title !== 'TV'
                            ? p.attrs.media_title : p.attrs.app_name || p.attrs.source || ''
                          return (
                            <motion.button
                              key={p.entityId}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04 }}
                              whileHover={{ background: colors.glass }}
                              onClick={() => { setSelectedEntityId(p.entityId); setShowPlayerPicker(false) }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 12px', borderRadius: '10px',
                                background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
                                border: 'none', cursor: 'pointer', color: colors.textPrimary,
                                textAlign: 'left', width: '100%',
                              }}
                            >
                              <Icon path={p.icon} size={0.7} color={isSelected ? colors.textPrimary : colors.textSecondary} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '13px', fontWeight: 600 }}>{p.label}</div>
                                {pTitle && (
                                  <div style={{
                                    fontSize: '11px', color: colors.textSecondary,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                  }}>
                                    {pTitle}
                                  </div>
                                )}
                              </div>
                              <div style={{
                                fontSize: '11px', color: colors.textMuted, textTransform: 'capitalize',
                                display: 'flex', alignItems: 'center', gap: 4,
                              }}>
                                {isSelected && <Icon path={mdiCheck} size={0.55} color={colors.statusGood} />}
                                {p.entity.state}
                              </div>
                            </motion.button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Album Art / Cover */}
                <motion.div
                  layoutId="media-thumbnail"
                  style={{
                    width: '100%', aspectRatio: isVideo ? '16 / 9' : '1',
                    borderRadius: isDesktop ? '16px' : '20px',
                    overflow: 'hidden', background: 'rgba(255,255,255,0.04)',
                    marginBottom: isDesktop ? 20 : 32,
                    boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                  transition={SPRING_SMOOTH}
                >
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Icon path={activePlayer.icon} size={isDesktop ? 2.5 : 3.5} color={colors.textMuted} />
                  )}
                </motion.div>

                {/* Title & Subtitle */}
                <div style={{
                  width: '100%', marginBottom: isDesktop ? 14 : 24,
                  textAlign: isDesktop ? 'center' : 'left',
                }}>
                  <div style={{
                    fontSize: isDesktop ? '17px' : '22px', fontWeight: 700, color: colors.textPrimary,
                    lineHeight: 1.3, marginBottom: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isDesktop ? 'nowrap' : undefined,
                  }}>
                    {title}
                  </div>
                  {subtitle && (
                    <div style={{ fontSize: isDesktop ? '13px' : '16px', color: colors.textSecondary }}>
                      {subtitle}
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {duration > 0 && (
                  <div style={{ width: '100%', marginBottom: isDesktop ? 16 : 24 }}>
                    <div
                      style={{
                        width: '100%', height: 5, borderRadius: 3,
                        background: 'rgba(255,255,255,0.1)', overflow: 'hidden', cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const pct = (e.clientX - rect.left) / rect.width
                        callMediaService('media_seek', { seek_position: pct * duration })
                      }}
                    >
                      <motion.div
                        style={{ height: '100%', background: colors.textPrimary, borderRadius: 3 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'linear' }}
                      />
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', marginTop: 6,
                      fontSize: '11px', color: colors.textMuted, fontVariantNumeric: 'tabular-nums',
                    }}>
                      <span>{formatTime(position)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                )}

                {/* Playback Controls */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: isDesktop ? 28 : 36, marginBottom: isDesktop ? 20 : 32, width: '100%',
                }}>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => callMediaService('media_previous_track')}
                    style={controlBtnStyle}
                  >
                    <Icon path={mdiSkipPrevious} size={isDesktop ? 1.1 : 1.3} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => callMediaService('media_play_pause')}
                    style={{
                      ...controlBtnStyle,
                      background: 'rgba(255,255,255,0.95)', color: '#000',
                      width: isDesktop ? 52 : 64, height: isDesktop ? 52 : 64,
                      borderRadius: '50%',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Icon path={isPlaying ? mdiPause : mdiPlay} size={isDesktop ? 1.2 : 1.5} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => callMediaService('media_next_track')}
                    style={controlBtnStyle}
                  >
                    <Icon path={mdiSkipNext} size={isDesktop ? 1.1 : 1.3} />
                  </motion.button>
                </div>

                {/* Volume & Power */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 12px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.06)',
                }}>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => callVolumeService('volume_mute', { is_volume_muted: !isMuted })}
                    style={{ ...controlBtnStyle, padding: 4 }}
                  >
                    <Icon path={volumeIcon(volume, isMuted)} size={0.75} />
                  </motion.button>
                  <input
                    type="range"
                    className="media-volume"
                    min={0} max={1} step={0.02}
                    value={effectiveVolume}
                    onChange={(e) => callVolumeService('volume_set', { volume_level: parseFloat(e.target.value) })}
                    style={{
                      flex: 1, appearance: 'none', height: 5, borderRadius: 3,
                      background: `linear-gradient(to right, ${colors.textPrimary} ${effectiveVolume * 100}%, rgba(255,255,255,0.1) ${effectiveVolume * 100}%)`,
                      outline: 'none', cursor: 'pointer',
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => callMediaService('turn_off')}
                    style={{ ...controlBtnStyle, padding: 4 }}
                  >
                    <Icon path={mdiPower} size={0.75} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
