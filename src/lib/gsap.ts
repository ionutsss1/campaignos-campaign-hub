import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, ScrollToPlugin, useGSAP)
gsap.defaults({ ease: 'expo.out', duration: 1 })

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const FINE_POINTER = '(hover: hover) and (pointer: fine)'

/** Masked line reveal for serif section titles, played once when scrolled into view. */
export function revealTitle(target: Element | string, trigger?: Element | null) {
  const split = SplitText.create(target, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
  gsap.from(split.lines, {
    yPercent: 115,
    duration: 1.4,
    stagger: 0.1,
    scrollTrigger: { trigger: trigger ?? (target as Element), start: 'top 85%', once: true },
  })
  return split
}

export { Flip, gsap, ScrollTrigger, SplitText, useGSAP }
