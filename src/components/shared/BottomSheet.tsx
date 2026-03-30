import { AnimatePresence, motion } from 'framer-motion'
import { spacing } from '../../styles/theme'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  maxHeight?: string
  children: React.ReactNode
}

export function BottomSheet({ isOpen, onClose, maxHeight = '75vh', children }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              maxHeight, overflowY: 'auto', zIndex: 201,
              borderRadius: '22px 22px 0 0',
              padding: spacing.lg,
              paddingBottom: `calc(${spacing.lg} + env(safe-area-inset-bottom, 0px))`,
              background: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(50px) saturate(2)',
              WebkitBackdropFilter: 'blur(50px) saturate(2)',
              border: '0.5px solid rgba(255, 255, 255, 0.08)',
              borderTop: '0.5px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 0.5px 0 0 rgba(255,255,255,0.25) inset, 0 -0.5px 0 0 rgba(0,0,0,0.15) inset, 0 -8px 32px rgba(0,0,0,0.35), 0 -2px 6px rgba(0,0,0,0.15)',
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
