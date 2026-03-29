import { useEntity } from '@hakit/core'
import type { EntityName } from '@hakit/core'
import { MediaPlayerCard } from '@hakit/components'
import { mediaEntities } from '../../config/rooms'

export function MediaPlayerBar() {
  const sonos = useEntity(mediaEntities.livingRoomSonos as EntityName, { returnNullIfNotFound: true })
  const tv = useEntity(mediaEntities.livingRoomTV as EntityName, { returnNullIfNotFound: true })

  // Show the one that's currently playing, prefer Sonos
  const activeEntity = sonos?.state === 'playing' ? mediaEntities.livingRoomSonos
    : tv?.state === 'playing' ? mediaEntities.livingRoomTV
    : sonos?.state === 'paused' ? mediaEntities.livingRoomSonos
    : tv?.state === 'paused' ? mediaEntities.livingRoomTV
    : null

  if (!activeEntity) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
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
