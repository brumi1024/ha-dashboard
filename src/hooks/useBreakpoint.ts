import { useState, useEffect } from 'react'

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

const MOBILE_MAX = 639
const TABLET_MAX = 1024

function getBreakpoint(): Breakpoint {
  const width = window.innerWidth
  if (width <= MOBILE_MAX) return 'mobile'
  if (width <= TABLET_MAX) return 'tablet'
  return 'desktop'
}

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint)

  useEffect(() => {
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`)
    const tabletQuery = window.matchMedia(`(min-width: ${MOBILE_MAX + 1}px) and (max-width: ${TABLET_MAX}px)`)

    const update = () => setBreakpoint(getBreakpoint())

    mobileQuery.addEventListener('change', update)
    tabletQuery.addEventListener('change', update)

    return () => {
      mobileQuery.removeEventListener('change', update)
      tabletQuery.removeEventListener('change', update)
    }
  }, [])

  return breakpoint
}
