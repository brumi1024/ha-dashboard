import { useState, useEffect } from 'react'
import { WeatherCard } from '../components/home/WeatherCard'
import { GreetingCard } from '../components/home/GreetingCard'
import { TemperatureDisplay } from '../components/home/TemperatureDisplay'
import { ScenesGrid } from '../components/home/ScenesGrid'
import { SecurityControls } from '../components/home/SecurityControls'
import { NotificationBadge } from '../components/home/NotificationBadge'
import { NotificationPanel } from '../components/home/NotificationPanel'
import { WeatherDetailPanel } from '../components/home/WeatherDetailPanel'
import { ModesSection } from '../components/home/ModesSection'
import { EnergyStatusBar } from '../components/home/EnergyStatusBar'
import { EventsTab } from '../components/home/EventsTab'
import { ActiveEntitiesTab } from '../components/home/ActiveEntitiesTab'
import { TabBar } from '../components/layout/TabBar'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { spacing } from '../styles/theme'

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'events', label: 'Events' },
  { id: 'active', label: 'Active' },
]

export function HomeView() {
  const [activeTab, setActiveTab] = useState('home')
  const [now, setNow] = useState(() => new Date())
  const [notifOpen, setNotifOpen] = useState(false)
  const [weatherOpen, setWeatherOpen] = useState(false)
  const breakpoint = useBreakpoint()

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const isDesktop = breakpoint === 'desktop'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, alignItems: 'center' }}>
      {/* Header: greeting + notification bell */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: spacing.sm,
        width: '100%', maxWidth: isDesktop ? '780px' : '600px',
        justifyContent: 'space-between',
      }}>
        <GreetingCard now={now} />
        <NotificationBadge onClick={() => setNotifOpen(true)} />
      </div>

      {/* Weather + Energy bar */}
      <div style={{ width: '100%', maxWidth: isDesktop ? '780px' : '600px', display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <WeatherCard onClick={() => setWeatherOpen(true)} />
        <EnergyStatusBar />
      </div>

      {/* Tab bar */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'home' && (
        isDesktop ? (
          /* Desktop: two-column layout */
          <div className="stagger-in" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: spacing.lg,
            width: '100%',
            maxWidth: '780px',
            alignItems: 'start',
          }}>
            {/* Left column: temperature chart + security */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
              <TemperatureDisplay />
              <SecurityControls />
            </div>
            {/* Right column: modes + scenes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
              <ModesSection />
              <ScenesGrid />
            </div>
          </div>
        ) : (
          /* Mobile/Tablet: single column */
          <div className="stagger-in" style={{
            display: 'flex', flexDirection: 'column', gap: spacing.lg,
            width: '100%', maxWidth: '600px',
          }}>
            <ModesSection />
            <TemperatureDisplay />
            <ScenesGrid />
            <SecurityControls />
          </div>
        )
      )}
      {activeTab === 'events' && (
        <EventsTab />
      )}
      {activeTab === 'active' && (
        <ActiveEntitiesTab />
      )}

      <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
      <WeatherDetailPanel isOpen={weatherOpen} onClose={() => setWeatherOpen(false)} />
    </div>
  )
}
