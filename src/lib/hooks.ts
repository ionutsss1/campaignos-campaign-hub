import { useEffect, useRef, useState } from 'react'
import { FINE_POINTER, gsap } from './gsap'

/** Ticks every second towards a fixed target timestamp. */
export function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const left = Math.max(0, target - now)
  const s = Math.floor(left / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

export const pad2 = (n: number) => String(n).padStart(2, '0')

/** Subtle magnetic pull toward the cursor on fine pointers. */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia(FINE_POINTER).matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])
  return ref
}

/** Tweens a number shown in an element whenever `value` changes. */
export function useTweenedNumber(value: number, format: (n: number) => string = (n) => Math.round(n).toLocaleString('en-US')) {
  const ref = useRef<HTMLSpanElement>(null)
  const current = useRef({ v: value })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.textContent = format(current.current.v)
    const tween = gsap.to(current.current, {
      v: value,
      duration: 1.2,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = format(current.current.v)
      },
    })
    return () => {
      tween.kill()
    }
  }, [value, format])
  return ref
}
