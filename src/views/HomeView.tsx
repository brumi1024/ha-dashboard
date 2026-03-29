import { useState } from 'react'
import { WeatherBadge } from '../components/home/WeatherBadge'
import { GreetingCard } from '../components/home/GreetingCard'
import { TemperatureDisplay } from '../components/home/TemperatureDisplay'
import { ScenesGrid } from '../components/home/ScenesGrid'
import { SecurityStatus } from '../components/home/SecurityStatus'
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
      <div style={{ fontSize: '14px', color: colors.textMuted, marginTop: spacing.md }}>{dateStr} - {timeStr}</div>
      <WeatherBadge />
      <GreetingCard />
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'home' && (
        <div className="stagger-in" style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl, width: '100%', maxWidth: '600px' }}>
          <TemperatureDisplay />
          <ScenesGrid />
          <SecurityStatus />
        </div>
      )}
      {activeTab === 'events' && (
        <div style={{ color: colors.textMuted, textAlign: 'center', padding: spacing.xl }}>Events view coming soon</div>
      )}
      {activeTab === 'active' && (
        <div style={{ color: colors.textMuted, textAlign: 'center', padding: spacing.xl }}>Active entities view coming soon</div>
      )}
    </div>
  )
}
