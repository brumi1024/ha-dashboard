import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { BottomTabBar } from './BottomTabBar'
import { MediaPlayerBar } from './MediaPlayerBar'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { colors } from '../../styles/theme'

const springTransition = {
  type: 'spring' as const,
  stiffness: 350,
  damping: 30,
  mass: 0.8,
}

const mainPadding = {
  desktop: '44px 48px 60px 110px',
  tablet: '24px 24px 150px 24px',
  mobile: '16px 16px 150px 16px',
}

export function AppShell() {
  const location = useLocation()
  const breakpoint = useBreakpoint()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `url('/background.jpg') center / cover no-repeat fixed`,
        color: colors.textPrimary,
        position: 'relative',
      }}
    >
      {/* Frosted overlay for readability */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(3px) saturate(1.15)',
          WebkitBackdropFilter: 'blur(3px) saturate(1.15)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Sidebar />
      <BottomTabBar />
      <MediaPlayerBar />
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: breakpoint === 'mobile' ? '100%' : '900px',
          margin: '0 auto',
          padding: mainPadding[breakpoint],
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={springTransition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
