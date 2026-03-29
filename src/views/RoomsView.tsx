import { useState } from 'react'
import { rooms } from '../config/rooms'
import { RoomCard } from '../components/rooms/RoomCard'
import { TabBar } from '../components/layout/TabBar'
import { spacing } from '../styles/theme'

const categoryTabs = [
  { id: 'main', label: 'Main' },
  { id: 'home', label: 'Home' },
  { id: 'utility', label: 'Utility' },
]

export function RoomsView() {
  const [category, setCategory] = useState('main')
  const filteredRooms = rooms.filter((r) => r.category === category)

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", marginBottom: spacing.md }}>Rooms</h1>
      <TabBar tabs={categoryTabs} activeTab={category} onTabChange={setCategory} />
      <div className="stagger-in" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: spacing.md,
        maxWidth: '600px',
        margin: `${spacing.lg} auto 0`,
      }}>
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  )
}
