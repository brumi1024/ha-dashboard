import { useMemo } from 'react'
import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { MediaPlayerCard } from '@hakit/components'
import { mediaEntities } from '../../config/rooms'
import { useBreakpoint } from '../../hooks/useBreakpoint'

export function MediaPlayerBar() {
  const breakpoint = useBreakpoint()
  const sonos = useEntity(mediaEntities.livingRoomSonos as EntityName, { returnNullIfNotFound: true })
  const tv = useEntity(mediaEntities.livingRoomTV as EntityName, { returnNullIfNotFound: true })

  const activeEntity = useMemo(() => {
    if (sonos?.state === 'playing') return mediaEntities.livingRoomSonos
    if (tv?.state === 'playing') return mediaEntities.livingRoomTV
    if (sonos?.state === 'paused') return mediaEntities.livingRoomSonos
    if (tv?.state === 'paused') return mediaEntities.livingRoomTV
    return null
  }, [sonos?.state, tv?.state])

  if (!activeEntity) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: breakpoint !== 'desktop' ? '64px' : 0,
      left: 0,
      right: 0,
      zIndex: 101,
      padding: '0 8px 8px',
    }}>
      <MediaPlayerCard
        entity={activeEntity as any}
        layout="slim"
        hideMute
        hideGrouping
      />
    </div>
  )
}
