import { useRef, type PointerEvent } from 'react'
import { Button, Icon, SectionTitle } from '../components/ui'
import { tiers } from '../data'
import { gsap, MOTION_OK, revealTitle, useGSAP } from '../lib/gsap'
import { CURRENT_TIER, TIER_GOAL, usePlayer } from '../lib/player'
import './pass.css'

const STEP = 142

export function BrandPass() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const { xp } = usePlayer()
  const progress = Math.min(1, xp / TIER_GOAL)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = revealTitle('.pass .section-title')
        gsap.from('.pass__panel', { y: 30, autoAlpha: 0, scrollTrigger: { trigger: '.pass__panel', start: 'top 85%', once: true } })
        gsap.from('.tier', {
          y: 32,
          autoAlpha: 0,
          stagger: 0.05,
          duration: 1.2,
          clearProps: 'transform',
          scrollTrigger: { trigger: '.pass__track', start: 'top 85%', once: true },
        })
        gsap.from('.pass__rail-fill', {
          scaleX: 0,
          duration: 1.8,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.pass__track', start: 'top 80%', once: true },
        })
        gsap.from('.pass__here', {
          y: -16,
          autoAlpha: 0,
          duration: 1,
          delay: 1.2,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: '.pass__track', start: 'top 80%', once: true },
        })
        return () => split.revert()
      })
    },
    { scope: root },
  )

  // Drag to scroll with a little momentum.
  const drag = useRef({ down: false, startX: 0, startLeft: 0, lastX: 0, v: 0, moved: false })
  const onPointerDown = (e: PointerEvent) => {
    const el = track.current
    if (!el || e.pointerType !== 'mouse') return
    gsap.killTweensOf(el)
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, lastX: e.clientX, v: 0, moved: false }
    el.setPointerCapture(e.pointerId)
    el.classList.add('is-dragging')
  }
  const onPointerMove = (e: PointerEvent) => {
    const el = track.current
    const d = drag.current
    if (!el || !d.down) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 4) d.moved = true
    d.v = e.clientX - d.lastX
    d.lastX = e.clientX
    el.scrollLeft = d.startLeft - dx
  }
  const onPointerUp = (e: PointerEvent) => {
    const el = track.current
    const d = drag.current
    if (!el || !d.down) return
    d.down = false
    el.releasePointerCapture(e.pointerId)
    el.classList.remove('is-dragging')
    gsap.to(el, { scrollTo: { x: el.scrollLeft - d.v * 18 }, duration: 1.1, ease: 'power3.out' })
  }
  const nudge = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    gsap.to(el, { scrollTo: { x: el.scrollLeft + dir * STEP * 4 }, duration: 1.2, ease: 'power3.inOut' })
  }

  return (
    <section id="pass" className="section pass" ref={root}>
      <div className="section-header">
        <div className="section-header__lead">
          <SectionTitle lead="Every entry" italic="moves you forward." />
        </div>
        <div className="pass__panel glass">
          <div className="pass__panel-row">
            <p className="pass__tier">
              <span className="display">Tier {CURRENT_TIER}</span> <span className="muted">of 20</span>
            </p>
            <span className="num muted">
              {xp} / {TIER_GOAL} XP
            </span>
          </div>
          <div className="track">
            <div className="track__bar" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="pass__panel-row">
            <span className="muted pass__small">Season ends in 18 days</span>
            <Button variant="ghost" size="m" icon="arrow_forward">
              How XP works
            </Button>
          </div>
        </div>
      </div>

      <div className="pass__viewport">
        <div
          className="pass__track"
          ref={track}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="pass__inner" style={{ width: tiers.length * STEP + 96 }}>
            <div className="pass__rail">
              <div className="pass__rail-fill" style={{ width: (CURRENT_TIER - 1) * STEP + 64 }} />
              {tiers.map((t, i) => (
                <span
                  key={i}
                  className={`pass__tick ${i < CURRENT_TIER ? 'is-done' : ''} ${i === CURRENT_TIER - 1 ? 'is-current' : ''} ${t.chest ? 'is-chest' : ''}`}
                  style={{ left: i * STEP + 64 }}
                />
              ))}
              <span className="pass__here" style={{ left: (CURRENT_TIER - 1) * STEP + 64 }}>
                <Icon name="person_pin_circle" />
                You are here
              </span>
            </div>
            <ol className="pass__tiers">
              {tiers.map((t, i) => {
                const n = i + 1
                const state = n < CURRENT_TIER ? 'claimed' : n === CURRENT_TIER ? 'current' : t.chest ? 'chest' : 'locked'
                return (
                  <li key={i} className={`tier tier--${state}`}>
                    <div className="tier__top">
                      <span>Tier {n}</span>
                      <Icon name={state === 'claimed' ? 'check' : state === 'current' ? 'radio_button_checked' : state === 'chest' ? 'workspace_premium' : 'lock'} />
                    </div>
                    <div className="tier__art">
                      <Icon name={t.icon} />
                    </div>
                    <span className="tier__reward">{t.reward}</span>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
        <div className="pass__fade" aria-hidden="true" />
        <div className="pass__nav">
          <button className="icon-btn glass" onClick={() => nudge(-1)} aria-label="Previous tiers">
            <Icon name="arrow_back" />
          </button>
          <button className="icon-btn glass" onClick={() => nudge(1)} aria-label="Next tiers">
            <Icon name="arrow_forward" />
          </button>
        </div>
      </div>
    </section>
  )
}
