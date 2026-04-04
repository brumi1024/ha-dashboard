import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEntity, type EntityName } from '@hakit/core'
import { rooms } from '../config/rooms'
import { RoomDetailView } from '../components/rooms/RoomDetailView'
import { ActiveTab } from '../components/rooms/ActiveTab'
import { TabBar } from '../components/layout/TabBar'
import { StatBadge } from '../components/shared/StatBadge'
import { colors, spacing } from '../styles/theme'

const tabs = [
  { id: 'room', label: 'Room' },
  { id: 'active', label: 'Active' },
]

export function RoomDetailPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('room')

  const room = rooms.find((r) => r.id === roomId)
  if (!room) {
    return <div style={{ textAlign: 'center', padding: spacing.xl, color: colors.textSecondary }}>Room not found</div>
  }

  return <RoomDetailContent room={room} activeTab={activeTab} setActiveTab={setActiveTab} navigate={navigate} />
}

// Separate component so hooks are always called (room is guaranteed to exist)
function RoomDetailContent({ room, activeTab, setActiveTab, navigate }: {
  room: typeof rooms[number]
  activeTab: string
  setActiveTab: (t: string) => void
  navigate: ReturnType<typeof useNavigate>
}) {
  const temp = useEntity(room.temperatureEntity as EntityName, { returnNullIfNotFound: true })
  const humidity = useEntity(room.humidityEntity as EntityName, { returnNullIfNotFound: true })

  return (
    <div>
      <button
        className="liquid-pill"
        onClick={() => navigate('/rooms')}
        style={{
          border: 'none', color: colors.textSecondary,
          cursor: 'pointer', fontSize: '13px', padding: '6px 16px', marginBottom: spacing.md,
        }}
      >
        ← Back
      </button>

      <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em' }}>{room.name}</h1>

      <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center', margin: `${spacing.md} 0` }}>
        {temp && <StatBadge icon="🌡" value={`${parseFloat(temp.state).toFixed(1)}°C`} />}
        {humidity && <StatBadge icon="💧" value={`${parseFloat(humidity.state).toFixed(0)}%`} />}
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="stagger-in" style={{ marginTop: spacing.lg, maxWidth: '600px', margin: `${spacing.lg} auto 0` }}>
        {activeTab === 'room' && <RoomDetailView room={room} />}
        {activeTab === 'active' && <ActiveTab room={room} />}
      </div>
    </div>
  )
}
