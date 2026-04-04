import { colors, borderRadius } from '../../styles/theme'

interface Tab {
  id: string
  label: string
  icon?: string
}

interface TabBarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div
      className="liquid-glass"
      style={{
        display: 'inline-flex',
        gap: '2px',
        padding: '4px 6px',
        borderRadius: borderRadius.full,
        margin: '12px auto',
        width: 'fit-content',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '8px 20px',
              borderRadius: borderRadius.full,
              border: 'none',
              background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: isActive ? colors.textPrimary : colors.textSecondary,
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              letterSpacing: '0.2px',
              transition: 'all 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
