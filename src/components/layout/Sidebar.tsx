import { Icon } from '@mdi/react'
import { mdiHome, mdiFloorPlan, mdiSolarPower, mdiCarElectric, mdiCogOutline, mdiDotsHorizontal } from '@mdi/js'
import { NavLink } from 'react-router-dom'
import { colors, borderRadius } from '../../styles/theme'

const navItems = [
  { to: '/', icon: mdiHome, label: 'Home' },
  { to: '/rooms', icon: mdiFloorPlan, label: 'Rooms' },
  { to: '/energy/solar', icon: mdiSolarPower, label: 'Energy' },
  { to: '/energy/ev', icon: mdiCarElectric, label: 'EV' },
  { to: '/system', icon: mdiCogOutline, label: 'System' },
  { to: '/more', icon: mdiDotsHorizontal, label: 'More' },
]

export function Sidebar() {
  return (
    <nav
      className="liquid-glass"
      style={{
        position: 'fixed',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '14px 6px',
        zIndex: 100,
        borderRadius: borderRadius.xl,
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
            gap: '3px',
            padding: '10px 14px',
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
