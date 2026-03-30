import { Icon } from '@mdi/react'
import { NavLink } from 'react-router-dom'
import { navItems } from './Sidebar'
import { colors, borderRadius } from '../../styles/theme'

export function BottomTabBar() {
  return (
    <nav
      className="liquid-glass bottom-tab-bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'none',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 4px',
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
        zIndex: 100,
        borderRadius: '22px 22px 0 0',
      }}
    >
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '6px 12px',
            borderRadius: borderRadius.md,
            textDecoration: 'none',
            color: isActive ? colors.textPrimary : colors.textMuted,
            background: isActive ? colors.sidebarActive : 'transparent',
            fontSize: '10px',
            fontWeight: isActive ? 600 : 400,
            letterSpacing: '0.2px',
            transition: 'all 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          })}
        >
          <Icon path={icon} size={0.82} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
