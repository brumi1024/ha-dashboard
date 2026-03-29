import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { colors } from '../../styles/theme'

const springTransition = {
  type: 'spring' as const,
  stiffness: 350,
  damping: 30,
  mass: 0.8,
}

export function AppShell() {
  const location = useLocation()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `url('/background.jpg') center / cover no-repeat fixed`,
        color: colors.textPrimary,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
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
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '780px',
          margin: '0 auto',
          padding: '44px 48px 60px 110px',
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
