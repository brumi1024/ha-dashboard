import { useState } from 'react'
import { WeatherBadge } from '../components/home/WeatherBadge'
import { GreetingCard } from '../components/home/GreetingCard'
import { TemperatureDisplay } from '../components/home/TemperatureDisplay'
import { ScenesGrid } from '../components/home/ScenesGrid'
import { SecurityStatus } from '../components/home/SecurityStatus'
import { NotificationBadge } from '../components/home/NotificationBadge'
import { ModesSection } from '../components/home/ModesSection'
import { EventsTab } from '../components/home/EventsTab'
import { ActiveEntitiesTab } from '../components/home/ActiveEntitiesTab'
import { TabBar } from '../components/layout/TabBar'
import { spacing, colors } from '../styles/theme'

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'events', label: 'Events' },
  { id: 'active', label: 'Active' },
]

export function HomeView() {
  const [activeTab, setActiveTab] = useState('home')
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, alignItems: 'center', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md }}>
        <div style={{ fontSize: '14px', color: colors.textMuted }}>{dateStr} - {timeStr}</div>
        <NotificationBadge />
      </div>
      <WeatherBadge />
      <GreetingCard />
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'home' && (
        <div className="stagger-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl, width: '100%', maxWidth: '600px' }}>
          <ModesSection />
          <TemperatureDisplay />
          <ScenesGrid />
          <SecurityStatus />
        </div>
      )}
      {activeTab === 'events' && (
        <EventsTab />
      )}
      {activeTab === 'active' && (
        <ActiveEntitiesTab />
      )}
    </div>
  )
}
