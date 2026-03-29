import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  decimals?: number
  style?: React.CSSProperties
}

export function AnimatedCounter({ value, suffix = '', decimals = 0, style }: AnimatedCounterProps) {
  const spring = useSpring(0, { stiffness: 100, damping: 20 })
  const display = useTransform(spring, (v) => `${v.toFixed(decimals)}${suffix}`)
  const [displayValue, setDisplayValue] = useState(`${value.toFixed(decimals)}${suffix}`)

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => setDisplayValue(v))
    return unsubscribe
  }, [display])

  return <motion.span style={style}>{displayValue}</motion.span>
}
